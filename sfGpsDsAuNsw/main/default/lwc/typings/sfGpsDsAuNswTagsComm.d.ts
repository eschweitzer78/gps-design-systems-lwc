declare module "c/sfGpsDsAuNswTagsComm" { 
  import type SfGpsDsLwc from "c/sfGpsDsLwc"; 
  import type { PropertyAccessor } from "c/sfGpsDsElement"; 
  import type { NavigationMixin } from "lightning/navigation";
  import type { TagLink, TagChangeEvent } from "c/sfGpsDsAuNswTags";

  export default 
  class SfGpsDsAuNswTagsComm 
  extends NavigationMixin<SfGpsDsLwc>(SfGpsDsLwc) {
    asCheckboxes: boolean;
    className?: string;
    links?: string;

    // private

    _links: PropertyAccessor<TagLink[]>

    handleChange(
      event: TagChangeEvent
    ): void;
  }
}
