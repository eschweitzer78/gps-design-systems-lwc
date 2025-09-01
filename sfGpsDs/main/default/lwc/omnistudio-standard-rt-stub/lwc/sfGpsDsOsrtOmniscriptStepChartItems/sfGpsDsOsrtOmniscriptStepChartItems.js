import { api, LightningElement } from "lwc";
import tmpl_vertical from "./omniscriptStepChartItems_vertical.html";
import tmpl_horizontal from "./omniscriptStepChartItems_horizontal.html";
import tmpl_nds from "./omniscriptStepChartItems_nds.html";
import { getSldsResourcesUrl } from "c/sfGpsDsOsrtSalesforceUtils";

/**
 * @module ns/omniscriptStepChartItems
 * @extends LightningElement
 * @typicalname omniscriptStepChartItems
 */
export default class OmniscriptStepChartItems extends LightningElement {
  /**
   * @scope public (api)
   * @type {Object}
   * @description Gets and sets Omniscript JSON definition.
   */
  @api jsonDef;

  /**
   * @scope public (api)
   * @type {Object}
   * @description Gets and sets Omniscript data JSON.
   */
  @api jsonData;

  /**
   * @scope public (api)
   * @type {Object}
   * @description Script header definitions and globally shared variables.
   */
  @api scriptHeaderDef;

  /**
   * @scope public (api)
   * @type {Boolean}
   * @description Identifies step chart is horizontal or vertical.
   */
  @api isVertical;

  /**
   * @scope public (api)
   * @type {Integer}
   * @description Stores current index
   */
  @api currentIndex;

  /**
   * @scope public (api)
   * @type {Integer}
   * @description Stores current index from steps
   */
  @api currentStepIndex;

  /**
   * @scope public (api)
   * @type {String}
   * @description Stores theme layout. Default = 'slds'.
   */
  @api theme = "slds";

  /**
   * @scope public (api)
   * @type {Integer}
   * @description Stores last executed step index.
   */
  @api lastExecutedStepIndex;

  _lastStepIndex = 0;
  _firstVisibleStepIndex = 0;
  _labelInProgress = "";
  _labelCompleted = "";
  _labelUntouched = "";
  _labelIncomplete = "";

  /**
   * @scope private
   * @type {String}
   * @description The URL for the icon used on the stepchart items
   */
  stepChartIconUrl =
    getSldsResourcesUrl() + "icons/utility-sprite/svg/symbols.svg#success";

  /**
   * @scope public (api)
   * @type {Integer}
   * @description Stores last step index.
   */
  @api
  get lastStepIndex() {
    return this._lastStepIndex;
  }
  set lastStepIndex(index) {
    if (index) {
      this._lastStepIndex = index;
      this.applyLightningStyles();
    }
  }

  @api get firstVisibleStepIndex() {
    return this._firstVisibleStepIndex;
  }
  set firstVisibleStepIndex(index) {
    if (index) {
      this._firstVisibleStepIndex = index;
      this.applyLightningStyles();
    }
  }

  /**
   * @scope private
   * @type {Boolean}
   * @description Flag for Completed indicator.
   */
  get completed() {
    return (
      this.jsonDef.bShow !== false &&
      this.jsonDef.bDirty === true &&
      this.currentIndex > this.jsonDef.indexInParent &&
      this.inProgress === false &&
      this.jsonDef.type === "Step"
    );
  }

  /**
   * @scope private
   * @type {Boolean}
   * @description Flag for In Progress indicator.
   */
  get inProgress() {
    return (
      this.jsonDef.bShow !== false &&
      this.jsonDef.bAccordionActive === true &&
      this.jsonDef.type === "Step"
    );
  }

  /**
   * @scope private
   * @type {Boolean}
   * @description Flag for Pristine indicator.
   */
  get pristine() {
    return (
      this.jsonDef.bShow !== false &&
      (this.jsonDef.bDirty === undefined || this.jsonDef.bDirty === false) &&
      this.jsonDef.type === "Step"
    );
  }

  /**
   * @scope private
   * @type {Boolean}
   * @description Flag for Nonpristine indicator.
   */
  get nonpristine() {
    return (
      this.jsonDef.bShow !== false &&
      this.jsonDef.bAccordionActive !== true &&
      this.jsonDef.bDirty === true &&
      !this.completed &&
      this.jsonDef.type === "Step"
    );
  }

  /**
   * @scope private
   * @type {String}
   * @description Step label.
   */
  get stepLabel() {
    let stepLabel = "";
    if (this.jsonDef.bShow !== false) {
      stepLabel =
        this.jsonDef.propSetMap.chartLabel || this.jsonDef.propSetMap.label;
      if (this.scriptHeaderDef && this.scriptHeaderDef.multiLang) {
        stepLabel = this.scriptHeaderDef.allCustomLabels[stepLabel];
      }
    }
    return stepLabel;
  }

  connectedCallback() {
    const allCustomLabels = this.scriptHeaderDef.allCustomLabels;
    this._labelInProgress = `${this.stepLabel} ${allCustomLabels.OmniStepChartInProgress}`;
    this._labelCompleted = `${this.stepLabel} ${allCustomLabels.OmniStepChartCompleted}`;
    this._labelUntouched = `${this.stepLabel} ${allCustomLabels.OmniStepChartUntouched}`;
    this._labelIncomplete = `${this.stepLabel} ${allCustomLabels.OmniStepChartIncomplete}`;
  }

