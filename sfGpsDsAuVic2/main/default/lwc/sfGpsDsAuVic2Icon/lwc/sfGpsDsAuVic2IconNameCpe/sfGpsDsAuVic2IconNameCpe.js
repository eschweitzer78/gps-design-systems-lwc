import { LightningElement, api } from "lwc";
import { RplIconNames } from "c/sfGpsDsAuVic2IconConstants";

export default class extends LightningElement {
  @api label = "Icon name";
  @api required;
  @api schema; // JSON Schema
  @api errors; // PropertyError[] w/ PropertyError = { message }
  @api value;

  get options() {
    return RplIconNames.map((item) => {
      return {
        label: item.startsWith("icon-") ? item.slice(5) : item, // remove "icon-"
        value: item
      };
    });
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
