import { LightningElement, api } from "lwc";
import { computeClass, normaliseString } from "c/sfGpsDsHelpers";

const RplImageAspectOptions = [
  "square",
  "full",
  "wide",
  "ultrawide",
  "panorama"
];
const RplImagePriorityOptions = ["auto", "low", "high"];
const RplImageFitOptions = ["none", "contain", "cover"];

export default class SfGpsDsAuVic2Image extends LightningElement {
  @api src;
  @api alt;
  @api width;
  @api height;
  @api sizes;
  @api circle;
  @api focalPoint;
  @api addClassName;

  /* api: aspect */

  _aspectOriginal;
  _aspect;

  @api get aspect() {
    return this._aspectOriginal;
  }

  set aspect(value) {
    this._fitOriginal = value;
    this._fit = normaliseString(value, {
      validValue: RplImageAspectOptions
    });
  }

  /* api: fit */

  _fitOriginal;
  _fit;

  @api get fit() {
    return this._fitOriginal;
  }

  set fit(value) {
    this._fitOriginal = value;
    this._fit = normaliseString(value, {
      validValue: RplImageFitOptions
    });
  }

  /* api: priority */

  _priorityOriginal;
  _priority;

  @api get priority() {
    return this._priorityOriginal;
  }

  set priority(value) {
    this._priorityOriginal = value;
    this._priority = normaliseString(value, {
      validValue: RplImagePriorityOptions
    });
  }

  get aspectClasses() {
    const base = "rpl-u-aspect";

    if (this.circle) {
      return { [`${base}-square`]: true };
    }

    if (typeof this.aspect === "string") {
      return { [`${base}-${this.aspect}`]: true };
    }

    if (typeof this.aspect === "object") {
      const o = {};
      for (const bp in this.aspect) {
        if (this.aspect.getOwnPropertyNames(bp)) {
          const breakpoint = bp !== "xs" ? `-${bp}` : "";
          o[`${base}-${this.aspect[bp]}${breakpoint}`] = true;
        }
      }
      return o;
    }

    return false;
  }

  get computedClassName() {
    return computeClass({
      "rpl-image": true,
      "rpl-image--fill": this.aspect,
      "rpl-image--circle": this.circle,
      [`rpl-image--${this.fit}`]: this.fit,
      ...this.aspectClasses,
      [this.addClassName]: this.addClassName
    });
  }

  get objectPosition() {
    if (
      !this.height ||
      !this.width ||
      !this.focalPoint?.x ||
      !this.focalPoint?.y
    ) {
      return null;
    }

    const xPercent = 0; //distanceAsPercentage(this.focalPoint.x, this.width)
    const yPercent = 0; //distanceAsPercentage(this.focalPoint.y, this.height)

    return { "object-position": `${xPercent}% ${yPercent}%` };
  }

  get loading() {
    return this.priority === "high" ? "eager" : "lazy";
  }
}
