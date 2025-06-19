
declare module "c/sfGpsDsAuNswCallout" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";
  import type { PropertyAccessor } from "c/sfGpsDsElement";

  export default 
  class SfGpsDsAuNswCalloutComm
  extends SfGpsDsLwc {
    title: string;
    level: number;
    firstChild: boolean;
    className: string;

    content: string;

    // private

    _contentHtml: PropertyAccessor<string>;
  }
}