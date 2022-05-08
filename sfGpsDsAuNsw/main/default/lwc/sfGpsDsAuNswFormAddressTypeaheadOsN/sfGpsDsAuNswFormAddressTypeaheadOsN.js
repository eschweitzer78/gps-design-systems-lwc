/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, track } from "lwc";
import OmniscriptTypeahead from "omnistudio/omniscriptTypeahead";
import { omniGetMergedField } from "c/sfGpsDsOmniHelpersOsN";
import { getHelperClassName, getStatusIcon } from "c/sfGpsDsAuNswFormHelperOsN";
import { debounce } from "omnistudio/utility";
import tmpl from "./sfGpsDsAuNswFormAddressTypeaheadOsN.html";

const STATUS_TYPING = "typing";
const STATUS_SELECTED = "selected";
const STATUS_RESOLVED = "resolved";
const MODE_SMART = "smart";
const MODE_MANUAL = "manual";

export default class sfGpsDsAuNswFormAddressTypeaheadOsN extends OmniscriptTypeahead {
  @api street;
  @api suburb;
  @api state = "NSW";
  @api postcode;
  @api country = "Australia";
  @api states = [
    { label: "ACT", value: "ACT" },
    { label: "NSW", value: "NSW" },
    { label: "NT", value: "NT" },
    { label: "QLD", value: "QLD" },
    { label: "SA", value: "SA" },
    { label: "TAS", value: "TAS" },
    { label: "VIC", value: "VIC" },
    { label: "WA", value: "WA" }
  ];

  @track isSmart = true;
  @track elementValueLabel;
  @track elementValueValue;
  @track elementValueStatus = STATUS_TYPING;

  // EVENT HANDLING

  handleToggle() {
    this.setElementValue("", false, false);
    this.dispatchOmniEventUtil(
      this,
      this.createAggregateNode(),
      "omniaggregate"
    );

    this.options = [];
    this.elementValueLabel = null;
    this.elementValueValue = null;
    this.elementValueStatus = STATUS_TYPING;
    this.dispatchOmniEventUtil(this, { item: "$Vlocity.nullify" }, "select");

    if (this.isSmart) {
      this.isSmart = false;
      this.setManualValue();
    } else {
      this.isSmart = true;
    }
  }

  handleStateBlur(event) {
    if (this.state !== event.target.value) {
      // eslint-disable-next-line @lwc/lwc/no-api-reassignments
      this.state = event.target.value;
      this.setManualValue();
    }
  }

  handleFieldBlur(event) {
    switch (event.target.name) {
      case "street":
        if (this.street !== event.target.value) {
          // eslint-disable-next-line @lwc/lwc/no-api-reassignments
          this.street = event.target.value;
          this.setManualValue();
        }

        break;

      case "suburb":
        if (this.suburb !== event.target.value) {
          // eslint-disable-next-line @lwc/lwc/no-api-reassignments
          this.suburb = event.target.value;
          this.setManualValue();
        }

        break;

      case "postcode":
        if (this.postcode !== event.target.value) {
          // eslint-disable-next-line @lwc/lwc/no-api-reassignments
          this.postcode = event.target.value;
          this.setManualValue();
        }

        break;

      case "country":
        if (this.country !== event.target.value) {
          // eslint-disable-next-line @lwc/lwc/no-api-reassignments
          this.country = event.target.value;
          this.setManualValue();
        }

        break;

      default:
    }
  }

  handleLookup() {
    if (this.isSmart) {
      super.handleLookup();
    }
  }

  setManualValue() {
    let fullAddress =
      (this.street ? this.street : "") +
      (this.street && (this.suburb || this.state || this.postcode) ? "," : "") +
      (this.street && this.suburb ? " " : "") +
      (this.suburb ? this.suburb : "") +
      ((this.street || this.suburb) && this.state ? " " : "") +
      (this.state ? this.state : "") +
      ((this.street || this.suburb || this.state) && this.postcode ? " " : "") +
      (this.postcode ? this.postcode : "");

    fullAddress = fullAddress ? fullAddress.toUpperCase() : null;

    this.applyCallResp(
      {
        value: {
          addressDetails: {
            street: this.street,
            suburb: this.suburb,
            state: this.state,
            postcode: this.postcode,
            country: this.country
          },
          address: fullAddress
        },
        mode: MODE_MANUAL,
        label: fullAddress
      },
      false
    );
  }

