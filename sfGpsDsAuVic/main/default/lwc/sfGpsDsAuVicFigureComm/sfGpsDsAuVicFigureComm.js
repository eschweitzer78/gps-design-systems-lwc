import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default class SfGpsDsAuVicFigureComm extends SfGpsDsLwc {
  @api imageSrc;
  @api imageAlt;
  @api caption;
  @api source;
  @api className;

  /* computed: _image */

  get _image() {
    return this.imageSrc ? { src: this.imageSrc, alt: this.imageAlt } : null;
  }
}
