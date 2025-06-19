declare module "c/sfGpsDsAuNswLinkList" {
  import type SfGpsDsElement, { PropertyAccessor } from "c/sfGpsDsElement";
  import type { Link } from "c/sfGpsDsMarkdown";

  export default 
  class SfGpsDsAuNswLinkList 
  extends SfGpsDsElement {
    title: string;
    links: Link[];
    className: string;
    firstChild: boolean;

    // private

    _firstChild: PropertyAccessor<boolean>;

    readonly computedClassName: any;
  }
}
