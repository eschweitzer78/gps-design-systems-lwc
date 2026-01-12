declare module "c/sfGpsDsCaOnCard" {
  import type SfGpsDsElement from "c/sfGpsDsElement";
  import type { PropertyAccessor } from "c/sfGpsDsElement";

  export type HeadingColour = "default" | "light-accent" | "dark-accent" | "light-gold" | "light-yellow" | "light-taupe" | "light-green" | "light-lime" | "light-teal" | "light-sky" | "light-purple" | "light-orange" | "light-red" | "light-magenta" | "gold" | "yellow" | "taupe" | "green" | "lime" | "teal" | "sky" | "purple" | "orange" | "red" | "magenta" ;

  export type HeadingLevel = "h2" | "h3" | "h4" | "h5" | "h6";

  export type HorizontalImagePosition = "left" | "right";

  export type HorizontalImageSize = "one-third" | "one-fourth";

  export type LayoutDirection = "horizontal" | "vertical";

  export default 
  class SfGpsDsCaOnCard
  extends SfGpsDsElement {
    ariaLabelText?: string;
    hasDescription?: boolean;
    heading?: string;
    headingColour?: HeadingColour;
    headingLevel?: string;
    horizontalImagePosition?: HorizontalImagePosition;
    horizontalImageSize?: HorizontalImageSize;
    image?: string;
    imageAltText?: string;
    layoutDirection?: LayoutDirection;
    url?: string;
    className?: string;
  
    // private

    _hasDescription: PropertyAccessor<boolean>;
    _headingColour: PropertyAccessor<HeadingColour>;
    _headingLevel: PropertyAccessor<HeadingLevel>;
    _horizontalImagePosition: PropertyAccessor<string>;
    _horizontalImageSize: PropertyAccessor<string>;
    
    get computedClassName(): any;
    get computedTextContainerClassName(): any;
    get computedHeadingClass(): any;
  }
}
