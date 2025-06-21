declare module "c/sfGpsDsAuNswHeroBanner" {
  import type SfGpsDsElement from "c/sfGpsDsElement"; 
  import type { PropertyAccessor } from "c/sfGpsDsElement";
  import type { Link } from "c/sfGpsDsMarkdown";

  export type CStyle =
    "dark" |
    "light" |
    "off-white" |
    "white";

  export interface CStyleValue {
    main: string,
    button: string
  }

  export interface BannerImage {
    src: string,
    alt?: string,
  }

  export default 
  class SfGpsDsAuNswHeroBanner 
  extends SfGpsDsElement {
    //title: string;
    subtitle?: string;
    cta?: string;
    image?: BannerImage;
    className?: string;

    cstyle?: CStyle;
    wide?: boolean;
    feature?: boolean;
    lines?: boolean;
    ctaPreventDefault?: boolean;
    linksPreventDefault?: boolean;
    
    get links(): Link[];
    set links(value: Link[]);

    // private
    _cstyle: PropertyAccessor<CStyleValue>;
    _wide: PropertyAccessor<boolean>;
    _featured: PropertyAccessor<boolean>;
    _ctaPreventDefault: PropertyAccessor<boolean>;
    _linksPreventDefault: PropertyAccessor<boolean>;
    _links: Link[];
    _linksOriginal: Link[];

    get computedClassName(): any;
    get computedButtonClassName(): any;
    get computedHasLinks(): boolean;

    handleCtaClick(event: MouseEvent): void;
    handleLinksClick(event: MouseEvent): void;
  }
}
