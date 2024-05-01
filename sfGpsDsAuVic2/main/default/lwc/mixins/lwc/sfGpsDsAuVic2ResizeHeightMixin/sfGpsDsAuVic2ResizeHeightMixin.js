let ResizeHeightMixin = (Base, resizeRef) =>
  class extends Base {
    _resizeObserver;
    _handleResizeHeight;
    renderedCallback() {
      if (super.renderedCallback) {
        super.renderedCallback();
      }

      if (!this._resizeObserver) {
        this._resizeObserver = new ResizeObserver((entries) => {
          /* eslint-disable-next-line @lwc/lwc/no-async-operation */
          window.requestAnimationFrame(() => {
            this.handleResizeHeight(entries[0].contentRect.height);
          });
        });

        this._handleResizeHeight = this.handleResizeHeight.bind(this);
        this._resizeObserver.observe(this.refs[resizeRef]);

        window.addEventListener("resize", (entries) => {
          /* eslint-disable-next-line @lwc/lwc/no-async-operation */
          window.requestAnimationFrame(() => {
            if (Array.isArray(entries) && entries.length) {
              this._handleResizeHeight(entries[0].contentRect.height);
            }
          });
        });
      }
    }

    disconnectedCallback() {
      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }

      this._resizeObserver.disconnect();
      window.removeEventListener("resize", this._handleResizeHeight);
    }

    // eslint-disable-next-line no-unused-vars
    handleResizeHeight(height) {
      // override as required
      return false;
    }
  };

export default ResizeHeightMixin;
