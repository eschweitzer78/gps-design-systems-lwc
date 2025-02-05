import { LightningElement, api } from "lwc";
import { isString, isArray } from "c/sfGpsDsHelpers";

export default class extends LightningElement {
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
    return {
      "rpl-contact-us": true,
      [this.className]: this.className
    };
  }

  get computedSocialLinks() {
    return this.items && isArray(this.items)
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
          label: isString(this.title) ? this.title : null
        }
      })
    );
  }
}
