import { handleData } from "c/sfGpsDsOsrtSalesforceUtils";
import {
  BASE_URL,
  InputType,
  OutputType,
  SessionToken,
  GooglePlacesError,
  GoogleApiError
} from "./constants";

/**
 * A library style component, exporting the classes GooglePlacesService, and GoogleApiService, as well as several utility functions.
 * @module c/sfGpsDsOsrtGooglePlacesService
 */

/**
 * Use this class when the Maps JavaScript API  is not available.
 * @example
 * ``` js
 * import { GooglePlacesService } from 'c/sfGpsDsOsrtGooglePlacesService';
 *
 * //...
 * connectedCallback() {
 *   this.placesService = new GooglePlacesService('MYAPIKEY');
 * }
 * //...
 * getPlacesAutoComplete(query) {
 *   return this.placesService.placeAutocomplete(query, this.locaiton, this.radius)
 *     .then(result => this.handleResponse(result))
 *     .catch(reason => this.handleError(reason));
 * }
 * ```
 */
export class GooglePlacesService {
  /**
   * @param {string} apiKey - @see {@link https://developers.google.com/places/web-service/get-api-key}
   * @param {string} [outputType] - 'json' or 'xml', 'json' is default.
   */
  constructor(apiKey, outputType) {
    this.apiKey = apiKey;
    this.outputType = OutputType[outputType] || OutputType.default;
    this.endpoints = Object.freeze({
      placeSearch: `${BASE_URL}/findplacefromtext/${this.outputType}?key=${this.apiKey}`,
      placeDetails: `${BASE_URL}/details/${this.outputType}?key=${this.apiKey}`,
      placeAutocomplete: `${BASE_URL}/autocomplete/${this.outputType}?key=${this.apiKey}`
    });
  }

  /**
   * Query for place information on a variety of categories,
   * such as: establishments, prominent points of interest,
   * geographic locations, and more. You can search for places
   * either by proximity or a text string. A Place Search returns a
   * list of places along with summary information about each place; additional
   * information is available via a Place Details query.
   *
   * @param {string} query
   * @param {string} [fields=name]
   * @param {string} [locationBias]
   * @param {InputType} [inputType='textquery']
   * @param {string} [language]
   * @param {string} [params] - Any additional url parameters supported by google api. https://developers.google.com/places/web-service/search
   * @returns Promise<any>
   */
  placeSearch(
    query,
    fields = "name",
    locationBias,
    inputType = InputType.default,
    language,
    params
  ) {
    let url = `${this.endpoints.placeSearch}&input=${query}&inputtype=${inputType}`;

    if (fields) url += `&fields=${fields}`;
    if (locationBias) url += `&locationbias=${locationBias}`;
    if (language) url += `&language=${language}`;
    if (params) url += params;

    return callApi(url).catch((reason) =>
      handleError(reason, "Error handling place search endpoint.")
    );
  }

  /**
   *
   * @param {string} placeId
   * @param {string} fields
   * @param {string} sessionToken
   * @param {string} params
   */
  placeDetails(placeId, fields = "name", sessionToken, params) {
    let url = `${this.endpoints.placeDetails}&place_id=${placeId}&fields=${fields}`;

    if (sessionToken) url += `&sessiontoken=${sessionToken}`;
    if (params) url += params;

    return callApi(url).catch((reason) =>
      handleError(reason, "Error handling place details endpoint.")
    );
  }

  placePhotos() {}

  /**
   *
   * @param {string} query - The text string on which to search. The Place Autocomplete service will return candidate matches based on this string and order results based on their perceived relevance.
   * @param {string} location - The point around which you wish to retrieve place information. Must be specified as latitude,longitude. @see {@link module:c/sfGpsDsOsrtUtility#getCoordinates}
   * @param {number} radius - The distance (in meters) within which to return place results. Note that setting a radius biases results to the indicated area, but may not fully restrict results to the specified area.
   * @param {SessionToken} sessionToken - A random string which identifies an autocomplete session for billing purposes. If this parameter is omitted from an autocomplete request, the request is billed independently.
   * @param {string} types - The types of place results to return. See Place Types below. If no type is specified, all types will be returned.
   * @param {string} country - Countries must be passed as a two character, ISO 3166-1 Alpha-2 compatible country code. You may pass up to 5 countries, | separated.
   * @param {string} params - Any additional url parameters not supported by this service, but supported by the Google Places API.
   */
  placeAutocomplete(
    query,
    location,
    radius = 25000,
    sessionToken = new SessionToken(4),
    types = "geocode",
    country,
    params
  ) {
    let url = `${this.endpoints.placeAutocomplete}&input=${encodeURIComponent(
      query
    )}&sessiontoken=${sessionToken}&types=${types}`;

    if (location) url += `&location=${location}&radius=${radius}`;
    if (country && country !== "all") url += `&components=country:${country}`;
    if (params) url += params;

    return callApi(url)
      .then((result) => {
        result.sessionToken = sessionToken;
        return result;
      })
      .catch((reason) =>
        handleError(reason, "Error handling place autocomplete endpoint.")
      );
  }

