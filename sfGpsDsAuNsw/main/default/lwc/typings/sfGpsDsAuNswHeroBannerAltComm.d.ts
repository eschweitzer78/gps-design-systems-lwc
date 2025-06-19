declare module "c/sfGpsDsAuNswHeroBannerAltComm" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";
  import type { PropertyAccessor } from "c/sfGpsDsElement";
  import type { Link } from "s/sfGpsDsMarkdown";

  export default 
  class SfGpsDsAuNswHeroBannerAltComm 
  extends SfGpsDsLwc {
    imageSrc: string;
    imageAlt: string;
    className: string;

    titleLink: string;
    content: string;

    // private

    _titleLink: PropertyAccessor<Link>;
    _contentHtml: PropertyAccessor<string>;

    readonly _titleUrl: string;
    readonly _titleLabel: string;
  }
}
