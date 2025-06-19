declare module "c/sfGpsDsAuNswHeroSearch" {
  import type SfGpsDsElement from "c/sfGpsDsElement"; 
  import type { PropertyAccessor } from "c/sfGpsDsElement";
  import type { Link } from "c/sfGpsDsMarkdown";

  export type ButtonStyle = "icon" | "text";

  export default 
  class SfGpsDsAuNswHeroSearch 
  extends SfGpsDsElement {
    title: string;
    intro: string;
    links: Link[];
    value: string;
    className: string;

    searchLabel: string;
    searchButtonLabel: string;

    button: ButtonStyle;
    label: boolean;

    // private

    _button: PropertyAccessor<ButtonStyle>;
    _label: PropertyAccessor<boolean>;

    readonly computedClassName: any;
    readonly computedLabelClassName: any;
    readonly computedInputGroupClassName: any;
    readonly computedHasTextButton: boolean;
    readonly computedHasIconButton: boolean;

    handleChange(event: InputEvent): void;
    handleKeyUp(event: KeyboardEvent): void;
    handleClick(event: MouseEvent): void;
  }
}
