import sfGpsDsTabSetLwr from "c/sfGpsDsTabSetLwr";

export default 
class sfGpsDsAuQldTabs
extends sfGpsDsTabSetLwr {
  static renderMode: "light" | "shadow" = "light";

  // getters
  
  get computedClassName(): any {
    return {
      ...super.computedClassName,
      "qld__tab-container": true,
      "qld__tab-container__fixed": true
    };
  }
}
