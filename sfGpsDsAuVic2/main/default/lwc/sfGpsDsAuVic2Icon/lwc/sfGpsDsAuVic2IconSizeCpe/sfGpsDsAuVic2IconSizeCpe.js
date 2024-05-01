import { LightningElement, api } from "lwc";
import { RplIconSizes } from "c/sfGpsDsAuVic2IconConstants";

export default class extends LightningElement {
  @api label = "Icon size";
  @api required;
  @api schema; // JSON Schema
  @api errors; // PropertyError[] w/ PropertyError = { message }
  @api value;

  get options() {
    return Object.entries(RplIconSizes).map(([value, label]) => ({
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
