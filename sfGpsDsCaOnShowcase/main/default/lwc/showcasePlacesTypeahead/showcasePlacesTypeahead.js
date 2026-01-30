import { LightningElement, api, track } from "lwc";

/**
 * Showcase component for Google Places Typeahead
 * Used for E2E testing of address autocomplete with Google Places API
 */
export default class ShowcasePlacesTypeahead extends LightningElement {
  @api pageTitle = "Places Typeahead Showcase";

  @track selectedPlace = null;
  @track selectedAddress = "";
  @track addressComponents = {};

  // Configuration options for testing different behaviors
  countryRestriction = "ca";
  biasLocation = { lat: 43.6532, lng: -79.3832 }; // Toronto

  // Address component breakdown for verification
  @track streetNumber = "";
  @track streetName = "";
  @track city = "";
  @track province = "";
  @track postalCode = "";
  @track country = "";

  handlePlaceSelected(event) {
    this.selectedPlace = event.detail;
    this.selectedAddress =
      event.detail.formatted_address || event.detail.description;

    // Parse address components
    if (event.detail.address_components) {
      this.parseAddressComponents(event.detail.address_components);
    }

    this.dispatchEvent(
      new CustomEvent("placeselected", { detail: event.detail })
    );
  }

  parseAddressComponents(components) {
    this.streetNumber = this.getComponentValue(components, "street_number");
    this.streetName = this.getComponentValue(components, "route");
    this.city = this.getComponentValue(components, "locality");
    this.province = this.getComponentValue(
      components,
      "administrative_area_level_1"
    );
    this.postalCode = this.getComponentValue(components, "postal_code");
    this.country = this.getComponentValue(components, "country");

    this.addressComponents = {
      streetNumber: this.streetNumber,
      streetName: this.streetName,
      city: this.city,
      province: this.province,
      postalCode: this.postalCode,
      country: this.country
    };
  }

  getComponentValue(components, type) {
    const component = components.find((c) => c.types.includes(type));
    return component ? component.long_name : "";
  }

  handleClear() {
    this.selectedPlace = null;
    this.selectedAddress = "";
    this.streetNumber = "";
    this.streetName = "";
    this.city = "";
    this.province = "";
    this.postalCode = "";
    this.country = "";
    this.addressComponents = {};
  }

  get hasSelection() {
    return this.selectedPlace !== null;
  }

  get fullStreetAddress() {
    if (!this.streetNumber && !this.streetName) return "";
    return `${this.streetNumber} ${this.streetName}`.trim();
  }

  get coordinates() {
    if (!this.selectedPlace?.geometry?.location) return null;
    const loc = this.selectedPlace.geometry.location;
    return {
      lat: typeof loc.lat === "function" ? loc.lat() : loc.lat,
      lng: typeof loc.lng === "function" ? loc.lng() : loc.lng
    };
  }

  get formattedCoordinates() {
    if (!this.coordinates) return "";
    return `${this.coordinates.lat.toFixed(6)}, ${this.coordinates.lng.toFixed(6)}`;
  }
}
