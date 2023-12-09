import { api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";
import SfGpsDsLwc from "c/sfGpsDsLwc";

/**
 * @slot Section
 */
export default class SfGpsDsAuNswSectionLwr extends SfGpsDsLwc {
  static renderMode = "light";

  @api paddingStyle;
  @api colorStyle;
  @api withContainer;
  @api withBox;
  @api withInvert;
  @api imageSrc;
  @api containerClassName;
  @api className;

  get computedStyle() {
    return this.imageSrc ? `background-image: url(${this.imageSrc})` : null;
  }

  get computedClassName() {
    return computeClass({
      "nsw-section": true,

      "nsw-section--half-padding": this.paddingStyle === "half",
      "nsw-section--no-padding": this.paddingStyle === "none",

      "nsw-section--brand-dark": this.colorStyle === "brand-dark",
      "nsw-section--brand-light": this.colorStyle === "brand-light",
      "nsw-section--brand-supplementary":
        this.colorStyle === "brand-supplementary",
      "nsw-section--black": this.colorStyle === "black",
      "nsw-section--white": this.colorStyle === "white",
      "nsw-section--off-white": this.colorStyle === "off-white",
      "nsw-section--grey-01": this.colorStyle === "grey-01",
      "nsw-section--grey-02": this.colorStyle === "grey-02",
      "nsw-section--grey-03": this.colorStyle === "grey-03",
      "nsw-section--grey-04": this.colorStyle === "grey-04",

      "nsw-section--box": this.withBox,
      "nsw-section--invert": this.withInvert,
      "nsw-section--image": this.imageSrc,

      [this.className]: this.className
    });
  }

  get computedContainerClassName() {
    return computeClass({
      "nsw-container": this.withContainer,
      [this.containerClassName]: this.containerClassName
    });
  }

  /* lifecycle */

  connectedCallback() {
    this._isLwrOnly = true;
    super.connectedCallback();

    this.classList.add("nsw-scope");
  }
}
