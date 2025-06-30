declare module "c/sfGpsDsAuVic2StepNavigationMixin" {
  export interface StepNavigationItf {
    get stepRange(): number;
    get isFirstStep(): boolean;
    get isLastStep(): boolean;
    get visibleSteps(): (number | null)[]

    updateStep(step: number): void;
    getSteps(): {
      hasFirst: boolean;
      hasLast: boolean;
      start: number;
      end: number;
    }
  }

  export default 
  function StepNavigationMixin<T>(
    base: new (...args: any[]) => object,
    currentStepProp: string,
    surroundingStepsProp: string,
    totalStepsProp: string
  ): new (...args: any[]) => StepNavigationItf & T;
}