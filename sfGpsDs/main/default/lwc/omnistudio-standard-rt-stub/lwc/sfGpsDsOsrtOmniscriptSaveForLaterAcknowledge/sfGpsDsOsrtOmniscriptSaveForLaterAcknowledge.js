/**
 * @module ns/omniscriptSaveForLaterAcknowledge
 * @description This component is used to render Save For Later's acknowledge modal
 */
import { LightningElement, api, track } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { copySelectedToClipboard } from "c/sfGpsDsOsrtOmniscriptUtils";

import tmpl from "./omniscriptSaveForLaterAcknowledge_slds.html";
import tmpl_nds from "./omniscriptSaveForLaterAcknowledge_nds.html";

/**
 * @class OmniscriptSaveForLaterAcknowledge
 * @extends LightningElement
 * @typicalname OmniscriptSaveForLaterAcknowledge
 */
export default class OmniscriptSaveForLaterAcknowledge extends LightningElement {
  /**
   * @scope private
   * @type {Object}
   * @description Contains the results for the save for later acknowledge
   */
  _result = null;
  /**
   * @scope private
   * @type {Object}
   * @description Contains all of the custom labels
   */
  _bSflLabels;

  /**
   * @scope public (api)
   * @description Sets the result for the save for later acknowledge
   */
  @api set result(value) {
    if (value && value.allCustomLabels && !this._bSflLabels) {
      this._bSflLabels = value.allCustomLabels;
    }

    this._result = value ? value.value : undefined;
    this.handleResultChange(value.value);
  }
  get result() {
    return this._result;
  }
  /**
   * @scope public (api)
   * @type {String}
   * @description Stores theme layout.
   */
  @api layout;
  @api auto = false;
  /**
   * @scope public (track)
   * @type {String}
   * @description Stores resume link.
   */
  @track resumeLink;
  /**
   * @scope public (track)
   * @type {String}
   * @description Stores email link.
   */
  @track emailLink;
  /**
   * @scope public (track)
   * @type {Boolean}
   * @description Flag to determine if there is a result for the save for later acknowledge
   */
  @track hasResult = false;

  handleResultChange(val) {
    if (val) {
      const link = val.saveUrl + "&c__instanceId=" + val.instanceId;
      const body = `${this._bSflLabels.OmniResumeLink}\n${link}\n${this._bSflLabels.OmniSaveEmailBody}`;
      this.resumeLink = link;
      this.emailLink = `mailto:?body=${encodeURIComponent(body)}`;
      this.hasResult = true;
    }
  }

  /**
   * Copies resume link to clipboard via temporary textarea.
   */
  copyLinkToClipboard() {
    const { OmniCopyLinkSuccess, OmniCopyLinkError } = this._bSflLabels;
    const container = this.template.querySelector(".copy-container");
    const textarea = document.createElement("textarea");

    textarea.value = this.resumeLink;
    container.appendChild(textarea);

    try {
      copySelectedToClipboard(textarea, "resume link");
      this.dispatchEvent(
        new ShowToastEvent({
          title: OmniCopyLinkSuccess,
          variant: "success"
        })
      );
    } catch (e) {
      console.error(e);
      this.dispatchEvent(
        new ShowToastEvent({
          title: OmniCopyLinkError,
          variant: "error"
        })
      );
    } finally {
      container.removeChild(textarea);
    }
  }

  openEmail() {
    window.open(this.emailLink, "_blank", "noopener");
  }

  render() {
    return this.layout === "newport" ? tmpl_nds : tmpl;
  }
}
