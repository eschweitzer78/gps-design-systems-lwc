import { track } from "lwc";
import {
  getElementValue,
  isArrayEqual
} from "c/sfGpsDsOsrtOmniscriptInternalUtils";
import { replaceUrlHost } from "c/sfGpsDsOsrtOmniscriptRestApi";

/**
 * @module ns/omniscriptOptionsMixin
 * @typicalname
 * @param {Base} Base - component
 * @description Mixin which adds functionality for handling options.
 * @returns {Class}
 */
export const OmniscriptOptionsMixin = (Base) => {
  return class extends Base {
    // private variables
    _tempOptions = [];
    _realtimeOptions = [];
    _initialOptions = [];
    _needMoreValidation = false;
    _dependency;
    _seedOptions;
    _optionValueToIndex = {};
    /**
     * @scope private (track)
     * @description Flag to refresh UI.
     * @type {Boolean}
     */
    @track refresh = false;

    /**
     * @scope private
     * @description Overwrites inherited initCompVariables.
     * @returns {Void}
     */
    initCompVariables() {
      super.initCompVariables();

      this._dependency = this._propSetMap.dependency;
      this._seedOptions = this._propSetMap.options;

      if (this.scriptHeaderDef.rtpSeed) {
        let key = "";

        if (this._propSetMap.controllingField.type === "SObject") {
          key =
            this._propSetMap.optionSource.source +
            "/" +
            this._propSetMap.controllingField.source;
        } else if (this._propSetMap.controllingField.type === "Custom") {
          key =
            this._propSetMap.controllingField.element +
            "/" +
            this._propSetMap.controllingField.source;
        } else if (
          this._propSetMap.optionSource.type === "SObject" ||
          this._propSetMap.optionSource.type === "Custom"
        ) {
          key = this._propSetMap.optionSource.source;
        }

        if (
          this._propSetMap.controllingField.type === "SObject" ||
          this._propSetMap.controllingField.type === "Custom"
        ) {
          this._dependency = this.scriptHeaderDef.rtpSeed[key];
        } else if (
          this._propSetMap.optionSource.type === "SObject" ||
          this._propSetMap.optionSource.type === "Custom"
        ) {
          this._seedOptions = this.scriptHeaderDef.rtpSeed[key];
        }
      }

      this._tempOptions = this.prependOptions(
        this._initialOptions,
        this._seedOptions
      );

      // non-controlling field options get loaded here
      if (!this._dependency || this.seedOptions()) {
        this._realtimeOptions = this._tempOptions.map((option) => {
          let rtOptions = {
            label: option.value,
            value: option.name
          };
          if (option.imgId) {
            rtOptions.imgId = replaceUrlHost(
              option.imgId,
              this.scriptHeaderDef.isCommunity,
              this.scriptHeaderDef.networkUrlPathPrefix || null,
              this.scriptHeaderDef.communityBaseUrl
            );
          }
          return rtOptions;
        });
      }

      if (this._propSetMap.options) {
        this._propSetMap.options.forEach((option, index) => {
          // name contains the value
          this._optionValueToIndex[option.name] = index;
        });
      }
    }

    /**
     * @scope private
     * @description Options are seeded.
     * @returns {Boolean}
     */
    seedOptions() {
      return false;
    }

    /**
     * @scope private
     * @description Overwrites inherited combinedWatch.
     * @returns {Void}
     */
    combinedWatch() {
      super.combinedWatch();

      if (this.jsonData && this.scriptHeaderDef && this._dependency) {
        // controlling field options are retrieved here
        this.getOptions(this._initialOptions);
      }
    }

    getElementValueString() {
      return Array.isArray(this.elementValue)
        ? this.elementValue.join(";")
        : this.elementValue;
    }

    /**
     * @scope private
     * @description Overwrites inherited setElementFormattedValue. Sets the value to be displayed
     *              (formatted value) to the label value.
     * @returns {Void}
     */
    setElementFormattedValue() {
      if (
        this._realtimeOptions.length > 0 &&
        this.elementValue != null &&
        this.getElementValueString().split
      ) {
        let tempElementFormattedValue = "";
        let numberOfElementValues = 0;
        const elementValueArr = this.getElementValueString().split(";");

        for (let i = 0; i < this._realtimeOptions.length; i++) {
          if (elementValueArr.indexOf(this._realtimeOptions[i].value) !== -1) {
            // Adds a semi-color separator if there are multiple element values
            if (numberOfElementValues > 0) {
              tempElementFormattedValue += ";";
            }

            tempElementFormattedValue += this._realtimeOptions[i].label;
            numberOfElementValues++;
          }
        }

        this._elementFormattedValue = tempElementFormattedValue;
      } else {
        // Clears formatted element value
        this._elementFormattedValue = "";
      }

      super.setElementFormattedValue();
    }

    /**
     * @scope private
     * @description Gets options. Primarily used for elements with controlling fields.
     * @param {Object[]} initialOptions
     * @returns {Void}
     */
    getOptions(initialOptions) {
      // updates options with new options
      const elementName = this._propSetMap.controllingField.element;
      const elementValue = getElementValue(
        elementName,
        this.jsonData,
        this.scriptHeaderDef.labelMap,
        this.jsonDef.JSONPath || null
      );
      let newOptions = this._dependency[elementValue];

      // prepends initialOptions to newOptions
      newOptions = this.prependOptions(initialOptions, newOptions);

      // updates the options if options have changed
      if (newOptions && !isArrayEqual(newOptions, this._tempOptions)) {
        // updates picklist options
        this._realtimeOptions = newOptions.map((option) => {
          return { label: option.value, value: option.name };
        });

        this.updatePropOptions(newOptions);

        // checkedResult has properties valid and/or options
        const checkedResult = this.checkOptions(
          this._realtimeOptions,
          this.jsonDef.response
        );

        // clears jsonData if no valid responses are found
        if (
          !checkedResult.valid ||
          (checkedResult.valid && checkedResult.dataToApply === "")
        ) {
          this.applyCallResp(null, true);
        }
        // applies jsonData if valid options exist
        else if (checkedResult.valid && checkedResult.dataToApply) {
          if (checkedResult.dataToApply !== this.jsonDef.response) {
            this.applyCallResp(checkedResult.dataToApply, true);
          } else if (this.jsonDef.type === "Select") {
            // triggers reportValidity to update invalidElement count in header
            this.applyCallResp(checkedResult.dataToApply, true);
          }
        }

        // updates the formatted json data for dependent options
        this.setElementFormattedValue();
      }
      // clears data if options are undefined || null
      else if (newOptions == null) {
        if (this._tempOptions && this._tempOptions.length > 0) {
          // clears the jsonData
          this.applyCallResp(null, true);
        }

        // clears options
        this._realtimeOptions = [];
        this._tempOptions = [];
        this._elementFormattedValue = "";
      }

      // stores options temporarily for the next check
      this._tempOptions = newOptions;

      // toggles UI refresh
      this.refresh = !this.refresh;
    }

    /**
     * @scope private
     * @description Checks options to see if data JSON needs to be cleared.
     * @param {Object[]} options
     * @param {Object} data
     * @returns {Object}
     */
    checkOptions(options, data) {
      // preforms additional checks if data not undefined || null
      // in OmniScript, option is in the format of "name":"key1","value":"displayVal1"
      // but in base component, it's "value":"key1","label":"displayVal1"
      if (data != null) {
        const key = typeof data === "object" ? data.name : data;

        for (let i = 0; i < options.length; i++) {
          if (options[i].value != null && options[i].value === key) {
            return { valid: true, dataToApply: data };
          }
        }

        return { valid: false };
      }

      return { valid: true, dataToApply: null };
    }

    /**
     * @scope private
     * @description Prepends options to initialOptions.
     * @param {Object[]} initialOptions
     * @param {Object[]} options
     * @returns {Object[]}
     */
    prependOptions(initialOptions, options) {
      if (
        (Array.isArray(options) &&
          options.length === 1 &&
          options[0] !== null &&
          typeof options[0] === "object" &&
          Object.getOwnPropertyNames(options[0]).length === 0) ||
        !options
      ) {
        options = [];
      }

      if (
        initialOptions &&
        Array.isArray(initialOptions) &&
        initialOptions.length > 0
      ) {
        // initial options will be prepended to the second options argument
        if (options) {
          return initialOptions.concat(options);
        }

        // if options doesn't exist, returns initial options
        return initialOptions;
      }

      return options;
    }

    /**
     * @scope private
     * @description Updates options property.
     * @returns {Void}
     */
    updatePropOptions() {}

    /**
     * @scope private
     * @description Determines if data is valid.
     * @param {*} data
     * @returns {Boolean}
     */
    validateData(data) {
      // note, typeof data !== 'object' evaluates to true when data = null
      if (typeof data !== "string" && typeof data !== "object") {
        return { valid: false };
      }

      if (this._dependency) {
        return { valid: true, dataToApply: data };
      }

      return this.checkOptions(this._realtimeOptions, data);
    }
  };
};
