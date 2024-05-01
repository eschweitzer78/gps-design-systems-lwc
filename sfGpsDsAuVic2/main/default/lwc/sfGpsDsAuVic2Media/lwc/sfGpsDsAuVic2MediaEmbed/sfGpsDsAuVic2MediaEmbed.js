import { LightningElement, api, track } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

const TRANSCRIPT_CONTENT_LABEL = "View transcript";

export default class SfGpsDsAuVic2MediaEmbed extends LightningElement {
  @api type;
  @api variant;
  @api size;
  @api title;
  @api src;
  @api alt;
  @api showTitle;
  @api transcriptUrl;
  @api caption;
  @api sourceCaption;
  @api allowFullscreen;
  @api fullscreenLabel;
  @api dSlot;
  @api dLabel;
  @api downloadUrl;
  @api downloadLabel;
  @api className;

  @track isFullscreenOpen = false;
  @track isDataContentOpen = false;

  /* computed */

  get transcriptContentLabel() {
    return TRANSCRIPT_CONTENT_LABEL;
  }

  get dContentLabel() {
    if (this.dLabel) {
      return this.dLabel;
    }

    return `${!this.isDataContentOpen ? "View" : "Close"} '${this.title}' data`;
  }

  get computedIsImage() {
    return this.type === "image";
  }

  get computedIsVideo() {
    return this.type === "video";
  }

  get computedImageAspect() {
    switch (this.variant) {
      case "landscape":
        return { xs: "wide" };
      case "portrait":
        return { xs: "full" };
      case "square":
        return { xs: "square" };
      case "avatar":
        return { xs: "square" };
      default:
        return undefined;
    }
  }

  get computedIsAvatar() {
    return this.variant === "avatar";
  }

  get computedHasCaption() {
    return this.caption || this.sourceCaption;
  }

  get computedHasActions() {
    return (
      this.transcriptUrl ||
      this.allowFullscreen ||
      this.dContent ||
      this.downloadUrl
    );
  }

  get computedImageClassName() {
    if (!this.computedIsImage) {
      return null;
    }

    return computeClass({
      "rpl-media-embed__image": true,
      [`rpl-media-embed__image--${this.variant}`]: this.variant,
      [`rpl-media-embed__image--${this.size}`]: this.size
    });
  }

  get computedExandableAriaHidden() {
    return this.isDataContentOpen ? null : true;
  }

  get fullscreenContentLabel() {
    return this.fullscreenLabel || `View '${this.title}' fullscreen`;
  }

  get downloadContentLabel() {
    return this.downloadLabel || `Download '${this.title}'`;
  }

  /* event management */

  handleToggleFullscreen(event) {
    this.isFullscreenOpen = !this.isFullscreenOpen;

    this.dispatchEvent(
      new CustomEvent("viewfullscreen", {
        detail: {
          action: this.isFullscreenOpen ? "enter" : "exit",
          text: event?.label || this.fullscreenContentLabel,
          label: this.title,
          type: this.type
        },
        bubbles: true
      })
    );
  }

  handleToggleData() {
    this.isDataContentOpen = !this.isDataContentOpen;

    this.dispatchEvent(
      new CustomEvent("viewdata", {
        detail: {
          action: this.isDataContentOpen ? "open" : "close",
          text: this.dContentLabel,
          label: this.title,
          type: this.type
        },
        bubbles: true
      })
    );
  }

  handleTranscript() {
    this.dispatchEvent(
      new CustomEvent("viewtranscript", {
        detail: {
          action: "click",
          text: this.transcriptContentLabel,
          label: this.title,
          type: this.type
        },
        bubbles: true
      })
    );
  }

  handleDownload() {
    this.dispatchEvent(
      new CustomEvent("downloadImage", {
        detail: {
          action: "download",
          text: this.downloadContentLabel,
          label: this.title,
          value: this.downloadUrl,
          type: this.type
        },
        bubbles: true
      })
    );
  }
}
