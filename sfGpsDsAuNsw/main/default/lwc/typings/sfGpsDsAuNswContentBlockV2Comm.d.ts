declare module "c/SfGpsDsAuNswContentBlockV2Comm" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";
  import type { PropertyAccessor } from "c/sfGpsDsElement";
  import type { Link } from "c/sfGpsDsMarkdown";

  export default 
  class SfGpsDsAuNswContentBlockV2Comm
  extends SfGpsDsLwc {
    //title: string;
    image?: string;
    imageAlt?: string;
    icon?: string;
    className?: string;

    useMarkup: boolean;

    links?: string;
    copy?: string;
    mainLink?: string;

    // private

    _links: PropertyAccessor<Link[]>;
    _copyHtml: PropertyAccessor<string>;
    _mainLink: PropertyAccessor<Link>;
  }
}