import { api, track } from "lwc";
import { dispatchOmniEvent } from "c/sfGpsDsOsrtOmniscriptUtils";
import {
  handleMergeField,
  isRepeatNotation,
  autoAdvance
} from "c/sfGpsDsOsrtOmniscriptInternalUtils";
import pubsub from "c/sfGpsDsOsrtPubsub";
import { OmniscriptActionCommonUtil } from "c/sfGpsDsOsrtOmniscriptActionUtils";

/**
 *
 * @param {class} Base A class that will be passed in and inherited by OmniScriptBaseMixin
 *
 * angular equivalents of lwc @api variables
 * LWC variable might contain more information
 *
 * LWC                    Angular
 * omniScriptHeaderDef    $scope.bpTree.propSetMap and $scope.bpTree.labelMap
 * omniSeedJson           $scope.bpTree.propSetMap.seedDataJSON
 * omniJsonData           $scope.bpTree.response
 * omniJsonDef            element
 *
 */
export const OmniscriptBaseMixin = (Base) =>
  class extends Base {
    // tracked properties
    @track showValidation = false;
    @track omniSpinnerEnabled = false;

    // public properties
    @api omniScriptHeaderDef;
    @api omniResume;
    @api omniSeedJson;
    @api omniJsonDef;
    @api omniJsonData;
    @api omniCustomState;
    @api omniJsonDataStr;

    dispatchOmniEventUtil = dispatchOmniEvent;

    /**
     * Merges input into Custom LWC's path inside the data json
     * @param {object} input
     */
    omniUpdateDataJson(input, aggregateOverride = false) {
      if (
        this.omniJsonDef &&
        this.omniJsonDef.index !== undefined &&
        this.omniJsonDef.name
      ) {
        const detail = {
          data: input,
          elementId: this.omniJsonDef.name,
          index: this.omniJsonDef.index,
          show: true,
          aggregateOverride: aggregateOverride
        };
        dispatchOmniEvent(this, detail, "omniaggregate");
      }
    }

    /**
     * Updates and/or adds a node to json data
     * @param {object} response
     * @param {boolean} [usePubsub=false] Setting to true allows omniApplyCallResp to continue running in the background while on a different step
     */
    omniApplyCallResp(response, usePubsub = false) {
      const detail = {
        apiResponse: response
      };
      if (usePubsub) {
        pubsub.fire(this.omniScriptHeaderDef.uuid + "omniactionbtn", "data", {
          detail: detail
        });
      } else {
        dispatchOmniEvent(this, detail, "omniactionbtn");
      }
    }

    /**
     * Save data used by component to keep track of internal state
     * @param {object} input
     * @param {boolean} [usePubsub=false] Setting to true allows omniSaveState to continue running in the background while on a different step
     */
    omniSaveState(input, key, usePubsub = false) {
      let saveStateKey = key || (this.omniJsonDef && this.omniJsonDef.name);
      if (saveStateKey) {
        const state = {
          elementId: saveStateKey,
          data: input
        };
        if (!usePubsub) {
          dispatchOmniEvent(this, state, "omnicustomsavestate");
        } else if (this.omniScriptHeaderDef) {
          pubsub.fire(
            this.omniScriptHeaderDef.uuid + "omnicustomsavestate",
            "data",
            state
          );
        }
      }
    }

    omniGetSaveState(key) {
      let state = null;
      let saveStateKey = key || (this.omniJsonDef && this.omniJsonDef.name);
      if (saveStateKey) {
        if (this.omniCustomState && this.omniCustomState[saveStateKey]) {
          // deep clone the state
          state = JSON.parse(
            JSON.stringify(this.omniCustomState[saveStateKey])
          );
        }
      }
      return state;
    }

    omniGetMergeField(mergeFieldString) {
      if (
        mergeFieldString &&
        this.omniJsonData &&
        this.omniScriptHeaderDef &&
        this.omniJsonDef
      ) {
        return handleMergeField(
          mergeFieldString,
          this.omniJsonData,
          this.omniScriptHeaderDef.labelMap,
          isRepeatNotation(mergeFieldString) ? this.omniJsonDef.JSONPath : null,
          true
        );
      }
      return null;
    }

    omniNextStep() {
      this.omniNavigateTo("next");
    }

    omniPrevStep() {
      this.omniNavigateTo("previous");
    }

    /**
     * Given the step name or step index, navigate the OmniScript to any step before the current step or to the immediate next step
     * @param {String} element step name (elementId) or step index
     * @returns {void}
     */
    omniNavigateTo(element) {
      // element can be index or elementId
      if (element != null) {
        autoAdvance(
          [
            {
              name: true,
              autoAdv: element
            }
          ],
          0,
          this
        );
      }
    }

    /**
     * Sends an event up to omniscriptCustomLwc to trigger validation and call reportValidity
     * @param {boolean} showMessage Setting to false will prevent error messages from getting displayed when calling omniValidate
     * @returns {void}
     */
    omniValidate(showMessage = true) {
      const detail = {
        showMessage: showMessage
      };
      dispatchOmniEvent(this, detail, "trigger_validation");
    }

    /**
     * Notifies the OmniscriptHeader that the current instance needs to be saved.
     * @param {boolean} auto When true, SFL will process in the background and no spinner will be shown
     * @returns {void}
     */
    omniSaveForLater(auto = false) {
      const detail = {
        auto
      };
      dispatchOmniEvent(this, detail, "omnisaveforlater");
    }

    /**
     * Triggers a remote call. Invokes apex classes that extend from Vlocity Open Interface. Remote calls are called
     * using Generic Invoke.
     * @param {object} params - parameters to pass into GenericInvoke2 which will call specified apex class
     * @param {boolean} [enableSpinner=false] - optional parameter to enable spinner (spinner must be configured in custom
     *                  lwc's markup)
     * @returns {promise} returns a promise that will need to be resolved in custom lwc. resolved promise will have
     *                    a response in the format of { result: rawResponse, error: boolean }
     */
    omniRemoteCall(params, enableSpinner = false) {
      // enables the spinner if defined and spinner is configured in custom lwc markup
      this.omniSpinnerEnabled = enableSpinner;

      // instantiates action utility class
      const actionUtilClass = new OmniscriptActionCommonUtil();

      // returns executed action's promise to be resolved in custom lwc. resolved promise's response is returned
      // in the format of { result: rawResponse, error: boolean }
      return actionUtilClass
        .executeAction(params, null, this)
        .then((resp) => {
          this.omniSpinnerEnabled = false;

          return resp;
        })
        .catch((errorResp) => {
          this.omniSpinnerEnabled = false;

          return {
            result: errorResp,
            error: true
          };
        });
    }

    /**
     * checkValidity should return a boolean value true, if the input is valid, false if invalid.
     * @returns {boolean}
     */
    @api checkValidity() {
      return true;
    }

    /**
     * reportValidity should return the value of checkValidity, and trigger the display of any
     * validation messages as well.
     */
    @api reportValidity() {
      let isValid = this.checkValidity();
      this.showValidation = !isValid;
      return isValid;
    }
  };
