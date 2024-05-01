import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default class extends SfGpsDsLwc {
  @api title = "Share this page";
  @api pagetitle;
  @api url;
  @api email;
  @api networks;
  @api className;

  get _networks() {
    return this.networks?.split(";");
  }

  get computedShowShare() {
    return (this.networks || this.email) && this.pagetitle;
  }
}
