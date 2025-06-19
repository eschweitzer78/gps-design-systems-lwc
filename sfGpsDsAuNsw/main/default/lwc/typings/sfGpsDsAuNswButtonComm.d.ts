
declare module "c/sfGpsDsAuNswButtonComm" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";
  import type { PropertyAccessor } from "c/sfGpsDsElement";
  import type { NavigationMixin } from "lightning/navigation";
  import type { Rendering, CStyle, IconStyle, Type } from "c/sfGpsDsAuNswButton";

  export default 
  class SfGpsDsAuNswButtonComm
  extends NavigationMixin<SfGpsDsLwc>(SfGpsDsLwc) {
    type: Type;
    iconName: string;
    ariaHasPopup: boolean;
    className: string;

    cstyle: CStyle;
    iconStyle: IconStyle;
    rendering: Rendering;
    disabled: boolean;
    mobileFullWidth: boolean;

    link: string;

    // private

    _link: PropertyAccessor<Link>

    readonly computedIsButton: boolean;

    handleClick(event: MouseEvent): void;
  }
}