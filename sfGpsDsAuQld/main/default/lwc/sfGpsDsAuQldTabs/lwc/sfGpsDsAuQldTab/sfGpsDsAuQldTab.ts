import SfGpsDsTabLwr from "c/sfGpsDsTabLwr";

export default 
class SfGpsDsAuQldTabLwr
extends SfGpsDsTabLwr {
  static renderMode: "light" | "shadow" = "light";

  /* computed */

  get computedClassName(): any {
    return {
      ...super.computedClassName,
      "qld__tab-content": true,
      active: !this._vhidden,
    };
  }
}
