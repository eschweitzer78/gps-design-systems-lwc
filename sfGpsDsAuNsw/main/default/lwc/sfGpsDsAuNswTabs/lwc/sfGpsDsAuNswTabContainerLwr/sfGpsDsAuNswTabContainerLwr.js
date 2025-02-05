import { api } from "lwc";
import { normaliseString } from "c/sfGpsDsHelpers";
import SfGpsDsLwc from "c/sfGpsDsLwc";

const TABPADDINGSTYLE_DEFAULT = "full";
const TABPADDINGSTYLE_VALUES = {
  full: "",
  flush: "nsw-tabs__content--flush",
  "side-flush": "nsw-tabs__content--side-flush"
};

const TABBORDERSTYLE_DEFAULT = "border";
const TABBORDERSTYLE_VALUES = {
  border: "",
  "no-border": "nsw-tabs__content--no-border"
};

/**
 * @slot Tab1
 * @slot Tab2
 * @slot Tab3
 * @slot Tab4
 * @slot Tab5
 * @slot Tab6
 * @slot Tab7
 * @slot Tab8
 * @slot Tab9
 * @slot Tab10
 */
export default class extends SfGpsDsLwc {
  @api title;
  @api tab1Label;
  @api tab2Label;
  @api tab3Label;
  @api tab4Label;
  @api tab5Label;
  @api tab6Label;
  @api tab7Label;
  @api tab8Label;
  @api tab9Label;
  @api tab10Label;
  @api firstChild;

  /* api: tabPaddingStyle, Picklist */

  _tabPaddingStyle = TABPADDINGSTYLE_DEFAULT;
  _tabPaddingStyleOriginal = TABPADDINGSTYLE_DEFAULT;

  @api
  get tabPaddingStyle() {
    return this._tabPaddingStyleOriginal;
  }

  set tabPaddingStyle(value) {
    this._tabPaddingStyleOriginal = value;
    this._tabPaddingStyle = normaliseString(value, {
      validValues: TABPADDINGSTYLE_VALUES,
      fallbackValue: TABPADDINGSTYLE_DEFAULT,
      returnObjectValue: true
    });
  }

  /* api: tabBorderStyle, Picklist */

  _tabBorderStyle = TABBORDERSTYLE_DEFAULT;
  _tabBorderStyleOriginal = TABBORDERSTYLE_DEFAULT;

  @api
  get tabBorderStyle() {
    return this._tabBorderStyleOriginal;
  }

  set tabBorderStyle(value) {
    this._tabBorderStyleOriginal = value;
    this._tabBorderStyle = normaliseString(value, {
      validValues: TABBORDERSTYLE_VALUES,
      fallbackValue: TABBORDERSTYLE_DEFAULT,
      returnObjectValue: true
    });
  }

  /* computed */

  get computedTabClassName() {
    return {
      "nsw-tabs__content": true,
      [this._tabPaddingStyle]: this._tabPaddingStyle,
      [this._tabBorderStyle]: this._tabBorderStyle
    };
  }

  /* lifecycle */

  connectedCallback() {
    this._isLwrOnly = true;
    super.connectedCallback();
    this.classList.add("nsw-scope");
  }
}
