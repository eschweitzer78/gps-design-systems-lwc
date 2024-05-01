import { LightningElement, api } from "lwc";
import { RplSocialShareNetworks } from "c/sfGpsDsAuVic2SocialShareConstants";
import PopupMixin from "c/sfGpsDsAuVic2PopupMixin";

export default class extends PopupMixin(LightningElement) {
  @api network;
  @api title;
  @api label;
  @api url;

  get computedAriaLabel() {
    return `Share this page on ${this.network}`;
  }

  get lcname() {
    return this.network?.toLowerCase();
  }

  get computedIconName() {
    return this.network ? `icon-${this.lcname}` : null;
  }

  get computedNetworkName() {
    return this.network === "X" ? "X (formerly Twitter)" : this.network;
  }

  get computedShareTemplate() {
    return (RplSocialShareNetworks[this.network] || "")
      .replace("$t", encodeURIComponent(this.title))
      .replace("$u", encodeURIComponent(this.url));
  }

  handleClick(event) {
    event.preventDefault();

    this.openPopup(this.computedShareTemplate, this.lcname);

    this.dispatchEvent(
      new CustomEvent("openShareWindow", {
        detail: {
          action: "share",
          text: this.network,
          label: this.label
        }
      })
    );
  }
}
