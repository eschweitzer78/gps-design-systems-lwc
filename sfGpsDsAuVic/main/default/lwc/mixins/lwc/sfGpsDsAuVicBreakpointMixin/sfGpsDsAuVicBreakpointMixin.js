import { track } from "lwc";

const SfGpsDsAuVicBreakpointMixin = (Base) =>
  class extends Base {
    @track clientWidth = 0;
    @track clientHeight = 0;

    breakpointsSmallToLarge = [
      { label: "xs", value: 0 },
      { label: "s", value: 576 },
      { label: "m", value: 768 },
      { label: "l", value: 992 },
      { label: "xl", value: 1200 },
      { label: "xxl", value: 1600 },
      { label: "xxxl", value: 2560 }
    ];

    get $breakpoint() {
      const result = {
        // For custom breakpoint logic.
        width: this.clientWidth,
        height: this.clientHeight
      };

      // Define breakpoints.
      this.breakpointsSmallToLarge.forEach((bp) => {
        result[bp.label] = this.clientWidth >= bp.value;
      });

      return result;
    }

    _updateDimensions() {
      // Cross-browser support as described in:
      // https://stackoverflow.com/questions/1248081
      this.clientWidth = Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0
      );
      this.clientHeight = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
      );
    }

    _breakpoint$updateDimensionsFunc;

    breakpointConnectedCallback() {
      if (typeof window !== "undefined") {
        this._breakpoint$updateDimensionsFunc =
          this._updateDimensions.bind(this);

        this._updateDimensions();
        window.addEventListener(
          "resize",
          this._breakpoint$updateDimensionsFunc,
          { passive: true }
        );
      }
    }

    breakpointDisconnectedCallback() {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "resize",
          this._breakpoint$updateDimensionsFunc
        );
      }
    }
  };

export default SfGpsDsAuVicBreakpointMixin;
