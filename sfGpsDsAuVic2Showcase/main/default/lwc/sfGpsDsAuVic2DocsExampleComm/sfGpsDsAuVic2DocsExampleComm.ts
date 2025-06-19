import { api, track } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default 
class SfGpsDsAuVic2DocsExampleComm 
extends SfGpsDsLwc {
  /* Similar to the Rpl Docs version but only support same origin */

  // @ts-ignore
  @api 
  code: string;
  // @ts-ignore
  @api 
  hideNewTab: boolean;
  // @ts-ignore
  @api 
  hideCode: boolean;
  // @ts-ignore
  @api 
  withPadding = false;
  // @ts-ignore
  @api 
  storyPreviewUrl: string;
  // @ts-ignore
  @api 
  showCallout: true;
  // @ts-ignore
  @api 
  className: string;

  // @ts-ignore
  @track 
  isCodeOpen: boolean;

  /* computed */

  get computedClassName() {
    return {
      "docs-example": true,
      "with-padding": this.withPadding,
      [this.className]: this.className
    };
  }

  get computedShowNewTab(): boolean {
    return !this.hideNewTab;
  }

  get computedShowCode(): boolean {
    return !this.hideCode;
  }

  get computedCodeIcon(): string {
    return this.isCodeOpen ? "icon-chevron-up" : "icon-chevron-down";
  }

  /* event management */

  handleToggleCode(): void {
    this.isCodeOpen = !this.isCodeOpen;
  }

  handleFrameLoad(): void {
    /* This only works on same domain */
    // Assuming this is set on an iFrame

    const frame = this.refs.frame as HTMLIFrameElement;
    frame.height = `${frame?.contentWindow?.document.body.scrollHeight}`;
  }

  /* lifecycle */

  constructor() {
    super(true); // isLwrOnly
  }

  _messageListener: (event: MessageEvent) => void;

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("vic2-scope");

    this._messageListener = (event) => {
      if (event.data === "sfgpsds-auvic2-resize") {
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
