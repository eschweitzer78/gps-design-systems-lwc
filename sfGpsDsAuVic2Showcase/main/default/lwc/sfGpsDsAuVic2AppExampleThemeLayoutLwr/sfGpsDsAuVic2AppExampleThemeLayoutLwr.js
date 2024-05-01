import { LightningElement, api } from "lwc";
import { computeClass, debounce } from "c/sfGpsDsHelpers";

const ID_SKIP_LINKS = "sfgpsds-au-vic2-skip-links";
const ID_HEADER = "sfgpsds-au-vic2-header";
const ID_BELOW_HEADER = "sfgpsds-au-vic2-below-header";

/**
 * @slot aboveHeader
 * @slot header
 * @slot belowHeader
 * @slot footer
 */
export default class extends LightningElement {
  @api direction;
  @api background;
  @api showBackToTop;
  @api skipToContentLabel = "Skip to main content";

  @api hasHeader;
  @api hasBelowHeader;

  @api themeClassName = "";

  @api aboveHeaderClassName = "";
  @api headerClassName = "rpl-layout__header";
  @api belowHeaderClassName = "rpl-u-margin-t-1";
  @api footerClassName = "";

  get skipLinksId() {
    return ID_SKIP_LINKS;
  }

  get headerId() {
    return ID_HEADER;
  }

  get belowHeaderId() {
    return ID_BELOW_HEADER;
  }

  get computedLayoutClassName() {
    return computeClass({
      "rpl-layout": true,
      "rpl-layout--default": this.background === "default",
      "rpl-layout--alt": this.background === "alt"
    });
  }

  /* lifecycle */

  _observer;

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
