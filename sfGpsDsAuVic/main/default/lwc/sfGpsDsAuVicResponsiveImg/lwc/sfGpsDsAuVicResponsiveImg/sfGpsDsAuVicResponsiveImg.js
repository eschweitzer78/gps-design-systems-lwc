import { LightningElement, api } from "lwc";
import SfGpsDsAuVicBreakpointMixin from "c/sfGpsDsAuVicBreakpointMixin";
import { isArray, normaliseString } from "c/sfGpsDsHelpers";
import objectFitImages from "./object-fit-images";

const FIT_DEFAULT = "cover";
const FIT_VALUES = {
  cover: "rpl-responsive-image--fit-cover",
  contain: "rpl-responsive-image--fit-contain"
};

const getPercentage = (pos, dimension) => {
  if (pos > dimension) {
    return 100;
  } else if (pos < 1) {
    return 0;
  }

  return ((pos / dimension) * 100).toFixed(2);
};

export default class extends SfGpsDsAuVicBreakpointMixin(LightningElement) {
  static renderMode = "light";

  @api src; // string
  @api alt; // string
  @api focalPoint = { x: 0, y: 0 }; // { Number: x, Number y }
  @api sizes; // String
  @api height; // Number
  @api width; // Number
  @api className;

  /*
   * api: srcSet
   * object array [{size width src* other_param_for_qs* }]
   * size must align with Ripple breakpoints xs 0, s 576, m 768, l 992, xl 1200, xxl 1600, xxxl 2560
   */

  _srcSet;
  _srcSetOriginal;

  @api
  get srcSet() {
    return this._srcSetOriginal;
  }

  set srcSet(value) {
    // string or array
    this._srcSetOriginal = value;
    this.updateSrcSetProps();
  }

  /* api: srcSetQs */

  _srcSetQsOriginal;

  @api
  get srcSetQs() {
    return this._srcSetQsOriginal;
  }

  set srcSetQs(value) {
    this._srcSetQsOriginal = value;
    this.updateSrcSetProps();
  }

  /* api: fit */

  _fit = FIT_VALUES[FIT_DEFAULT];
  _fitOriginal = FIT_DEFAULT;

  @api
  get fit() {
    return this._fitOriginal;
  }

  set fit(value) {
    this._fitOriginal = value;
    this._fit = normaliseString(value, {
      validValues: FIT_VALUES,
      fallbackValue: FIT_DEFAULT,
      returnObjectValue: true
    });
  }

  /* computed */

  get computedIsResponsive() {
    // eslint-disable-next-line no-prototype-builtins
    return this.srcSetQs ? true : false;
  }

  get computedSizes() {
    if (this.sizes) {
      return this.sizes;
    }

    if (isArray(this._srcSet) && this.computedIsResponsive) {
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

  get computedFocalPoint() {
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

  get computedSrcSet() {
    if (typeof this._srcSet === "string") {
      return this._srcSet;
    }

    if (isArray(this._srcSet) && this.computedIsResponsive) {
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

  get bps() {
    if (this.breakpointsSmallToLarge) {
      return this.breakpointsSmallToLarge.reduce((obj, bp) => {
        obj[bp.label] = bp.value;
        return obj;
      }, {});
    }

    return null;
  }

  get computedClassName() {
    return {
      "rpl-responsive-image": true,
      [this._fit]: this._fit,
      [this.className]: this.className
    };
  }

  /* methods */

  updateSrcSetProps() {
    try {
      this._srcSet = JSON.parse(this._srcSetOriginal);
    } catch (error) {
      this._srcSet =
        typeof this._srcSetOriginal === "string" ? this._srcSetOriginal : "";
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
