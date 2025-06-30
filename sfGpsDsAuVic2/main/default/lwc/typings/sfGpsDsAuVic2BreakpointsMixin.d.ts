declare module "c/sfGpsDsAuVic2BreakpointsMixin" {
  import type { LightningElement } from "lwc";

  export interface BreakpointsItf<T> {
    bpGreaterOrEqual(bpName: T): boolean;
    bpGreater(bpName: T): boolean;
    bpSmallerOrEqual(bpName: T): boolean;
    bpSmaller(bpName: T): boolean;
    bpBetween(bpName1: T, bpName2: T): boolean;

    handleResize(): void;
  }

  export type Breakpoint = "xs" | "s" | "m" | "l" | "xl";
  export type Breakpoints<T extends string> = Record<T, number>;

  export default 
  function BreakpointsMixin<T extends LightningElement>(
    base: new (...args: any[]) => LightningElement,
    bp?: Breakpoints<Breakpoint>
  ): new (...args: any[]) => BreakpointsItf<Breakpoint> & T;
}