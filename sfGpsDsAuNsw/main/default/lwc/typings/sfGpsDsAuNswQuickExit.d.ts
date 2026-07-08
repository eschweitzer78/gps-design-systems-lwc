import type { PropertyAccessor } from "c/sfGpsDsElement";

declare module "c/sfGpsDsAuNswQuickExit" {
  import type SfGpsDsElement from "c/sfGpsDsElement";

  export default
  class SfGpsDsAuNswQuickExit
  extends SfGpsDsElement {
    safeUrl: string;
    enableEsc?: boolean;
    enableCloak?: boolean;
    focusFirst?: boolean;
    className?: string;

    // private

    _enableEsc: PropertyAccessor<boolean>;
    _enableCloak: PropertyAccessor<boolean>;
    _focusFirst: PropertyAccessor<boolean>;
    _firstTabTarget?: HTMLElement;
    _describedById?: string;
    _handleKeydown?: (event: KeyboardEvent) => void;

    get i18n(): Record<string, string>;
    get isModalOpen(): boolean;
    get computedAriaDescribedById(): string;

    isEditable(el: HTMLElement): boolean;
    bindDoubleEsc(callback: () => void): void;
    unbindDoubleEsc(): void;
    setFocusFirst(): void;
    unsetFocusFirst(): void;
    handleClick(event: MouseEvent): void;
  }
}
