import { track } from "lwc";

let WindowSizeMixin = (Base) =>
  class extends Base {
    @track _windowSize;

    _handleWindowResize = () => {
      this._windowSize = {
        width: window.innerWidth,
        height: window.innerHeight
      };
    };

    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }

      this._handleWindowResize();
      window.addEventListener("resize", this._handleWindowResize);
    }

    disconnectedCallback() {
      window.removeEventListener("resize", this._handleWindowResize);

      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }
    }
  };

export default WindowSizeMixin;
