import OmniscriptLookup from "omnistudio/omniscriptLookup";
import { omniGetMergedField } from "c/sfGpsDsOmniHelpersOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuVicFormLookupOsN.html";

export default class SfGpsDsAuVicFormLookupOsN extends OmniscriptLookup {
  render() {
    return tmpl;
  }

  get computedFormGroupClassName() {
    return computeClass({
      "form-group": true,
      invalid: this.invalid,
      valid: !this.invalid,
      required: this._propSetMap.required
    });
  }

  get mergedLabel() {
    return omniGetMergedField(this, this._propSetMap.label);
  }

  get mergedHelpText() {
    return omniGetMergedField(this, this._handleHelpText);
  }

  get computedListboxClassName() {
    return computeClass({
      "sfgpsds-dropdown": true,
      "sfgpsds-dropdown_fluid": true,
      "sfgpsds-dropdown_length--5": true,
      "sfgpsds-predictive__list": true,
      "sfgpsds-is-open": this.show
    });
  }

  /* overriding parent to have smooth scrollInto on focus */

  mouseOverFocus(event) {
    let index = event.target.getAttribute("data-option-index");
    this.ariaFocus(index, true);
  }

  /* overriding parent to cope with theme not being sfgpsds */

  ariaFocus(newIndex, isHover = false) {
    const options = this.template.querySelectorAll('[role="option"]');
    if (options.length > 0) {
      options.forEach((opt) => {
        opt.classList.remove("sfgpsds-has-focus");
      });
    }
    if (options[newIndex]) {
      options[newIndex].classList.add("sfgpsds-has-focus");
      // workaround for an issue where this attribute gets an extra suffix if used in the template
      this._inputRef.setAttribute(
        "aria-activedescendant",
        options[newIndex].id
      );

      /* scroll into view if keyboard event */
      if (options[newIndex].scrollIntoView && !isHover) {
        options[newIndex].scrollIntoView({
          block: "nearest"
        });
      }
    }
  }
}
