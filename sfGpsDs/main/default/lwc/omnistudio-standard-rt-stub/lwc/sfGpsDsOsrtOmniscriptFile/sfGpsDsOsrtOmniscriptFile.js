import { api, track } from "lwc";
import OmniscriptAtomicElement from "c/sfGpsDsOsrtOmniscriptAtomicElement";
import { OmniscriptActionCommonUtil } from "c/sfGpsDsOsrtOmniscriptActionUtils";
import {
  handleErrorReplace,
  isRepeatNotation,
  handleExtraPayload,
  generateUUID
} from "c/sfGpsDsOsrtOmniscriptInternalUtils";
import { LinkContentDocument } from "c/sfGpsDsOsrtOmniscriptRestApi";
import { DeleteOSContentDocument } from "c/sfGpsDsOsrtOmniscriptRestApi";
import tmpl from "./omniscriptFile_slds.html";
import tmpl_nds from "./omniscriptFile_nds.html";

/**
 * @module ns/omniscriptFile
 * @extends OmniscriptAtomicElement
 * @typicalname omniscriptFile
 */
export default class OmniscriptFile extends OmniscriptAtomicElement {
  // Private track properties
  /**
   * @type {Array} - A list of current uploaded files
   * @scope track (private)
   */
  @track _value = [];

  /**
   * @type {Boolean} - Keeps track if the spinner is shown
   * @scope track (private)
   */
  @track isPageLoading = false;

  /**
   * @type {Boolean} - Keeps track if the validation message is shown
   * @scope track (private)
   */
  @track _showValidation;

  /**
   * @type {String} - The CSS classes to be applied to the component
   * @scope track (private)
   */
  @track _containerClasses = "";

  /**
   * @type {String} - The current status of the aria live message to show after uploading files (polite, assertive, off)
   * @scope track (private)
   */
  @track ariaLiveStatus;

  /**
   * @type {String} - The current value of the aria live message to show after uploading files
   * @scope track (private)
   */
  @track ariaLiveStatusText;

  // Private properties\
  /**
   * @type {String} - Utility class for HTTP Actions
   * @scope private
   */
  _actionUtil;

  /**
   * @type {String} - The current styling theme
   * @scope private
   */
  _theme;

  /**
   * @type {String} - An array of content parent records for this file
   * @scope private
   */
  _contentParentIds = [];

  /**
   * @type {String} - When guest user, the parent record for the uploaded file.
   * @scope private
   */
  get parentRecordId() {
    const contentParents = [];

    // Save to content document
    if (
      this._propSetMap?.uploadContDoc === true &&
      this._propSetMap?.contentParentId &&
      Array.isArray(this._propSetMap?.contentParentId)
    ) {
      this._propSetMap.contentParentId.forEach((pId) => {
        const id = this.handleMergeFieldUtil(
          pId,
          this.jsonData,
          this.scriptHeaderDef.labelMap,
          isRepeatNotation(pId) ? this.jsonDef.JSONPath : null
        );
        if (id) {
          contentParents.push(id);
        }
      });

      this._contentParentIds = contentParents;
    }

    // If guest user and FBC, we will use the first parent record ID
    if (this.scriptHeaderDef.isGuestUser === true) {
      if (this.scriptHeaderDef.sOmniScriptId.indexOf("_") === -1) {
        // For Non-FBC return the OS Id
        return this.scriptHeaderDef.sOmniScriptId;
      } else if (this._contentParentIds.length > 0) {
        // For FBC, return the first content parent ID
        return this._contentParentIds.shift();
      }
    } else {
      return this._contentParentIds.shift();
    }

    return "";
  }

  /**
   * Overwrites inherited connectedCallback.
   * @scope private
   * @returns {void}
   */
  connectedCallback() {
    super.connectedCallback();
    this._actionUtilClass = new OmniscriptActionCommonUtil();
  }

  /**
   * Overwrites inherited initCompVariables. This method is executed once during connectedCallback.
   * @scope private
   * @returns {void}
   */
  initCompVariables() {
    super.initCompVariables();
    this._theme = this.layout === "newport" ? "nds" : "slds";
    this._needMoreValidation = false;
    if (this.jsonDef.response) {
      this._value = JSON.parse(JSON.stringify(this.jsonDef.response)).map(
        (item) => {
          return Object.assign(item, {
            deleteLabel: this.allCustomLabelsUtil.OmniDeleteItem?.replace(
              "{0}",
              item.filename
            )
          });
        }
      );
    }
  }

