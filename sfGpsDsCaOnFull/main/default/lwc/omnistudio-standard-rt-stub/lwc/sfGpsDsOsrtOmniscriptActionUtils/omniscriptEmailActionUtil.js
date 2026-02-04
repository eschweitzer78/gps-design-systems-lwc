import { OmniscriptBaseActionUtil } from "./omniscriptBaseActionUtil";

/**
 * Omniscript Email Action Utility Class
 */
export class OmniscriptEmailActionUtil extends OmniscriptBaseActionUtil {
  preProcess(params, queueableRespId, comp, payload, vlcParams) {
    let control = JSON.parse(JSON.stringify(this._element));

    control.propSetMap.remoteOptions = {};
    control.propSetMap.remoteOptions.emailElementName = control.name;
    control.propSetMap.remoteOptions.useTemplate =
      control.propSetMap.useTemplate;
    let tempStr = JSON.stringify(
      this.stringifyProp(
        control.propSetMap.emailTemplateInformation.emailTemplateName
      )
    );
    control.propSetMap.remoteOptions.emailTemplateName = JSON.parse(
      this.handleMergeFieldUtil(
        tempStr,
        this.getCompJsonData(comp),
        comp.scriptHeaderDef.labelMap,
        this.isRepeatNotationUtil(tempStr) ? comp.jsonDef.JSONPath : null
      )
    );
    tempStr = JSON.stringify(
      this.stringifyProp(
        control.propSetMap.emailTemplateInformation.emailTargetObjectId
      )
    );
    control.propSetMap.remoteOptions.emailTargetObjectId = JSON.parse(
      this.handleMergeFieldUtil(
        tempStr,
        this.getCompJsonData(comp),
        comp.scriptHeaderDef.labelMap,
        this.isRepeatNotationUtil(tempStr) ? comp.jsonDef.JSONPath : null
      )
    );
    tempStr = JSON.stringify(
      this.stringifyProp(control.propSetMap.emailTemplateInformation.whatId)
    );
    control.propSetMap.remoteOptions.whatId = JSON.parse(
      this.handleMergeFieldUtil(
        tempStr,
        this.getCompJsonData(comp),
        comp.scriptHeaderDef.labelMap,
        this.isRepeatNotationUtil(tempStr) ? comp.jsonDef.JSONPath : null
      )
    );
    control.propSetMap.remoteOptions.saveAsActivity =
      control.propSetMap.emailTemplateInformation.saveAsActivity;
    tempStr = JSON.stringify(
      this.stringifyProp(control.propSetMap.emailInformation.toAddressList)
    );
    control.propSetMap.remoteOptions.toAddressList = this.parseEmailAddresses(
      JSON.parse(
        this.handleMergeFieldUtil(
          tempStr,
          this.getCompJsonData(comp),
          comp.scriptHeaderDef.labelMap,
          this.isRepeatNotationUtil(tempStr) ? comp.jsonDef.JSONPath : null
        )
      )
    );
    tempStr = JSON.stringify(
      this.stringifyProp(control.propSetMap.OrgWideEmailAddress)
    );
    control.propSetMap.remoteOptions.OrgWideEmailAddress = JSON.parse(
      this.handleMergeFieldUtil(
        tempStr,
        this.getCompJsonData(comp),
        comp.scriptHeaderDef.labelMap,
        this.isRepeatNotationUtil(tempStr) ? comp.jsonDef.JSONPath : null
      )
    );

    if (
      control.propSetMap.remoteOptions.useTemplate &&
      (control.propSetMap.remoteOptions.emailTemplateName === "" ||
        control.propSetMap.remoteOptions.emailTemplateName === undefined)
    ) {
      return {
        error: true,
        errorMsg: comp.scriptHeaderDef.allCustomLabels
          ? comp.scriptHeaderDef.allCustomLabels.OmniSendEmailNoTemplate
          : "OmniSendEmailNoTemplate"
      };
    }

    if (
      !control.propSetMap.remoteOptions.useTemplate &&
      control.propSetMap.remoteOptions.toAddressList.length === 0
    ) {
      return {
        error: true,
        errorMsg: comp.scriptHeaderDef.allCustomLabels
          ? comp.scriptHeaderDef.allCustomLabels.OmniDocuSignNoRecipients
          : "OmniDocuSignNoRecipients"
      };
    }

    tempStr = JSON.stringify(
      this.stringifyProp(control.propSetMap.emailInformation.ccAddressList)
    );
    control.propSetMap.remoteOptions.ccAddressList = this.parseEmailAddresses(
      JSON.parse(
        this.handleMergeFieldUtil(
          tempStr,
          this.getCompJsonData(comp),
          comp.scriptHeaderDef.labelMap,
          this.isRepeatNotationUtil(tempStr) ? comp.jsonDef.JSONPath : null
        )
      )
    );
    tempStr = JSON.stringify(
      this.stringifyProp(control.propSetMap.emailInformation.bccAddressList)
    );
    control.propSetMap.remoteOptions.bccAddressList = this.parseEmailAddresses(
      JSON.parse(
        this.handleMergeFieldUtil(
          tempStr,
          this.getCompJsonData(comp),
          comp.scriptHeaderDef.labelMap,
          this.isRepeatNotationUtil(tempStr) ? comp.jsonDef.JSONPath : null
        )
      )
    );
    tempStr = JSON.stringify(
      this.stringifyProp(control.propSetMap.emailInformation.emailSubject)
    );
    control.propSetMap.remoteOptions.emailSubject = JSON.parse(
      this.handleMergeFieldUtil(
        tempStr,
        this.getCompJsonData(comp),
        comp.scriptHeaderDef.labelMap,
        this.isRepeatNotationUtil(tempStr) ? comp.jsonDef.JSONPath : null
      )
    );
    tempStr = JSON.stringify(
      this.stringifyProp(control.propSetMap.emailInformation.emailBody)
    );
    control.propSetMap.remoteOptions.emailBody = JSON.parse(
      this.handleMergeFieldUtil(
        tempStr,
        this.getCompJsonData(comp),
        comp.scriptHeaderDef.labelMap,
        this.isRepeatNotationUtil(tempStr) ? comp.jsonDef.JSONPath : null
      )
    );
    control.propSetMap.remoteOptions.setHtmlBody =
      control.propSetMap.emailInformation.setHtmlBody;

    // File Attachment Support
    tempStr = JSON.stringify(
      this.stringifyProp(control.propSetMap.fileAttachments)
    );
    let fileAttachments = JSON.parse(
      this.handleMergeFieldUtil(
        tempStr,
        this.getCompJsonData(comp),
        comp.scriptHeaderDef.labelMap,
        this.isRepeatNotationUtil(tempStr) ? comp.jsonDef.JSONPath : null
      )
    );
    // For LWC this property will always true because docs will be always content doc.
    control.propSetMap.remoteOptions.uploadContDoc = true;

    if (fileAttachments.length > 0) {
      fileAttachments.forEach((fileAttachment) => {
        fileAttachment.content = fileAttachment.data;
      });
    }

    if (this.lodashUtil.isEqual(fileAttachments, "")) fileAttachments = [];
    control.propSetMap.remoteOptions.fileAttachments = fileAttachments;

    if (control.propSetMap.attachmentList !== undefined) {
      tempStr = JSON.stringify(
        this.stringifyProp({ osAttList: control.propSetMap.attachmentList })
      );
      let osAtt = JSON.parse(
        this.handleMergeFieldUtil(
          tempStr,
          this.getCompJsonData(comp),
          comp.scriptHeaderDef.labelMap,
          this.isRepeatNotationUtil(tempStr) ? comp.jsonDef.JSONPath : null
        )
      );

      if (osAtt.osAttList && !Array.isArray(osAtt.osAttList))
        osAtt.osAttList = [osAtt.osAttList];

      if (Array.isArray(osAtt.osAttList))
        control.propSetMap.remoteOptions.osAttList = osAtt.osAttList;
    }

    // Document Attachment Support
    let docLst = [];
    control.propSetMap.staticDocList.forEach((staticDocList) => {
      docLst.push(staticDocList);
    });

    tempStr = JSON.stringify(this.stringifyProp(control.propSetMap.docList));
    let attachment = JSON.parse(
      this.handleMergeFieldUtil(
        tempStr,
        this.getCompJsonData(comp),
        comp.scriptHeaderDef.labelMap,
        this.isRepeatNotationUtil(tempStr) ? comp.jsonDef.JSONPath : null
      )
    );

    if (attachment && attachment !== "") docLst.push(attachment);

    // Content Version Attachment Support
    if (control.propSetMap.contentVersionList !== undefined) {
      tempStr = JSON.stringify(
        this.stringifyProp({
          osContVerList: control.propSetMap.contentVersionList
        })
      );
      let osConVer = JSON.parse(
        this.handleMergeFieldUtil(
          tempStr,
          this.getCompJsonData(comp),
          comp.scriptHeaderDef.labelMap,
          this.isRepeatNotationUtil(tempStr) ? comp.jsonDef.JSONPath : null
        )
      );

      if (osConVer.osContVerList && !Array.isArray(osConVer.osContVerList))
        osConVer.osContVerList = [osConVer.osContVerList];

      if (Array.isArray(osConVer.osContVerList)) {
        control.propSetMap.remoteOptions.contentVersionAttachments =
          osConVer.osContVerList;
      }
    }

    control.propSetMap.remoteOptions.documentAttachments = docLst;
    return this.preProcessCommonReq(
      comp,
      control,
      {
        sClassName: `${this._ns}DefaultOmniScriptSendEmail`,
        sMethodName: "sendEmail"
      },
      this.getSendResponseJSONUtil(
        payload ? payload : this.getCompJsonData(comp),
        control.propSetMap.sendJSONPath,
        control.propSetMap.sendJSONNode,
        control.propSetMap.JSONPath,
        comp.scriptHeaderDef.labelMap,
        control.propSetMap.sendOnlyExtraPayload
      ),
      vlcParams,
      true
    );
  }

  parseEmailAddresses(addresses) {
    let addrArray = [];
    if (Array.isArray(addresses)) {
      for (let i = 0; i < addresses.length; i++) {
        if (Array.isArray(addresses[i])) {
          for (let j = 0; j < addresses[i].length; j++) {
            if (typeof addresses[i][j] === "object") {
              for (let addr in addresses[i][j]) {
                if (addresses[i][j][addr])
                  addrArray.push(addresses[i][j][addr]);
              }
            } else if (typeof addresses[i][j] === "string") {
              addrArray.push(addresses[i][j]);
            }
          }
        } else if (typeof addresses[i] === "string") {
          addrArray.push(addresses[i]);
        }
      }
    }
    return addrArray;
  }

  stringifyProp(field) {
    return field == null ? "" : field;
  }
}
