import { api, track, LightningElement } from "lwc";
import {
  handleMergeField,
  RUN_MODES
} from "c/sfGpsDsOsrtOmniscriptInternalUtils";
import { replaceUrlHost } from "c/sfGpsDsOsrtOmniscriptRestApi";

import tmpl from "./omniscriptStepChart_slds.html";
import tmpl_nds from "./omniscriptStepChart_nds.html";

/**
 * @module ns/omniscriptStepChart
 * @extends LightningElement
 * @typicalname omniscriptStepChart
 */
export default class OmniScriptStepChart extends LightningElement {
  _jsonDef = {};
  _tempStepProgressValue = -1;
  _tempStepsLength = 0;
  _props = {};
  _currPlacement = "";
  _jsonData;
  _numOfSteps = 0;
  _lastExecutedStepIndex = 0;
  _progressBarContainerComp;
  _progressBarComp;

  /**
   * @scope public (api)
   * @type {String}
   * @description Stores theme layout.
   */
  @api layout;

  /**
   * @scope public (api)
   * @type {String}
   * @description Flag to determine where component is run.
   */
  @api runMode = RUN_MODES.PLAYER;

  /**
   * @scope private (track)
   * @type {String}
   * @description Step instructions for a specific step.
   */
  @track stepInstruction;

  /**
   * @scope private (track)
   * @type {Integer}
   * @description Step progress value.
   */
  @track stepProgressValue = 0;

  /**
   * @scope private (track)
   * @type {Boolean}
   * @description Identifies step chart is horizontal or vertical.
   */
  @track isVertical = true;

  /**
   * @scope private (track)
   * @type {Integer}
   * @description Stores current index
   */
  @track currentIndex = 0;

  /**
   * @scope private (track)
   * @type {Integer}
   * @description Stores last step index.
   */
  @track lastStepIndex = 0;

  /**
   * @scope private (track)
   * @type {Integer}
   * @description Stores first visible step index.
   */
  @track firstVisibleStepIndex = 0;

  /**
   * @scope public (api)
   * @type {Object}
   * @description Gets and sets Omniscript JSON definition.
   */
  @api
  get jsonDef() {
    return this._jsonDef;
  }
  set jsonDef(jsonDef) {
    if (jsonDef) {
      this._jsonDef = jsonDef;
      this.currentIndex = jsonDef.asIndex;
      this.handleJsonData(jsonDef.asIndex, jsonDef.response);
      this.calculateProgressBar(jsonDef.asIndex);
    }
  }

  /**
   * @scope public (api)
   * @type {Object}
   * @description Gets and sets Omniscript data JSON.
   */
  @api
  get jsonData() {
    return this._jsonData;
  }
  set jsonData(jsonData) {
    if (jsonData && this.jsonDef.asIndex >= 0) {
      this.handleJsonData(this.jsonDef.asIndex, jsonData);
    }
  }

  /**
   * @scope public (api)
   * @type {Object}
   * @description Script header definitions and globally shared variables.
   */
  @api
  get scriptHeaderDef() {
    return this._scriptHeaderDef;
  }
  set scriptHeaderDef(headerDef) {
    if (headerDef) {
      this._scriptHeaderDef = headerDef;

      if (this.jsonDef && this.jsonDef.response && this.jsonDef.asIndex >= 0) {
        this.handleJsonData(this.jsonDef.asIndex, this.jsonDef.response);
      }
    }
  }

  /**
   * @scope public (api)
   * @type {Object}
   * @description Evaluates the step chart properties. Only applicable when theme = slds.
   */
  @api
  get props() {
    return this._props;
  }
  set props(props) {
    if (props && this._theme !== "nds") {
      this._props = props;
      this.isVertical = this._props.layout === "vertical";
      this.applyPlacement();
    }
  }

  get stepDef() {
    return this.jsonDef.children.filter((step) => {
      const isStep = step.isStep || step.type === "Step" || false;
      return isStep && step.bShow !== false;
    });
  }

  get progressBarStyle() {
    return `width: ${this.stepProgressValue}%`;
  }

