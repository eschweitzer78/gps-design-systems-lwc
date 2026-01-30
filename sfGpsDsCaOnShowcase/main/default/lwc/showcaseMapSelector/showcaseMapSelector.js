import { LightningElement, api } from "lwc";

/**
 * Showcase component for Map Selector / Site Selector Tool
 * Used for E2E testing of ESRI map integration
 */
export default class ShowcaseMapSelector extends LightningElement {
  @api pageTitle = "Map Selector Showcase";

  // Map configuration
  mapConfig = {
    basemapType: "topo-vector",
    center: { lat: 43.6532, lng: -79.3832 }, // Toronto
    zoom: 10
  };

  // Track selected location
  selectedLocation = null;
  selectedCoordinates = null;

  // Coordinate formats for testing
  coordinateFormats = [
    { label: "Decimal Degrees", value: "decimal" },
    { label: "UTM Zone 17", value: "utm17" },
    { label: "UTM Zone 18", value: "utm18" },
    { label: "DMS", value: "dms" }
  ];

  selectedFormat = "decimal";

  handleLocationSelected(event) {
    this.selectedLocation = event.detail.address || event.detail.location;
    this.selectedCoordinates = event.detail.coordinates;
    this.dispatchEvent(
      new CustomEvent("locationchange", { detail: event.detail })
    );
  }

  handleFormatChange(event) {
    this.selectedFormat = event.detail.value;
  }

  get hasSelection() {
    return this.selectedLocation !== null;
  }

  get formattedCoordinates() {
    if (!this.selectedCoordinates) return "";
    const { lat, lng } = this.selectedCoordinates;
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
}
