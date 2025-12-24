declare module "c/sfGpsDsAuNswCardV2" {
  import type SfGpsDsElement from "c/sfGpsDsElement"; 
  import type { PropertyAccessor } from "c/sfGpsDsElement";
  import type { DateStyle as HelpersDateStyle } from "c/sfGpsDsHelpers";

  export type DateStyle = HelpersDateStyle;

  export type Orientation =
    "vertical" |
    "horizontal";

  export type CStyle = 
    "white" |
    "dark" |
    "light";

  export default 
  class sfGpsDsAuNswCardV2
  extends SfGpsDsElement {
    title: string;
    link?: string;
    tag?: string;
    image?: string;
    imageAlt?: string;
    className?: string;

    preventDefault?: boolean;
    headline?: boolean;
    border?: boolean;
    cstyle?: CStyle;
    orientation?: Orientation;
    highlight?: boolean;
    dateStyle?: DateStyle;

    get date(): string | Date | undefined;
    set date(value: string | Date);

    click(): void;

    // private

    _preventDefault: PropertyAccessor<boolean>;
    _headline: PropertyAccessor<boolean>;
    _border: PropertyAccessor<boolean>;
    _cstyle: PropertyAccessor<string>;
    _orientation: PropertyAccessor<string>;
    _highlight: PropertyAccessor<boolean>;
    _dateStyle: PropertyAccessor<DateStyle>;
    _date: Date;
    _dateOriginal: string | Date;

    get _dateISOString(): string | undefined;
    get _dateLocaleString(): string | undefined;
    get computedClassName(): any;

    handleClick(event: MouseEvent): void;

    _userLocale: string;
  }
}
