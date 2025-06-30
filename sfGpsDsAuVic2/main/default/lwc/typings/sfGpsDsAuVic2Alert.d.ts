import { PropertyAccessor } from "c/sfGpsDsElement";

declare module "c/sfGpsDsAuVic2Alert" {
  import type SfGpsDsElement from "c/sfGpsDsElement";
  import type ResizeHeightMixin from "c/sfGpsDsAuVic2ResizeHeightMixin"

  export type Variant = 
    "information" | 
    "warning" | 
    "error";


  export default 
  class SfGpsDsAuVic2Alert
  extends ResizeHeightMixin<SfGpsDsElement>(
    SfGpsDsElement, 
    "alert"
  ) {
    iconName: string;
    message: string;
    linkText: string;
    linkUrl: string;
    dismissed: boolean;
    alertId?: string;
    className?: string;

    variant?: Variant;
    isDismissible?: boolean;

    // private

    _variant: PropertyAccessor<Variant>;
    _isDismissible: PropertyAccessor<boolean>;

    get computedClassName(): any;
    get computedAriaLabelledBy(): string;
    get i18n(): Record<string, string>;
    get computedHasTextAndUrl(): boolean;

    handleClose(event: MouseEvent): void;
    handleResizeHeight(height: number): void;
  }
}