
declare module "c/sfGpsDsAuNswProgressIndicator" { 
  import type SfGpsDsElement from "c/sfGpsDsElement"; 
  import type { PropertyAccessor } from "c/sfGpsDsElement";

  export type Mode =
    "current" |
    "cumulative" |
    "label-only";

  export interface StepInfo {
    index: number,
    isActive: boolean,
    className: string
  }

  export default 
  class SfGpsDsAuNswProgressIndicator 
  extends SfGpsDsElement {
    className?: string;

    step?: number;
    of?: number;
    mode?: Mode;

    // private
    _step: PropertyAccessor<number>;
    _of: PropertyAccessor<number>;
    _mode: PropertyAccessor<Mode>

    get computedSteps(): StepInfo[];
    get computedClassName(): any;
    get computedShowBar(): boolean;
  }
}
