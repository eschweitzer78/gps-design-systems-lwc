import type {
  StepNavigationItf
} from "c/sfGpsDsAuVic2StepNavigationMixin";

export default 
function StepNavigationMixin<T>(
  base: new (...args: any[]) => object,
  currentStepProp: string,
  surroundingStepsProp: string,
  totalStepsProp: string
): new (...args: any[]) => StepNavigationItf & T {
  // @ts-ignore
  return class StepNavigationMixin extends base {
    get stepRange() {
      // @ts-ignore
      return this[surroundingStepsProp] * 2 + 1;
    }

    get isFirstStep() {
      // @ts-ignore
      return this[currentStepProp] === 1;
    }

    get isLastStep() {
      // @ts-ignore
      return this[currentStepProp] === this[totalStepsProp];
    }

    updateStep(step: number) {
      // @ts-ignore
      this[currentStepProp] = step;
    }

    getSteps() {
      // @ts-ignore
      const activeStep = this[currentStepProp];
      const stepRange = this.stepRange;
      // @ts-ignore
      const totalStepsRef = this[totalStepsProp];

      let start = Math.max(1, Math.round(activeStep - stepRange / 2));
      const hasFirst = 
        // @ts-ignore
        this[surroundingStepsProp] > 2 && 
        start > 1;
      const end = Math.min(start + stepRange - 1, totalStepsRef);
      const hasLast = 
        // @ts-ignore
        this[surroundingStepsProp] > 2 && 
        end < totalStepsRef;

      if (end - start + 1 < stepRange) {
        start = Math.max(1, end - stepRange + 1);
      }

      return {
        hasFirst,
        hasLast,
        start: hasFirst ? start + 1 : start,
        end: hasLast ? end - 1 : end
      };
    }

    get visibleSteps() {
      const steps: (number | null)[] = [];
      const { hasFirst, hasLast, start, end } = this.getSteps();
      // @ts-ignore
      const totalStepsRefAny = parseInt(this[totalStepsProp], 10);
      const totalStepsRef= isNaN(totalStepsRefAny) ? 0 : totalStepsRefAny;

      if (hasFirst) steps.push(1);

      for (let i = start; i <= end; i += 1) {
        // Check if we need to display this step as a truncated divider i.e …
        const firstSpacer = i === start && hasFirst && i > 2;
        const lastSpacer = i === end && hasLast && i < totalStepsRef - 1;

        steps.push(firstSpacer || lastSpacer ? null : i);
      }

      if (hasLast) steps.push(totalStepsRef);

      return steps;
    }
  };
}
