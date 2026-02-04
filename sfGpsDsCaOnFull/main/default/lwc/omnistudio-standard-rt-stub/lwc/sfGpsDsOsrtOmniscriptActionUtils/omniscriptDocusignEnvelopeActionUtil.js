import { applyDateFormat } from "c/sfGpsDsOsrtOmniscriptUtils";
import { OmniscriptBaseActionUtil } from "./omniscriptBaseActionUtil";
import { OmniscriptDrTransformActionUtil } from "./omniscriptDrTransformActionUtil";

/**
 * Omniscript Docusign Envelope Action Utility Class
 */
export class OmniscriptDocusignEnvelopeActionUtil extends OmniscriptBaseActionUtil {
  // eslint-disable-next-line no-unused-vars
  preProcess(params, queueableRespId, comp, payload, vlcParams) {
    const input = payload ? payload : this.getCompJsonData(comp);
    const preProcessedResp = this.docusignAction(input, this._element, comp);

    // if error is found in the docusignAction, there is no need to process further
    if (preProcessedResp.error) {
      return preProcessedResp;
    }

    // if no immediate errors are found from docusignAction, continue processing
    return preProcessedResp.then((resp) => {
      return this.sendDocusignMail(comp, resp, input);
    });
  }

  /**
   * @description Overwrites hook from omniscriptActionCommonUtil for handling Promise data that has been
   *              preprocessed. This method is called in the inherited invokeAction after data has been preprocessed
   *              in preProcess. Handles preprocessed Promise data as a result of createDataRaptorPromise.
   * @param {Promise} data
   * @param {*} comp
   * @param {Object} payload
   * @returns {Promise}
   */
  handlePromiseDuringInvoke(data, comp, payload) {
    return data.then((response) => {
      if (response.error) {
        return super.handlePromiseDuringInvoke(
          Promise.resolve(response),
          comp,
          payload
        );
      }

      return super.invokeAction(response, comp, payload);
    });
  }

  docusignAction(payload, element, comp) {
    let input = payload,
      control = JSON.parse(JSON.stringify(element));
    control.propSetMap.remoteOptions = {};
    control.propSetMap.remoteOptions.docuSignTemplatesGroup = [];
    const resp = this.getDataFromDocusignTemplate(control, comp);

    // if error is found during getDataFromDocusignTemplate, return response with error and stop processing
    if (resp.error) {
      return resp;
    }

    // no error was found in getDataFromDocusignTemplate, call DataRaptors
    return this.createDataRaptorPromise(control, input, comp);
  }

  //Create DataRaptor promise
  createDataRaptorPromise(control, input, comp) {
    let transformControl;
    const promiseArray = [];
    const propSetMap = control.propSetMap;
    const options = {
      dateFormat: propSetMap.dateFormat,
      dateTimeFormat: propSetMap.dateTimeFormat,
      timeFormat: propSetMap.timeFormat
    };

    // Mergefield for emailSubject will be handled in the preProcessCommonReq
    if (propSetMap.emailSubject && propSetMap.emailSubject !== "") {
      propSetMap.remoteOptions.emailSubject = propSetMap.emailSubject;
    }

    // Mergefield for emailBody will be handled in the preProcessCommonReq
    if (propSetMap.emailBody && propSetMap.emailBody !== "") {
      propSetMap.remoteOptions.emailBody = propSetMap.emailBody;
    }

    propSetMap.remoteOptions.elementName = control.name;
    propSetMap.remoteClass = `${this._ns}DefaultDocuSignOmniScriptIntegration`;
    propSetMap.remoteMethod = "sendEnvelope";

    propSetMap.remoteOptions.docuSignTemplatesGroup.forEach(
      (docSignTemplateGroup) => {
        // Transform does not have any remoteOptions. Mergefields will not be performed on any remoteOptions for
        // this transform
        const transform = docSignTemplateGroup.transformBundle;
        let drTransform;
        if (transform != null && transform !== "") {
          transformControl = {
            name: control && control.name,
            type: control && control.type,
            propSetMap: {
              label: control.propSetMap.label,
              bundle: transform,
              useQueueableApexRemoting:
                propSetMap.useQueueableApexRemoting === true,
              sendJSONPath: docSignTemplateGroup.sendJSONPath,
              sendJSONNode: docSignTemplateGroup.sendJSONNode
            }
          };
          drTransform = new OmniscriptDrTransformActionUtil(transformControl);

          const promise = drTransform
            .executeAction(null, null, comp, null, null)
            .then((response) => {
              const resp = response.result;

              if (resp && resp.error) {
                comp.sendErrorModalUtil(
                  resp.errorMsg,
                  comp._isBtn,
                  this._element,
                  comp.scriptHeaderDef,
                  comp
                );
              } else {
                input = this.getSendResponseJSONUtil(
                  input,
                  propSetMap.sendJSONPath,
                  propSetMap.sendJSONNode,
                  propSetMap.JSONPath,
                  comp.scriptHeaderDef.labelMap,
                  propSetMap.sendOnlyExtraPayload
                );
                if (docSignTemplateGroup.TFDRresp) {
                  delete docSignTemplateGroup.TFDRresp;
                }
                docSignTemplateGroup.TFDRresp = resp;
              }
            });
          promiseArray.push(promise);
        } else {
          if (
            docSignTemplateGroup.sendJSONPath &&
            docSignTemplateGroup.sendJSONPath !== ""
          ) {
            docSignTemplateGroup.input = this.getSendResponseJSONUtil(
              input,
              docSignTemplateGroup.sendJSONPath,
              docSignTemplateGroup.sendJSONNode,
              docSignTemplateGroup.JSONPath,
              comp.scriptHeaderDef.labelMap,
              docSignTemplateGroup.sendOnlyExtraPayload
            );
            docSignTemplateGroup.input = applyDateFormat(
              docSignTemplateGroup.input,
              options
            );
          } else {
            input = applyDateFormat(input, options);
          }

          if (docSignTemplateGroup.TFDRresp) {
            delete docSignTemplateGroup.TFDRresp;
          }
          promiseArray.push(Promise.resolve(true));
        }
      }
    );

    return Promise.all(promiseArray).then((resp) => {
      resp = { input: input, control: control };
      return resp;
    });
  }

