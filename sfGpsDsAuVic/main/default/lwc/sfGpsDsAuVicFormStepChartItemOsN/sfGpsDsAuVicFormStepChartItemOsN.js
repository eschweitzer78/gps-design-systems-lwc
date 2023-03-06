import OmnistudioStepChartItems from "omnistudio/omniscriptStepChartItems";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuVicFormStepChartItemOsN.html";

export default class SfGpsDsAuVicFormStepChartItemOsN extends OmnistudioStepChartItems {
  render() {
    return tmpl;
  }

  get computedStepClassName() {
    return computeClass({
      step: true,
      step_vertical: this.isVertical,
      step_horizontal: !this.isVertical
    });
  }

  get _currentStepIndexPlusOne() {
    return this.currentStepIndex + 1;
  }
}
