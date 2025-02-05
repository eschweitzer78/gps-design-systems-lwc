import { LightningElement, api } from "lwc";
import { isArray } from "c/sfGpsDsHelpers";

export default class extends LightningElement {
  static renderMode = "light";

  @api url;
  @api title;
  @api label = "Social networks";
  @api networks = [
    {
      name: "twitter",
      label: "Twitter",
      iconName: "twitter",
      iconSize: "0.81"
    },
    {
      name: "facebook",
      label: "Facebook",
      iconName: "facebook",
      iconSize: "1"
    },
    {
      name: "linkedin",
      label: "LinkedIn",
      iconName: "linkedin",
      iconSize: "0.81"
    }
  ];
  @api emailSubject;
  @api emailBody;
  @api className;

  /* computed */

  get computedEmailEnabled() {
    return this.emailSubject || this.emailBody ? true : false;
  }

  get computedEmailUrl() {
    return `mailto:?subject=${encodeURIComponent(
      this.emailSubject
    )}&body=${encodeURIComponent(this.emailBody)}%0D%0A %0D%0A${this.url}`;
  }

  get computedHasNetworks() {
    return isArray(this.networks) && this.networks.length > 0;
  }

  get computedClassName() {
    return {
      "rpl-share-this": true,
      [this.className]: this.className
    };
  }
}
