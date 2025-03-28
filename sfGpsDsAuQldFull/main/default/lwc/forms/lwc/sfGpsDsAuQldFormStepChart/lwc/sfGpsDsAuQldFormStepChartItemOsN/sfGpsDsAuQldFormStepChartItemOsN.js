import OmnistudioStepChartItems from "c/sfGpsDsFormStepChartItemOsN";
import tmpl from "./sfGpsDsAuQldFormStepChartItemOsN.html";

export default class extends OmnistudioStepChartItems {
  /* computed */

  get computedStepClassName() {
    return {
      step: true,
      step_vertical: this.isVertical,
      step_horizontal: !this.isVertical
    };
  }

  get _currentStepIndexPlusOne() {
    return this.currentStepIndex + 1;
  }

  /* lifecycle */

  render() {
    return tmpl;
  }
}
