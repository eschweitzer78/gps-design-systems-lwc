import OmnistudioStepChartItem from "c/sfGpsDsFormStepChartItemOsN";
import tmpl from "./sfGpsDsAuVicFormStepChartItemOsN.html";

export default class extends OmnistudioStepChartItem {
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

  connectedCallback() {
    super.connectedCallback();

    /* original code adds assistive text that has the current step label and status
       event though the step label is already visible */
    const allCustomLabels = this.scriptHeaderDef.allCustomLabels;
    this._labelInProgress = allCustomLabels.OmniStepChartInProgress;
    this._labelCompleted = allCustomLabels.OmniStepChartCompleted;
    this._labelUntouched = allCustomLabels.OmniStepChartUntouched;
    this._labelIncomplete = allCustomLabels.OmniStepChartIncomplete;
  }

  render() {
    return tmpl;
  }
}