  queryAutocomplete() {}

  /**
   * @deprecated Use the exported calculateZoom function instead.
   * @param {LightningElement} component
   * @param {Object} viewport
   * @returns {number}
   */
  calculateZoom(component, viewport) {
    return calculateZoom(component, viewport);
  }
}

/**
 * Use this class when the Maps JavaScript API  is available.
 * @example
 * ``` js
 * import { GoogleApiService } from 'c/sfGpsDsOsrtGooglePlacesService';
 *
 * //...
 * connectedCallback() {
 *   this.mapContainer = this.template.querySelector('data-map-container');
 *   this.placesService = new GoogleApiService(mapContainer);
 * }
 * //...
 * getPlacesAutoComplete(query) {
 *   return this.placesService.placeAutocomplete(query, this.locaiton, this.radius)
 *     .then(result => this.handleResponse(result))
 *     .catch(reason => this.handleError(reason));
 * }
 * ```
 */
export class GoogleApiService {
  /**
   * Create a service to interact with the Maps JavaScript API
   * @param {HTMLDivElement} map
   */
  constructor(map) {
    this.clientApi = true;
    this.autocompleteService =
      new window.google.maps.places.AutocompleteService();
    this.placesService = new window.google.maps.places.PlacesService(map);
  }

  /**
   * Retrieves details about the place identified by the given placeId.
   * @param {string} placeId
   * @param {string} fields
   * @param {google.maps.places.AutocompleteSessionToken} sessionToken
   * @param {string} params
   */
  // eslint-disable-next-line no-unused-vars
  placeDetails(placeId, fields = "name", sessionToken, params) {
    /** @type {google.maps.places.PlaceDetailsRequest} */
    let request = {
      placeId: placeId,
      fields: fields.split(","),
      sessionToken: sessionToken
    };

    return new Promise((resolve, reject) => {
      this.placesService.getDetails(request, (result, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          resolve({ result: result });
        } else {
          reject(new GoogleApiError(status));
        }
      });
    }).catch((reason) =>
      handleError(reason, "Error handling place details endpoint.")
    );
  }

  /**
   * Retrieves place autocomplete predictions based on the supplied autocomplete request.
   * @param {string} query - The text string on which to search. The Place Autocomplete service will return candidate matches based on this string and order results based on their perceived relevance.
   * @param {string} location - The point around which you wish to retrieve place information. Must be specified as latitude,longitude. @see {@link module:c/sfGpsDsOsrtUtility#getCoordinates}
   * @param {number} radius - The distance (in meters) within which to return place results. Note that setting a radius biases results to the indicated area, but may not fully restrict results to the specified area.
   * @param {google.maps.places.AutocompleteSessionToken} sessionToken - A random string which identifies an autocomplete session for billing purposes. If this parameter is omitted from an autocomplete request, the request is billed independently.
   * @param {string} types - The types of place results to return. See Place Types below. If no type is specified, all types will be returned.
   * @param {string} country - Countries must be passed as a two character, ISO 3166-1 Alpha-2 compatible country code. You may pass up to 5 countries, | separated.
   * @param {string} params - Any additional url parameters not supported by this service, but supported by the Google Places API.
   */
  placeAutocomplete(
    query,
    location,
    radius = 25000,
    sessionToken = new window.google.maps.places.AutocompleteSessionToken(),
    types = "geocode",
    country,
    // eslint-disable-next-line no-unused-vars
    params
  ) {
    /** @type {google.maps.places.AutocompletionRequest} */
    let autocompleteRequest = {
      input: query,
      sessionToken: sessionToken,
      types: types.split(",")
    };

    if (location) {
      try {
        const latLngComponents = location.split(",");
        autocompleteRequest = {
          ...autocompleteRequest,
          ...{
            location: new window.google.maps.LatLng(
              Number(latLngComponents[0]),
              Number(latLngComponents[1])
            ),
            radius: radius
          }
        };
      } catch (err) {
        console.warn("Unexpected location format.", err);
      }
    }

    if (country && country !== "all") {
      autocompleteRequest = {
        ...autocompleteRequest,
        ...{ componentRestrictions: { country: country } }
      };
    }

    return new Promise((resolve, reject) => {
      this.autocompleteService.getPlacePredictions(
        autocompleteRequest,
        (result, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            resolve({ predictions: result, sessionToken: sessionToken });
          } else {
            reject(new GoogleApiError(status));
          }
        }
      );
    }).catch((reason) =>
      handleError(reason, "Error handling place autocomplete endpoint.")
    );
  }
}

