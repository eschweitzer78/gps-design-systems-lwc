declare module "c/sfGpsDsCaOnAside" {
  import type SfGpsDsElement from "c/sfGpsDsElement";
  import type { PropertyAccessor } from "c/sfGpsDsElement";
  
  export type HeadingColour = 
    "default" | 
    "blue" | 
    "gold" | 
    "yellow" | 
    "taupe" | 
    "green" | 
    "lime" | 
    "teal" | 
    "sky" | 
    "purple" ;

  export type HeadingLevel = 
    "h2" | 
    "h3" | 
    "h4" | 
    "h5" | 
    "h6";

  export default 
  class SfGpsDsCaOnAside 
  extends SfGpsDsElement {
    highlightColour?: HeadingColour;
    headingLevel?: string;
    className?: string;
  
    // private

    _highlightColour: PropertyAccessor<string>
    _headingLevel: PropertyAccessor<string>;
    
    get computedClassName(): any;
    get isH2(): boolean;
    get isH3(): boolean;
    get isH4(): boolean;
    get isH5(): boolean;
    get isH6(): boolean;
  }
}
