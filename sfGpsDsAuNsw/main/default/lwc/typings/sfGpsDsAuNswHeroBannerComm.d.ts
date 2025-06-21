declare module "c/sfGpsDsAuNswHeroBannerComm" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";
  import type { PropertyAccessor } from "c/sfGpsDsElement";
  import type { BannerImage, CStyle } from "c/sfGpsDsAuNswHeroBanner";
  import type { Link } from "c/sfGpsDsMarkdown";

  export default 
  class SfGpsDsAuNswHeroBannerComm
  extends SfGpsDsLwc {
    title: string;
    subtitle?: string;
    cstyle?: CStyle;
    wide?: boolean;
    feature?: boolean;
    lines?: boolean;
    image?: string;
    imageAlt?: string;
    className?: string;

    cta?: string;
    links?: string;
    intro?: string;

    // private

    _cta: PropertyAccessor<Link>;
    _links: PropertyAccessor<Link[]>;
    _introHtml: PropertyAccessor<string>;

    readonly computedImage: BannerImage | null;
  }
}
