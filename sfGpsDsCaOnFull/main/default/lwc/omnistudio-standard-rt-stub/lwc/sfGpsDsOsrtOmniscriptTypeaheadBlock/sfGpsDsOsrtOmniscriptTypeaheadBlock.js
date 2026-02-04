import { api } from "lwc";
import { get } from "c/sfGpsDsOsrtLodash";
import OmniscriptGroupElement from "c/sfGpsDsOsrtOmniscriptGroupElement";

import tmpl from "./sfGpsDsOsrtOmniscriptTypeaheadBlock.html";

/**
 * The typeahead block is a wrapper element which contains the typeahead element, and any other children inputs.
 * @module ns/omniscriptTypeaheadBlock
 * @typicalName OmniscriptTypeaheadBlock
 * @extends OmniscriptBlock
 */
export default class OmniscriptTypeaheadBlock extends OmniscriptGroupElement {
  /**
   * A cached reference to the underlying omniscriptTypeahead/omniscriptPlacesTypeahead.
   * @type {LightningElement}
   * @scope private
   */
  _typeaheadElement;

  /**
   * Event handler bound via template.
   * @param {CustomEvent} evt
   * @param {Object} evt.detail
   * @param {Object} evt.detail.item - The object that was selected.
   * @scope private
   * @returns {void}
   */
  handleSelect(evt) {
    if (evt.detail.item === "$Vlocity.nullify") {
      this.nullifyChildren(evt.detail.type);
    } else {
      this.applyCallResp(evt.detail.item, true);
    }
  }

  /**
   * Calls toggleEditMode(true), on the child omniscriptTypeahead/omnscriptPlacesTypeahead, and clears
   * block level validation messages.
   * @scope private
   * @returns {void}
   */
  enterEditMode() {
    this._typeaheadElement.toggleEditMode(true);
    this.showValidation = false;
  }

  /**
   * Hides block level validation messages.
   * @param {CustomEvent} evt
   * @scope private
   * @returns {void}
   */
  hideValidation(evt) {
    if (evt) {
      evt.stopPropagation();
    }

    this.showValidation = false;
  }

  render() {
    return tmpl;
  }

  /**
   * Override for the base lifecycle method `initCompvariables`. Binds event listeners for 'select' and 'hidevalidation' events.
   * @scope private
   * @returns {void}
   */
  initCompVariables() {
    super.initCompVariables();
    this.template.addEventListener("select", this.handleSelect.bind(this));
    this.template.addEventListener(
      "hidevalidation",
      this.hideValidation.bind(this)
    );
  }

  /**
   * Override for base implementation. Prevents display issues.
   * @scope private
   * @returns {void}
   */
  applyCtrlWidth() {
    super.applyCtrlWidth();
    this.classList.remove(`${this._theme}-p-right_small`);
  }

  /**
   * Shows block level validation messaging when hidden child elements are invalid.
   * Messaging is hidden when the typeahead element itself or the typeahead is already in edit mode.
   * @scope api (public)
   * @returns {boolean}
   */
  @api reportValidity() {
    const isValid = super.reportValidity();

    if (
      !this._typeaheadElement.checkValidity() ||
      this._typeaheadElement.getIsEditMode()
    ) {
      // If the typeahead field is invalid, don't bother showing other validation.
      this.showValidation = false;
    }

    return isValid;
  }

  /**
   * Clears the values of any child inputs. Triggered from the `OmniscriptTypeaheadBlock.handleSelect`.
   * @param {string} type
   * @scope private
   * @returns {void}
   */
  nullifyChildren(type) {
    if (
      this.jsonDef.response != null &&
      typeof this.jsonDef.response === "object" &&
      Object.keys(this.jsonDef.response).length > 0
    ) {
      let childJsonStruct = {};
      for (let key in this.jsonDef.response) {
        if (this.jsonDef.response.hasOwnProperty(key)) {
          if (
            type === "Lookup" ||
            key !== this.jsonDef.children[0].eleArray[0].name
          ) {
            childJsonStruct[key] = null;
          }
        }
      }
      if (Object.keys(childJsonStruct).length > 0) {
        this.applyCallResp(childJsonStruct, true);
      }
    }
  }

  initialRenderCallback() {
    super.initialRenderCallback();
    this._typeaheadElement = this.querySelector(
      `[data-omni-key="${get(this, "jsonDef.children[0].eleArray[0].name")}"]`
    );
  }
}
