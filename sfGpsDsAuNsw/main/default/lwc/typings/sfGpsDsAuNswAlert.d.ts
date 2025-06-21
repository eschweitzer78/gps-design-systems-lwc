declare module "c/sfGpsDsAuNswAlert" {
  import type SfGpsDsElement from "c/sfGpsDsElement"; 
  import type { PropertyAccessor } from "c/sfGpsDsElement";
  
  export type AlertType = 
    "info" | 
    "warning" | 
    "error" | 
    "success";
  
  export interface AsValue {
    className: string,
    iconName: string
  }

  export default 
  class SfGpsDsAuNswAlert 
  extends SfGpsDsElement {
    // title: string;
    index: string | number;
    header: string;
    as: AlertType;
    compact: boolean;
    className: string;
    closed: boolean;

    // private

    _as: PropertyAccessor<AsValue>;
    _compact: PropertyAccessor<boolean>;

    get computedClassName(): any;
    get computedIconName(): string;
    get space(): string;
  }
}
