import { ShowToastEvent } from "lightning/platformShowToastEvent";

/**
 * Use this function to show a toast.
 * Utilizes the standard slds salesforce toast.
 * @param {object} config
 * @param {scope} comp
 */
export function showToast(config, comp) {
  const event = new ShowToastEvent({
    title: config.title,
    message: config.message,
    variant: config.variant || "info",
    mode: config.mode || "dismissable"
  });

  comp.dispatchEvent(event);
}
