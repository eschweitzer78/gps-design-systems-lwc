declare module "c/sfGpsDsSpinner" {
  import type * as CSS from "csstype";
  import type SfGpsDsElement from "c/sfGpsDsElement";

  export interface StyleElement {
    style: CSS.Properties,
    index: number
  }

  export default 
  class SfGpsDsSpinner 
  extends SfGpsDsElement {
    animationDuration: number;
    size: number;
    squaresNum: number;
    color: string;

    // internal
    get computedSquareStyle(): CSS.Properties;
    get computedSquaresStyles(): StyleElement[];
  }
}