function callApi(url) {
  const requestData = {
    type: "rest",
    value: {
      methodType: "GET",
      subType: "web",
      endpoint: url
    }
  };

  return getDataHandler(JSON.stringify(requestData)).then((result) => {
    result = JSON.parse(result);

    if (result.status !== "OK") {
      throw new GooglePlacesError(result.status, result.error_message);
    }

    return result;
  });
}

// This method has been copied from `c/sfGpsDsOsrtUtility/dataHandler.js`
// @param {string} requestData - stringified request object.
function getDataHandler(requestData) {
  if (requestData) {
    let requestObj =
      typeof requestData === "string" ? JSON.parse(requestData) : requestData;

    if (
      requestObj.value &&
      requestObj.value.vlocityAsync &&
      (requestObj.type.toLowerCase() === "integrationprocedures" ||
        requestObj.type.toLowerCase() === "apexremote")
    ) {
      let promise = new Promise((resolve, reject) => {
        handleAsynCall(requestData, resolve, reject);
      });
      return promise;
    }
    return handleData({
      dataSourceMap: requestData
    });
  }
  return false;
}

// This method has been copied from `c/sfGpsDsOsrtUtility/dataHandler.js`
// @param {string} requestData - stringified request object.
// @param {Function} resolve - Success callback.
// @param {Function} reject - Failure callback.
function handleAsynCall(requestData, resolve, reject) {
  let requestObj =
    typeof requestData === "string" ? JSON.parse(requestData) : requestData;

  handleData({
    dataSourceMap: requestData
  })
    .then((res) => {
      if (res.result === "WAIT") {
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(() => {
          requestObj.value.stagingObjectId = res.responseId;
          handleAsynCall(JSON.stringify(requestObj), resolve, reject);
        }, requestObj.value.vlocityAsyncTimeout || 1000);
      } else {
        let asynRes = JSON.parse(res.result);
        if (asynRes.error && asynRes.error !== "OK") {
          reject(res.result);
        } else {
          resolve(res.result);
        }
      }
    })
    .catch((error) => {
      reject(error);
    });
}

function handleError(reason, message) {
  if (reason.constructor.name !== "GooglePlacesError") {
    try {
      reason = new GooglePlacesError(
        reason.body.exceptionType,
        reason.body.message.replace(/\/maps\/.*/, "")
      );
    } catch (err) {
      window.console.error(
        `Unhandled Error: ${message}`,
        JSON.stringify(reason)
      );
    }
  }

  throw reason;
}

function latRad(lat) {
  const sin = Math.sin((lat * Math.PI) / 180);
  const radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
  return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
}

function zoom(mapPx, worldPx, fraction) {
  return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
}

/**
 * Fit the given bounds to the viewport.
 * Extrapolated from: {@link https://stackoverflow.com/questions/6048975/google-maps-v3-how-to-calculate-the-zoom-level-for-a-given-bounds}
 * @param {LightningElement} component
 * @param {Object} viewport
 * @returns {number}
 */
export function calculateZoom(component, viewport) {
  const ZOOM_MAX = 20;
  const WORLD_BOUNDS = { width: 256, height: 256 };
  const componentBounds = component.getBoundingClientRect();
  let north = 0;
  let east = 0;
  let south = 0;
  let west = 0;
  if (typeof viewport.toJSON === "function") {
    viewport = viewport.toJSON();
  }
  if (viewport.north) {
    north = viewport.north;
    east = viewport.east;
    south = viewport.south;
    west = viewport.west;
  } else if (viewport.northeast && viewport.northeast.lat) {
    north = viewport.northeast.lat;
    east = viewport.northeast.lng;
    south = viewport.southwest.lat;
    west = viewport.southwest.lng;
  }

  const latFraction = (latRad(north) - latRad(south)) / Math.PI;
  const lngDiff = east - west;
  const lngFraction = (lngDiff < 0 ? lngDiff + 360 : lngDiff) / 360;

  const horizontalZoom = zoom(
    componentBounds.width,
    WORLD_BOUNDS.width,
    lngFraction
  );

  const verticalZoom = zoom(
    componentBounds.height,
    WORLD_BOUNDS.height,
    latFraction
  );

  return Math.min(horizontalZoom, verticalZoom, ZOOM_MAX);
}

/**
 * Wrapper for navigator.geolocation.getCurrentPosition.
 * @returns {Promise}
 */
export function getCoordinates() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (result) => resolve(result.coords),
        (reason) => reject(reason)
      );
    } else {
      reject("Geolocation unsupported.");
    }
  });
}
