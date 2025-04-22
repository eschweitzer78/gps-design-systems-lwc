import { LightningElement, api } from "lwc";
import { normaliseString, isObject, isString } from "c/sfGpsDsHelpers";
import {
  RplImageAspectOptions,
  RplImagePriorityOptions,
  RplImageFitOptions,
  IMAGE_DEFAULT
} from "c/sfGpsDsAuVic2ImageConstants";

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuVic2Image";

const distanceAsPercentage = (point, total) => {
  const nP = Number(point);
  const nT = Number(total);

  if (nP < 0) {
    return 0;
  }

  if (nP > nT) {
    return 100;
  }

  const rv = Number(((nP / nT) * 100).toFixed(2));

  return rv;
};

/* eslint-disable @lwc/lwc/no-api-reassignments */

export default class extends LightningElement {
  @api src;
  @api alt;
  @api width;
  @api height;
  @api srcSet;
  @api sizes;
  @api circle;
  @api focalPoint;
  @api className;

  /* api: image */

  _imageOriginal = IMAGE_DEFAULT;
  _error;

  @api
  get image() {
    return this._imageOriginal;
  }

  set image(value) {
    this._imageOriginal = value;

    if (isString(value)) {
      try {
        value = JSON.parse(value);
        this._error = null;
      } catch (e) {
        value = IMAGE_DEFAULT;
        this._error = e;
      }
    }

    if (isObject(value)) {
      this.src = value.src;
      this.alt = value.alt;
      this.width = value.width;
      this.height = value.height;
      this.srcSet = value.srcSet;
      this.sizes = value.sizes;
      this.circle = value.circle;
      this.focalPoint = value.focalPoint;
      this.aspect = value.aspect;
      this.fit = value.fit;
      this.priority = value.priority;
      this.className = value.className;
    } else {
      this.src = null;
      this.alt = null;
      this.width = null;
      this.height = null;
      this.srcSet = null;
      this.sizes = null;
      this.circle = null;
      this.focalPoint = null;
      this.aspect = null;
      this.fit = null;
      this.priority = null;
      this.className = null;
    }
  }

  /* api: aspect */

  _aspect = IMAGE_DEFAULT.aspect;

  @api
  get aspect() {
    return this._aspect;
  }

  set aspect(value) {
    if (isString(value)) {
      this._aspect = normaliseString(value, {
        validValues: RplImageAspectOptions,
        fallbackValue: IMAGE_DEFAULT.aspect
      });
    } else if (isObject(value)) {
      this._aspect = value;
    } else {
      this._aspect = IMAGE_DEFAULT.aspect;
    }
  }

  /* api: fit */

  _fit = IMAGE_DEFAULT.fit;

  @api
  get fit() {
    return this._fit;
  }

  set fit(value) {
    this._fit = normaliseString(value, {
      validValues: RplImageFitOptions,
      fallbackValue: IMAGE_DEFAULT.fit
    });
  }

  /* api: priority */

  _priority = IMAGE_DEFAULT.priority;

  @api
  get priority() {
    return this._priority;
  }

  set priority(value) {
    this._priority = normaliseString(value, {
      validValues: RplImagePriorityOptions,
      fallbackValue: IMAGE_DEFAULT.priority
    });
  }

  /* computed */

  get computedAspectClassName() {
    if (DEBUG) {
      console.debug(
        CLASS_NAME,
        "> computedAspectClassName",
        "circle=",
        this.circle,
        "_aspect=",
        JSON.stringify(this._aspect)
      );
    }

    const base = "rpl-u-aspect";
    let rv = {};

    if (this.circle) {
      rv = { [`${base}-square`]: true };
    } else if (typeof this._aspect === "string") {
      rv = { [`${base}-${this._aspect}`]: true };
    } else if (typeof this._aspect === "object") {
      const o = {};

      for (const bp in this._aspect) {
        if (Object.getOwnPropertyNames(bp)) {
          if (this._aspect[bp]) {
            // only if there's an actual value set
            const breakpoint = bp !== "xs" ? `-${bp}` : "";
            o[`${base}-${this._aspect[bp]}${breakpoint}`] = true;
          }
        }
      }

      rv = o;
    }

    if (DEBUG) console.debug(CLASS_NAME, "< computedAspectClassName", rv);
    return rv;
  }

  get computedClassName() {
    if (DEBUG) {
      console.debug(
        CLASS_NAME,
        "> computedClassName",
        "circle=",
        this.circle,
        "_aspect=",
        JSON.stringify(this._aspect),
        "_fit=",
        this._fit,
        "className=",
        this.className
      );
    }

    const rv = {
      "rpl-image": true,
      "rpl-image--fill": !!this._aspect,
      "rpl-image--circle": !!this.circle,
      [`rpl-image--${this._fit}`]: this._fit,
      ...this.computedAspectClassName,
      [this.className]: this.className
    };

    if (DEBUG)
      console.debug(CLASS_NAME, "< computedClassName", JSON.stringify(rv));
    return rv;
  }

  get computedObjectPosition() {
    if (!this.width || !this.height || !this.focalPoint) {
      return null;
    }

    const xPercent = distanceAsPercentage(this.focalPoint.x, this.width);
    const yPercent = distanceAsPercentage(this.focalPoint.y, this.height);
    return `object-position: ${xPercent}% ${yPercent}%`;
  }

  get computedLoading() {
    return this.priority === "high" ? "eager" : "lazy";
  }

  get computedIsError() {
    return this._error;
  }

  get computedIsNotEmpty() {
    return this.src || this.srcSet;
  }
}
