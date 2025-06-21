declare module "c/sfGpsDsAuNswTable" { 
  import type SfGpsDsElement from "c/sfGpsDsElement"; 
  import type { PropertyAccessor } from "c/sfGpsDsElement";
 
  export type CaptionLocation =
    "top" |
    "bottom" |
    "none";

  export type ContentDisplayType =
    "markdown" |
    "string" |
    "number" |
    "boolean" |
    "reference";

  export type ContentDataType =
    "string" |
    "number" |
    "boolean"

  export type ContentItemLiteral = 
    string | 
    number | 
    boolean;

  export interface ContentItemObject {
    value: ContentItemLiteral;
    type: ContentDisplayType;
    className?: string;
  }

  export type ContentItem = 
    ContentItemObject | 
    ContentItemLiteral;

  export type ContentRow = Record<string, ContentItem>;
  export type Content = ContentRow[];

  export interface TableItem {
    _key: string,
    value?: ContentItemLiteral,
    type?: ContentDisplayType
    _isMarkdown?: boolean,
    _isString?: boolean,
    _isNumber?: boolean,
    _isBoolean?: boolean,
    _isReference?: boolean,
    className?: string
  }

  export interface TableRow {
    _key: string;
    _items: Record<string, TableItem>;
  }

  export interface DisplayRow {
    _key: string,
    _cols: TableItem[]
  }

  export interface Header {
    name: string,
    label: string,
    width?: string
  }

  export default 
  class SfGpsDsAuNswTable 
  extends SfGpsDsElement {
    caption?: string;
    className: string;
    offset?: number;
    limit?: number;
    captionLocation?: CaptionLocation;
    isStriped?: boolean;
    isBordered?: boolean;

    get content(): Content | ContentRow | undefined;
    set content(value: Content | ContentRow);

    get headers(): Header[] | Header | undefined;
    set headers(value: Header[] | Header);

    // private

    _offset: PropertyAccessor<number>;
    _limit: PropertyAccessor<number>;
    _captionLocation: PropertyAccessor<CaptionLocation>;
    _isStriped: PropertyAccessor<boolean>;
    _isBordered: PropertyAccessor<boolean>;

    _content?: TableRow[];
    _contentOriginal: Content | ContentRow;
    _attributes: Set<string>;

    _headers?: Header[];
    _headersOriginal?: Header[] | Header;

    get _tableHeaders(): Header[];
    get _tableRows(): DisplayRow[] | undefined;

    get computedClassName(): any;
    get computedShowCaption(): boolean;
  }
}
