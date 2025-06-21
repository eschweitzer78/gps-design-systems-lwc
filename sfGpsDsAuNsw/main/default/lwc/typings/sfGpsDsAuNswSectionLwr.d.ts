declare module "c/sfGpsDsAuNswSectionLwr" { 
  import type { PropertyAccessor } from "c/sfGpsDsElement";
  import type SfGpsDsLwc from "c/sfGpsDsLwc";

  export type PaddingStyle = 
    "full" |
    "half" |
    "none";

  export type PaddingValues = Record<PaddingStyle, string>;

  export type ColorStyle = 
    "none" |
    "brand-dark" |
    "brand-light" |
    "brand-supplementary" |
    "black" |
    "white" |
    "off-white" |
    "grey-01" |
    "grey-02" |
    "grey-03" |
    "grey-04";

  export type ColorStyleValues = Record<ColorStyle, string>;

  export default 
  class SfGpsDsAuNswSectionLwr 
  extends SfGpsDsLwc {
    imageSrc?: string;
    containerClassName?: string;
    className?: string;

    paddingStyle?: PaddingStyle;
    colorStyle?: ColorStyle;
    withContainer?: boolean;
    withBox?: boolean;
    withInvert?: boolean;

    // private

    _paddingStyle: PropertyAccessor<string>;
    _colorStyle: PropertyAccessor<string>;
    _withContainer: PropertyAccessor<boolean>;
    _withBox: PropertyAccessor<boolean>;
    _withInvert: PropertyAccessor<boolean>;

    get computedClassName(): any;
    get computedContainerClassName(): any;
  }
}
