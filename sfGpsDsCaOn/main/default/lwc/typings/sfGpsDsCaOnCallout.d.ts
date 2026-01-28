declare module "c/sfGpsDsCaOnCallout" {
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

  /**
   * Callout type variants for alert-style callouts.
   * - default: Standard callout with border color only
   * - information: Blue background with info icon
   * - warning: Yellow/gold background with warning icon
   * - error: Red background with error icon
   * - success: Green background with success icon
   */
  export type CalloutType = 
    "default" | 
    "information" | 
    "warning" | 
    "error" | 
    "success";

  export default 
  class SfGpsDsCaOnCallout 
  extends SfGpsDsElement {
    highlightColour?: HeadingColour;
    headingLevel?: string;
    className?: string;
    heading?: string;
    type?: CalloutType;
  
    // private

    _highlightColour: PropertyAccessor<string>
    _headingLevel: PropertyAccessor<string>;
    _type: PropertyAccessor<string>;
    
    get computedClassName(): any;
    get isH2(): boolean;
    get isH3(): boolean;
    get isH4(): boolean;
    get isH5(): boolean;
    get isH6(): boolean;
    get isTypedCallout(): boolean;
    get isDefaultCallout(): boolean;
    get showIcon(): boolean;
    get isInformation(): boolean;
    get isWarning(): boolean;
    get isError(): boolean;
    get isSuccess(): boolean;
    get hasHeadingProp(): boolean;
    get showHeadingSlot(): boolean;
  }
}
