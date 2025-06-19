declare module "c/sfGpsDsAuNswBreadcrumbs" {
  import type SfGpsDsElement from "c/sfGpsDsElement";
  import type { Link } from "c/sfGpsDsMarkdown";
  
  export interface DecoratedLink 
  extends Link {
    _isSecond: boolean
  }

  export default 
  class sfGpsDsAuNswBreadcrumbs
  extends SfGpsDsElement {
    label: string;
    items: Link[]
    containerClassName: string;
    className: string;

    // private

    _showMore: boolean;
    _moreToggleKey: string;
    
    readonly computedClassName: any;
    readonly computedOlClassName: any;
    readonly decoratedItems: DecoratedLink[];

    handleMoreToggle(event: MouseEvent): void;
  }
}
