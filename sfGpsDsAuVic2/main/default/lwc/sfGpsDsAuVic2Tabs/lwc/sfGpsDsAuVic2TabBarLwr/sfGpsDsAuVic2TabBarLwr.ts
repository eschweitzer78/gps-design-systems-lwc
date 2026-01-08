import { api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";
import SfGpsDsTabBarLwr from "c/sfGpsDsTabBarLwr";
import { DATA_TAB_VALUE_ATTR } from "c/sfGpsDsTabBarLwr";
import type { Vic2TabHeader, Vic2Tab } from "c/sfGpsDsAuVic2TabBarLwr";

const MODE_HORIZONTAL = "horizontal"
const MODE_VERTICAL = "vertical";
const MODE_VALUES = [MODE_HORIZONTAL, MODE_VERTICAL];
const MODE_DEFAULT = MODE_HORIZONTAL;

const DEBUG = false;
const CLASS_NAME = "SfGpsDsAuVic2TabBarLwr";

export default 
class SfGpsDsAuVic2TabBarLwr 
extends SfGpsDsTabBarLwr {
  static renderMode: "light" | "shadow" = "light";

  // @ts-ignore
  @api 
  mode?: string;
  _mode = this.defineEnumProperty("mode", {
    defaultValue: MODE_DEFAULT,
    validValues: MODE_VALUES
  });

  get _isLightDOM() {
    return true;
  }

  // eslint-disable-next-line no-unused-vars
  _tabClassName(options?: { selected?: boolean, hasFocus?: boolean }): string | undefined {
    const superTCN = super._tabClassName(options);

    return computeClass({
      [superTCN || ""]: !!superTCN,
      "rpl-tab": true,
      "rpl-tab--active": !!(options || {}).selected,
      "rpl-type-p": true,
      "rpl-u-focusable-block": true
    });
  }

  _findTemplateTabByValue(tabValue: string): HTMLElement | undefined {
    if (DEBUG) console.debug(CLASS_NAME, "> _findTemplateTabByValue", tabValue);

    const target = this._isLightDOM ? this : this.template;
    const rv = target.querySelector(`button[${DATA_TAB_VALUE_ATTR}="${tabValue}"]`) as HTMLElement;

    if (DEBUG) console.debug(CLASS_NAME, "< _findTemplateTabByValue", rv);
    return rv;

  }

  tabHeaderToTab(tab: Vic2TabHeader): Vic2Tab {
    if (DEBUG) console.debug(CLASS_NAME, "> tabHeaderToTab", tab);

    const rv = {
      ...super.tabHeaderToTab(tab),
      iconName: tab.iconName,
    }

    if (DEBUG) console.debug(CLASS_NAME, "< tabHeaderToTab", rv);
    return rv;
  }

  get computedClassName(): any {
    return {
      "rpl-tabs": true,
      "rpl-tabs--vertical": this._mode.value === MODE_VERTICAL,
      ...super.computedClassName
    };
  }
}
