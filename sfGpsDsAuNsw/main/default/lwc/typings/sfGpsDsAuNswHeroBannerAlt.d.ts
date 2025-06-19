declare module "c/sfGpsDsAuNswHeroBannerAlt" {
  import type SfGpsDsElement, { PropertyAccessor } from "c/sfGpsDsElement";

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
