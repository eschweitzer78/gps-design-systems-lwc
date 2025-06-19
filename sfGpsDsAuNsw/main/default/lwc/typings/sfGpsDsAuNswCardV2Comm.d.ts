declare module "c/sfGpsDsAuNswCardV2Comm" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";
  import type { PropertyAccessor } from "c/sfGpsDsElement";
  import type { DateStyle, Orientation, CStyle } from "c/sfGpsDsAuNswCardV2";
  import type { Link } from "s/sfGpsDsMarkdown";

  export default 
  class sfGpsDsAuNswCardV2Comm
  extends SfGpsDsLwc {
    cstyle: CStyle;
    orientation: Orientation;
    dateStyle: DateStyle;
    headline: boolean;
    tag: string;
    image: string;
    imageAlt: string;
    preventDefault: boolean;
    className: string;

    useMarkup: string | boolean;

    title: string;
    date: string;
    copy: string;
    footer: string;

    // private

    _copySlotted: boolean;
    _footerSlotted: boolean;
    _title: PropertyAccessor<Link>;

    readonly _titleText: string;
    readonly _titleUrl: string;

    _copyHtml: PropertyAccessor<string>;
    _footerHtml: PropertyAccessor<string>;

    readonly highlight: boolean;

    readonly computedCopyClassName: string;
    readonly computedFooterClassName: string;

    click(): void;
    handleSlotChange(event: Event): void;
    handleNavigate(event: CustomEvent): void;
  }
}
