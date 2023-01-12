import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default class SfGpsDsAuVicResponsiveImgComm extends SfGpsDsLwc {
  @api src; // string
  @api alt; // string
  @api focalPointX = 0; // number
  @api focalPointY = 0; // int
  @api srcSet; // string
  @api srcSetQs; // string e.g. https://a.b.com/blah?w={w}
  @api sizes; // string
  @api height; // number
  @api width; // number
  @api fit = "cover"; // string: cover, contain
  @api className;

  get _focalPoint() {
    return this.focalPointX && this.focalPointY
      ? { x: this.focalPointX, y: this.focalPointY }
      : null;
  }
}
