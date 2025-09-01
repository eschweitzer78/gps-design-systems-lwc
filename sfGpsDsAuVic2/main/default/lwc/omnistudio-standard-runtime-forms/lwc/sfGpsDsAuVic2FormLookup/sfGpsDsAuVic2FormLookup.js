/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, wire } from "lwc";
import SfGpsDsFormLookup from "c/sfGpsDsFormLookup";
import SfGpsDsAuVic2FormElementMixin from "c/sfGpsDsAuVic2FormElementMixin";
import tmpl from "./sfGpsDsAuVic2FormLookup.html";
import { getObjectInfo } from "lightning/uiObjectInfoApi";

export default class extends SfGpsDsAuVic2FormElementMixin(SfGpsDsFormLookup) {
  /* override */

  /* 
    So here the tricky part is that now we are offloading presentation to a child element, we no longer can do getOptions
    on demand and have to load them once and for all and provide it upfront to the child element.
    However getOptions has a dependency on objectInfo which is loaded asynchronously through a wire directly into an
    attribute. So we are trying to catch the moment when that happens... unfortunately we can't really wedge ourselves
    in the wire to attribute process so we do it on our end too.
  */

  @wire(getObjectInfo, { objectApiName: "$objectApiName" })
  processObjectInfo(value) {
    this.objectInfo = value;
    if (value.data) {
      this.getOptions();
    }
  }

  showOptions() {
    // The original method does a lot of things that are no longer relevant...
    this.isPageLoading = false;
  }

  get decoratedOptions() {
    /* Make it consistent with Select and remove the -- item at the front as the RplDropdown already allows to deselect */

    return this.computedOptions.slice(1).map((option) => ({
      ...option,
      label: option.name
    }));
  }

  /* event management */

  handleChange(event) {
    const value = event.target.value;

    this.lookupValue = value;
    this.applyCallResp(value);
  }

  @api checkValidity() {
    return this.refs.childInput.checkValidity();
  }

  @api reportValidity() {
    return this.refs.childInput.reportValidity();
  }

  @api setCustomValidation(message) {
    this.refs.childInput.setCustomValidity(message);
    this.reportValidity();
  }

  /* lifecycle */

  render() {
    return tmpl;
  }
}
