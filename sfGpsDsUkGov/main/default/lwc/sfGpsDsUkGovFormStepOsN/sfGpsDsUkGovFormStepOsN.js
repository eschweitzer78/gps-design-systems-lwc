/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

// Setup:
// in omniscript designer, go to setup tab and in the Element Type To LWC Component Mapping section
// set Step as the ElementType and this LWC as the Lightning Web Component

import { track } from "lwc";
import OmniscriptStep from "c/sfGpsDsFormStepOsN";
import tmpl from "./sfGpsDsUkGovFormStepOsN.html";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsUkGovFormStepOsN";

export default class SfGpsDsUkGovFormStepOsN extends OmniscriptStep {
  /* computed */

  get sfGpsDsErrorMessages() {
    /**
     *
     * BEGIN MANAGE UKGOV ERRORS
     * NOTE: We can't handle containers, e.g. TypeaheadBlock, Block etc. and anything placed in them using the
     * standard invalidElements capability.
     * We typically only display errors that existing when we last hit next and add anything that is a custom error
     * from a SetErrors step
     * This avoids having errors that newly sprung on the current page to make it to the summary at the
     * top of the page.
     *
     * There is currently a bug with the original Multiselect element which does not report the validationMessage
     * correctly.
     *
     **/

    let customErrors = this.getCurrentMessages()
      .filter((item) => item.custom === true)
      .map((item) => ({ ...item }));
    let errorMessages = customErrors.concat(this._sfGpsDsErrorSnapshot);
    return errorMessages.length ? errorMessages : null;
  }

  get computedErrorLabelId() {
    return "error-summary-title";
  }

  get computedIsH1() {
    return (
      this._propSetMap.isHeading === true ||
      this._propSetMap.isHeading === 1 ||
      this._propSetMap.isHeading === "1"
    );
  }

  get computedIsH2() {
    return (
      this._propSetMap.isHeading === 2 || this._propSetMap.isHeading === "2"
    );
  }

  get computedIsH3() {
    return (
      this._propSetMap.isHeading === 3 || this._propSetMap.isHeading === "3"
    );
  }

  get computedHeadingClassName() {
    let ls = this._propSetMap.labelSize;
    let h = this._propSetMap.isHeading;

    return {
      "govuk-heading-xl":
        ls === "xl" ||
        ls === "x-large" ||
        (ls == null && (h === true || h === 1 || h === "1")),
      "govuk-heading-l":
        ls === "l" || ls === "large" || (ls == null && (h === 2 || h === "2")),
      "govuk-heading-m":
        ls === "m" || ls === "medium" || (ls == null && (h === 3 || h === "3")),
      "govuk-heading-s": ls === "s" || ls === "small"
    };
  }

  get computedLabelClassName() {
    let ls = this._propSetMap.labelSize;

    return {
      "govuk-label": true,
      "govuk-label--xl": ls === "xl" || ls === "x-large",
      "govuk-label--l": ls === "l" || ls === "large",
      "govuk-label--m": ls === "m" || ls === "medium",
      "govuk-label--s": ls === "s" || ls === "small"
    };
  }

  get computedCaptionClassName() {
    let ls = this._propSetMap.captionSize || this._propSetMap.labelSize;
    let h = this._propSetMap.isHeading;

    return {
      "govuk-caption--xl":
        ls === "xl" ||
        ls === "x-large" ||
        (ls == null && (h === true || h === 1 || h === "1")),
      "govuk-caption--l":
        ls === "l" || ls === "large" || (ls == null && (h === 2 || h === "2")),
      "govuk-caption--m":
        ls === "m" || ls === "medium" || (ls == null && (h === 3 || h === "3")),
      "govuk-caption--s": ls === "s" || ls === "small"
    };
  }

  /* methods */

  getCurrentMessages() {
    if (DEBUG) console.log(CLASS_NAME, "> getCurrentMessages");

    let errorMessages = [];

    Object.keys(this.invalidElements).forEach((key) => {
      const element = this.invalidElements[key];
      const hasCustomValidation =
        element.sfGpsDsHasCustomValidation &&
        element.sfGpsDsHasCustomValidation();

      if (DEBUG)
        console.log(
          CLASS_NAME,
          "getCurrentMessages",
          "Element with error",
          "key: " + key,
          "vm: " + element.validationMessage,
          "has func sfGpsDsHasCustomValidation: " +
            element.sfGpsDsHasCustomValidation !=
            null,
          hasCustomValidation
        );

      if (element.validationMessage) {
        errorMessages.push({
          key,
          href: "#error-" + key,
          message: element.validationMessage,
          custom: hasCustomValidation
        });
      }
    });

    if (DEBUG)
      console.log(
        CLASS_NAME,
        "< getCurrentMessages",
        JSON.stringify(errorMessages, null, 2)
      );
    return errorMessages;
  }

  @track _sfGpsDsErrorSnapshot = [];

  prepareSnapshot() {
    this._sfGpsDsErrorSnapshot = this.getCurrentMessages()
      .filter((item) => item.custom === false)
      .map((item) => ({ ...item }));
    if (DEBUG)
      console.log(
        CLASS_NAME,
        "prepareSnapshot",
        JSON.stringify(this._sfGpsDsErrorSnapshot, null, 2)
      );
  }

  clearSnapshot() {
    this._sfGpsDsErrorSnapshot = [];
  }

  /* event management */

  handleBack(e) {
    e.preventDefault(); // avoid default behaviour with the href on anchor
    super.handleBack(e);
  }

  handleNext(e) {
    if (DEBUG) console.log(CLASS_NAME, "handleNext");

    /* Prepare snapshot captures errors so that they can be kept until the next time the user does next */
    this.reportValidity();
    this.prepareSnapshot();

    super.handleNext(e);
  }

  handleErrorClick(e) {
    e.preventDefault();
    this.focusInvalidInput(e.currentTarget.dataset.errorkey);
  }

  /* lifecycle */

  render() {
    return tmpl;
  }
}
