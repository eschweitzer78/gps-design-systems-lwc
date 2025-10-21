declare module "c/sfGpsDsAuNswButtonMenu" {
  import type SfGpsDsElement from "c/sfGpsDsElement"; 
  import type { PropertyAccessor } from "c/sfGpsDsElement";
  import type { Link } from "c/sfGpsDsMarkdown";
  import type OnClickOutside from "c/sfGpsDsOnClickOutside";

  export type MenuPosition = "left" | "right";
  export type Variant = "padded" | "unpadded";

  export default 
  class SfGpsDsAuNswButtonMenu 
  extends SfGpsDsElement {
    label?: string;
    iconName?: string;
    buttonAriaLabel?: string;
    menuPosition: MenuPosition;
    items?: Link[];
    preventDefault?: boolean;
    className?: string;

    toggle(focus?: boolean): void;
    close(focus?: boolean): void;
    open(focus?: boolean): void;
    focus(): void;
    blur(): void;

    // private

    _menuPosition: PropertyAccessor<MenuPosition>;
    _preventDefault: PropertyAccessor<Boolean>;
    _isOpen: boolean;
    _onClickOutside?: OnClickOutside;

    get computedButtonAriaLabel(): string;
    get computedClassName(): any;
    get computedButtonClassName(): any;
    get computedDropdownClassName(): any;
    get computedIsClosed(): boolean;
    get computedItems(): Array<Link & { index: number, key: string }>;

    handleButtonClick(event: MouseEvent): void;
    handleButtonKeydown(event: KeyboardEvent): void;
    handleItemClick(event: MouseEvent): void;
    handleItemKeydown(event: KeyboardEvent): void;
  }
}
