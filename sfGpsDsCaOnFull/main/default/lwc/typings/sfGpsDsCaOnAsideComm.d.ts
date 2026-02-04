declare module "c/sfGpsDsCaOnAsideComm" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";
  import type { PropertyAccessor } from "c/sfGpsDsElement";

  export default 
  class SfGpsDsCaOnAsideComm
  extends SfGpsDsLwc {
    content?: string;
    heading?: string;
    highlightColour?: string;
    headingLevel?: string;
    className?: string;
  
    // private

    _contentHtml: PropertyAccessor<string>;
    _headingHtml: PropertyAccessor<string>
    
    get computedClassName(): any;
  }
}
