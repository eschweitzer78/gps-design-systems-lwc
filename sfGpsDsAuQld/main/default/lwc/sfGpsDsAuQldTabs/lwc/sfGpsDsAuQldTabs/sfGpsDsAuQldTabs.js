import sfGpsDsTabSetLwr from "c/sfGpsDsTabSetLwr";
export default class sfGpsDsAuQldTabs extends sfGpsDsTabSetLwr {
  static renderMode = "light";
  // getters
  get computedClassName() {
    return {
      ...super.computedClassName,
      "qld__tab-container": true,
      "qld__tab-container__fixed": true
    };
  }
}
