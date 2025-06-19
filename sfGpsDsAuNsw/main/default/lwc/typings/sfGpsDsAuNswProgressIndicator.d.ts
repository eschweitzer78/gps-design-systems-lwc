
declare module "c/sfGpsDsAuNswProgressIndicator" { 
  import type SfGpsDsElement, { PropertyAccessor } from "c/sfGpsDsElement";

  export type Mode =
    "current" |
    "cumulative" |
    "label-only";

  export interface StepInfo {
    index: number,
    isActive: boolean,
    className: string
  };

  export default 
  class SfGpsDsAuNswProgressIndicator 
  extends SfGpsDsElement {
    className: string;

    step: number;
    of: number;
    mode: Mode;

    // private
    _step: PropertyAccessor<number>;
    _of: PropertyAccessor<number>;
    _mode: PropertyAccessor<Mode>

    readonly computedSteps: StepInfo[];
    readonly computedClassName: any;
    readonly computedShowBar: boolean;
  }
}
