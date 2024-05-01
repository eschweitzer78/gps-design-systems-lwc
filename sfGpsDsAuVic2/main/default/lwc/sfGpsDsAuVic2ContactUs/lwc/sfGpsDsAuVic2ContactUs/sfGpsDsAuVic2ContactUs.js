import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVic2ContactUs extends LightningElement {
  @api title = "Contact us";
  @api address;
  @api items;
  @api className;

  /* computed */

  get name() {
    return this.address?.name;
  }

  get department() {
    return this.address?.department;
  }

  get street() {
    return this.address?.street;
  }

  get computedClassName() {
    return computeClass({
      "rpl-contact-us": true,
      [this.className]: this.className
    });
  }

  get computedSocialLinks() {
    return this.items && Array.isArray(this.items)
      ? this.items.map((i) => {
          return i.icon === "icon-twitter" ? { ...i, icon: "icon-x" } : i;
        })
      : [];
  }

  get computedHasDeptOrStreet() {
    return this.department || this.street;
  }

  /* event management */

  handleClick(event) {
    this.dispatchEvent(
      new CustomEvent("itemClick", {
        detail: {
          ...event.detail,
          label: typeof this.title === "string" ? this.title : null
        }
      })
    );
  }
}
