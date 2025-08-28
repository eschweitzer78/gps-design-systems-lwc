import { AggregatesValidation } from "./aggregatesValidation";
import { HasValidation } from "./hasValidation";

const VALIDATION_EVENTS = {
  INVALID: "omniinvalid",
  VALID: "omnivalid"
};

Object.freeze(VALIDATION_EVENTS);

function showHideValidityHook(newShow, comp) {
  if (newShow) {
    comp.checkValidity();
  } else if (comp._isValid === false && !comp._initialRender) {
    comp.dispatchOmniEventUtil(
      comp,
      { jsonPath: comp.jsonDef.lwcId },
      VALIDATION_EVENTS.VALID
    );
    window.console.log(
      "omniscriptValidation validation event - valid " + comp.jsonDef.name
    );
  }
}

export {
  AggregatesValidation,
  HasValidation,
  VALIDATION_EVENTS,
  showHideValidityHook
};
