const Breakpoint = (base) =>
  class extends base {
    breakpoint$clientWidth = 0;
    breakpoint$clientHeight = 0;
    breakpoint$breakpointsSmallToLarge = [
      {
        label: "xs",
        value: 0
      },
      {
        label: "s",
        value: 576
      },
      {
        label: "m",
        value: 768
      },
      {
        label: "l",
        value: 992
      },
      {
        label: "xl",
        value: 1200
      },
      {
        label: "xxl",
        value: 1600
      },
      {
        label: "xxxl",
        value: 2560
      }
    ];

    get $breakpoint() {
      const result = {
        // For custom breakpoint logic.
        width: this.breakpoint$clientWidth,
        height: this.breakpoint$clientHeight
      };

      // Define breakpoints.
      this.breakpoint$breakpointsSmallToLarge.forEach((bp) => {
        result[bp.label] = this.clientWidth >= bp.value;
      });

      return result;
    }

    _breakpoint$updateDimensions() {
      // Cross-browser support as described in:
      // https://stackoverflow.com/questions/1248081
      this.breakpoint$clientWidth = Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0
      );
      this.breakpoint$clientHeight = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
      );
    }

    _breakpoint$updateDimensionsFunc;

    breakpoint$connectedCallback() {
      if (typeof window !== "undefined") {
        this._breakpoint$updateDimensionsFunc =
          this._breakpoint$updateDimensions.bind(this);
        this._breakpoint$updateDimensions();
        window.addEventListener(
          "resize",
          this._breakpoint$updateDimensionsFunc,
          {
            passive: true
          }
        );
      }
    }

    breakpoint$disconnectedCallback() {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "resize",
          this._breakpoint$updateDimensionsFunc
        );
      }
    }
  };

export default Breakpoint;
