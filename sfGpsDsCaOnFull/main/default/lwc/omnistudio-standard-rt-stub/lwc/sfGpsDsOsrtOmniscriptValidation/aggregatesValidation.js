import { api, track } from "lwc";
import { delay } from "c/sfGpsDsOsrtAsyncUtils";
import { VALIDATION_EVENTS } from "./sfGpsDsOsrtOmniscriptValidation";

export const AggregatesValidation = (Base) => {
  return class extends Base {
    /**
     * @type {HasValidation[]} - Can also be use to display errors summary.
     * Each item will contain the properties, label, and validationMessage.
     * @scope track (private)
     */
    @track invalidElements = {};

    /** for demo purposes only */
    get errorsJson() {
      return JSON.stringify(this.invalidElements, null, 2);
    }

    connectedCallback() {
      super.connectedCallback();
      this.template.addEventListener(
        VALIDATION_EVENTS.VALID,
        this.markInputAsValid.bind(this)
      );
      this.template.addEventListener(
        VALIDATION_EVENTS.INVALID,
        this.markInputAsInvalid.bind(this)
      );
    }

    /**
     * The input which fired this event is invalid, keep track of it in the _invalidElements array.
     * @param {CustomEvent} evt
     * @param {HasValidation} evt.target
     * @scope private
     */
    markInputAsInvalid(evt) {
      let order = [];
      const ordered = {};
      this.invalidElements = {
        ...this.invalidElements,
        ...{ [evt.detail.jsonPath]: evt.target }
      };

      order = Object.keys(this.invalidElements).sort((a, b) => {
        return (
          this.invalidElements[a]?.getBoundingClientRect().top -
          this.invalidElements[b]?.getBoundingClientRect().top
        );
      });

      order.forEach((key) => {
        ordered[key] = this.invalidElements[key];
      });

      this.invalidElements = ordered;
    }

    /**
     * The input which fired this event is now valid, and removed from the tracking array.
     * @param {CustomEvent} evt
     * @param {HasValidation} evt.target
     * @scope private
     */
    markInputAsValid(evt) {
      if (evt.detail.jsonPath) delete this.invalidElements[evt.detail.jsonPath];
    }

    /**
     * Focus the invalid input at the specified index.
     * @param {string} path - The key of the invalid element in the invalidElements collection.
     * @scope private
     */
    focusInvalidInput(path) {
      if (path && this.invalidElements[path]) {
        const element = this.invalidElements[path];
        // handle case where the invalid element is a group (eg. preview -> step)
        if (typeof element.handleInvalid === "function") {
          element.handleInvalid();
        }
        // handle case where the invalid element is an input (eg. step -> input)
        else if (typeof element.focus === "function") {
          element.scrollIntoView({
            block: "center",
            inline: "nearest",
            behavior: "smooth"
          });
          delay(500).then(() => {
            // check if user fixed the invalid input within the 500ms
            if (this.invalidElements[path]) {
              element.focus();
            }
          });
        }
      }
    }

    /**
     * Overridable
     * A default behavior for handling an invalid state.
     */
    @api handleInvalid() {
      const key = Object.keys(this.invalidElements)[0];
      this.focusInvalidInput(key);
    }

    checkValidity() {
      return Object.keys(this.invalidElements).length === 0;
    }

    @api reportValidity() {
      const isValid = this.checkValidity();

      if (!isValid) {
        Object.keys(this.invalidElements).forEach((key) => {
          const omniElement = this.invalidElements[key];
          if (typeof omniElement.reportValidity === "function") {
            omniElement.reportValidity();
          }
        });
      }

      return isValid;
    }
  };
};
