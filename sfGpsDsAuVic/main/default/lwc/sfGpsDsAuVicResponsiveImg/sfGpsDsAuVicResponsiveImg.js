import { LightningElement, api } from "lwc";
import SfGpsDsAuVicBreakpointMixin from "c/sfGpsDsAuVicBreakpointMixin";
import { computeClass } from "c/sfGpsDsHelpers";
import objectFitImages from "./object-fit-images";

const getPercentage = (pos, dimension) => {
  if (pos > dimension) {
    return 100;
  } else if (pos < 1) {
    return 0;
  }

  return ((pos / dimension) * 100).toFixed(2);
};

export default class SfGpsDsAuVicResponsiveImg extends SfGpsDsAuVicBreakpointMixin(
  LightningElement
) {
  static renderMode = "light";

  @api src; // string
  @api alt; // string

  /*
   * api: srcSet
   * object array [{size width src* other_param_for_qs* }]
   * size must align with Ripple breakpoints xs 0, s 576, m 768, l 992, xl 1200, xxl 1600, xxxl 2560
   */

  _originalSrcSet;
  _srcSet;

  @api get srcSet() {
    return this._originalSrcSet;
  }

  set srcSet(value) {
    // string or array
    this._originalSrcSet = value;
    this.updateSrcSetProps();
  }

  /* api: srcSetQs */

  _originalSrcSetQs;

  @api get srcSetQs() {
    return this._originalSrcSetQs;
  }

  set srcSetQs(value) {
    this._originalSrcSetQs = value;
    this.updateSrcSetProps();
  }

  @api focalPoint = { x: 0, y: 0 }; // { Number: x, Number y }
  @api sizes; // String
  @api height; // Number
  @api width; // Number
  @api fit = "cover"; // String: cover, contain
  @api className;

  /* methods */

  updateSrcSetProps() {
    try {
      this._srcSet = JSON.parse(this._originalSrcSet);
    } catch (error) {
      this._srcSet =
        typeof this._originalSrcSet === "string" ? this._originalSrcSet : "";
    }
  }

  queryString(bp) {
    let placeholders = this.srcSetQs.match(/\{.*?\}/g);
    let rv = this.srcSetQs;

    placeholders.forEach((placeholder) => {
      let key = placeholder.substring(1, placeholder.length - 1);

      if (bp[key]) {
        rv = rv.replace(placeholder, bp[key]);
      }
    });

    return rv;
  }

  /* computed: isResponsive */

  get isResponsive() {
    // eslint-disable-next-line no-prototype-builtins
    return this.srcSetQs ? true : false;
  }

  /* computed: calcSizes */

  get calcSizes() {
    if (this.sizes) {
      return this.sizes;
    }

    if (Array.isArray(this._srcSet) && this.isResponsive) {
      return (
        this._srcSet
          .map((bp) => {
            if (bp.width && bp.size && this.bps[bp.size]) {
              return `(max-width: ${this.bps[bp.size]}px) ${bp.width}px`;
            }
            return null;
          })
          .filter((bp) => bp)
          .join(", ") + ", 100vw"
      );
    }

    return null;
  }

  /* computed: calcFocalPoint */

  get calcFocalPoint() {
    if (this.focalPoint && this.height && this.width) {
      // default value is 0 0, we set this to the middle instead
      const focalPoint =
        this.focalPoint.x === 0 && this.focalPoint.y === 0
          ? "50% 50%"
          : `${getPercentage(this.focalPoint.x, this.width)}% ${getPercentage(
              this.focalPoint.y,
              this.height
            )}%`;
      return `object-position: ${focalPoint};font-family:'object-fit: cover; object-position: ${focalPoint};'`;
    }

    return null;
  }

  /* computed: calcSrcSet */

  get calcSrcSet() {
    if (typeof this._srcSet === "string") {
      return this._srcSet;
    }

    if (Array.isArray(this._srcSet) && this.isResponsive) {
      return this._srcSet
        .map(
          (bp) =>
            `${bp.src || this.src}${this.queryString(bp)} ${
              bp.width || this.bps[bp.size]
            }w`
        )
        .join(", ");
    }

    return null;
  }

  /* computed: bps */

  get bps() {
    if (this.breakpointsSmallToLarge) {
      return this.breakpointsSmallToLarge.reduce((obj, bp) => {
        obj[bp.label] = bp.value;
        return obj;
      }, {});
    }

    return null;
  }

  /* computed: computedClassName */

  get computedClassName() {
    return computeClass({
      "rpl-responsive-image": true,
      "rpl-responsive-image--fit-cover": this.fit === "cover",
      "rpl-responsive-image--fit-contain": this.fit === "contain",
      [this.className]: this.className
    });
  }

  /* lifecycle */

  disconnectedCallback() {
    this.breakpointDisconnectedCallback();
  }

  _rendered = false;

  renderedCallback() {
    if (!this._rendered) {
      this.breakpointConnectedCallback();
      this._rendered = true;
    }

    if (this.src) {
      let elt = this.querySelector("img");
      objectFitImages(elt);
    }
  }
}
