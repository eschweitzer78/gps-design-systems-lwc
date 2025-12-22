import SfGpsDsTabLwr from "c/sfGpsDsTabLwr";

export default 
class SfGpsDsAuNswTabLwr
extends SfGpsDsTabLwr {
  static renderMode: "light" | "shadow" = "light";

  /* computed */

  get computedClassName(): any {
    return {
      ...super.computedClassName,
      "nsw-tabs__content": true
    };
  }
}
