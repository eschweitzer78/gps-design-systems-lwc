declare module "c/sfGpsDsAuNswSteps" { 
  import type SfGpsDsElement from "c/sfGpsDsElement"; 
  import type { PropertyAccessor } from "c/sfGpsDsElement";
 
  export type CStyle =
    "default" |
    "dark" |
    "light" |
    "supplementary";
  
  export type Size = 
    "large" |
    "medium" |
    "small";

  export default 
  class SfGpsDsAuNswSteps 
  extends SfGpsDsElement {
    type: string;
    className: string;

    firstChild: boolean;
    cstyle: CStyle;
    size: Size;

    // private

    _firstChild: PropertyAccessor<boolean>;
    _cstyle: PropertyAccessor<string>;
    _size: PropertyAccessor<string>;

    readonly computedClassName: any;
  }
}
