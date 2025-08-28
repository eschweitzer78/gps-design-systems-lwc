import { api } from "lwc";
import OmniscriptBaseElement from "c/sfGpsDsOsrtOmniscriptBaseElement";
import {
  HasValidation,
  showHideValidityHook,
  VALIDATION_EVENTS
} from "c/sfGpsDsOsrtOmniscriptValidation";

/**
 * Wrapper for Custom Lightning Web Component that is embedded inside of OmniScript
 */
export default class OmniscriptCustomLwc extends HasValidation(
  OmniscriptBaseElement
) {
  @api applyCallResp() {}

  validityHook(newShow) {
    showHideValidityHook(newShow, this);
  }

  /**
   * Calls HasValidation's reportValidity similar to how onchange calls applyCallResp in text element
   */
  handleValidation(evt) {
    evt.stopPropagation();
    if (evt.detail.showMessage) {
      this.reportValidity();
    } else {
      this.checkValidity();
    }
  }

  constructor() {
    super();
    // custom validation events from OmniscriptBaseMixin
    this.template.addEventListener(
      "trigger_validation",
      this.handleValidation.bind(this)
    );
    this.template.addEventListener(
      "omniaggregate",
      this.handleOmniAggregate.bind(this)
    );
    // prevent any omniscript validation events bubbling out from an OS embedded inside of a custom lwc.
    this.template.addEventListener(VALIDATION_EVENTS.VALID, this.stopBubbling);
    this.template.addEventListener(
      VALIDATION_EVENTS.INVALID,
      this.stopBubbling
    );
  }

  /**
   * Event handler that stops the propagation of captured event
   * @param {Object} evt
   */
  stopBubbling(evt) {
    evt.stopPropagation();
  }

  handleOmniAggregate(evt) {
    if (evt.detail) {
      evt.stopPropagation();
      if (evt.detail.elementId === this._elementId) {
        this.elementValue = evt.detail.data;
      } else {
        this.elementValue = Object.assign({}, this.elementValue, {
          [evt.detail.elementId]: evt.detail.data
        });
      }
      this._aggregateOverride = evt.detail.aggregateOverride;
      this.dispatchOmniEventUtil(
        this,
        this.createAggregateNode(),
        "omniaggregate"
      );
    }
  }
}
