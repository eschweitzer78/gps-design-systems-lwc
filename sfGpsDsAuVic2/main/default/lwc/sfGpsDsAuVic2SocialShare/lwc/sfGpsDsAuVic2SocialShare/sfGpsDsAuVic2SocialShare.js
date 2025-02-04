import { LightningElement, api } from "lwc";
import {
  RplSocialShareNetworks,
  NETWORKS_DEFAULT
} from "c/sfGpsDsAuVic2SocialShareConstants";

export default class extends LightningElement {
  @api title = "Share this page";
  @api pagetitle;
  @api url;
  @api email;
  @api className;

  /* api: networks */

  _networksOriginal = NETWORKS_DEFAULT;
  _networks = NETWORKS_DEFAULT;

  @api
  get networks() {
    return this._networksOriginal;
  }

  set networks(value) {
    this._networksOriginal = value;
    this._networks = value.filter((key) =>
      Object.keys(RplSocialShareNetworks).includes(key)
    );
  }

  /* computed */

  get computedClassName() {
    return {
      "rpl-social-share": true,
      "rpl-u-screen-only": true,
      [this.className]: this.className
    };
  }
}
