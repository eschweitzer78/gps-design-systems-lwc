declare module "c/sfGpsDsLwc" {
  import type SfGpsDsElement, { 
    PropertyDefOptions, 
    PropertyAccessor 
  } from "c/sfGpsDsElement";
  import type { Link } from "c/sfGpsDsMarkdown";

  export interface LwcError {
    index: number,
    code: string,
    description: string
  }

  export interface PropertyDefMarkdownOptions 
  extends PropertyDefOptions {
    errorCode?: string,
    errorText?: string,
    defaultValue?: any
  }

  export default 
  class SfGpsDsLwc 
  extends SfGpsDsElement {
    // external

    getErrors(): LwcError[];

    // internal

    constructor(isLwrOnly?: boolean);
    
    readonly communityId: string;
    readonly communityBasePath: string;
    readonly isPreview: boolean;

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
