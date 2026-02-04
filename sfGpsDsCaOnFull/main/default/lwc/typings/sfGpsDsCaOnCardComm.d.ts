declare module "c/sfGpsDsCaOnCardComm" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";  
  import type { PropertyAccessor } from "c/sfGpsDsElement";
  import type { Link as BaseLink } from "c/sfGpsDsMarkdown";

  export type Link = BaseLink;

  export default 
  class SfGpsDsCaOnCardComm
  extends SfGpsDsLwc {
    ariaLabelText?: string;
    description?: string;
    heading?: string;
    headingColour?: string;
    headingLevel?: string;
    hideDescription?: boolean;
    horizontalImagePosition?: string;
    horizontalImageSize?: string;
    image?: string;
    imageAltText?: string;
    layoutDirection?: string;
    className?: string;
  
    // private

    _descriptionHtml: PropertyAccessor<string>;
    _heading: PropertyAccessor<Link>;
    
    get computedHasDescription(): any;
    get _headingText(): string | undefined;
    get _headingUrl(): string | undefined;
  }
}
