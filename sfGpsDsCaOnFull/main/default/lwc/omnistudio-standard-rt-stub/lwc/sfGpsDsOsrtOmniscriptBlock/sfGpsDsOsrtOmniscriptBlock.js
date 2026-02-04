import { api, track } from "lwc";
import OmniscriptGroupElement from "c/sfGpsDsOsrtOmniscriptGroupElement";
import tmpl from "./omniscriptBlock_slds.html";
import tmpl_nds from "./omniscriptBlock_nds.html";

/**
 * @module ns/omniscriptBlock
 * @extends OmniscriptGroupElement
 * @typicalname omniscriptBlock
 */
export default class OmniscriptBlock extends OmniscriptGroupElement {
  /**
   * @scope private (track)
   * @type {Boolean}
   * @description Flag that identifies if the block is expanded.
   */
  @track expandContent = true;
  @track ariaHiddenValue = false;

  /**
   * @scope private (track)
   * @type {String}
   * @description Classes applied to the block.
   */
  @track blockClasses = "";

  /**
   * @scope private (track)
   * @type {String}
   * @description Indicates active block.
   */
  @track activeSections;

  /**
   * @scope private (track)
   * @type {String}
   * @description Lightning classes applied to the block.
   */
  @track sldsBlockClasses = "";

  _addAriaLabel = "";
  _removeAriaLabel = "";

  /**
   * @scope private
   * @type {Boolean}
   * @description Flag to show error message.
   */
  get showErrorMessage() {
    return Object.keys(this.invalidElements).length > 0 && !this.expandContent;
  }

  /**
   * @scope private
   * @description Handles when block is toggled.
   * @returns {Void}
   */
  toggleContent(e) {
    e.preventDefault();
    // Using selector like this so that names containing omniscript AND block are all covered.
    const childBlocks = Array.from(this.template.querySelectorAll("*")).filter(
      (element) => {
        const nameAttribute = element.tagName;
        return (
          nameAttribute &&
          nameAttribute.toLowerCase().includes("omniscript") &&
          nameAttribute.toLowerCase().includes("block")
        );
      }
    );
    childBlocks.forEach((child) => {
      if (child.collapse) {
        child.collapse();
      }
    });
    this.expandContent = !this.expandContent;
    this.ariaHiddenValue = !this.ariaHiddenValue;
    if (this.expandContent) {
      this.showValidation = false;
    }
    this.updateBlockClasses();
  }

  @api collapse() {
    // Collapse only if content is expanded.
    if (this.expandContent) {
      this.expandContent = !this.expandContent;
      this.ariaHiddenValue = !this.ariaHiddenValue;
      this.updateBlockClasses();
    }
  }

  /**
   * @scope private
   * @description Overwrites inherited initCompVariables.
   * @returns {Void}
   */
  initCompVariables() {
    super.initCompVariables();

    this.expandContent = !this._propSetMap.collapse;
    this.ariaHiddenValue = this._propSetMap.collapse;
    this.updateBlockClasses();
    this.activeSections = this.jsonDef.name;
    this._addAriaLabel = this.allCustomLabelsUtil.OmniBlockAddAriaLabel;
    this._removeAriaLabel =
      this.allCustomLabelsUtil.OmniBlockRemoveAriaLabel.replace(
        /\{0\}/gi,
        this.blockLabel
      );

    if (this._theme === "slds") {
      this._blockContentContainer = `slds-accordion__content ${this._isDesignMode ? "omni-designer-block_content" : "omni-block_content"}`;
    }
  }

  /**
   * @scope private
   * @type {String}
   * @description Gets block label.
   */
  get blockLabel() {
    // will return block label with index for repeated blocks
    if (
      this._propSetMap.repeat &&
      this._propSetMap.label &&
      this.jsonDef.ct > 1 &&
      this.jsonDef.index > 0
    ) {
      return `${this._propSetMap.label} ${this.jsonDef.index + 1}`;
    }

    // returns blank label if label is not defined
    if (!this._propSetMap.label) {
      return "";
    }

    return this._propSetMap.label;
  }

  @api reportValidity() {
    const isValid = super.reportValidity();

    if (this.expandContent) this.showValidation = false;

    return isValid;
  }

  /**
   * @scope private
   * @description Updates block classes.
   * @returns {Void}
   */
  updateBlockClasses() {
    if (this._theme === "nds") {
      this.blockClasses =
        "nds-form-element nds-clearfix nds-block nds-p-around_small " +
        (this.expandContent || this._isDesignMode ? "nds-is-open" : "");
    } else if (this._theme === "slds") {
      this.blockClasses = `slds-accordion__section slds-p-horizontal_none ${this.expandContent || this._isDesignMode ? "slds-is-open" : ""}`;
    }
  }

  /**
   * @scope private
   * @description Overwrites native render.
   * @returns {Template}
   */
  render() {
    return this.layout === "newport" ? tmpl_nds : tmpl;
  }

  getBoundsForDesigner() {
    const container = this.template.querySelector(
      this.layout === "lightning"
        ? ".omni-designer-block_content"
        : ".nds-block_body>.nds-grid"
    );
    const outerWrapper = this.getBoundingClientRect();
    if (container) {
      const computedStyle = getComputedStyle(container);
      const boundingRect = container.getBoundingClientRect();
      return Object.assign({}, JSON.parse(JSON.stringify(outerWrapper)), {
        containerBounds: boundingRect,
        paddingLeft: this.safeParseStyleToNumber(computedStyle.paddingLeft),
        paddingRight: this.safeParseStyleToNumber(computedStyle.paddingRight),
        paddingTop: this.safeParseStyleToNumber(computedStyle.paddingTop),
        paddingBottom: this.safeParseStyleToNumber(computedStyle.paddingBottom)
      });
    }
    return this.getBoundingClientRect();
  }

  /**
   * Override focus() in omniscriptBaseElement
   * @scope private
   */
  focus() {
    const elements = this.template.querySelector("slot")?.assignedElements();
    if (elements && elements.length > 0) {
      elements[0].focus();
    }
  }

  get blockHeadingLevel() {
    return this._propSetMap.headingLevel || 2;
  }
}