  /**
   * @scope private
   * @description Overwrites native render.
   * @returns {Void}
   */
  render() {
    if (this.theme === "nds") {
      return tmpl_nds;
    }

    return this.isVertical ? tmpl_vertical : tmpl_horizontal;
  }

  /**
   * @scope private
   * @description Event handler when steps are selected on the step chart.
   * @param {Event} event
   * @returns {Void}
   */
  handleStepClick(event) {
    event.preventDefault();

    // gets index of selected step
    const selectedIndex =
      parseInt(event.target.getAttribute("data-index"), 10) ||
      parseInt(event.target.value, 10) ||
      0;

    // prevents click navigation to future steps
    if (selectedIndex < this.currentIndex) {
      const eventContent = {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          currIndex: selectedIndex,
          prevIndex: this.currentIndex
        }
      };
      this.dispatchEvent(new CustomEvent("omnistepchart", eventContent));
    }
  }

  /**
   * @scope private
   * @description Applies progress indicator styles to the parent template for lightning when stepchart is in Vertical
   *              mode.
   * @returns {Void}
   */
  applyLightningStyles() {
    if (this.theme === "slds" && this.isVertical) {
      if (
        (this.inProgress && this.lastExecutedStepIndex > this.currentIndex) ||
        this.completed ||
        (this.nonpristine &&
          this.lastExecutedStepIndex > this.currentIndex &&
          this.lastExecutedStepIndex !== this.jsonDef.indexInParent)
      ) {
        this.dispatchEvent(
          new CustomEvent("omniaddclasslist", {
            bubbles: true,
            composed: true,
            detail: {
              index: this.currentStepIndex,
              className: "omni-vert-stepchart-completed"
            }
          })
        );
      } else {
        this.dispatchEvent(
          new CustomEvent("omniremoveclasslist", {
            bubbles: true,
            composed: true,
            detail: {
              index: this.currentStepIndex,
              className: "omni-vert-stepchart-completed"
            }
          })
        );
      }

      if (
        (this.lastExecutedStepIndex <= this.currentIndex && this.inProgress) ||
        (this.nonpristine &&
          this.lastExecutedStepIndex > this.currentIndex &&
          this.lastExecutedStepIndex === this.jsonDef.indexInParent)
      ) {
        this.dispatchEvent(
          new CustomEvent("omniaddclasslist", {
            bubbles: true,
            composed: true,
            detail: {
              index: this.currentStepIndex,
              className: "omni-vert-stepchart-active"
            }
          })
        );
      } else {
        this.dispatchEvent(
          new CustomEvent("omniremoveclasslist", {
            bubbles: true,
            composed: true,
            detail: {
              index: this.currentStepIndex,
              className: "omni-vert-stepchart-active"
            }
          })
        );
      }

      if (this._lastStepIndex === this.jsonDef.indexInParent) {
        this.dispatchEvent(
          new CustomEvent("omniaddclasslist", {
            bubbles: true,
            composed: true,
            detail: {
              index: this.currentStepIndex,
              className: "omni-vert-stepchart-last"
            }
          })
        );
      } else {
        this.dispatchEvent(
          new CustomEvent("omniremoveclasslist", {
            bubbles: true,
            composed: true,
            detail: {
              index: this.currentStepIndex,
              className: "omni-vert-stepchart-last"
            }
          })
        );
      }

      // Apply style to the last Step Chart item to ensure that the progress bar is fully filled
      if (this.currentIndex === this._lastStepIndex) {
        this.dispatchEvent(
          new CustomEvent("omniaddclasslist", {
            bubbles: true,
            composed: true,
            detail: {
              index: this.currentStepIndex,
              className: "omni-vert-stepchart-last-completed"
            }
          })
        );
      } else {
        this.dispatchEvent(
          new CustomEvent("omniremoveclasslist", {
            bubbles: true,
            composed: true,
            detail: {
              index: this.currentStepIndex,
              className: "omni-vert-stepchart-last-completed"
            }
          })
        );
      }

      if (this.isVertical) {
        // Apply style to the first Step Chart item to ensure there is no stranded progress line if there are hidden step
        if (this.jsonDef.indexInParent === this.firstVisibleStepIndex) {
          this.dispatchEvent(
            new CustomEvent("omniaddclasslist", {
              bubbles: true,
              composed: true,
              detail: {
                index: this.currentStepIndex,
                className: "omni-vert-stepchart-active-initial"
              }
            })
          );
        } else {
          this.dispatchEvent(
            new CustomEvent("omniremoveclasslist", {
              bubbles: true,
              composed: true,
              detail: {
                index: this.currentStepIndex,
                className: "omni-vert-stepchart-active-initial"
              }
            })
          );
        }
      }
    }
  }

  /**
   * @scope private
   * @description Overwrites native renderedCallback.
   * @returns {Void}
   */
  renderedCallback() {
    this.applyLightningStyles();

    if (this.jsonDef.bShow === false) {
      this.dispatchEvent(
        new CustomEvent("omniaddclasslist", {
          bubbles: true,
          composed: true,
          detail: {
            index: this.currentStepIndex,
            className: this.theme + "-hide"
          }
        })
      );
    } else {
      this.dispatchEvent(
        new CustomEvent("omniremoveclasslist", {
          bubbles: true,
          composed: true,
          detail: {
            index: this.currentStepIndex,
            className: this.theme + "-hide"
          }
        })
      );
    }
  }
}