  //handle Merger field
  getDataFromMergeField(signerListStr, comp) {
    return JSON.parse(
      this.handleMergeFieldUtil(
        signerListStr,
        this.getCompJsonData(comp),
        comp.scriptHeaderDef.labelMap,
        this.isRepeatNotationUtil(signerListStr) ? comp.jsonDef.JSONPath : null
      )
    );
  }

  // Get the data from the docusign Template
  getDataFromDocusignTemplate(control, comp) {
    let docuSignInput = {},
      signerListStr = "";
    if (
      control.propSetMap.docuSignTemplate &&
      control.propSetMap.docuSignTemplate !== ""
    ) {
      control.propSetMap.docuSignTemplatesGroup = [];
      docuSignInput.docuSignTemplate = control.propSetMap.docuSignTemplate;
      signerListStr = JSON.stringify(control.propSetMap.signerList);
      docuSignInput.signerList = this.getDataFromMergeField(
        signerListStr,
        comp
      );
      docuSignInput.sendJSONPath = control.propSetMap.sendJSONPath;
      docuSignInput.sendJSONNode = control.propSetMap.sendJSONNode;
      docuSignInput.transformBundle = control.propSetMap.transformBundle;
      docuSignInput.includeToSend = true;

      if (!this.validateSigner(docuSignInput)) {
        return {
          error: true,
          errorMsg: comp.scriptHeaderDef.allCustomLabels
            ? comp.scriptHeaderDef.allCustomLabels.OmniDocuSignNoRecipients
            : "OmniDocuSignNoRecipients"
        };
      }

      control.propSetMap.docuSignTemplatesGroup.push(docuSignInput);
      control.propSetMap.remoteOptions.docuSignTemplatesGroup =
        control.propSetMap.docuSignTemplatesGroup;
    } else {
      for (
        let i = 0;
        i < control.propSetMap.docuSignTemplatesGroup.length;
        i++
      ) {
        signerListStr = JSON.stringify(
          control.propSetMap.docuSignTemplatesGroup[i].signerList
        );
        let docuInp = {};
        docuInp.signerList = this.getDataFromMergeField(signerListStr, comp);

        if (!this.validateSigner(docuInp)) {
          return {
            error: true,
            errorMsg: comp.scriptHeaderDef.allCustomLabels
              ? comp.scriptHeaderDef.allCustomLabels.OmniDocuSignNoRecipients
              : "OmniDocuSignNoRecipients"
          };
        }

        control.propSetMap.remoteOptions.docuSignTemplatesGroup[i] = {};
        control.propSetMap.remoteOptions.docuSignTemplatesGroup[
          i
        ].docuSignTemplate =
          control.propSetMap.docuSignTemplatesGroup[i].docuSignTemplate;
        control.propSetMap.remoteOptions.docuSignTemplatesGroup[
          i
        ].sendJSONPath =
          control.propSetMap.docuSignTemplatesGroup[i].sendJSONPath;
        control.propSetMap.remoteOptions.docuSignTemplatesGroup[
          i
        ].sendJSONNode =
          control.propSetMap.docuSignTemplatesGroup[i].sendJSONNode;
        control.propSetMap.remoteOptions.docuSignTemplatesGroup[
          i
        ].transformBundle =
          control.propSetMap.docuSignTemplatesGroup[i].transformBundle;
        control.propSetMap.remoteOptions.docuSignTemplatesGroup[
          i
        ].includeToSend =
          control.propSetMap.docuSignTemplatesGroup[i].includeToSend;
        control.propSetMap.remoteOptions.docuSignTemplatesGroup[i].signerList =
          docuInp.signerList;
      }
    }
    return { error: false };
  }

  //Validate the sender email
  validateSigner(docuSignInput) {
    let i = 0;
    for (
      i;
      i < docuSignInput.signerList.length ||
      docuSignInput.signerList.length === 0;
      i++
    ) {
      if (
        docuSignInput.signerList.length === 0 ||
        docuSignInput.signerList[i].signerEmail === "" ||
        docuSignInput.signerList[i].signerName === "" ||
        docuSignInput.signerList[i].templateRole === ""
      ) {
        return false;
      }
    }
    return true;
  }

  // eslint-disable-next-line no-unused-vars
  sendDocusignMail(comp, resp, input) {
    return this.preProcessCommonReq(
      comp,
      resp.control,
      {
        sClassName: `${this._ns}DefaultDocuSignOmniScriptIntegration`,
        sMethodName: "sendEnvelope"
      },
      resp.input,
      null
    );
  }
}
