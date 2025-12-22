import { api } from "lwc";
import SfGpsDsTabLwr from "c/sfGpsDsTabLwr";

export default 
class SfGpsDsAuNswTabLwr
extends SfGpsDsTabLwr {
  static renderMode: "light" | "shadow" = "light";

  /* api: iconName, String */

  _iconName?: string;
  
  // @ts-ignore
  @api
  get iconName() {
    return this._iconName;
  }

  set iconName(value) {
    this._iconName = value;
    this._dispatchDataChangeEventIfConnected();
  }

  /* api: vhidden */

  // @ts-ignore
  @api
  get vhidden() {
    return super.vhidden;
  }

  set vhidden(value: boolean) {
    super.vhidden = value;
    this.setAttribute("data-vhidden", value);
  }

  /* computed */

  get computedClassName(): any {
    return {
      ...super.computedClassName,
      "sfgpsdsauvic2-tab__content": true
    };
  }
}
