import { api, track } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default class extends SfGpsDsLwc {
  /* Similar to the Rpl Docs version but only support same origin */

  @api code;
  @api hideNewTab;
  @api hideCode;
  @api withPadding = false;
  @api storyPreviewUrl;
  @api className;
  @api showCallout;

  @track isCodeOpen;

  /* computed */

  get computedClassName() {
    return {
      "docs-example": true,
      "with-padding": this.withPadding,
      [this.className]: this.className
    };
  }

  get computedShowNewTab() {
    return !this.hideNewTab;
  }

  get computedShowCode() {
    return !this.hideCode;
  }

  get computedCodeIcon() {
    return this.isCodeOpen ? " fas chevron-up" : " faschevron-down";
  }

  /* event management */

  handleToggleCode() {
    this.isCodeOpen = !this.isCodeOpen;
  }

  handleFrameLoad() {
    /* This only works on same domain */

    const frame = this.refs.frame;
    frame.height = frame?.contentWindow.document.body.scrollHeight;
  }

  /* lifecycle */

  _messageListener;

  connectedCallback() {
    super._isLwrOnly = true;
    super.connectedCallback();
    this.classList.add("qld-scope");

    this._messageListener = (event) => {
      if (event.data === "sfgpsds-auqld-resize") {
        this.handleFrameLoad();
      }
    };

    window.addEventListener("message", this._messageListener);
  }

  disconnectedCallback() {
    if (this._messageListener) {
      window.removeEventListener("message", this._messageListener);
    }
  }
}
