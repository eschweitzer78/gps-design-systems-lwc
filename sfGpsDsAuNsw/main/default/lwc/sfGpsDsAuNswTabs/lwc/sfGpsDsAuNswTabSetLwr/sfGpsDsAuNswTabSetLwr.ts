import { 
  api 
} from "lwc";
import sfGpsDsTabSetLwr from "c/sfGpsDsTabSetLwr";

const FIRSTCHILD_DEFAULT = false;

export default 
class sfGpsDsAuNswTabSetLwr
extends sfGpsDsTabSetLwr {
  static renderMode: "light" | "shadow" = "light";

  // @ts-ignore
  @api 
  firstChild?: boolean;
  _firstChild = this.defineBooleanProperty("firstChild", {
    defaultValue: FIRSTCHILD_DEFAULT
  });

  // getters
  
  get computedClassName(): any {
    return {
      [this.className || ""]: !!this.className,
      "nsw-tabs": true
    };
  }
}
