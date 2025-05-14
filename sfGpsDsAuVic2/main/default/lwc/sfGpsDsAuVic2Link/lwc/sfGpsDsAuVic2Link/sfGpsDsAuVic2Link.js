// Based on v2.6.2

import { LightningElement, api } from "lwc";
import { normaliseBoolean } from "c/sfGpsDsHelpers";

const PREVENTDEFAULT_DEFAULT = false;

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuVic2Link";

export default class sfGpsDsAuVic2Link extends LightningElement {
  static renderMode = "light";

  @api url;

  // These four are added to the original spec

  @api target;
  @api index;
  @api tabIndex;
  @api className;

  /* api: preventDefault */

  _preventDefaultOriginal = PREVENTDEFAULT_DEFAULT;
  _preventDefault = PREVENTDEFAULT_DEFAULT;

  @api
  get preventDefault() {
    return this._preventDefaultOriginal;
  }

  set preventDefault(value) {
    this._preventDefaultOriginal = value;
    this._preventDefault = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: PREVENTDEFAULT_DEFAULT
    });
  }

  @api focus() {
    this.refs.a.focus();
  }

  handleClick(event) {
    if (DEBUG)
      console.debug(
        CLASS_NAME,
        "handleClick",
        event.target,
        this._preventDefault
      );

    if (this._preventDefault) {
      /* if preventDefault is set, we block the default url navigation and 
        but the click will carry on propagating to the parent */

      event.preventDefault();
    }
  }
}
