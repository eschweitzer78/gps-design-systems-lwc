/*
* Copyright (c) 2025, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api 
} from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

import type { 
  HeadingColour, 
  HeadingLevel,
  CalloutType 
} from "c/sfGpsDsCaOnCallout";

// eslint-disable-next-line no-unused-vars
const DEBUG = false;
// eslint-disable-next-line no-unused-vars
const CLASS_NAME = "SfGpsDsCaOnCaCallout";


const HIGHLIGHTCOLOUR_VALUES: Record<HeadingColour, string> = {
  default: "ontario-border-highlight--teal",
  blue: "ontario-border-highlight--blue",
  gold: "ontario-border-highlight--gold", 
  green: "ontario-border-highlight--green", 
  lime: "ontario-border-highlight--lime",
  purple: "ontario-border-highlight--purple",
  sky: "ontario-border-highlight--sky", 
  taupe: "ontario-border-highlight--taupe",
  teal: "ontario-border-highlight--teal", 
  yellow: "ontario-border-highlight--yellow" 
} as const;
const HIGHLIGHTCOLOUR_DEFAULT = "default";

const HEADINGLEVEL_VALUES: HeadingLevel[] = [
  "h2", "h3", "h4", "h5", "h6"
];
const HEADINGLEVEL_DEFAULT: HeadingLevel = "h2";

/**
 * Callout type variants with corresponding CSS classes
 * - default: Standard callout with border color only
 * - information: Blue background with info icon
 * - warning: Yellow/gold background with warning icon
 * - error: Red background with error icon
 * - success: Green background with success icon
 */
const CALLOUTTYPE_VALUES: Record<CalloutType, string> = {
  default: "",
  information: "ontario-callout--typed ontario-callout--information",
  warning: "ontario-callout--typed ontario-callout--warning",
  error: "ontario-callout--typed ontario-callout--error",
  success: "ontario-callout--typed ontario-callout--success"
} as const;
const CALLOUTTYPE_DEFAULT: CalloutType = "default";

export default 
class SfGpsDsCaOnCallout
extends SfGpsDsLwc {
  static renderMode = "light";

  // @ts-ignore
  @api 
  highlightColour?: HeadingColour;
  _highlightColour = this.defineEnumObjectProperty<string, HeadingColour>("highlightColour", {
    validValues: HIGHLIGHTCOLOUR_VALUES,
    defaultValue: HIGHLIGHTCOLOUR_DEFAULT
  });

  // @ts-ignore
  @api 
  headingLevel?: string;
  _headingLevel = this.defineEnumProperty<HeadingLevel>("headingLevel", {
    validValues: HEADINGLEVEL_VALUES,
    defaultValue: HEADINGLEVEL_DEFAULT
  });

  // @ts-ignore
  @api 
  className?: string;

  /**
   * Heading text content (alternative to using the heading slot).
   * For Light DOM compatibility, this property is preferred over slots.
   */
  // @ts-ignore
  @api 
  heading?: string;

  /**
   * Callout type for alert-style callouts with background colors and icons.
   * - default: Standard callout with border color only
   * - information: Blue background with info icon
   * - warning: Yellow/gold background with warning icon (for regulatory notices)
   * - error: Red background with error icon (for hard stops/ineligibility)
   * - success: Green background with success icon
   */
  // @ts-ignore
  @api 
  type?: CalloutType;
  _type = this.defineEnumObjectProperty<string, CalloutType>("type", {
    validValues: CALLOUTTYPE_VALUES,
    defaultValue: CALLOUTTYPE_DEFAULT
  });

  /* getters */

  /**
   * Returns true if heading property has content.
   * When true, renders heading from property instead of slot.
   */
  get hasHeadingProp(): boolean {
    return !!this.heading;
  }

  /**
   * Returns true if the heading slot should be shown.
   * This is the inverse of hasHeadingProp.
   * Note: Can't use lwc:else on slot elements, so we need this getter.
   */
  get showHeadingSlot(): boolean {
    return !this.heading;
  }

  /**
   * Returns the resolved type key from the type property.
   */
  get _typeKey(): CalloutType {
    // If type is set and valid, use it; otherwise default
    const validTypes: CalloutType[] = ["default", "information", "warning", "error", "success"];
    if (this.type && validTypes.includes(this.type as CalloutType)) {
      return this.type as CalloutType;
    }
    return CALLOUTTYPE_DEFAULT;
  }

  /**
   * Returns true if this is a typed callout (has icon).
   */
  get isTypedCallout(): boolean {
    return this._typeKey !== "default";
  }

  /**
   * Returns true if this is NOT a typed callout (default callout).
   * Used in template since LWC doesn't support ! negation in expressions.
   */
  get isDefaultCallout(): boolean {
    return this._typeKey === "default";
  }

  /**
   * Returns true if callout should show an icon.
   */
  get showIcon(): boolean {
    return this.isTypedCallout;
  }

  /**
   * Returns true if this is an information callout.
   */
  get isInformation(): boolean {
    return this._typeKey === "information";
  }

  /**
   * Returns true if this is a warning callout.
   */
  get isWarning(): boolean {
    return this._typeKey === "warning";
  }

  /**
   * Returns true if this is an error callout.
   */
  get isError(): boolean {
    return this._typeKey === "error";
  }

  /**
   * Returns true if this is a success callout.
   */
  get isSuccess(): boolean {
    return this._typeKey === "success";
  }

  /**
   * Get the CSS class for the current type.
   */
  get _typeClassName(): string {
    return CALLOUTTYPE_VALUES[this._typeKey] || "";
  }

  get computedClassName(): any {
    const isTyped = this.isTypedCallout;
    const typeClass = this._typeClassName;
    return {
      "ontario-callout": true,
      // Only apply border highlight color for default (non-typed) callouts
      [this._highlightColour.value]: !isTyped && !!this._highlightColour.value,
      // Apply type-specific classes for typed callouts
      [typeClass]: isTyped && !!typeClass,
      // Add no-heading modifier if typed but no heading
      "ontario-callout--no-heading": isTyped && !this.heading,
      [this.className || ""]: this.className
    }
  }

  get isH2() {
    return this._headingLevel.value === "h2";
  }

  get isH3() {
    return this._headingLevel.value === "h3";
  }

  get isH4() {
    return this._headingLevel.value === "h4";
  }

  get isH5() {
    return this._headingLevel.value === "h5";
  }

  get isH6() {
    return this._headingLevel.value === "h6";
  }
}
