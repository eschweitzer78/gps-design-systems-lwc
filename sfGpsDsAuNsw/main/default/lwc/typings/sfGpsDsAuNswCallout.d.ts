
declare module "c/sfGpsDsAuNswCallout" {
  import type SfGpsDsElement from "c/sfGpsDsElement"; 
  import type { PropertyAccessor } from "c/sfGpsDsElement";

  export default 
  class SfGpsDsAuNswCallout
  extends SfGpsDsElement {
    //title: string;
    className?: string;

    // @ts-ignore
    firstChild?: boolean;
    level?: number;

    // private

    _firstChild: PropertyAccessor<boolean>;
    _level: PropertyAccessor<number>;

    get computedClassName(): any;
    get computedTitleClassName(): any;
  }
}