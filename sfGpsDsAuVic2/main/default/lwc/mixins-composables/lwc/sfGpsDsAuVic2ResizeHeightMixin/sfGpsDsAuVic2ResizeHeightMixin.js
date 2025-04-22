import { isArray } from "c/sfGpsDsHelpers";

const RESIZE_OBSERVER = Symbol("_resizeObserver");
const HANDLE_RESIZE_HEIGHT = Symbol("_handleResizeHeight");

const ResizeHeightMixin = (Base, resizeRef) =>
  class extends Base {
    [RESIZE_OBSERVER];
    [HANDLE_RESIZE_HEIGHT];

    renderedCallback() {
      if (super.renderedCallback) {
        super.renderedCallback();
      }

      if (!this[RESIZE_OBSERVER]) {
        this[RESIZE_OBSERVER] = new ResizeObserver((entries) => {
          /* eslint-disable-next-line @lwc/lwc/no-async-operation */
          window.requestAnimationFrame(() => {
            this[HANDLE_RESIZE_HEIGHT](entries[0].contentRect.height);
          });
        });

        this[HANDLE_RESIZE_HEIGHT] = this.handleResizeHeight.bind(this);
        this[RESIZE_OBSERVER].observe(this.refs[resizeRef]);

        window.addEventListener("resize", (entries) => {
          /* eslint-disable-next-line @lwc/lwc/no-async-operation */
          window.requestAnimationFrame(() => {
            if (isArray(entries) && entries.length) {
              this[HANDLE_RESIZE_HEIGHT](entries[0].contentRect.height);
            }
          });
        });
      }
    }

    disconnectedCallback() {
      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }

      this[RESIZE_OBSERVER]?.disconnect();

      const handler = this[HANDLE_RESIZE_HEIGHT];
      if (handler) {
        window.removeEventListener("resize", handler);
      }
      this[HANDLE_RESIZE_HEIGHT] = null;
    }

    // eslint-disable-next-line no-unused-vars
    handleResizeHeight(height) {
      // override as required
      return false;
    }
  };

export default ResizeHeightMixin;
