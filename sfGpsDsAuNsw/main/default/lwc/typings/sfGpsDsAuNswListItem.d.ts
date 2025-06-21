declare module "c/sfGpsDsAuNswListItem" {
  import type SfGpsDsElement from "c/sfGpsDsElement"; 
  import type { PropertyAccessor } from "c/sfGpsDsElement";
  import type { Link } from "c/sfGpsDsMarkdown";
  import type { DateStyle as DateStyleHelpers } from "c/sfGpsDsHelpers";

  export type DateStyle = DateStyleHelpers;

  export default 
  class SfGpsDsAuNswListItem
  extends SfGpsDsElement {
    label?: string;
    link?: string;
    // title: string;
    image?: string;
    imageAlt?: string;
    tags?: Link[];
    className?: string;

    isBlock?: boolean;
    isReversed?: boolean;
    showLink?: boolean;
    preventDefault?: boolean;
    dateStyle?: DateStyle;
    date?: Date | string;

    // private

    _isBlock: PropertyAccessor<boolean>;
    _isReversed: PropertyAccessor<boolean>;
    _showLink: PropertyAccessor<boolean>;
    _preventDefault: PropertyAccessor<boolean>;
    _dateStyle: PropertyAccessor<DateStyle>;

    _date?: Date;
    _dateOriginal?: Date | string;

    get _dateISOString(): string | undefined;
    get _dateLocaleString(): string | undefined;

    get computedClassName(): any;

    handleClick(event: MouseEvent): void;

    _userLocale?: string;
  }
}
