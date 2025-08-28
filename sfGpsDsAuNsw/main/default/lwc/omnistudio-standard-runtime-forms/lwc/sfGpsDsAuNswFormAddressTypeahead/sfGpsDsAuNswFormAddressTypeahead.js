/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, track } from "lwc";
import SfGpsDsFormTypeahead from "c/sfGpsDsFormTypeahead";
import SfGpsDsAuNswStatusHelperMixin from "c/sfGpsDsAuNswStatusHelperMixin";
import { debounce } from "omnistudio/utility";
import { isArray } from "c/sfGpsDsHelpers";
import { omniGetMergedField } from "c/sfGpsDsOmniHelpers";

import tmpl from "./sfGpsDsAuNswFormAddressTypeahead.html";

const STATUS_TYPING = "typing";
const STATUS_SELECTED = "selected";
const STATUS_RESOLVED = "resolved";
const MODE_SMART = "smart";
const MODE_MANUAL = "manual";
const DEFAULT_STATE = "NSW";
const DEFAULT_COUNTRY = "Australia";

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuNswFormAddressTypeahead";

const I18N = {
  manualAddressHelpText: "Enter your address details below."
};

export default class extends SfGpsDsAuNswStatusHelperMixin(
  SfGpsDsFormTypeahead
) {
  @api street;
  @api suburb;
  @api state = DEFAULT_STATE;
  @api postcode;
  @api country = DEFAULT_COUNTRY;
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

  /* other vars */

  _ath_options;

  get options() {
    return this._ath_options;
  }

  set options(v) {
    if (DEBUG) console.debug(CLASS_NAME, "> set options", JSON.stringify(v));

    this._ath_options = v;

    if (v && isArray(v)) {
      if (v.length === 1 && v[0].name) {
        // simulate selection after all asynchronous activities are done
        Promise.resolve().then(() => {
          this.handleSelect({
            target: { value: v[0].name },
            detail: v[0]
          });
        });
      }
    }

    if (DEBUG) console.debug(CLASS_NAME, "< set options");
  }

  _manualChildInputs;

  get manualChildInputs() {
    if (!this._manualChildInputs) {
      this._manualChildInputs = this.template.querySelectorAll(".manual-field");
    }
    return this._manualChildInputs;
  }

  get elementValue() {
    return this.isSmart ? this.getSmartValue() : this.getManualValue();
  }

  set elementValue(v) {
    if (DEBUG)
      console.debug(CLASS_NAME, "> set elementValue", JSON.stringify(v));

    if (this._propSetMap) {
      this._didGetValue = true;
      this.ingest(v);
    }

    if (DEBUG) console.debug(CLASS_NAME, "< set elementValue");
  }

  /* computed / getters */

  get computedLabelClassName() {
    return {
      "nsw-form__label": true,
      "nsw-form__required": this._propSetMap.required
    };
  }

  get computedTypeaheadClassName() {
    return {
      "sfgpsds-hide": !this.isSmart
    };
  }

  get computedManualClassName() {
    return {
      "sfgpsds-hide": this.isSmart
    };
  }

  get complete() {
    return this.isSmart ? this.elementValueStatus === STATUS_RESOLVED : false;
  }

  get computedShowHelpText() {
    return this.mergedHelpText || !this.isSmart;
  }

  get mergedManualHelpText() {
    return omniGetMergedField(
      this,
      this._propSetMap.manualAddressHelpText || I18N.manualAddressHelpText
    );
  }

  /* event management */

  handleToggle() {
    this.isSmart = !this.isSmart;

    if (this._propSetMap.manualAddressEditMode) {
      this.toggleEditMode(!this.isSmart);
    }

    this.dispatchOmniEventUtil(
      this,
      this.createAggregateNode(),
      "omniaggregate"
    );

    this.checkValidity();
  }

  handleStateBlur(event) {
    if (this.state !== event.target.value) {
      // eslint-disable-next-line @lwc/lwc/no-api-reassignments
      this.state = event.target.value;

      this.dispatchOmniEventUtil(
        this,
        this.createAggregateNode(),
        "omniaggregate"
      );

      this.checkValidity();
    }
  }

  handleFieldBlur(event) {
    switch (event.target.name) {
      case "street":
        if (this.street !== event.target.value) {
          // eslint-disable-next-line @lwc/lwc/no-api-reassignments
          this.street = event.target.value;
        }

        break;

      case "suburb":
        if (this.suburb !== event.target.value) {
          // eslint-disable-next-line @lwc/lwc/no-api-reassignments
          this.suburb = event.target.value;
        }

        break;

      case "postcode":
        if (this.postcode !== event.target.value) {
          // eslint-disable-next-line @lwc/lwc/no-api-reassignments
          this.postcode = event.target.value;
        }

        break;

      case "country":
        if (this.country !== event.target.value) {
          // eslint-disable-next-line @lwc/lwc/no-api-reassignments
          this.country = event.target.value;
        }

        break;

      default:
    }

    this.dispatchOmniEventUtil(
      this,
      this.createAggregateNode(),
      "omniaggregate"
    );

    this.checkValidity();
  }

  handleLookup() {
    if (this.isSmart) {
      super.handleLookup();
    }
  }

  handleTypeahead(event) {
    if (this.isSmart) {
      this.elementValueStatus = STATUS_TYPING;

      if (!this.typeaheadFn) {
        this.typeaheadFn = debounce((e) => {
          this.performTypeahead(e);
        }, this._propSetMap.callFrequency);
      }

      this.typeaheadFn(event);

      // solve an issue with validation with the original widget
      // when entering text, not selecting an item and choosing next
      // which shows a validation error when it should not
      this.checkValidity();
    }
  }

  handleBlur(event) {
    this.elementValueLabel = event.target.value;
    let proxyEvent = {
      target: {
        value: this.elementValue
      }
    };

    super.handleBlur(proxyEvent);
  }

  handleSelect(event) {
    if (DEBUG) console.debug(CLASS_NAME, "> handleSelect");

    super.handleSelect({
      target: {
        value: this.getSmartValue({
          elementValueLabel: event.target.value,
          elementValueValue: event.detail.item,
          elementValueStatus: STATUS_SELECTED
        })
      },
      detail: event.detail
    });

    const cv = this.checkValidity();
    if (DEBUG)
      console.debug(CLASS_NAME, "= handleSelect", "checkValidity=", cv);

    // for some reason this is otherwise not (never?) refreshed
    this.jsonDataStr = JSON.stringify(this._jsonData);

    this.hitEndPoint(this._propSetMap.taAction)
      .then((e) => this.handleResponse(e))
      .then((e) => this.dataProcessorHook(e))
      .then((e) => {
        this.applyCallResp(
          {
            ...this.elementValue,
            value: isArray(e) ? e[0] : e,
            status: STATUS_RESOLVED
          },
          true
        );

        this.checkValidity();
      })
      .catch((e) => this.handleError(e));

    if (DEBUG) console.debug(CLASS_NAME, "< handleSelect");
  }

  /* lifecycle */

  render() {
    return tmpl;
  }

  _didTypeahead = false;
  _didGetValue = false;

  connectedCallback() {
    this._didTypeahead = false;
    this._didGetValue = false;
    super.connectedCallback();

    this._readOnlyClass = "sfgpsdsaunsw-read-only";

    if (this.elementValue) {
      this.ingest(this.elementValue);
    } else {
      this.isSmart = true;
      this.elementValueLabel = null;
      this.elementValueValue = {};
      this.elementValueStatus = STATUS_TYPING;
    }
  }

  renderedCallback() {
    super.renderedCallback();

    if (DEBUG) {
      console.debug(
        CLASS_NAME,
        "> renderedCallback",
        "_didGetValue=",
        this._didGetValue,
        "_didTypeahead=",
        this._didTypeahead,
        "elementValueStatus=",
        this.elementValueStatus
      );
    }

    if (!this._didTypeahead && this._didGetValue) {
      if (this.isSmart) {
        if (this.elementValueStatus === STATUS_TYPING) {
          this.performTypeahead({ value: this.elementValueLabel }, false);
        } else if (this.elementValueStatus === STATUS_SELECTED) {
          this._didTypeahead = true;
          this.handleSelect({
            target: { value: this.elementValueLabel },
            detail: { item: this.elementValueValue }
          });
        } else {
          this._didTypeahead = true;
        }
      }
    }

    if (DEBUG) console.debug(CLASS_NAME, "< renderedCallback");
  }

  /* methods / overrides */

  async performTypeahead(e, testValue = true) {
    if (DEBUG) {
      console.debug(
        CLASS_NAME,
        "> performTypeahead",
        "e.value=",
        e?.value,
        "testValue=",
        testValue
      );
    }

    this._didTypeahead = true;
    const t = e?.value || null;
    this.elementValueLabel = t;

    if (!testValue || this.elementValue !== t) {
      this.setElementValue(this.getSmartValue(), false, false);

      await this.dispatchOmniEventUtil(
        this,
        this.createAggregateNode(),
        "omniaggregate"
      );

      if (DEBUG)
        console.debug(
          CLASS_NAME,
          "= performTypeahead post omniaggregate",
          this.jsonDataStr
        );

      if (t === null) {
        this.options = [];
      } else {
        if (this._propSetMap.useDataJson) {
          this.getOptionsDataJson();
        } else {
          /* Doing promise resolution twice to let events propagate */
          Promise.resolve().then(() => {
            Promise.resolve().then(() => {
              console.debug(
                CLASS_NAME,
                "= performTypeahead getOptions",
                this.jsonDataStr
              );
              this.getOptions(this._propSetMap.taAction);
            });
          });
        }
      }

      this.dispatchOmniEventUtil(this, { item: "$Vlocity.nullify" }, "select");
    }

    if (DEBUG) {
      console.debug(CLASS_NAME, "< performTypeahead");
    }
  }

  applyCallResp(json, bApi = false, bValidation = false) {
    if (bValidation) {
      this.setCustomValidation(json);
    } else {
      json = this.treatResp(json);

      if (
        json !== undefined &&
        !this.lodashUtil.isEqual(this.elementValue || {}, json)
      ) {
        this.setElementValue(json, bApi, bValidation);
        this.dispatchOmniEventUtil(
          this,
          this.createAggregateNode(),
          "omniaggregate"
        );
      }
    }
  }

  ingest(v) {
    if (v && (typeof v === "string" || v instanceof String)) {
      this.isSmart = true;
      this.elementValueLabel = v;
      this.elementValueValue = {};
      this.elementValueStatus = STATUS_TYPING;
      this.performTypeahead({ value: v });
    } else if (v && typeof v === "object") {
      this.isSmart = v.mode ? v.mode === MODE_SMART : true;
      this.elementValueLabel = v.label;
      this.elementValueValue = { ...v.value };
      this.elementValueStatus = v.status ? v.status : STATUS_TYPING;

      if (!this.isSmart && this.elementValueValue.addressDetails) {
        // eslint-disable-next-line @lwc/lwc/no-api-reassignments
        this.street = this.elementValueValue.addressDetails.street;
        // eslint-disable-next-line @lwc/lwc/no-api-reassignments
        this.suburb = this.elementValueValue.addressDetails.suburb;
        // eslint-disable-next-line @lwc/lwc/no-api-reassignments
        this.state = this.elementValueValue.addressDetails.state;
        // eslint-disable-next-line @lwc/lwc/no-api-reassignments
        this.postcode = this.elementValueValue.addressDetails.postcode;
        // eslint-disable-next-line @lwc/lwc/no-api-reassignments
        this.country =
          this.elementValueValue.addressDetails.country || DEFAULT_COUNTRY;
      }
    } else {
      this.isSmart = true;
      this.elementValueLabel = "";
      this.elementValueValue = {};
      this.elementValueStatus = STATUS_TYPING;
    }

    // Need to wait for the value to trickle down to the child element
    Promise.resolve().then(() => this.checkValidity());
  }

  getManualValue() {
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

    return {
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
    };
  }

  getSmartValue(ev = null) {
    let value = {
      label: (ev ? ev : this).elementValueLabel,
      value: (ev ? ev : this).elementValueValue,
      status: (ev ? ev : this).elementValueStatus,
      mode: MODE_SMART
    };

    return value;
  }

  @api checkValidity() {
    if (DEBUG) console.debug(CLASS_NAME, "> checkValidity");

    let cv = true;

    try {
      if (this.isSmart) {
        if (
          this.elementValueStatus !== STATUS_RESOLVED &&
          this._propSetMap?.required
        ) {
          if (DEBUG)
            console.debug(
              CLASS_NAME,
              "= checkValidity not valid, isSmart not resolved required"
            );
          cv = false;
          this.isValid = false;
        } else {
          cv = super.checkValidity();
          if (DEBUG)
            console.debug(
              CLASS_NAME,
              `= checkValidity valid=${cv}, isSmart resolved or not required`
            );
        }
      } else {
        this.manualChildInputs.forEach((i) => {
          cv &&= i.checkValidity();
        });

        if (DEBUG)
          console.debug(CLASS_NAME, `= checkValidity valid=${cv}, manual`);
        this.isValid = cv;
      }
    } catch (t) {
      if (DEBUG) console.debug(CLASS_NAME, "= checkValidity exception", t);
      cv = true;
      this.isValid = cv;
    }

    if (DEBUG) console.debug(CLASS_NAME, "< checkValidity", cv);
    return cv;
  }

  @api reportValidity() {
    if (DEBUG) console.debug(CLASS_NAME, "> reportValidity");

    let rv = true;

    try {
      if (this.isSmart) {
        rv = super.reportValidity();

        if (
          this.elementValueStatus !== STATUS_RESOLVED &&
          this._propSetMap.required &&
          this.elementValueLabel
        ) {
          // There is a condition on this.elementValueLabel as we do not want to show an error message when
          // there is no text as the child input will do it.

          rv = false;
          this.isValid = false;
          this.errorMessage = this._messageWhenValueMissing;
        }
      } else {
        rv = true;
        this.manualChildInputs.forEach((i) => {
          rv &&= i.reportValidity();
        });

        this.isValid = rv;
      }
    } catch (t) {
      if (DEBUG) console.debug(CLASS_NAME, "= reportValidity exception", t);
      rv = true;
    }

    if (DEBUG) console.debug(CLASS_NAME, "< reportValidity", rv);
    return rv;
  }
}
