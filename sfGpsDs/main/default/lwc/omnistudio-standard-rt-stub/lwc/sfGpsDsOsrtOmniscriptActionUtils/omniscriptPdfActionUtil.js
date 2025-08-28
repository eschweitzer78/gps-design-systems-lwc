import { Buffer } from "c/sfGpsDsOsrtBuffer";
import { applyDateFormat } from "c/sfGpsDsOsrtOmniscriptUtils";
import { replaceUrlHost } from "c/sfGpsDsOsrtOmniscriptRestApi";
import { OmniscriptBaseActionUtil } from "./omniscriptBaseActionUtil";
import { OmniscriptDrTransformActionUtil } from "./omniscriptDrTransformActionUtil";
import { OmniscriptActionCommonUtil } from "./omniscriptActionCommonUtil";

/**
 * Omniscript PDF Action Utility Class
 */
export class OmniscriptPdfActionUtil extends OmniscriptBaseActionUtil {
  /**
   * @description Executes action flow. Starting point for the action flow. This method should NOT be overwritten.
   *              Hooks are present throughout the action flow that can be used as an alternative.
   * @param {Object} params
   * @param {String} queueableId
   * @param {*} comp
   * @param {Object} payload
   * @param {Object} vlcParams
   * @returns {Promise}
   */
  preProcess(params, queueableId, comp, payload) {
    const control = JSON.parse(JSON.stringify(this._element));
    const propSetMap = control.propSetMap;
    const prepProms = [],
      input = payload,
      options = {
        dateFormat: propSetMap.dateFormat,
        dateTimeFormat: propSetMap.dateTimeFormat,
        timeFormat: propSetMap.timeFormat,
        readOnly: propSetMap.readOnly
      };

    if (propSetMap.useAppearanceObject) {
      options.useAppearanceObject = propSetMap.useAppearanceObject;
    }

    prepProms.push(comp.loadWriterProm);

    const preTransformPromise = this.runPreTransform(control, input, comp);
    prepProms.push(preTransformPromise);

    let templateFetch = new OmniscriptActionCommonUtil();
    const params1 = {
      input: { templateName: propSetMap.templateName },
      sClassName: "omnistudiocore.DefaultPDFOmniScriptIntegration",
      sMethodName: "fetchPDFTemplate",
      options: { vlcClass: "omnistudiocore.DefaultPDFOmniScriptIntegration" }
    };
    const fetchPdfPromise = templateFetch.executeAction(
      params1,
      null,
      comp,
      payload,
      null
    );
    prepProms.push(fetchPdfPromise);

    this._parentId = this.handleMergeFieldUtil(
      propSetMap.attachmentParentId,
      this.getCompJsonData(comp),
      comp.scriptHeaderDef.labelMap,
      this.isRepeatNotationUtil(propSetMap.attachmentParentId)
        ? this._element.JSONPath
        : null
    );

    const customFileName = this.handleMergeFieldUtil(
      propSetMap.attachmentName,
      this.getCompJsonData(comp),
      comp.scriptHeaderDef.labelMap,
      this.isRepeatNotationUtil(propSetMap.attachmentName)
        ? this._element.JSONPath
        : null
    )
      .replace(/\.pdf/, "")
      .replace(/\./g, "");

    return Promise.all(prepProms).then(
      function (respArray) {
        const data = respArray[1] || {},
          template = new Buffer(respArray[2].result.templateBody, "base64"),
          filledInForm = comp.vPdfWriter.fillPdfForm(template, data, options),
          tempInput = filledInForm.toString("base64");
        return {
          sClassName:
            "omnistudiocore.BusinessProcessDisplayController.BusinessProcessDisplayControllerOpen",
          sMethodName: "CreateOSAttachment",
          input: {
            input: tempInput,
            parentId: this._parentId || "TEMP",
            fileName: (customFileName || this._element.name) + ".pdf"
          },
          options: "{}"
        };
      }.bind(this)
    );
  }

