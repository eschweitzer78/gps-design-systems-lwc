declare module "c/sfGpsDsHelpers" {
  export type DateStyle = "short" | "medium" | "full" | "long";
  export type MonthFormat = "long" | "short" | "numeric" | "2-digit" | "narrow";
  export type ClassConfig = Record<string, any> | string[];

  export function isDate(
    value: any)
    : boolean;
  export function isValidDate(
    obj: any)
    : boolean;
  export function parseIso8601(
    date: string
  ): Date;
  export function formatDate(
    date: Date, 
    dateStyle?: DateStyle, 
    userLocale?: string
  ): string;
  export function getMonthNames(
    userLocale?: string, 
    format?: MonthFormat
  ): string[];
  export function formatDateRange(
    dateStart: Date, 
    dateEnd: Date, 
    dateStyle?: DateStyle, 
    userLocale?: string
  ): string;
  export function getUserLocale(
    useFallbackLocale?: boolean, 
    fallbackLocale?: string
  ): string;
  export function getUserLocales(
    useFallbackLocale?: boolean, 
    fallbackLocale?: string
  ): string[];

  export function replaceInnerHtml(
    element: Element, 
    markup: string | undefined | null
  ): void;
  export function htmlDecode(
    markup: string | undefined | null
  ): string | null;
  export function getFirstChild(
    markup: string | undefined | null
  ): Element | null;
  export function computeClass(
    config: ClassConfig, 
    joinChar?: string
  ): string | null;
  export function uniqueClassesFromString(
    classNames?: string
  ): string;
  export function isRTL(): boolean;
  export function getCssPropertyValue(
    propertyName: string
  ): string | null;

  export type HtmlSanitizerPlugin = {
    selector: string,
    process: (node: Node, parse: DOMParser) => Node
  }
  export type HtmlSanitizerClass = {
    sanitize(
      input: string, 
      plugIns?: HtmlSanitizerPlugin[]
    ): string
  }
  export const HtmlSanitizer: HtmlSanitizerClass;

  export function withModifiers(
    fn: Function, 
    modifiers: string[]
  ): any;
  export function withKeys(
    fn: (event: Event) => any, 
    modifiers: string[]
  ): any;
  export function patchEvent(
    el: Element, 
    rawName: string, 
    prevValue: Function | Function[] | null, 
    nextValue: Function | Function[] | unknown
  ): void;

  export function deepCopy(
    obj: any
  ): any;
  export function arraysEqual(
    array1: any[] | null, 
    array2: any[] | null
  ): boolean;
  export function debounce(
    func: Function, 
    delay: number, 
    options?: { 
      leading?: boolean 
    }): (...args: any[]) => void;
  export function once(
    func: Function
  ): (...args: any[]) => void;
  export function invokeArrayFns (
    fns: Function[], 
    ...args: any[]
  ): any;
  export function hasChanged(
    value: any, 
    oldValue: any
  ): boolean;

  export function nextTick(
    fn: (value: void) => void | PromiseLike<void>
  ): Promise<void>;

  export function styleToString(styleObj: object | string[]): string;
  
  export function normaliseBoolean(
    value: any, 
    options?: {
      acceptString?: boolean,
      fallbackValue?: boolean
  }): boolean;
  export function normaliseArray(
    value: any, 
    options?: {
      arraySingleton?: boolean
  }): any[];
  export function normaliseAriaAttribute(
    value: any
  ): string | null;
  export function normaliseString(
    value: any, 
    options?: {
      fallbackValue?: string,
      validValues?: string[] | Record<string, any>,
      toLowerCase?: boolean,
      trim?: boolean,
      returnObjectValue?: boolean
  }): string;
  export function normaliseInteger(
    value: any, 
    options?: {
      fallbackValue?: number,
      min?: number,
      max?: number,
      acceptString?: boolean
  }): number;

  export function formatTemplate(
    template: string, 
    values?: Record<string, any>, 
    options?: {
    sep?: string
  }): string | null;
  export function safeEqualsIgnoreCase(
    a: string, 
    b: string
  ): boolean;
  export function truncateText(
    text: string, 
    stop: number, 
    clamp?: string
  ): string;
  export const camelize: (str: string) => string;
  export const hyphenate: (str: string) => string;
  export const capitalize: (str: string) => string;
  export const toHandlerKey: (str: string) => string;
  
  export const hasOwn: (val: any, key: any) => boolean;
  export const toTypeString: (value: any) => string;
  export const toRawType: (value: any) => string;
  export const isPlainObject: (val: any) => boolean;

  export const isArray: (val: any) => boolean ;
  export const isMap: (val: any) => boolean ;
  export const isSet: (val: any) => boolean;
  export const isRegEx: (val: any) => boolean;
  export const isFunction: (val: any) => boolean;
  export const isString: (val: any) => boolean;
  export const isSymbol: (val: any) => boolean;
  export const isObject: (val: any) => boolean;
  export const isPromise: (val: any) => boolean;
  export const def: (obj: any, key: any, value: any, writable?: boolean) => any;
  export function toNumber(val: any): number;
  export function toArray<T = any>(value: T): T[];

  export function isRelativeUrl(
    url: string
  ): boolean;
  export function isExternalUrl(
    url: string
  ): boolean;
  export function isAnchorLink(
    url: string
  ): boolean;
  export function getAnchorLinkName(
    str: string
  ): string;
  export function decodeSpecialCharacters(
    html: string
  ): string | null;

  export function uniqueId(
    prefix?: string
  ): string;
  export function isIPadPro(): boolean;
  export function isMacPlatform(): boolean;
}