  /**
   * An event listener that is triggered after file have been uploaded.
   * @param {Event} event
   * @scope private
   * @returns {void}
   */
  handleUploadFinished(event) {
    // Get the list of uploaded files
    const uploads = event.detail.files,
      documentIds = [],
      contentParents = this._contentParentIds,
      filesData = {};

    uploads.forEach((file) => {
      // Save the details of the files in an object for quicker modification
      const id = file.documentId || generateUUID();
      filesData[id] = {
        data: id,
        filename: file.name,
        vId: "",
        size: 0
      };

      // If we have public URL, store it
      if (file.publicUrl) {
        filesData[file.documentId].publicUrl = file.publicUrl;
      }

      // Save the document ids in order to unlink from OS and, if required,
      // link to content documents
      if (file.documentId) {
        documentIds.push(file.documentId);
      }
    });

    LinkContentDocument({
      documentIds: documentIds,
      omniscriptId: this.scriptHeaderDef.sOmniScriptId,
      parentIds: contentParents
    })
      .then((response) => {
        const dataResponse = JSON.parse(response);

        if (dataResponse.error) {
          return Promise.reject(dataResponse.error);
        }

        // Save the document versions and size
        dataResponse.versions.forEach((ver) => {
          if (filesData.hasOwnProperty(ver.ContentDocumentId)) {
            filesData[ver.ContentDocumentId].size = ver.ContentSize;
            filesData[ver.ContentDocumentId].vId = ver.Id;
          }
        });

        // Create the final array of uploaded items
        const files = [],
          contentIds = {};
        for (let key in filesData) {
          if (filesData.hasOwnProperty(key)) {
            files.push(
              Object.assign(filesData[key], {
                deleteLabel: this.allCustomLabelsUtil.OmniDeleteItem?.replace(
                  "{0}",
                  filesData[key].filename
                )
              })
            );
            contentIds[key] = key;
          }
        }

        this._value = this._value.concat(files);

        // Remote invoke if configured and uploadContDoc
        let promise = Promise.resolve();
        if (
          this._propSetMap.uploadContDoc === true &&
          this._propSetMap.remoteClass !== undefined &&
          this._propSetMap.remoteClass !== ""
        ) {
          const sClassName = this._propSetMap.remoteClass,
            sMethodName = this._propSetMap.remoteMethod,
            filesMap = Object.assign(
              {},
              this.scriptHeaderDef.filesMap,
              contentIds
            ),
            input = Object.assign(
              {
                [this.jsonDef.name]: this._value
              },
              handleExtraPayload(this._propSetMap.extraPayload, {}, this)
            ),
            options = Object.assign(
              {
                vlcFileKey: this.jsonDef.name,
                vlcClass: this._propSetMap.remoteClass,
                vlcOperation: "contentDocumentAdd",
                vlcFilesMap: filesMap
              },
              // handleExtraPayload is used to performs merge fields
              handleExtraPayload(this._propSetMap.remoteOptions, {}, this)
            ),
            actionParams = {
              input: JSON.stringify(input),
              options: JSON.stringify(options),
              sClassName,
              sMethodName
            };

          promise = this._actionUtilClass
            .executeAction(actionParams, null, this)
            .then((resp) => {
              // handles errors from remote calls
              if (resp.error) {
                // action framework api provides result node which houses the entire remote call response
                // where the error will be housed
                this.notifyError(resp.result);
              }

              return Promise.resolve();
            });
        }

        return promise;
      })
      .catch((respErr) => {
        this.notifyError(respErr);
      })
      .finally(() => {
        this._containerClasses = "";
        this._showValidation = false;
        this.isPageLoading = false;
        this.notifyUploadChange();
        this.ariaLiveStatus = "polite";
        this.ariaLiveStatusText =
          this.allCustomLabelsUtil.OmniFileUploadCount.replace(
            "{0}",
            this._value.length
          );
      });
  }

  /**
   * Deletes a file from the values and notify the change.
   * Also, tries to delete to remove the file from content document
   * @param {Event} evt
   * @scope private
   * @returns {void}
   */
  deleteFile(evt) {
    const documentId = evt.target.getAttribute("data-id");
    this.isPageLoading = true;

    let promise = Promise.resolve();

    // Guest user might not have document ID, we use a generated UUID.
    // In that case, do not try to delete the file or it will fail.
    if (documentId && documentId.indexOf("-") === -1) {
      promise = DeleteOSContentDocument({ contentDocumentId: documentId });
    }

    promise
      .then(() => {
        this._value = this._value.filter((doc) => doc.data !== documentId);
        this.notifyUploadChange(documentId, true);
      })
      .catch((responseError) => {
        // Check to see if the deletion failed due to the file entity already being deleted
        if (
          responseError &&
          responseError.status === 500 &&
          responseError.body &&
          Array.isArray(responseError.body.pageErrors) &&
          responseError.body.pageErrors[0] &&
          (responseError.body.pageErrors[0].statusCode ===
            "ENTITY_IS_DELETED" ||
            responseError.body.pageErrors[0].statusCode ===
              "INSUFFICIENT_ACCESS_OR_READONLY")
        ) {
          this._value = this._value.filter((doc) => doc.data !== documentId);
          this.notifyUploadChange(documentId, true);
        } else {
          this.notifyError(responseError);
        }
      })
      .finally(() => {
        this.isPageLoading = false;
        this.ariaLiveStatusText =
          this.allCustomLabelsUtil.OmniFileUploadCount.replace(
            "{0}",
            this._value.length
          );
      });
  }

