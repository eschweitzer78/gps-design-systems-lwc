declare module "c/sfGpsDsAuNswStepsItem" { 
  import type SfGpsDsElement from "c/sfGpsDsElement"; 
  import type { PropertyAccessor } from "c/sfGpsDsElement";

  export type HeadingLevel = 2 | 3 | 4;

  export default 
  class SfGpsDsAuNswStepsItem
  extends SfGpsDsElement {
    title: string;
    content: string;
    className: string;

    headingLevel: HeadingLevel;
    filled: boolean;

    // private

    _headingLevel: PropertyAccessor<HeadingLevel>;
    _filled: PropertyAccessor<boolean>;

    readonly computedClassName: any;
    readonly _isH3: boolean;
    readonly _isH4: boolean;
 }
}
