declare module "c/sfGpsDsAuNswTags" { 
  import type SfGpsDsElement, { PropertyAccessor } from "c/sfGpsDsElement";
 
  import type { Link } from "c/sfGpsDsMarkdown";

  export interface TagLink extends Link {
    checked?: boolean;
    className?: string;
  }

  export interface TagChangeEvent extends CustomEvent {
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
    tags: TagLink[];

    // private

    _asCheckboxes: PropertyAccessor<boolean>;
    _tags: TagLink[];
    _tagsOriginal: Link[];

    readonly computedClassName: any;

    _idBase: string;

    readonly idBase: string;

    updateTags(): void;
  }
}
