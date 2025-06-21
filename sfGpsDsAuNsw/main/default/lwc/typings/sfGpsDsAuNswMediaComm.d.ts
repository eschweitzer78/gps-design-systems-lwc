declare module "c/sfGpsDsAuNswMediaComm" { 
  import type SfGpsDsElement from "c/sfGpsDsElement";
  import type { PropertyAccessor } from "c/sfGpsDsElement";
  import type { CStyle, Position } from "c/sfGpsDsAuNswMedia";

  export default 
  class SfGpsDsAuNswMediaComm 
  extends SfGpsDsElement {
    cstyle: CStyle;
    image?: string;
    imageAlt?: string;
    video?: string;
    videoTitle?: string;
    position?: Position;
    caption?: string;
    className?: string

    // private

    _captionHtml: PropertyAccessor<string>;
  }
}
