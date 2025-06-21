
declare module "c/sfGpsDsAuNswCardCarouselComm" {
  import type SfGpsDsElement from "c/sfGpsDsElement"; 
  import type { CardData } from "c/sfGpsDsAuNswCardCarousel";
  import type { CStyle, DateStyle, Orientation } from "c/sfGpsDsAuNswCardV2";

  export default 
  class SfGpsDsAuNswCardCarouselComm
  extends SfGpsDsElement {
    accessibilityLabel?: string;
    drag?: boolean;
    justifyContent?: boolean;
    navigation?: boolean;
    navigationItemClassName?: string;
    navigationClassName?: string;
    paginationClassName?: string;
    ctyle: CStyle;
    headline: boolean;
    orientation: Orientation;
    displayDate: boolean;
    dateStyle: DateStyle;
    className?: string;

    // private

    get _isEmpty(): boolean;
    get navigationNavigation(): boolean;
    get navigationPagination(): boolean;
    get loop(): boolean;

    mapIpData(data: any): CardData[];
  }
}