  /**
   * Notifies the component that a file was uploaded or removed
   * @param {string} [removedId] Optional. If a file is removed, the documentId
   * @param {Boolean} [bFileDeleteSuccess] Optional. True = file deletion is successful
   * @scope private
   * @returns {void}
   */
  notifyUploadChange(removedId, bFileDeleteSuccess) {
    let bApi = false;

    // File Required Data JSON Apply Note:
    // If called from deleteFile, the file is required, and there are no files existing in the filesMap
    // after the deletion, data json will be updated to reflect the empty filesMap despite the required
    // property set (this is an exception to the general required validation flow). UI validation will
    // still trigger
    if (
      this._value.length > 0 === false &&
      bFileDeleteSuccess === true &&
      this._propSetMap.required === true &&
      removedId != null
    ) {
      bApi = true;
      this._forceJsonToApply = true;
    }
    // Reset _forceJsonToApply when the condition outlined in the File Required Data JSON Apply Note is not valid
    else {
      this._forceJsonToApply = false;
    }

    // Reference File Required Data JSON Apply Note
    this.applyCallResp(this._value, bApi);

    let detail = {};
    if (removedId) {
      detail = {
        operation: "delete",
        fileId: removedId
      };
    } else {
      detail = {
        operation: "add",
        files: this._value
      };
    }
    this.dispatchOmniEventUtil(this, detail, "omnifileuploaded");
  }

  /**
   * Sets the container CSS styling
   * @scope private
   * @returns {void}
   */
  setContainerClasses() {
    this._containerClasses = this.isValid ? "" : this._theme + "-has-error";
  }

  /**
   * Dispatches an error modal.
   * @param {string} error
   * @scope private
   * @returns {void}
   */
  notifyError(error) {
    const errorMsg = handleErrorReplace(
      error,
      this._propSetMap,
      this.scriptHeaderDef
    );
    const detail = {
      type: "error",
      header: "Error",
      message: errorMsg,
      closeAfterClick: true,
      buttons: [{ label: "Ok", key: "0-Ok" }],
      hideHeader: false,
      hideFooter: false,
      triggeredOnStep: true
    };
    this.dispatchOmniEventUtil(this, detail, "omnimodal");
  }

  /**
   * Interface for native DOM checkValidity().
   * Performs custom validation as well as native Constraint Validation API calls.
   * Returns a boolean, but doesn't trigger display of validation messages.
   * @scope private
   * @returns {Boolean}
   */
  @api checkValidity() {
    this.isValid =
      this._propSetMap.required === true ? this._value.length > 0 : true;
    this.setContainerClasses();
    return this.isValid;
  }

  /**
   * Interface for native DOM reportValidity().
   * Performs custom validation as well as native Constraint Validation API calls.
   * Returns a boolean, and triggers the display of validation messages.
   * @scope private
   * @returns {Boolean}
   */
  @api reportValidity() {
    this.isValid =
      this._propSetMap.required === true ? this._value.length > 0 : true;
    this._showValidation = !this.isValid;
    if (this._showValidation) {
      if (this._propSetMap.label) {
        this.errorMessage = `${this.allCustomLabelsUtil.OmniErrorPrefix}${this.allCustomLabelsUtil.OmniRequiredWithLabel?.replace(
          /\{0\}/gi,
          this._propSetMap.label
        )}`;
      } else {
        this.errorMessage = `${this.allCustomLabelsUtil.OmniErrorPrefix}${this.allCustomLabelsUtil.OmniRequired}`;
      }
    }
    this.setContainerClasses();

    return this.isValid;
  }

  validateData(data) {
    const filesMap = this.scriptHeaderDef.filesMap;
    let isValid = Array.isArray(data) || data === null;

    // The data is valid ONLY if is an array and the files are part of the previously uploaded files.
    // This files list is in the scriptHeaderDef.filesMap object
    if (isValid && data) {
      isValid = data.reduce((valid, file) => {
        return valid && filesMap.hasOwnProperty(file.data || null);
      }, true);
    }
    return {
      valid: isValid,
      dataToApply: data
    };
  }

  setChildInputValue(value) {
    this._value = value || [];
  }

  /**
   * Overwrites native LWC render
   * @return {Template}
   * @scope private
   */
  render() {
    return this.layout === "newport" ? tmpl_nds : tmpl;
  }

  handleFocusOut() {
    this.reportValidity();
  }
}
