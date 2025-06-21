declare module "c/sfGpsDsAuNswTags" { 
  import type SfGpsDsElement from "c/sfGpsDsElement"; 
  import type { PropertyAccessor } from "c/sfGpsDsElement"; 
  import type { Link } from "c/sfGpsDsMarkdown";

  export interface TagLink 
  extends Link {
    checked?: boolean;
    className?: any;
  }

  export interface DisplayTagLink
  extends TagLink {
    key: string;
  }

  export interface TagChangeEvent 
  extends CustomEvent {
    detail: {
      index: number,
      checked: boolean
    }
  }

  export default 
  class SfGpsDsAuNswTags 
  extends SfGpsDsElement {
    className: string;
    asCheckboxes: boolean;

    get tags(): TagLink[];
    set tags(value: TagLink[]);

    // private

    _asCheckboxes: PropertyAccessor<boolean>;
    _tags: DisplayTagLink[];
    _tagsOriginal: Link[];

    get computedClassName(): any;

    _idBase?: string;
    get idBase(): string;

    updateTags(): void;
  }
}
