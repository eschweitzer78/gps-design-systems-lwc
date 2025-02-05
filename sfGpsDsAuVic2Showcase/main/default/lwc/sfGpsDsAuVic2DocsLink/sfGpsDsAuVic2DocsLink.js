import { LightningElement, api } from "lwc";
import { normaliseBoolean, computeClass } from "c/sfGpsDsHelpers";

const ISEXTERNAL_DEFAULT = false;
const ISSMALL_DEFAULT = false;

const ICONPOSITION_START = "start";
const ICONPOSITION_END = "end";
const ICONPOSITION_VALUES = [ICONPOSITION_END, ICONPOSITION_START];
const ICONPOSITION_DEFAULT = ICONPOSITION_START;

export default class extends LightningElement {
  static renderMode = "light";

  @api url;

  /* api: iconPosition */

  _iconPosition = ICONPOSITION_DEFAULT;
  _iconPositionOriginal = ICONPOSITION_DEFAULT;

  @api
  get iconPosition() {
    return this._iconPositionOriginal;
  }

  set iconPosition(value) {
    this._iconPositionOriginal = value;
    this._iconPosition = normaliseBoolean(value, {
      validValues: ICONPOSITION_VALUES,
      fallbackValue: ICONPOSITION_DEFAULT
    });
  }

  /* api: isExternal */

  _isExternalOriginal = ISEXTERNAL_DEFAULT;
  _isExternal = ISEXTERNAL_DEFAULT;

  @api
  get isExternal() {
    return this._isExternalOriginal;
  }

  set isExternal(value) {
    this._isExternalOriginal = value;
    this._isExternal = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: ISEXTERNAL_DEFAULT
    });
  }

  /* api: isSmall */

  _isSmallOriginal = ISSMALL_DEFAULT;
  _isSmall = ISSMALL_DEFAULT;

  @api
  get isSmall() {
    return this._isSmallOriginal;
  }

  set isSmall(value) {
    this._isSmallOriginal = value;
    this._isSmall = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: ISSMALL_DEFAULT
    });
  }

  /* computed */

  get computedClassName() {
    return computeClass({
      "docs-link": true,
      "rpl-type-p": !this._isSmall,
      "rpl-type-p-small": this._isSmall
    });
  }

  get computedShowIconStart() {
    return this._isExternal && this._iconPosition === ICONPOSITION_START;
  }

  get computedShowIconEnd() {
    return this._isExternal && this._iconPosition === ICONPOSITION_END;
  }
}
