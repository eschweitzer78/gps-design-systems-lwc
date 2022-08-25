import { api, track } from "lwc";

const OmniscriptBaseMixin = (base) =>
  class extends base {
    @api omniJsonDef = "";
    @api omniSeedJson = "";
    @api omniResume = false;
    @api omniScriptHeaderDef = "";
    @api omniJsonData = "";
    @api omniCustomState;
    dataLayout = "lightning";
    @track showValidation = true;

    omniUpdateDataJson(input, aggregateOverride = false) {}
    omniApplyCallResp(response, usePubsub = false) {}
    omniSaveState(input, key, usePubsub = false) {}
    omniSaveForLater(auto = false) {}
    omniGetSaveState(key) {
      return null;
    }
    omniGetMergeField(mergeFieldString) {
      return mergeFieldString;
    }
    omniNextStep() {}
    omniPrevStep() {}
    omniNavigateTo(element) {}
    omniValidate(showMessage = true) {}
    omniRemoteCall(params, enableSpinner = false) {
      return null;
    }
    checkValidity() {
      return true;
    }
    reportValidity() {
      return true;
    }
  };

export { OmniscriptBaseMixin };
