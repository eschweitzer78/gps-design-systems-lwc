declare module "c/sfGpsDsAuNswLinkList" {
  import type SfGpsDsElement from "c/sfGpsDsElement"; 
  import type { PropertyAccessor } from "c/sfGpsDsElement";
  import type { Link as BaseLink } from "c/sfGpsDsMarkdown";

  export type Link = BaseLink;
  export interface DecoratedLink extends Link {
    _isExternal?: boolean
  } 

  export default 
  class SfGpsDsAuNswLinkList 
  extends SfGpsDsElement {
    // title: string;
    links?: Link[];
    className?: string;
    hightlightExternal?: boolean;
    firstChild?: boolean;

    // private

    _hightlightExternal: PropertyAccessor<boolean>;
    _firstChild: PropertyAccessor<boolean>;
    _describedById?: string;

    get computedClassName(): any;
    get computedAriaDescribedById(): string;
    get i18n(): Record<string, string>;
  }
}
