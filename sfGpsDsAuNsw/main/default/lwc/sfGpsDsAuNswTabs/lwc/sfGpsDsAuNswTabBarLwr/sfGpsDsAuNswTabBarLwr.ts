import SfGpsDsTabBarLwr from "c/sfGpsDsTabBarLwr";

export default 
class SfGpsDsAuNswTabBarLwr 
extends SfGpsDsTabBarLwr {
  static renderMode: "light" | "shadow" = "light";

  get _isLightDOM() {
    return true;
  }

  get computedClassName() {
    return {
      ...super.computedClassName,
      "nsw-tabs__list-wrapper": true
    }
  }

  // eslint-disable-next-line no-unused-vars
  _tabLinkClassName(options?: { selected?: boolean }): string | undefined {
    return (options || {}).selected ? "active" : "";
  }
}
