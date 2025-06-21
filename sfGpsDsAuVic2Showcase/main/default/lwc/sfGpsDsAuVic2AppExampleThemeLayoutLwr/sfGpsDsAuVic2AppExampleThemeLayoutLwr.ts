import { LightningElement, api } from "lwc";
import { debounce } from "c/sfGpsDsHelpers";

const ID_SKIP_LINKS = "sfgpsds-au-vic2-skip-links";
const ID_HEADER = "sfgpsds-au-vic2-header";
const ID_BELOW_HEADER = "sfgpsds-au-vic2-below-header";

/**
 * @slot VIC-AboveHeader
 * @slot VIC-Header
 * @slot VIC-BelowHeader
 * @slot VIC-Footer
 */
export default 
class SfGpsDsAuVic2AppExampleThemeLayourLwr 
extends LightningElement {
  // @ts-ignore
  @api 
  direction?: string;

  // @ts-ignore
  @api 
  background?: string;

  // @ts-ignore
  @api 
  showBackToTop?: string;

  // @ts-ignore
  @api 
  skipToContentLabel: string = "Skip to main content";

  // @ts-ignore
  @api 
  hasHeader?: boolean;

  // @ts-ignore
  @api 
  hasBelowHeader?: boolean;

  // @ts-ignore
  @api 
  themeClassName = "";

  // @ts-ignore
  @api 
  aboveHeaderClassName = "";
  // @ts-ignore
  @api 
  headerClassName = "rpl-layout__header";
  // @ts-ignore
  @api 
  belowHeaderClassName = "rpl-u-margin-t-1";

  // @ts-ignore
  @api 
  footerClassName = "";

  /* computed */

  get skipLinksId(): string {
    return ID_SKIP_LINKS;
  }

  get headerId(): string {
    return ID_HEADER;
  }

  get belowHeaderId(): string {
    return ID_BELOW_HEADER;
  }

  get computedLayoutClassName(): any {
    return {
      "rpl-layout": true,
      "rpl-layout--default": this.background === "default",
      "rpl-layout--alt": this.background === "alt"
    };
  }

  /* lifecycle */

  _observer?: ResizeObserver;

  connectedCallback() {
    // Post a message about document resizing, but up to 1x per 500ms

    this._observer = new ResizeObserver(
      debounce(() => {
        // eslint-disable-next-line no-restricted-globals
        parent.postMessage("sfgpsds-auvic2-resize");
      }, 500)
    );

    this._observer.observe(document.body);
  }

  disconnectedCallback() {
    this._observer?.disconnect();
  }
}
