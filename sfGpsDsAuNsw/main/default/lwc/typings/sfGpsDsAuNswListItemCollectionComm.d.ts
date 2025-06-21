declare module "c/sfGpsDsAuNswListItemCollectionComm" {
  import type SfGpsDsIpLwc from "c/sfGpsDsIpLwc";
  import type { DateStyle as DateStyleHelpers } from "c/sfGpsDsAuNswListItem";
  import type { NavigationMixin } from "lightning/navigation";  

  export type DateStyle = DateStyleHelpers;

  export interface ListItem {
    label: string,
    title: string,
    link: string,
    headline: string,
    copy: string,
    image: string,
    imageAlt: string,
    tags: string,
    date: Date,
    isBlock: boolean;
    isReversed: boolean;
    showLink: boolean;
    dateStyle: DateStyle,
    className: string
  }

  export interface DisplayListItem extends ListItem {
    key: string,
  }

  export default 
  class SfGpsDsAuNswListItemComm
  extends NavigationMixin<SfGpsDsIpLwc>(SfGpsDsIpLwc) {
    dateStyle: DateStyle;
    isRelative: false;
    isBlock: boolean;
    isReversed: boolean;
    showLink: boolean;
    className?: string;

    // private

    get _isEmpty(): boolean;

    mapIpData(data: object | object[]): any[];
  }
}
