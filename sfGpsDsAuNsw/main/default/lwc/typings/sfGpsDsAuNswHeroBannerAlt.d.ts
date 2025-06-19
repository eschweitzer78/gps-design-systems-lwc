declare module "c/sfGpsDsAuNswHeroBannerAlt" {
  import type SfGpsDsElement from "c/sfGpsDsElement"; 
  import type { PropertyAccessor } from "c/sfGpsDsElement";
  import type { Link } from "s/sfGpsDsMarkdown";

  export default 
  class SfGpsDsAuNswHeroBannerAlt 
  extends SfGpsDsElement {
    titleUrl: string;
    titleLabel: string;
    imageSrc: string;
    imageAlt: string;
    className: string;

    titlePreventDefault: boolean;

    // private

    _titlePreventDefault: PropertyAccessor<boolean>;

    readonly computedClassName: any;

    handleTitleClick(event: MouseEvent): void;
  }
}