  runPreTransform(control, input, comp) {
    let transformControl;
    let out;
    const propSetMap = control.propSetMap;
    const options = {
      dateFormat: propSetMap.dateFormat,
      dateTimeFormat: propSetMap.dateTimeFormat,
      timeFormat: propSetMap.timeFormat
    };
    const transform = propSetMap.preTransformBundle;

    if (transform != null && transform !== "") {
      transformControl = {
        name: control && control.name,
        type: control && control.type,
        stage: "PreTransform",
        propSetMap: {
          label: control && control.propSetMap.label,
          bundle: transform,
          useQueueableApexRemoting:
            propSetMap.useQueueableApexRemoting === true,
          sendJSONPath: propSetMap.sendJSONPath,
          sendJSONNode: propSetMap.sendJSONNode
        }
      };
      let drTransform = new OmniscriptDrTransformActionUtil(transformControl);

      const promise = drTransform
        .executeAction(null, null, comp, null, null)
        .then((response) => {
          const resp = response.result;
          let output;
          if (resp && resp.error) {
            output = comp.sendErrorModalUtil(
              resp.errorMsg,
              comp._isBtn,
              this._element,
              comp.scriptHeaderDef,
              comp
            );
          } else {
            output = resp;
          }
          return output;
        });
      return promise;
    }
    if (propSetMap.sendJSONPath && propSetMap.sendJSONPath !== "") {
      out = this.getSendResponseJSONUtil(
        input,
        propSetMap.sendJSONPath,
        propSetMap.sendJSONNode,
        propSetMap.JSONPath,
        comp.scriptHeaderDef.labelMap,
        propSetMap.sendOnlyExtraPayload
      );
      out = applyDateFormat(out, options);
    } else {
      out = applyDateFormat(input, options);
    }
    return Promise.resolve(out);
  }

  postProcess(resp, element, comp, failure) {
    if (resp.hasOwnProperty("createdAttachmentId")) {
      const attachmentId = resp.createdAttachmentId,
        attachmentUrl = replaceUrlHost(
          "/servlet/servlet.FileDownload?file=" + attachmentId,
          comp.scriptHeaderDef.isCommunity,
          comp.scriptHeaderDef.networkUrlPathPrefix || null,
          comp.scriptHeaderDef.communityBaseUrl
        );

      if (element.propSetMap.showPopup && !window.open(attachmentUrl)) {
        comp.sendErrorModalUtil(
          comp.scriptHeaderDef.allCustomLabels
            ? comp.scriptHeaderDef.allCustomLabels.OmniPopupBlocked
            : "Popup Blocked",
          comp._isBtn,
          element,
          comp.scriptHeaderDef,
          comp
        );
      }

      if (!this._parentId) {
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(
          function () {
            let deleteUtil = new OmniscriptActionCommonUtil();
            const params1 = {
              sClassName:
                "omnistudiocore.BusinessProcessDisplayController.BusinessProcessDisplayControllerOpen",
              sMethodName: "DeleteOSAttachment",
              input: {
                attachmentId: attachmentId,
                deleteParent: true
              },
              options: "{}"
            };
            deleteUtil.executeAction(params1, null, comp, null, null).then(
              (delresp) => {
                if (delresp.error || delresp.result.error !== "OK") {
                  comp.sendErrorModalUtil(
                    delresp.result.error,
                    comp._isBtn,
                    this._element,
                    comp.scriptHeaderDef,
                    comp
                  );
                }
              },
              (delresp) => {
                comp.sendErrorModalUtil(
                  delresp.result.error,
                  comp._isBtn,
                  this._element,
                  comp.scriptHeaderDef,
                  comp
                );
              }
            );
          }.bind(this),
          10000
        );
      } else {
        delete this._parentId;
      }
      let tmp = {};
      tmp[element.name] = resp.createdAttachmentId;
      resp = tmp;
    }
    return super.postProcess(resp, element, comp, failure);
  }

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
}
