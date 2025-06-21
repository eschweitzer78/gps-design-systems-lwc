declare module "c/sfGpsDsAuNswContentBlockCollectionComm" {
  import type SfGpsDsIpLwc from "c/sfGpsDsLwc";
  import type { PropertyAccessor } from "c/sfGpsDsElement";

  export type WidthRatio = "1" | "2" | "3" | "4" | "6" | "12";

  export interface BlockData {
    title?: string,
    copy?: string,
    index: string | number,
    image?: string,
    imageAlt?: string,
    links?: string,
    mainLink?: string,
  }

  export default 
  class SfGpsDsAuNswContentBlockCollectionComm
  extends SfGpsDsIpLwc {
    xsWidth: WidthRatio;
    smWidth: WidthRatio;
    mdWidth: WidthRatio;
    lgWidth: WidthRatio;
    xlWidth: WidthRatio;
    className?: string;

    // private

    get computedClassName(): any;
    get computedColClassName(): any;
    get _isEmpty(): boolean;
    get i18n(): Record<string, string>;

    mapIpData(data: any): BlockData[];
  }
}