  getSmartValue() {
    let value = {
      label: this.elementValueLabel,
      value: this.elementValueValue,
      status: this.elementValueStatus,
      mode: MODE_SMART
    };

    return value;
  }

  // Render/Callbacks/Override

  render() {
    return tmpl;
  }

  handleTypeahead(event) {
    if (this.isSmart) {
      this.elementValueStatus = STATUS_TYPING;

      if (!this.typeaheadFn) {
        this.typeaheadFn = debounce((e) => {
          const t = e.value || null;
          this.elementValueLabel = t;
          if (this.elementValue !== t) {
            this.setElementValue(this.getSmartValue(), false, false);

            this.dispatchOmniEventUtil(
              this,
              this.createAggregateNode(),
              "omniaggregate"
            );

            if (t === null) {
              this.options = [];
            } else {
              if (this._propSetMap.useDataJson) {
                this.getOptionsDataJson();
              } else {
                Promise.resolve().then(() => {
                  this.getOptions(this._propSetMap.taAction);
                });
              }
            }

            this.dispatchOmniEventUtil(
              this,
              { item: "$Vlocity.nullify" },
              "select"
            );
          }
        }, this._propSetMap.callFrequency);
      }

      this.typeaheadFn(event);
    }
  }

  handleBlur(event) {
    this.elementValueLabel = event.target.value;
    let proxyEvent = {
      target: {
        value: this.getSmartValue()
      }
    };

    super.handleBlur(proxyEvent);
  }

  handleSelect(event) {
    this.elementValueLabel = event.target.value;
    this.elementValueValue = event.detail.item;
    this.elementValueStatus = STATUS_SELECTED;

    let proxyEvent = {
      target: {
        value: this.getSmartValue()
      },
      detail: event.detail
    };

    super.handleSelect(proxyEvent);

    // for some reason this is otherwise not (never?) refreshed
    this.jsonDataStr = JSON.stringify(this._jsonData);

    this.hitEndPoint(this._propSetMap.taAction)
      .then((e) => this.handleResponse(e))
      .then((e) => this.dataProcessorHook(e))
      .then((e) => {
        this.elementValueValue = Array.isArray(e) ? e[0] : e;
        this.elementValueStatus = STATUS_RESOLVED;
        this.applyCallResp(this.getSmartValue());
      })
      .catch((e) => this.handleError(e));
  }

  applyCallResp(e, t = false, i = false) {
    /* TODO: investigate: for some reason super.applyCallResp(e, t, i) does not set elementValue */

    if (i) {
      this.setCustomValidation(e);
    } else {
      e = this.treatResp(e);

      if (e === null) {
        return;
      }

      if (this.lodashUtil.isEqual(this.elementValue, e)) {
        return;
      }

      this.setElementValue(e, t, i);
      this.dispatchOmniEventUtil(
        this,
        this.createAggregateNode(),
        "omniaggregate"
      );
    }
  }

  // STYLE EXPRESSIONS

  get computedLabelClassName() {
    return `nsw-form__label ${
      this._propSetMap.required ? "nsw-form__required" : ""
    }`;
  }

  get computedHelperClassName() {
    return getHelperClassName("invalid");
  }

  get computedStatusIcon() {
    return getStatusIcon("invalid");
  }

  get computedTypeaheadClass() {
    return this.isSmart ? "" : "sfgpsds-hide";
  }

  get mergedLabel() {
    return omniGetMergedField(this, this._propSetMap.label);
  }

  get mergedHelpText() {
    return omniGetMergedField(this, this._handleHelpText);
  }
}
