import { PropertyAccessor } from "c/sfGpsDsElement";

declare module "c/sfGpsDsAuNswQuickExit" { 
  import type SfGpsDsElement from "c/sfGpsDsElement"; 

  export default 
  class SfGpsDsAuNswQuickExit
  extends SfGpsDsElement {
    safeUrl?: string;
    enableEsc?: boolean;
    enableCloak?: boolean;
    focusFirst?: boolean;
    className?: string;

    // private

    _enableEsc: PropertyAccessor<boolean>;
    _enableCloak: PropertyAccessor<boolean>;
    _firstFocus: PropertyAccessor<boolean>; 
    _firstTabTarget?: HTMLElement;

    static _firstTabHandlerBound?: EventListener;
    static _firstTabHandled: boolean;

    get i18n(): Record<string, string>;
    get isModalOpen(): boolean;
    get computedAriaDescribedById(): string;

    isEditable(el: HTMLElement): boolean;
    _handleKeydown?: EventListener;
    bindDoubleEsc(callback: Function): void;
    unbindDoubleEsc(): void;
    setFocusFirst(): void;
    unsetFocusFirst(): void;
    handleClick(event: MouseEvent): void;
  }
}
