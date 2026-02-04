import { getUrl } from "c/sfGpsDsOsrtOmniscriptInternalUtils";
import { OmniscriptDocusignEnvelopeActionUtil } from "./omniscriptDocusignEnvelopeActionUtil";

/**
 * Omniscript Docusign Signature Action Utility Class
 */
export class OmniscriptDocusignSignatureActionUtil extends OmniscriptDocusignEnvelopeActionUtil {
  /**
   * Get the data from the docusign Template
   * @param {object} control
   * Overwrite from OmniscriptDocusignEnvelopeAction
   */
  getDataFromDocusignTemplate(control, comp) {
    let docuSignInput = {},
      signerListStr = "",
      signerInfo;

    if (
      control.propSetMap.docuSignTemplate &&
      control.propSetMap.docuSignTemplate !== ""
    ) {
      control.propSetMap.docuSignTemplatesGroupSig = [];
      docuSignInput.docuSignTemplate = control.propSetMap.docuSignTemplate;
      signerListStr = JSON.stringify(control.propSetMap.signerInformation);
      signerInfo = this.getDataFromMergeField(signerListStr, comp);
      if (
        signerInfo.templateRole === "" ||
        signerInfo.signerEmail === "" ||
        signerInfo.signerName === ""
      ) {
        return {
          error: true,
          errorMsg: comp.scriptHeaderDef.allCustomLabels
            ? comp.scriptHeaderDef.allCustomLabels.OmniDocuSignNoRecipients
            : "OmniDocuSignNoRecipients"
        };
      }
      docuSignInput.signerList = [];
      docuSignInput.signerList.push(signerInfo);
      docuSignInput.sendJSONPath = control.propSetMap.sendJSONPath;
      docuSignInput.sendJSONNode = control.propSetMap.sendJSONNode;
      docuSignInput.transformBundle = control.propSetMap.transformBundle;
      docuSignInput.includeToSend = true;
      control.propSetMap.docuSignTemplatesGroupSig.push(docuSignInput);
    } else {
      signerListStr = JSON.stringify(control.propSetMap.signerInformation);
      signerInfo = this.getDataFromMergeField(signerListStr, comp);

      for (
        let i = 0;
        i < control.propSetMap.docuSignTemplatesGroupSig.length;
        i++
      ) {
        if (
          control.propSetMap.docuSignTemplatesGroupSig[i].templateRole === "" ||
          signerInfo.signerEmail === "" ||
          signerInfo.signerName === ""
        ) {
          return {
            error: true,
            errorMsg: comp.scriptHeaderDef.allCustomLabels
              ? comp.scriptHeaderDef.allCustomLabels.OmniDocuSignNoRecipients
              : "OmniDocuSignNoRecipients"
          };
        }

        control.propSetMap.docuSignTemplatesGroupSig[i].signerList = [];
        let signerObj = {};
        signerObj.signerEmail = signerInfo.signerEmail;
        signerObj.signerName = signerInfo.signerName;
        signerObj.templateRole =
          control.propSetMap.docuSignTemplatesGroupSig[i].templateRole;
        control.propSetMap.docuSignTemplatesGroupSig[i].signerList.push(
          signerObj
        );
      }
    }

    control.propSetMap.remoteOptions.signerInformation = signerInfo;
    control.propSetMap.remoteOptions.docuSignTemplatesGroup =
      control.propSetMap.docuSignTemplatesGroupSig;
    return { error: false };
  }

  // Overwrite from OmniscriptDocusignEnvelopeAction
  sendDocusignMail(comp, control, input) {
    let options = control.control.propSetMap.remoteOptions;
    return getUrl("OmniScriptDocuSignReturnPage").then((url) => {
      let returnUrl = url;

      if (
        comp.jsonDef.propSetMap.docuSignReturnUrl !== undefined &&
        comp.jsonDef.propSetMap.docuSignReturnUrl !== ""
      ) {
        returnUrl = comp.jsonDef.propSetMap.docuSignReturnUrl;
      }

      // Set return url and element name in options, DocuSign API need return url to redirect back after signature with status url param
      options.returnUrl = returnUrl;
      options.elementName = control.control.name;
      comp.template.querySelector(".modal-container").style.display = "block";

      return this.preProcessCommonReq(
        comp,
        control.control,
        {
          sClassName: `${this._ns}DefaultDocuSignOmniScriptIntegration`,
          sMethodName: "sendEnvelopeEmbedded"
        },
        input,
        null
      );
    });
  }

  // eslint-disable-next-line no-unused-vars
  postProcessHelper(resp, element, comp) {
    let eleName = element.name;
    comp.evaluateSpinner(false, comp.jsonDef);
    if (resp.error !== "OK") {
      comp.closeModal();
      comp.sendErrorModalUtil(
        resp.errorMsg,
        comp._isBtn,
        this._element,
        comp.scriptHeaderDef,
        comp
      );
    } else {
      comp.template
        .querySelector("iframe")
        .setAttribute("src", resp[eleName].url);
      comp._envelopeId = resp[eleName].envelopeId;
      if (comp._envelopeId) {
        comp._envelopeIdArray.unshift({
          status: "In Process",
          envelopeId: comp._envelopeId
        });
      }
    }
    return { [element.name]: comp._envelopeIdArray };
  }
}
