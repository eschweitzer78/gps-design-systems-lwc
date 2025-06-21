declare module "c/sfGpsDsAuNswHeroBannerAltComm" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";
  import type { PropertyAccessor } from "c/sfGpsDsElement";
  import type { Link } from "c/sfGpsDsMarkdown";

  export default 
  class SfGpsDsAuNswHeroBannerAltComm 
  extends SfGpsDsLwc {
    imageSrc?: string;
    imageAlt?: string;
    className?: string;

    titleLink?: string;
    content?: string;

    // private

    _titleLink: PropertyAccessor<Link>;
    _contentHtml: PropertyAccessor<string>;

    get _titleUrl(): string | undefined;
    get _titleLabel(): string | undefined;
  }
}
