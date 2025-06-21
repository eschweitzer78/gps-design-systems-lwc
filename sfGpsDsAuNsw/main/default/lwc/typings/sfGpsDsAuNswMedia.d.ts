declare module "c/sfGpsDsAuNswMedia" { 
  import type SfGpsDsElement from "c/sfGpsDsElement";
  
  type CStyle =
    "default" |
    "dark" |
    "light" |
    "transparent";

  type Position =
    "default" |
    "60" |
    "70" |
    "80" |
    "90" |
    "left-30" |
    "left-40" |
    "left-50" |
    "right-30" |
    "right-40" |
    "right-50";

  export default 
  class SfGpsDsAuNswMedia 
  extends SfGpsDsElement {
    image?: string;
    imageAlt?: string;
    video?: string;
    videoTitle?: string;
    caption?: string;
    className?: string

    // private
  }
}
