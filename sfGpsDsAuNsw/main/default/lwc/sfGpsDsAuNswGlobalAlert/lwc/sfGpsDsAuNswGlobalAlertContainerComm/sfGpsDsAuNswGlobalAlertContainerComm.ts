import { api } from "lwc";
import SfGpsDsIpLwc from "c/sfGpsDsIpLwc";
import { 
  htmlDecode, 
  isArray 
} from "c/sfGpsDsHelpers";
import type {
  GlobalAlertData
} from "c/sfGpsDsAuNswGlobalAlertContainerComm";

/**
 * @slot Alerts
 */
export default 
class SfGpsDsAuVic2AlertContainerComm 
extends SfGpsDsIpLwc {
  /* @ts-ignore */
  @api 
  className?: string;

  /* api: ipName, String */

  // @ts-ignore
  @api
  // @ts-ignore
  get ipName() {
    // @ts-ignore
    return super.ipName;
  }

  set ipName(value) {
  // @ts-ignore
    super.ipName = value;
  }

  /* api: inputJSON, String */

  // @ts-ignore
  @api
  // @ts-ignore
  get inputJSON() {
    // @ts-ignore
    return super.inputJSON;
  }

  set inputJSON(value) {
    // @ts-ignore
    super.inputJSON = value;
  }

  /* api: optionsJSON, String */

  // @ts-ignore
  @api
  // @ts-ignore
  get optionsJSON() {
    // @ts-ignore
    return super.optionsJSON;
  }

  set optionsJSON(value) {
    // @ts-ignore
    super.optionsJSON = value;
  }

  /* computed */

  get isEmpty(): boolean {
    return (
      this._didLoadOnce && (this._items == null || this._items.length === 0)
    );
  }

  /* methods */

  mapIpData(data: object | object[]): GlobalAlertData[] {
    if (!data) {
      return [];
    }

    if (!isArray(data)) {
      data = [data];
    }

    return (data as object[]).map((alert: any, index: number) => ({
      ...alert,
      alertId: alert.alertId || `sf-gps-ds-au-nsw-global-alert-default-${index + 1}`,
      title: alert.title,
      copy: alert.copy ? htmlDecode(alert.copy) : null,
      as: alert.as || "default",
      ctaStyle: alert.ctaStyle || "link",
      cta: alert.cta ? htmlDecode(alert.cta) : null,
      cookie: alert.cookie ? htmlDecode(alert.cookie) : null
    }));
  }

  /* lifecycle */

  constructor() {
    super(true); // LwrOnly
  }

  connectedCallback() {
    super.connectedCallback();

    this.classList.add("nsw-scope");
  }
}
