import { LightningElement, api } from "lwc";
import { RplButtonVariants } from "c/sfGpsDsAuVic2ButtonConstants";

export default class SfGpsDsAuVic2ButtonVariantCpe extends LightningElement {
  @api schema; // JSON Schema
  @api errors; // PropertyError[] w/ PropertyError = { message }
  @api value;

  get options() {
    return Object.entries(RplButtonVariants).map(([value, label]) => ({
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
