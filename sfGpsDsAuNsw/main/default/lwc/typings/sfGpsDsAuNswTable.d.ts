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

  export type ContentRow = { [key: string]: ContentItem };
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

  export type TableRow = 
    Record<Omit<string, '_key'>, TableItem> & {
      _key: string;
    };

  export interface DisplayRow {
    _key: string,
    _cols: TableRow[]
  }

  export interface Header {
    name: string,
    label: string,
    width?: string
  };

  export default 
  class SfGpsDsAuNswTable 
  extends SfGpsDsElement {
    caption: string;
    offset: number;
    limit: number;
    className: string;

    captionLocation: CaptionLocation;
    isStriped: boolean;
    isBordered: boolean;

    content;
    headers;

    // private

    _captionLocation: PropertyAccessor<CaptionLocation>;
    _isStriped: PropertyAccessor<boolean>;
    _isBordered: PropertyAccessor<boolean>;

    _content;
    _contentOriginal;
    _attributes: Set<string>;

    _headers: Header[];
    _headersOriginal;
  }
}
