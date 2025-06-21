declare module "c/sfGpsDsAuNswCardCollectionComm" {
  import type SfGpsDsIpLwc from "c/sfGpsDsIpLwc";
  import type { PropertyAccessor } from "c/sfGpsDsElement";
  import type { DateStyle, Orientation, CStyle } from "c/sfGpsDsAuNswCardV2";

  export type WidthRatio = "1" | "2" | "3" | "4" | "6" | "12";

  export interface CardData {
    title?: string,
    copy?: string,
    footer?: string,
    index: string | number,
    tag?: string,
    image?: string,
    imageAlt?: string,
    date?: string
  }

  export default 
  class SfGpsDsAuNswCardCollectionComm
  extends SfGpsDsIpLwc {
    cstyle: CStyle;
    headline: boolean;
    orientation: Orientation;
    displayDate: boolean;
    dateStyle: DateStyle;

    xsWidth: WidthRatio;
    smWidth: WidthRatio;
    mdWidth: WidthRatio;
    lgWidth: WidthRatio;
    xlWidth: WidthRatio;

    className?: string;

    // private

    get computedClassName(): any;
    get computedColClassName(): any;
    get isEmpty(): boolean;
    get i18n(): Record<string, string>

    mapIpData(
      data: object | object[]
    ): CardData[];
  }
}
