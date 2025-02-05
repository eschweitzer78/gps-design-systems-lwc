import OmnistudioStepChartItems from "omnistudio/omniscriptStepChartItems";
import tmpl from "./sfGpsDsAuVicFormStepChartItemOsN.html";

export default class extends OmnistudioStepChartItems {
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
