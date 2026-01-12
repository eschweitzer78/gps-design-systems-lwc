declare module "c/sfGpsDsLwc" {
  import type SfGpsDsElement from "c/sfGpsDsElement";
  import type { 
    PropertyDefOptions, 
    PropertyAccessor 
  } from "c/sfGpsDsElement";
  import type { 
    Link 
  } from "c/sfGpsDsMarkdown";

  export interface LwcError {
    index: number,
    code: string,
    description: string
  }

  export interface PropertyDefMarkdownOptions 
  extends PropertyDefOptions<string> {
    errorCode?: string,
    errorText?: string,
    defaultValue?: any,
    parseFunction?: (markdown: string) => string
  }

  export default 
  class SfGpsDsLwc 
  extends SfGpsDsElement {
    // external

    getErrors(): LwcError[] | undefined;

    // internal

    constructor(isLwrOnly?: boolean);
    
    get communityId(): string;
    get communityBasePath(): string;
    get isPreview(): boolean;

    _sfGpsDsErrors: LwcError[];
    addError(code: string, description: string): void;
    clearErrors(): void;

    defineMarkdownContentProperty(
      propertyName: string, 
      options?: PropertyDefMarkdownOptions
    ): PropertyAccessor<string>;

    defineMarkdownUnpackedFirstPProperty(
      propertyName: string, 
      options?: PropertyDefMarkdownOptions
    ): PropertyAccessor<string>;

    defineMarkdownFirstLinkProperty<T = Link>(
      propertyName: string, 
      options?: PropertyDefMarkdownOptions
    ): PropertyAccessor<T>;

    defineMarkdownLinksProperty<T = Link>(
      propertyName: string, 
      options?: PropertyDefMarkdownOptions
    ): PropertyAccessor<T[]>;
  }
}
