declare module "c/sfGpsDsAuNswListItemComm" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";
  import type { PropertyAccessor } from "c/sfGpsDsElement";
  import type { Link } from "c/sfGpsDsMarkdown";
  import type { DateStyle } from "c/sfGpsDsAuNswListItem";

  export type DateStyle = DateStyleHelpers;

  export default 
  class SfGpsDsAuNswListItemComm
  extends SfGpsDsLwc {
    label: string;
    image: string;
    imageAlt: string;
    isBlock: boolean;
    isReversed: boolean;
    showLink: boolean;
    dateStyle: DateStyle;
    className: string;

    useMarkup: boolean;

    headline: string;
    date: Date | string;
    copy: string;
    tags: string;

    // private

    _headline: PropertyAccessor<Link>;
    _date: Date;
    _dateOriginal: Date | string;
    _copy: PropertyAccessor<string>;
    _tags: PropertyAccessor<Link[]>;
  }
}
