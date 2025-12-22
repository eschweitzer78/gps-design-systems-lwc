import { 
  api 
} from "lwc";
import sfGpsDsTabSetLwr from "c/sfGpsDsTabSetLwr";
import type { 
  Vic2Tab, 
  Vic2TabHeader 
} from "c/sfGpsDsAuVic2TabBarLwr";

const MODE_HORIZONTAL = "horizontal"
const MODE_VERTICAL = "vertical";
const MODE_VALUES = [MODE_HORIZONTAL, MODE_VERTICAL];
const MODE_DEFAULT = MODE_HORIZONTAL;

const DEBUG = false;
const CLASS_NAME = "SfGpsDsAuVic2TabSetLwr";

export default 
class sfGpsDsAuVic2TabSetLwr
extends sfGpsDsTabSetLwr {
  static renderMode: "light" | "shadow" = "light";

  // @ts-ignore
  @api 
  mode?: string;
  _mode = this.defineEnumProperty("mode", {
    defaultValue: MODE_DEFAULT,
    validValues: MODE_VALUES
  });

  /* getters */

  get computedClassName(): any {
    return {
      "sfgpsdsauvic2-tabs-vertical": this.mode === MODE_VERTICAL,
      [this.className || ""]: !!this.className
    };
  }

  /* methods */

  _updateTabHeader(matchingTabHeader: Vic2TabHeader, changedTab: Vic2Tab): void {
    if (DEBUG) console.debug(CLASS_NAME, "> _updateTabHeader", matchingTabHeader, changedTab);

    super._updateTabHeader(matchingTabHeader, changedTab);
    matchingTabHeader.iconName = changedTab.iconName;

    if (DEBUG) console.debug(CLASS_NAME, "< _updateTabHeader", matchingTabHeader);
  }
}
