export const BASE_URL = "https://maps.googleapis.com/maps/api/place";
export const PLACE_SEARCH_URL = `${BASE_URL}/findplacefromtext`;
export const PLACE_AUTOCOMPLETE_URL = `${BASE_URL}/autocomplete`;

/**
 * Enum for inputType values.
 * @readonly
 * @enum {string}
 */
export const InputType = Object.freeze({
  textQuery: "textquery",
  phoneNumber: "phonenumber",
  default: "textquery"
});

/**
 * Enum for outputType values
 * @readonly
 * @enum {string}
 */
export const OutputType = Object.freeze({
  json: "json",
  xml: "xml",
  default: "json"
});

export class GooglePlacesError extends Error {
  /**
   * Used to transform an error from the Google Places api to the common format used by Vlocity.
   * @param {string} status - A generic error code returned by the Places API.
   * @param {string} [message] - A more specific message returned by the Places API, may or may not have a vale.
   */
  constructor(status, message) {
    super(status);
    this.errorMsg = message;
    this.error = true;
  }
}

export class GoogleApiError extends Error {
  constructor(status) {
    super(status);
    switch (status) {
      case "INVALID_REQUEST":
        this.errorMsg = "This request was invalid.";
        break;
      case "NOT_FOUND":
        this.errorMsg = "The place referenced was not found.";
        break;
      case "OVER_QUERY_LIMIT":
        this.errorMsg = "The application has gone over its request quota.";
        break;
      case "REQUEST_DENIED":
        this.errorMsg =
          "The application is not allowed to use the PlacesService.";
        break;
      case "UNKNOWN_ERROR":
        this.errorMsg =
          "The PlacesService request could not be processed due to a server error. The request may succeed if you try again.";
        break;
      case "ZERO_RESULTS":
        this.errorMsg = "No result was found for this request.";
        break;
      default:
        this.errorMsg =
          "An un handled error was encountered while processing this request.";

        this.error = true;
    }
  }
}

export class SessionToken extends String {
  /**
   * Creates a randomized string of the specified length;
   * @param {number} length
   */
  constructor(length) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let result = "";

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    super(result);
  }
}
