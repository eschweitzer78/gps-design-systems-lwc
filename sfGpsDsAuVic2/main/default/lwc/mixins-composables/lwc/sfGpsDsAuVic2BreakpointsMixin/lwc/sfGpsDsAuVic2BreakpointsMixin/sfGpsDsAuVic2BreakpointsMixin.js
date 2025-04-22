import { track } from "lwc";

export const bpMin = {
  xs: 0,
  s: 576,
  m: 768,
  l: 992,
  xl: 1200
};

export const BreakpointsMixin = (Base, bp = bpMin) =>
  class extends Base {
    @track _clientWidth;
    @track _clientHeight;

    bpGreaterOrEqual(bpName) {
      return bp ? this._clientWidth >= bp[bpName] : false;
    }

    bpGreater(bpName) {
      return bp ? this._clientWidth > bp[bpName] : false;
    }

    bpSmallerOrEqual(bpName) {
      return bp ? this._clientWidth <= bp[bpName] : false;
    }

    bpSmaller(bpName) {
      return bp ? this._clientWidth < bp[bpName] : false;
    }

    bpBetween(bpName1, bpName2) {
      const width = this._clientWidth;
      return bp ? width >= bp[bpName1] && width < bp[bpName2] : false;
    }

    handleResize() {
      // override as required
      this._clientWidth = document.documentElement.clientWidth;
      this._clientHeight = document.documentElement.clientHeight;
    }

    _handleResize;

    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }

      this.handleResize();
      this._handleResize = this.handleResize.bind(this);
      window.addEventListener("resize", this._handleResize);
    }

    disconnectedCallback() {
      window.removeEventListener("resize", this._handleResize);
      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }
    }
  };
