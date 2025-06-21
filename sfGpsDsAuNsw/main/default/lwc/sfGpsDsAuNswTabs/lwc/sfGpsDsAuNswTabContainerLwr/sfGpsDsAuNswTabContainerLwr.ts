import { 
  api 
} from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

import type { 
  TabPaddingStyle,
  TabBorderStyle
} from "c/sfGpsDsAuNswTabContainerLwr";

type TabPaddingStyleValues = Record<TabPaddingStyle, string>;

const TABPADDINGSTYLE_DEFAULT: TabPaddingStyle = "full";
const TABPADDINGSTYLE_VALUES: TabPaddingStyleValues = {
  full: "",
  flush: "nsw-tabs__content--flush",
  "side-flush": "nsw-tabs__content--side-flush"
};

type TabBorderStyleValues  = Record<TabBorderStyle, string>;

const TABBORDERSTYLE_DEFAULT: TabBorderStyle = "border";
const TABBORDERSTYLE_VALUES: TabBorderStyleValues = {
  border: "",
  "no-border": "nsw-tabs__content--no-border"
};

const FIRSTCHILD_DEFAULT = false;

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
export default 
class SfGpsDsAuNswTabContainerLwr
extends SfGpsDsLwc {
  // @ts-ignore
  @api 
  title = "";

  // @ts-ignore
  @api
  tab1Label?: string;

  // @ts-ignore
  @api
  tab2Label?: string;

  // @ts-ignore
  @api
  tab3Label?: string;

  // @ts-ignore
  @api
  tab4Label?: string;

  // @ts-ignore
  @api
  tab5Label?: string;

  // @ts-ignore
  @api
  tab6Label?: string;

  // @ts-ignore
  @api
  tab7Label?: string;

  // @ts-ignore
  @api
  tab8Label?: string;

  // @ts-ignore
  @api 
  tab9Label?: string;

  // @ts-ignore
  @api
  tab10Label?: string;

  // @ts-ignore
  @api 
  // @ts-ignore
  firstChild = FIRSTCHILD_DEFAULT;

  // @ts-ignore
  @api
  tabPaddingStyle?: TabPaddingStyle;
  _tabPaddingStyle = this.defineEnumObjectProperty<string>("tabPaddingStyle", {
    validValues: TABPADDINGSTYLE_VALUES,
    defaultValue: TABPADDINGSTYLE_DEFAULT
  });

  // @ts-ignore
  @api
  tabBorderStyle?: TabPaddingStyle;
  _tabBorderStyle = this.defineEnumObjectProperty<string>("tabBorderStyle", {
    validValues: TABBORDERSTYLE_VALUES,
    defaultValue: TABBORDERSTYLE_DEFAULT
  });

  /* computed */

  get computedTabClassName(): any {
    return {
      "nsw-tabs__content": true,
      [this._tabPaddingStyle.value]: !!this._tabPaddingStyle.value,
      [this._tabBorderStyle.value]: !!this._tabBorderStyle.value
    };
  }

  /* lifecycle */

  constructor() {
    super(true);
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("nsw-scope");
  }
}
