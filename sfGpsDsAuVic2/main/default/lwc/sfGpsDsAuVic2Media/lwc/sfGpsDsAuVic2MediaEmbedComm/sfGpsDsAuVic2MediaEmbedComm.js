import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

/**
 * @slot Data
 */
export default class SfGpsDsAuVic2MediaEmbedComm extends SfGpsDsLwc {
  @api type;
  @api variant;
  @api size;
  @api title;
  @api showTitle;
  @api src;
  @api caption;
  @api sourceCaption;
  @api transcriptUrl;
  @api allowFullscreen;
  @api fullscreenLabel;
  @api dSlot;
  @api dContent;
  @api dLabel;
  @api downloadUrl;
  @api downloadLabel;
  @api className;

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("vic2-scope");
  }
}
