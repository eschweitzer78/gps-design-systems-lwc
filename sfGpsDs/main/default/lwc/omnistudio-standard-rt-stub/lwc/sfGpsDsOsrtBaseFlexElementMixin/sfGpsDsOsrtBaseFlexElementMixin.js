import { api, track } from "lwc";
import {
  namespace,
  namespaceDotNotation,
  extractCardMergeFields
} from "c/sfGpsDsOsrtUtility";
/**
 * This is a placeholder component added by FlexCards. It will be overridden by actual component from via_cards.
 */
export const BaseFlexElementMixin = (Base) =>
  class extends Base {
    @api set card(val) {
      if (val) {
        this._card = val;
        this.initMergeFields(val);
      }
    }
    get card() {
      return this._card;
    }
    @api stateIndex;
    @api action;
    @api record;
    @track _card;
    @track _allMergeFields;

    /**
     * @description Initialize the card merge fields and trigger render.
     * @param {Object} val - card api value
     * @scope private
     */
    initMergeFields(val) {
      this._allMergeFields = extractCardMergeFields(val);
      this._allMergeFields.nsPrefix = namespace ? namespace : "";
      this._allMergeFields.nsPrefixLWC = namespaceDotNotation
        ? namespaceDotNotation
        : "c";
      this.triggerRender();
    }

    triggerRender() {
      /*hook to rerender the element*/
    }

    /**
     * @description Trigger an event to update the value of binding field. Listener is added in flexCardMixin.
     * @param {String} fieldName - name of the field.
     * @param {String} fieldValue - Value for the field. Optional
     * @param {Object} element - element triggering the change
     * @scope private
     */
    triggerUpdateFieldBinding(fieldName, fieldValue, element) {
      if (!fieldName || typeof fieldName !== "string" || !element) {
        return;
      }
      const regex = /{|}/g;
      fieldName = fieldName.replaceAll(regex, "");
      fieldValue = fieldValue ? fieldValue : "{element.value}";

      const updateValueEvent = new CustomEvent("updatefieldbinding", {
        bubbles: true,
        composed: true,
        detail: {
          fieldValues: [{ fieldName, fieldValue }],
          element
        }
      });
      this.dispatchEvent(updateValueEvent);
    }
  };
