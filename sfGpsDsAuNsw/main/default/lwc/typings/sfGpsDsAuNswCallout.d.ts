
declare module "c/sfGpsDsAuNswCallout" {
  import type SfGpsDsElement from "c/sfGpsDsElement"; 
  import type { PropertyAccessor } from "c/sfGpsDsElement";

  export default 
  class SfGpsDsAuNswCallout
  extends SfGpsDsElement {
    title: string;
    className: string;

    firstChild: boolean;
    level: number;

    // private

    _firstChild: PropertyAccessor<boolean>;
    _level: PropertyAccessor<number>;

    readonly computedClassName: any;
    readonly computedTitleClassName: any;
  }
}