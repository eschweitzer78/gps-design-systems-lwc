import { track } from "lwc";
import OmniscriptBaseAction from "c/sfGpsDsOsrtOmniscriptBaseAction";
import {
  OmniscriptDocusignSignatureActionUtil,
  OmniscriptRemoteActionUtil
} from "c/sfGpsDsOsrtOmniscriptActionUtils";
import {
  getNamespaceDotNotation,
  getUrl
} from "c/sfGpsDsOsrtOmniscriptInternalUtils";
import { safePostMessage } from "c/sfGpsDsOsrtSalesforceUtils";
import tmpl from "./omniscriptDocusignSignatureAction_slds.html";
import tmpl_nds from "./omniscriptDocusignSignatureAction_nds.html";

/**
 * @module ns/omniscriptDocusignSignatureAction
 */
export default class OmniscriptDocusignSignatureAction extends OmniscriptBaseAction {
  /**
   * @type {Boolean} - Opens DocuSign Signing Ceremony in modal.
   * @scope private
   */
  _docusignModal = true;

  /**
   * @type {String} - Default header css classes for modal.
   * @scope private
   */
  _headerClasses;

  /**
   * @type {String} - Default footer css classes for modal.
   * @scope private
   */
  _footerClasses;

  /**
   * @type {String} - Default css classes for modal container.
   * @scope private
   */
  _modalContainerClass;

  /**
   * @type {String} - Envelope Id of DocuSign for which signature is in progress.
   * @scope private
   */
  _envelopeId;

  /**
   * @type {Object[]} - Envelope Id Array of DocuSign for multiple signatures.
   * @scope private
   */
  _envelopeIdArray = [];

  /**
   * @type {String} - PDF blob data which we get from DocuSign after successful signature completion.
   * @scope private
   */
  _pdfData;

  /**
   * @type {Boolean} - Display View PDF button on modal after signature is completed successfully.
   * @scope track (private)
   */
  @track showViewPdfBtn = false;

  /**
   * @type {Boolean} - Disable View PDF button on modal after clicking on View PDF button and PDF is displayed.
   * @scope track (private)
   */
  @track disableViewPdfBtn = false;

  _ns = getNamespaceDotNotation();
  _iframeComp;

  execute() {
    if (this._isBtn) {
      // resets the View PDF button
      this.showViewPdfBtn = false;
    }

    return super.execute();
  }

  connectedCallback() {
    super.connectedCallback();
    this._headerClasses = `${this._theme}-modal__header ${this._theme}-text-heading_medium'`;
    this._modalClasses = `${this._theme}-modal ${this._theme}-fade-in-open`;
    this._footerClasses = `${this._theme}-modal__footer ${this._theme}-theme_default`;
    this._modalContainerClass = `${this._theme}-modal_prompt modal-container`;

    window.addEventListener("message", (event) => {
      try {
        let docusignStatus =
          typeof event.data === "string" &&
          event.data.indexOf("docusignPostMessage") !== -1
            ? JSON.parse(event.data)
            : event.data;
        if (
          typeof docusignStatus === "object" &&
          docusignStatus.docusignPostMessage
        ) {
          // caches iframe DOM query
          if (!this._iframeComp) {
            this._iframeComp = this.template.querySelector("iframe");
          }

          if (docusignStatus.docuSignViewPdfPageloaded) {
            safePostMessage(
              this._iframeComp.contentWindow,
              { pdfData: this._pdfData, docusignPostMessageViewPdf: true },
              "*"
            );
          } else {
            //Using object to fix OMNI-5324 because handle_message function of BusinessProcessJS expecting string object to parse
            try {
              docusignStatus = docusignStatus.docusignStatus;
            } catch (e) {
              return;
            }
            if (docusignStatus) {
              if (docusignStatus === "signing_complete") {
                docusignStatus = "Completed";
                this.showViewPdfBtn = true;
              } else if (docusignStatus === "decline")
                docusignStatus = "Declined";
              else if (docusignStatus === "cancel") docusignStatus = "Cancel";

              if (this._envelopeIdArray[0]) {
                this._envelopeIdArray[0].status = docusignStatus;
                this.dispatchOmniEventUtil(
                  this,
                  {
                    apiResponse: { [this.jsonDef.name]: this._envelopeIdArray }
                  },
                  "omniactionbtn"
                );
              }
            }
          }
        }
      } catch (e) {
        console.error("Invalid ", e);
      }
    });
    if (this.jsonDef) {
      this._actionUtilClass = new OmniscriptDocusignSignatureActionUtil(
        this.jsonDef
      );
    }
  }

  render() {
    return this.layout === "newport" ? tmpl_nds : tmpl;
  }

  /**
   * View the pdf after successful signature completion in DocuSign Signing Ceremony.
   * @scope private
   * @returns {Void}
   */
  viewPDF() {
    let control = JSON.parse(JSON.stringify(this.jsonDef));
    control.propSetMap.remoteOptions = { envelopeId: this._envelopeId };
    control.propSetMap.remoteOptions.lwcViewPdf = true;
    control.propSetMap.remoteOptions.elementName = control.name;

    const remoteUtilClass = new OmniscriptRemoteActionUtil(control);
    const actionParams = {
      sClassName: `${this._ns}DefaultDocuSignOmniScriptIntegration`,
      sMethodName: "getEnvelopePDF"
    };

    this.evaluateSpinner(true, this.jsonDef);

    remoteUtilClass
      .executeAction(actionParams, null, this, null, null)

      // eslint-disable-next-line consistent-return
      .then((response) => {
        this.evaluateSpinner(false, this.jsonDef);

        if (!response.error && response.result && response.result.success) {
          return getUrl("OmniScriptLwcDocuSignViewPdf").then((pdfUrl) => {
            this._iframeComp.setAttribute("src", pdfUrl);
            this._pdfData = response.result.docuSignEnvelopePDF;
            this.disableViewPdfBtn = true;
          });
        }
      })
      // eslint-disable-next-line no-unused-vars
      .catch((errorResp) => {
        this.evaluateSpinner(false, this.jsonDef);
      });
  }

  /**
   * Close the DocuSign Signing Ceremony modal.
   * @scope private
   * @returns {Void}
   */
  closeModal() {
    this.showViewPdfBtn = false;
    this.disableViewPdfBtn = false;

    // Caches DOM query in the event DocuSign message event listener doesnt cache the iframeComp before the user
    // attemots to close the modal
    if (!this._iframeComp)
      this._iframeComp = this.template.querySelector("iframe");

    this._iframeComp.setAttribute("src", "about:blank");
    this.template.querySelector(".modal-container").style.display = "none";
  }
}
