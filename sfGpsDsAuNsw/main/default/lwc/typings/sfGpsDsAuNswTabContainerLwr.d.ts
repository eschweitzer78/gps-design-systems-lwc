declare module "c/sfGpsDsAuNswTabContainerLwr" { 
  import type SfGpsDsLwc from "c/sfGpsDsLwc";
  import type { PropertyAccessor } from "c/sfGpsDsElement";

  export type TabPaddingStyle = 
    "full" | 
    "flush" | 
    "side-flush";

  export type TabBorderStyle = 
    "border" | 
    "no-border";

  export default 
  class SfGpsDsAuNswTabContainerLwr 
  extends SfGpsDsLwc {
    //title: string;
    tab1Label?: string;
    tab2Label?: string;
    tab3Label?: string;
    tab4Label?: string;
    tab5Label?: string;
    tab6Label?: string;
    tab7Label?: string;
    tab8Label?: string;
    tab9Label?: string;
    tab10Label?: string;

    // @ts-ignore
    firstChild?: boolean;

    tabPaddingStyle?: TabPaddingStyle;
    tabBorderStyle?: TabBorderStyle

    // private

    _tabPaddingStyle: PropertyAccessor<TabPaddingStyle>;
    _tabBorderStyle: PropertyAccessor<TabBorderStyle>;

    get computedTabClassName(): any;
  }
}
