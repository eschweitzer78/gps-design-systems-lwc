import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

/**
 * @slot Alerts
 */
export default class SfGpsDsAuVic2AlertContainerLwr extends SfGpsDsLwc {
  @api className;

  /* event management */

  handleDismiss(event) {
    event.stopPropagation();

    // In LWR one should query slot elements via template
    const elts = this.template.querySelectorAll(
      "c-sf-gps-ds-au-vic2-alert-comm"
    );

    for (let i = 0; i < elts.length; i++) {
      if (elts[i].alertId === event.detail.id) {
        elts[i].dismissed = true;
      }
    }
  }

  /* lifecycle */

  connectedCallback() {
    this._isLwrOnly = true;
    super.connectedCallback();

    this.classList.add("vic2-scope");
  }
}
