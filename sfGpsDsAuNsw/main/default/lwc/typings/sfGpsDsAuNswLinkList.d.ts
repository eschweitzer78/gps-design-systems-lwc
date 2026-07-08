declare module "c/sfGpsDsAuNswLinkList" {
  import type SfGpsDsElement from "c/sfGpsDsElement"; 
  import type { PropertyAccessor } from "c/sfGpsDsElement";
  import type { Link as BaseLink } from "c/sfGpsDsMarkdown";

  export type Link = BaseLink;
  export interface DecoratedLink extends Link {
    _isExternalUrl?: boolean;
    _describedById?: string;
  }

  export default
  class SfGpsDsAuNswLinkList
  extends SfGpsDsElement {
    // title: string;
    links?: Link[];
    className?: string;
    highlightExternal?: boolean;
    firstChild?: boolean;

    // private

    _highlightExternal: PropertyAccessor<boolean>;
    _firstChild: PropertyAccessor<boolean>;
    _uid?: string;

    get uid(): string;
    get computedClassName(): any;
    get decoratedList(): DecoratedLink[];
    get i18n(): Record<string, string>;
  }
}
