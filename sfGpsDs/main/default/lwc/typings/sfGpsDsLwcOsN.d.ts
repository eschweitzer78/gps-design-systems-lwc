declare module "c/sfGpsDsLwcOsN" {
  import type SfGpsDsElementOs from "c/sfGpsDsElementOs";
  import type { 
    PropertyDefOptions, 
    PropertyAccessor 
  } from "c/sfGpsDsElementOs";
  import type { 
    Link 
  } from "c/sfGpsDsMarkdownOs";
  import type { 
    OmniscriptBaseMixin
  } from "omnistudio/omniscriptBaseMixin";

  export interface LwcError {
    index: number,
    code: string,
    description: string
  }

  export interface PropertyDefMarkdownOptions 
  extends PropertyDefOptions<string> {
    errorCode?: string,
    errorText?: string,
    defaultValue?: any
  }

  export default 
  class SfGpsDsLwcOs 
  extends OmniscriptBaseMixin<SfGpsDsElementOs>(
    SfGpsDsElementOs
  ) {
    // external

    getErrors(): LwcError[] | undefined;

    // internal

    get communityId(): string;
    get communityBasePath(): string;
    get isPreview(): boolean;

    _sfGpsDsErrors?: LwcError[];
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

    static PACKAGE_NAME: string;
  }
}