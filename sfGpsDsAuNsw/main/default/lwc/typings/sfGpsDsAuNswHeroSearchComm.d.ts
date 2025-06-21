declare module "c/sfGpsDsAuNswHeroSearchComm" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";
  import type { NavigationMixin } from "lightning/navigation";
  import type { PropertyAccessor } from "c/sfGpsDsElement";
  import type { Link } from "c/sfGpsDsMarkdown";

  export type ButtonStyle = "icon" | "text";

  export default 
  class SfGpsDsAuNswHeroSearchComm 
  extends NavigationMixin<SfGpsDsLwc>(SfGpsDsLwc) {
    title: string;
    intro?: string;
    image?: string;
    className?: string;

    srLabel: string;
    srSearchButtonLabel: string;
    showLabel?: boolean;
    bStyle?: ButtonStyle;
    links?: string;

    // private

    _links: PropertyAccessor<Link[]>;

    get computedStyle(): string;

    handleSearch(event: CustomEvent): void;
  }
}
