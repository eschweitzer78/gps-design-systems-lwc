declare module "c/sfGpsDsAuNswInPageNavigation" {
  import type SfGpsDsElement from "c/sfGpsDsElement"; 
  import type { PropertyAccessor } from "c/sfGpsDsElement";
  import type { Link } from "c/sfGpsDsMarkdown";

  export default 
  class SfGpsDsAuNswInPageNavigation 
  extends SfGpsDsElement {
    title: string;
    items?: Link[];
    className?: string;

    // @ts-ignore
    firstChild?: boolean;

    // private

    _firstChild?: PropertyAccessor<boolean>;
    _labelledById?: string;

    readonly computedClassName: any;
    readonly computedAriaLabelledById: string;
  }
}
