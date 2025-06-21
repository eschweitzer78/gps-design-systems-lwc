declare module "c/sfGpsDsAuNswLinkList" {
  import type SfGpsDsElement from "c/sfGpsDsElement"; 
  import type { PropertyAccessor } from "c/sfGpsDsElement";
  import type { Link } from "c/sfGpsDsMarkdown";

  export default 
  class SfGpsDsAuNswLinkList 
  extends SfGpsDsElement {
    // title: string;
    links?: Link[];
    className?: string;
    // @ts-ignore
    firstChild?: boolean;

    // private

    _firstChild: PropertyAccessor<boolean>;

    readonly computedClassName: any;
  }
}
