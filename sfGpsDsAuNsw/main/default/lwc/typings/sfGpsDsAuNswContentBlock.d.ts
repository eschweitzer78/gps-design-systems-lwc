declare module "c/sfGpsDsAuNswContentBlock" {
  import type SfGpsDsElement from "c/sfGpsDsElement"; 
  import type { PropertyAccessor } from "c/sfGpsDsElement";

  import { Link } from "c/sfGpsDsMarkdown";
  
  export default 
  class SfGpsDsAuNswContentBlock
  extends SfGpsDsElement {
    // title: string;
    image?: string;
    imageAlt?: string;
    icon?: string;
    mainLink?: string;
    links: Link[];
    className?: string;

    // private

    readonly computedClassName: any;
  }
}