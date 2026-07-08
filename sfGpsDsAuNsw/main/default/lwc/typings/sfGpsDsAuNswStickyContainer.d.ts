declare module "c/sfGpsDsAuNswStickyContainer" {
  import type SfGpsDsElement from "c/sfGpsDsElement";

  export default
  class SfGpsDsAuNswStickyContainer
  extends SfGpsDsElement {
    className?: string;

    updateStickyBodyPadding(): void;

    // private

    _scId?: string;
    get computedId(): string;
    get computedClassName(): any;

    _onResizeObserver?: ResizeObserver;
  }
}
