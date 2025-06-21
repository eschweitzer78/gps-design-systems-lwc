declare module "c/sfGpsDsAuNswButton" {
  import type SfGpsDsElement from "c/sfGpsDsElement"; 
  import type { PropertyAccessor } from "c/sfGpsDsElement";
  
  export type CStyle = 
    "dark" |
    "dark-outline" |
    "dark-outline-solid" |
    "light" |
    "light-outline" |
    "white" |
    "danger" |
    "info";

  export type IconStyle =
   "none" |
   "before" |
   "after";

  export type Rendering = 
    "a" | 
    "button";

  export type Type = 
    "submit" | 
    "reset" | 
    "button" | 
    undefined;

  export default 
  class sfGpsDsAuNswButton
  extends SfGpsDsElement {
    label?: string;
    link?: string;
    type: Type;
    iconName?: string;
    className?: string;

    cstyle?: CStyle;
    iconStyle?: IconStyle;
    rendering?: Rendering;
    disabled?: boolean;
    mobileFullWidth?: boolean;

    // private

    _cstyle: PropertyAccessor<CStyle>;
    _iconStyle: PropertyAccessor<IconStyle>;
    _rendering: PropertyAccessor<Rendering>
    _disabled: PropertyAccessor<boolean>;
    _mobileFullWidth: PropertyAccessor<boolean>;

    get computedClassName(): any;
    get computedIsAnchor(): boolean;
    get computedHasIconBefore(): boolean;
    get computedHasIconAfter(): boolean;

    handleClick(event: MouseEvent): void;
  }
}
