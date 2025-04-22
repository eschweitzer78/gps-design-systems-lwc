let StepNavigationMixin = (
  Base,
  currentStepProp,
  surroundingStepsProp,
  totalStepsProp
) =>
  class extends Base {
    get stepRange() {
      return this[surroundingStepsProp] * 2 + 1;
    }

    get isFirstStep() {
      return this[currentStepProp] === 1;
    }

    get isLastStep() {
      return this[currentStepProp] === this[totalStepsProp];
    }

    updateStep(step) {
      this[currentStepProp] = step;
    }

    getSteps() {
      const activeStep = this[currentStepProp];
      const stepRange = this.stepRange;
      const totalStepsRef = this[totalStepsProp];

      let start = Math.max(1, Math.round(activeStep - stepRange / 2));
      const hasFirst = this[surroundingStepsProp] > 2 && start > 1;
      const end = Math.min(start + stepRange - 1, totalStepsRef);
      const hasLast = this[surroundingStepsProp] > 2 && end < totalStepsRef;

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
      const steps = [];
      const { hasFirst, hasLast, start, end } = this.getSteps();
      const totalStepsRef = this[totalStepsProp];

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

export default StepNavigationMixin;