  /**
   * @scope private
   * @description Overwrites native connectedCallback.
   * @returns {Void}
   */
  connectedCallback() {
    if (this.jsonDef) {
      this._theme = this.layout === "newport" ? "nds" : "slds";
      this.applyPlacement();
      this.calculateStepIndex(this.jsonDef.children, this.isVertical);
    }
    this.addEventListener("omniaddclasslist", this.handleAddClassList);
    this.addEventListener("omniremoveclasslist", this.handleRemoveClassList);
  }

  disconnectedCallback() {
    this.removeEventListener("omniaddclasslist", this.handleAddClassList);
    this.removeEventListener("omniremoveclasslist", this.handleRemoveClassList);
  }

  /**
   * @scope private
   * @description Calculates the last step index for the vertical step chart to ensure that css applied psuedo-classes
   *              for the progress bar are synced.
   * @param {Object} jsonDef
   * @param {Boolean} isVertical
   * @returns {Void}
   */
  calculateStepIndex(jsonDef, isVertical) {
    if (isVertical) {
      // stores JSON definitions for steps
      const stepDef = jsonDef.filter((step) => {
        const isStep = step.isStep || step.type === "Step" || false;
        return isStep && step.bShow !== false;
      });
      this.firstVisibleStepIndex =
        stepDef.length > 0 ? stepDef[0].indexInParent : 0;

      if (stepDef && stepDef.length > 0) {
        // stores the last step index
        this.lastStepIndex = stepDef[stepDef.length - 1].indexInParent;
      }
    }
  }

  /**
   * @scope private
   * @description Overwrites native renderedCallback.
   * @returns {Void}
   */
  renderedCallback() {
    this.calculateProgressBar(this.jsonDef.asIndex);
    this.calculateStepIndex(this.jsonDef.children, this.isVertical);
  }

  /**
   * @scope private
   * @description Applies the placement (position) of the step chart.
   * @returns {Void}
   */
  applyPlacement() {
    if (
      this._theme === "slds" &&
      this._currPlacement !== this._props.position
    ) {
      switch (this._props.position) {
        case "left": {
          this.classList.add(this._theme + "-medium-size_1-of-4");
          break;
        }
        case "right": {
          this.classList.add(this._theme + "-medium-size_1-of-3");
          break;
        }
        default: {
          // do nothing
        }
      }

      // store the current chart placement
      this._currPlacement = this._props.position;
    }
  }

  /**
   * @scope private
   * @description Overwrites native render.
   * @returns {Template}
   */
  render() {
    return this._theme === "nds" ? tmpl_nds : tmpl;
  }

  /**
   * @scope private
   * @description Handles step instructions in Step Chart.
   * @param {Integer} index
   * @param {Object} jsonData
   * @returns {Void}
   */
  handleJsonData(index, jsonData) {
    if (index >= 0) {
      //multilanguage use instructionKey
      let instruction = this.jsonDef.children[index].propSetMap.instruction;

      if (this.scriptHeaderDef && this.scriptHeaderDef.multiLang) {
        instruction =
          this.scriptHeaderDef.allCustomLabels[
            this.jsonDef.children[index].propSetMap.instructionKey
          ];
      }

      this.stepInstruction = handleMergeField(
        instruction,
        jsonData,
        this.jsonDef.labelMap,
        null,
        true,
        true
      );

      if (this.scriptHeaderDef) {
        this.stepInstruction = replaceUrlHost(
          this.stepInstruction,
          this.scriptHeaderDef.isCommunity,
          this.scriptHeaderDef.networkUrlPathPrefix || null,
          this.scriptHeaderDef.communityBaseUrl
        );
      }

      this.calculateProgressBar(this.jsonDef.asIndex);
      this.calculateStepIndex(this.jsonDef.children, this.isVertical);
    }
  }

