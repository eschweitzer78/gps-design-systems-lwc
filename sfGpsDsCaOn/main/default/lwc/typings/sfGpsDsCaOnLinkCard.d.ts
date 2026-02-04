declare module "c/sfGpsDsCaOnLinkCard" {
  import type SfGpsDsElement from "c/sfGpsDsElement";
  import type { PropertyAccessor } from "c/sfGpsDsElement";

  export type HeadingLevel = "h2" | "h3" | "h4" | "h5" | "h6";

  export default 
  class SfGpsDsCaOnLinkCard
  extends SfGpsDsElement {
    heading?: string;
    description?: string;
    url?: string;
    isExternal?: boolean;
    headingLevel?: string;
    className?: string;

    // private

    _isExternal: PropertyAccessor<Boolean>;
    _headingLevel: PropertyAccessor<HeadingLevel>; 

    get isH2(): boolean;
    get isH3(): boolean;
    get isH4(): boolean;
    get isH5(): boolean;
    get isH6(): boolean;
    get computedClassName(): any;
    get computedUrl(): string;
    get computedLinkTarget(): string;
    get computedLinkRel(): string | undefined;
  }
}
