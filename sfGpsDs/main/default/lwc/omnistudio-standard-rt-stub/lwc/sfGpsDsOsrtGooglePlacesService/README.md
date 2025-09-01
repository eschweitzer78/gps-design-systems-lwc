## Modules

| Module                                                                    | Description                                                                                                                       |
| ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| [c/sfGpsDsOsrtGooglePlacesService](#markdown-header-cgoogleplacesservice) | A library style component, exporting the classes GooglePlacesService, and GoogleApiService, as well as several utility functions. |

## c/sfGpsDsOsrtGooglePlacesService

A library style component, exporting the classes GooglePlacesService, and GoogleApiService, as well as several utility functions.

- [c/sfGpsDsOsrtGooglePlacesService](#markdown-header-cgoogleplacesservice)
  - [.GooglePlacesService](#markdown-header-cgoogleplacesservicegoogleplacesservice)
    - [new exports.GooglePlacesService(apiKey, [outputType])](#markdown-header-new-exportsgoogleplacesserviceapikey-outputtype)
    - [.placeSearch(query, [fields], [locationBias], [inputType], [language], [params])](#markdown-header-googleplacesserviceplacesearchquery-fields-locationbias-inputtype-language-params) ⇒
    - [.placeDetails(placeId, fields, sessionToken, params)](#markdown-header-googleplacesserviceplacedetailsplaceid-fields-sessiontoken-params)
    - [.placeAutocomplete(query, location, radius, sessionToken, types, country, params)](#markdown-header-googleplacesserviceplaceautocompletequery-location-radius-sessiontoken-types-country-params)
    - ~~[.calculateZoom(component, viewport)](#markdown-header-googleplacesservicecalculatezoomcomponent-viewport-number) ⇒ number~~
  - [.GoogleApiService](#markdown-header-cgoogleplacesservicegoogleapiservice)
    - [new exports.GoogleApiService(map)](#markdown-header-new-exportsgoogleapiservicemap)
    - [.placeDetails(placeId, fields, sessionToken, params)](#markdown-header-googleapiserviceplacedetailsplaceid-fields-sessiontoken-params)
    - [.placeAutocomplete(query, location, radius, sessionToken, types, country, params)](#markdown-header-googleapiserviceplaceautocompletequery-location-radius-sessiontoken-types-country-params)
  - [.calculateZoom(component, viewport)](#markdown-header-cgoogleplacesservicecalculatezoomcomponent-viewport-number) ⇒ number
  - [.getCoordinates()](#markdown-header-cgoogleplacesservicegetcoordinates-promise) ⇒ Promise

### c/sfGpsDsOsrtGooglePlacesService.GooglePlacesService

Use this class when the Maps JavaScript API is not available.

**Kind**: static class of [c/sfGpsDsOsrtGooglePlacesService](#markdown-header-cgoogleplacesservice)

- [.GooglePlacesService](#markdown-header-cgoogleplacesservicegoogleplacesservice)
  - [new exports.GooglePlacesService(apiKey, [outputType])](#markdown-header-new-exportsgoogleplacesserviceapikey-outputtype)
  - [.placeSearch(query, [fields], [locationBias], [inputType], [language], [params])](#markdown-header-googleplacesserviceplacesearchquery-fields-locationbias-inputtype-language-params) ⇒
  - [.placeDetails(placeId, fields, sessionToken, params)](#markdown-header-googleplacesserviceplacedetailsplaceid-fields-sessiontoken-params)
  - [.placeAutocomplete(query, location, radius, sessionToken, types, country, params)](#markdown-header-googleplacesserviceplaceautocompletequery-location-radius-sessiontoken-types-country-params)
  - ~~[.calculateZoom(component, viewport)](#markdown-header-googleplacesservicecalculatezoomcomponent-viewport-number) ⇒ number~~

#### new exports.GooglePlacesService(apiKey, [outputType])

| Param        | Type   | Description                                                                                                                       |
| ------------ | ------ | --------------------------------------------------------------------------------------------------------------------------------- |
| apiKey       | string | @see [https://developers.google.com/places/web-service/get-api-key](https://developers.google.com/places/web-service/get-api-key) |
| [outputType] | string | 'json' or 'xml', 'json' is default.                                                                                               |

**Example**

```js
import { GooglePlacesService } from 'c/sfGpsDsOsrtGooglePlacesService';

//...
connectedCallback() {
  this.placesService = new GooglePlacesService('MYAPIKEY');
}
//...
getPlacesAutoComplete(query) {
  return this.placesService.placeAutocomplete(query, this.locaiton, this.radius)
    .then(result => this.handleResponse(result))
    .catch(reason => this.handleError(reason));
}
```

#### googlePlacesService.placeSearch(query, [fields], [locationBias], [inputType], [language], [params]) ⇒

Query for place information on a variety of categories,
such as: establishments, prominent points of interest,
geographic locations, and more. You can search for places
either by proximity or a text string. A Place Search returns a
list of places along with summary information about each place; additional
information is available via a Place Details query.

**Kind**: instance method of GooglePlacesService  
**Returns**: Promise<any>

| Param          | Type      | Default       | Description                                                                                                    |
| -------------- | --------- | ------------- | -------------------------------------------------------------------------------------------------------------- |
| query          | string    |               |                                                                                                                |
| [fields]       | string    | `"name"`      |                                                                                                                |
| [locationBias] | string    |               |                                                                                                                |
| [inputType]    | InputType | `'textquery'` |                                                                                                                |
| [language]     | string    |               |                                                                                                                |
| [params]       | string    |               | Any additional url parameters supported by google api. https://developers.google.com/places/web-service/search |

#### googlePlacesService.placeDetails(placeId, fields, sessionToken, params)

**Kind**: instance method of GooglePlacesService

| Param        | Type   | Default  |
| ------------ | ------ | -------- |
| placeId      | string |          |
| fields       | string | `"name"` |
| sessionToken | string |          |
| params       | string |          |

#### googlePlacesService.placeAutocomplete(query, location, radius, sessionToken, types, country, params)

**Kind**: instance method of GooglePlacesService

| Param        | Type         | Default     | Description                                                                                                                                                                                           |
| ------------ | ------------ | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| query        | string       |             | The text string on which to search. The Place Autocomplete service will return candidate matches based on this string and order results based on their perceived relevance.                           |
| location     | string       |             | The point around which you wish to retrieve place information. Must be specified as latitude,longitude. @see [module:c/sfGpsDsOsrtUtility#getCoordinates](module:c/sfGpsDsOsrtUtility#getCoordinates) |
| radius       | number       | `25000`     | The distance (in meters) within which to return place results. Note that setting a radius biases results to the indicated area, but may not fully restrict results to the specified area.             |
| sessionToken | SessionToken |             | A random string which identifies an autocomplete session for billing purposes. If this parameter is omitted from an autocomplete request, the request is billed independently.                        |
| types        | string       | `"geocode"` | The types of place results to return. See Place Types below. If no type is specified, all types will be returned.                                                                                     |
| country      | string       |             | Countries must be passed as a two character, ISO 3166-1 Alpha-2 compatible country code. You may pass up to 5 countries,                                                                              | separated. |
| params       | string       |             | Any additional url parameters not supported by this service, but supported by the Google Places API.                                                                                                  |

#### ~~googlePlacesService.calculateZoom(component, viewport) ⇒ number~~

**_Deprecated_**

**Kind**: instance method of GooglePlacesService

| Param     | Type             |
| --------- | ---------------- |
| component | LightningElement |
| viewport  | Object           |

### c/sfGpsDsOsrtGooglePlacesService.GoogleApiService

Use this class when the Maps JavaScript API is available.

**Kind**: static class of [c/sfGpsDsOsrtGooglePlacesService](#markdown-header-cgoogleplacesservice)

- [.GoogleApiService](#markdown-header-cgoogleplacesservicegoogleapiservice)
  - [new exports.GoogleApiService(map)](#markdown-header-new-exportsgoogleapiservicemap)
  - [.placeDetails(placeId, fields, sessionToken, params)](#markdown-header-googleapiserviceplacedetailsplaceid-fields-sessiontoken-params)
  - [.placeAutocomplete(query, location, radius, sessionToken, types, country, params)](#markdown-header-googleapiserviceplaceautocompletequery-location-radius-sessiontoken-types-country-params)

#### new exports.GoogleApiService(map)

Create a service to interact with the Maps JavaScript API

| Param | Type           |
| ----- | -------------- |
| map   | HTMLDivElement |

**Example**

```js
import { GoogleApiService } from 'c/sfGpsDsOsrtGooglePlacesService';

//...
connectedCallback() {
  this.mapContainer = this.template.querySelector('data-map-container');
  this.placesService = new GoogleApiService(mapContainer);
}
//...
getPlacesAutoComplete(query) {
  return this.placesService.placeAutocomplete(query, this.locaiton, this.radius)
    .then(result => this.handleResponse(result))
    .catch(reason => this.handleError(reason));
}
```

#### googleApiService.placeDetails(placeId, fields, sessionToken, params)

Retrieves details about the place identified by the given placeId.

**Kind**: instance method of GoogleApiService

| Param        | Type                                        | Default  |
| ------------ | ------------------------------------------- | -------- |
| placeId      | string                                      |          |
| fields       | string                                      | `"name"` |
| sessionToken | google.maps.places.AutocompleteSessionToken |          |
| params       | string                                      |          |

#### googleApiService.placeAutocomplete(query, location, radius, sessionToken, types, country, params)

Retrieves place autocomplete predictions based on the supplied autocomplete request.

**Kind**: instance method of GoogleApiService

| Param        | Type                                        | Default     | Description                                                                                                                                                                                           |
| ------------ | ------------------------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| query        | string                                      |             | The text string on which to search. The Place Autocomplete service will return candidate matches based on this string and order results based on their perceived relevance.                           |
| location     | string                                      |             | The point around which you wish to retrieve place information. Must be specified as latitude,longitude. @see [module:c/sfGpsDsOsrtUtility#getCoordinates](module:c/sfGpsDsOsrtUtility#getCoordinates) |
| radius       | number                                      | `25000`     | The distance (in meters) within which to return place results. Note that setting a radius biases results to the indicated area, but may not fully restrict results to the specified area.             |
| sessionToken | google.maps.places.AutocompleteSessionToken |             | A random string which identifies an autocomplete session for billing purposes. If this parameter is omitted from an autocomplete request, the request is billed independently.                        |
| types        | string                                      | `"geocode"` | The types of place results to return. See Place Types below. If no type is specified, all types will be returned.                                                                                     |
| country      | string                                      |             | Countries must be passed as a two character, ISO 3166-1 Alpha-2 compatible country code. You may pass up to 5 countries,                                                                              | separated. |
| params       | string                                      |             | Any additional url parameters not supported by this service, but supported by the Google Places API.                                                                                                  |

### c/sfGpsDsOsrtGooglePlacesService.calculateZoom(component, viewport) ⇒ number

Fit the given bounds to the viewport.
Extrapolated from: [https://stackoverflow.com/questions/6048975/google-maps-v3-how-to-calculate-the-zoom-level-for-a-given-bounds](https://stackoverflow.com/questions/6048975/google-maps-v3-how-to-calculate-the-zoom-level-for-a-given-bounds)

**Kind**: static method of [c/sfGpsDsOsrtGooglePlacesService](#markdown-header-cgoogleplacesservice)

| Param     | Type             |
| --------- | ---------------- |
| component | LightningElement |
| viewport  | Object           |

### c/sfGpsDsOsrtGooglePlacesService.getCoordinates() ⇒ Promise

Wrapper for navigator.geolocation.getCurrentPosition.

**Kind**: static method of [c/sfGpsDsOsrtGooglePlacesService](#markdown-header-cgoogleplacesservice)

## InputType : enum

Enum for inputType values.

**Kind**: global enum  
**Read only**: true

## OutputType : enum

Enum for outputType values

**Kind**: global enum  
**Read only**: true
