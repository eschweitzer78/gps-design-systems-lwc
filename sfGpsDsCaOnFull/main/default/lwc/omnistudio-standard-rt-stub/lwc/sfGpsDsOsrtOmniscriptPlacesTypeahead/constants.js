/**
 * @class
 */
export class Place {
  /**
   * A constructor used to transform the results from GooglePlacesService.placeDetails,
   * to the structure consumed by omniscript, as well as the lightningMap component.
   * @param {Object} placeDetailsResult
   * @param {string} placeDetailsResult.name - Contains the human-readable name for the returned result. For establishment results, this is usually the canonicalized business name.
   * @param {string} placeDetailsResult.formatted_address - is a string containing the human-readable address of this place.
   * @param {Object} placeDetailsResult.geometry - contains the following information:
   *  - location contains the geocoded latitude,longitude value for this place.
   *  - viewport contains the preferred viewport when displaying this place on a map as a LatLngBounds if it is known.
   */
  constructor(placeDetailsResult) {
    const lat = placeDetailsResult.geometry.location.lat;
    const lng = placeDetailsResult.geometry.location.lng;
    this.location = {
      Latitude: typeof lat === "function" ? lat() : lat,
      Longitude: typeof lng === "function" ? lng() : lng
    };
    this.title = placeDetailsResult.name;
    this.description = placeDetailsResult.formatted_address;
  }
}

/**
 * Comma separated list of fields to be returned by the googlePlacesApi place details endpoint.
 * For a complete list of fields see: {@link:https://developers.google.com/places/web-service/details#fields}
 * @type {string}
 */
export const PLACE_DETAIL_FIELDS =
  "name,address_component,formatted_address,geometry,type,vicinity";

export const COMPONENT_MAPPING = {
  street_number: "short_name",
  route: "long_name",
  locality: "long_name",
  administrative_area_level_1: "short_name",
  administrative_area_level_2: "short_name",
  country: "long_name",
  postal_code: "short_name"
};

export const GOOGLE_ATTRIBUTION =
  "data:image/png;base64,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";