  /**
   * @scope private
   * @description Add classList to an element handler.
   * @param {Event} evt
   * @returns {Void}
   */
  handleAddClassList = (evt) => {
    evt.stopPropagation();
    if (evt.detail) {
      const el = this.template.querySelector(
        `li:nth-child(${evt.detail.index + 1})`
      );
      if (el) {
        el.classList.add(evt.detail.className);
      }
    }
  };

  /**
   * @scope private
   * @description Remove classList to an element handler.
   * @param {Event} evt
   * @returns {Void}
   */
  handleRemoveClassList = (evt) => {
    evt.stopPropagation();
    if (evt.detail) {
      const el = this.template.querySelector(
        `li:nth-child(${evt.detail.index + 1})`
      );
      if (el) {
        el.classList.remove(evt.detail.className);
      }
    }
  };

  /**
   * @scope private
   * @description Calculates the progress bar value and sets the styling for the actual progress bar.
   * @param {Integer} index
   * @returns {Void}
   */
  calculateProgressBar(index) {
    if (index >= 0) {
      const stepData = this.calculateStepData(index),
        newStepProgressValue = stepData.value,
        newStepsLength = stepData.length,
        positionToggled = this._tempIsVertical !== this.isVertical,
        progressValueDiff =
          this._tempStepProgressValue !== newStepProgressValue,
        stepsLengthDiff = this._numOfSteps !== newStepsLength;

      if (progressValueDiff || positionToggled || stepsLengthDiff) {
        const lastStepData =
          index !== this._lastExecutedStepIndex
            ? this.calculateStepData(this._lastExecutedStepIndex)
            : stepData;

        // caches progress bar component query when position is toggled or when progressBarComp does not exist
        if (!this._progressBarComp || positionToggled) {
          this._progressBarComp = !this.isVertical
            ? this.template.querySelector(
                "." + this._theme + "-progress-bar__value"
              )
            : null;
        }

        // recalculates step progress value due to data json changes, etc
        if (
          (this._numOfSteps > 0 && this._numOfSteps !== stepData.length) ||
          positionToggled
        ) {
          this.stepProgressValue = this._tempStepProgressValue =
            lastStepData.value;
        }

        // retains the farthest step progress value
        if (this._tempStepProgressValue < newStepProgressValue) {
          this.stepProgressValue = this._tempStepProgressValue =
            newStepProgressValue;
          this._lastExecutedStepIndex = index;
        }

        this._numOfSteps = stepData.length;
        this._tempIsVertical = this.isVertical;
      }

      if (
        this._progressBarComp &&
        !this.isVertical &&
        (newStepsLength !== this._tempStepsLength || positionToggled)
      ) {
        // Caches progress bar container component query when component does not exist or when position is toggled
        if (!this._progressBarContainerComp || positionToggled) {
          this._progressBarContainerComp = !this.isVertical
            ? this.template.querySelector(`.${this._theme}-progress-bar`)
            : null;
        }

        if (this.stepProgressValue === 0 && stepData.length === 1) {
          this._progressBarContainerComp.style.width = `${this.stepProgressValue}%`;
        } else {
          // When the number of steps changes due to conditional render, the container comp must be full width.
          this._progressBarContainerComp.style.removeProperty("width");
        }

        this._tempStepsLength = newStepsLength;
      }
    }
  }

  /*
   * This is used by the new OmniDesigner to tell the step chart the jsonDef has changed and the internal cached variables need to change.
   */
  @api updateStepChartInternals() {
    this.calculateStepData(this._jsonDef.asIndex);
  }

  /**
   * @scope private
   * @description Calculates the relevant step data for the step chart.
   * @param {Integer} index
   * @returns {Object}
   */
  calculateStepData(index) {
    const stepsDef = this.jsonDef.children.filter(
        (jsonDef) => jsonDef.type === "Step" && jsonDef.bShow !== false
      ),
      stepIndex = stepsDef.findIndex((def) => index === def.indexInParent),
      value = (stepIndex / (stepsDef.length - 1)) * 100;

    return {
      index: stepIndex,
      length: stepsDef.length,
      value: Number.isFinite(value) && stepIndex >= 0 ? value : 0
    };
  }
}
