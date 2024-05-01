import { LightningElement, api } from "lwc";
import { RplColorThemes } from "c/sfGpsDsAuVic2UiCoreConstants";

export default class SfGpsDsAuVic2ButtonVariantCpe extends LightningElement {
  @api schema; // JSON Schema
  @api errors; // PropertyError[] w/ PropertyError = { message }
  @api value;

  get options() {
    return Object.entries(RplColorThemes).map(([value, label]) => ({
      label,
      value
    }));
  }

  handleChange(event) {
    const target = event.target;
    /* eslint-disable-next-line @lwc/lwc/no-api-reassignments */
    this.value = target.value;

    this.dispatchEvent(
      new CustomEvent("valuechange", {
        detail: {
          value: this.value
        }
      })
    );
  }
}
