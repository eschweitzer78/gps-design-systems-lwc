import { LightningElement } from "lwc";
import sfGpsDsFrGov from "@salesforce/resourceUrl/sfGpsDsFrGov";
import { loadStyle } from "lightning/platformResourceLoader";

export default class SfGpsDsFrGovCoreOsN extends LightningElement {
  connectedCallback() {
    loadStyle(this, `${sfGpsDsFrGov}/dsfr.min.css`);
    loadStyle(this, `${sfGpsDsFrGov}/dsfr-supplement.min.css`);
  }
}
