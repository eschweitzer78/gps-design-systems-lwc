import { api } from "lwc";
import SfGpsDsNavigation from "c/sfGpsDsNavigation";

export default class SfGpsDsAuNswSLowerFooterP extends SfGpsDsNavigation {
  @api
  get ipName() {
    return super.ipName;
  }

  set ipName(value) {
    super.ipName = value;
  }

  @api
  get inputJSON() {
    return super.inputJSON;
  }

  set inputJSON(value) {
    super.inputJSON = value;
  }

  @api
  get optionsJSON() {
    return super.optionsJSON;
  }

  set optionsJSON(value) {
    super.optionsJSON = value;
  }

  //

  @api className;

  // Events

  handleNavigate(event) {
    if (this._map && event.detail) {
      this.dispatchEvent(
        new CustomEvent("navigate", {
          detail: {
            ...this._map[event.detail]
          }
        })
      );
    }
  }
}
