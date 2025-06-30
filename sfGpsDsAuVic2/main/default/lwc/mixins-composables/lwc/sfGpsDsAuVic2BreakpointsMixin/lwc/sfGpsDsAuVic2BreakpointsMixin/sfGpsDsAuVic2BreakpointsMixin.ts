import { 
  LightningElement, 
  track 
} from "lwc";

interface BreakpointsItf<T> {
  bpGreaterOrEqual(bpName: T): boolean;
  bpGreater(bpName: T): boolean;
  bpSmallerOrEqual(bpName: T): boolean;
  bpSmaller(bpName: T): boolean;
  bpBetween(bpName1: T, bpName2: T): boolean;

  handleResize(): void;
}

type Breakpoint = "xs" | "s" | "m" | "l" | "xl";
type Breakpoints<T extends string> = Record<T, number>;

export const bpMin: Breakpoints<Breakpoint> = {
  xs: 0,
  s: 576,
  m: 768,
  l: 992,
  xl: 1200
};

export default 
function BreakpointsMixin<T extends LightningElement>(
  base: new (...args: any[]) => LightningElement,
  bp: Breakpoints<Breakpoint> = bpMin
): new (...args: any[]) => BreakpointsItf<Breakpoint> & T {
  // @ts-ignore
  return class BreakpointsMixin extends base {
    // @ts-ignore
    @track 
    _clientWidth = 0;

    // @ts-ignore
    @track 
    _clientHeight = 0;

    bpGreaterOrEqual(bpName: Breakpoint) {
      return bp ? this._clientWidth >= bp[bpName] : false;
    }

    bpGreater(bpName: Breakpoint) {
      return bp ? this._clientWidth > bp[bpName] : false;
    }

    bpSmallerOrEqual(bpName: Breakpoint) {
      return bp ? this._clientWidth <= bp[bpName] : false;
    }

    bpSmaller(bpName: Breakpoint) {
      return bp ? this._clientWidth < bp[bpName] : false;
    }

    bpBetween(bpName1: Breakpoint, bpName2: Breakpoint) {
      const width = this._clientWidth;
      return bp ? width >= bp[bpName1] && width < bp[bpName2] : false;
    }

    handleResize(): void {
      // override as required
      this._clientWidth = document.documentElement.clientWidth;
      this._clientHeight = document.documentElement.clientHeight;
    }

    _handleResize?: EventListener;

    connectedCallback() {
      super.connectedCallback?.();

      this.handleResize();
      this._handleResize = this.handleResize.bind(this);
      window.addEventListener("resize", this._handleResize);
    }

    disconnectedCallback() {
      if (this._handleResize)
        window.removeEventListener("resize", this._handleResize);

      super.disconnectedCallback?.();
    }
  }
}
