# Ontario LIO Integration Procedure Guide

This guide explains how to create Integration Procedures that query Ontario's Land Information Ontario (LIO) ArcGIS REST services to retrieve environmental data based on geographic coordinates.

---

## Overview

The Ontario LIO services provide access to environmental data including:

- **MECP District Boundaries** - Ministry office contact information
- **EASR Registrations** - Existing Environmental Activity and Sector Registry sites
- **Environmental Compliance Approvals** - ECA permits
- **Permits to Take Water** - Water taking permits
- **Source Water Protection Areas** - Wellhead protection, aquifers, etc.

All services use standard ArcGIS REST API query operations and return JSON responses.

---

## Prerequisites

### 1. Named Credential Setup

Create a Named Credential for the Ontario LIO services:

**Setup → Security → Named Credentials → New**

| Field                             | Value                                  |
| --------------------------------- | -------------------------------------- |
| Label                             | Ontario LIO Services                   |
| Name                              | Ontario_LIO_Services                   |
| URL                               | `https://ws.lioservices.lrc.gov.on.ca` |
| Identity Type                     | Anonymous                              |
| Authentication Protocol           | No Authentication                      |
| Generate Authorization Header     | Unchecked                              |
| Allow Merge Fields in HTTP Header | Checked                                |
| Allow Merge Fields in HTTP Body   | Checked                                |

### 2. Remote Site Setting (Alternative)

If not using Named Credentials, add a Remote Site:

**Setup → Security → Remote Site Settings → New**

| Field            | Value                                  |
| ---------------- | -------------------------------------- |
| Remote Site Name | Ontario_LIO_Services                   |
| Remote Site URL  | `https://ws.lioservices.lrc.gov.on.ca` |
| Active           | Checked                                |

---

## Integration Procedure: EASR_GetLocationDetails

This Integration Procedure retrieves comprehensive location data including MECP district, nearby environmental registrations, and source water protection information.

### Create the Integration Procedure

**OmniStudio → Integration Procedures → New**

| Field    | Value              |
| -------- | ------------------ |
| Type     | EASR               |
| SubType  | GetLocationDetails |
| Language | English            |

---

### Element 1: HTTP Action - Get MECP District

**Type:** HTTP Action
**Name:** GetMECPDistrict

**Configuration:**

| Field            | Value                                                               |
| ---------------- | ------------------------------------------------------------------- |
| Path             | `/arcgis2/rest/services/MOE/MECP_Full_Boundaries/MapServer/0/query` |
| Method           | GET                                                                 |
| Named Credential | Ontario_LIO_Services                                                |

**Query Parameters:**

```json
{
  "geometry": "%longitude%,%latitude%",
  "geometryType": "esriGeometryPoint",
  "inSR": "4326",
  "spatialRel": "esriSpatialRelIntersects",
  "outFields": "MECP_DISTRICT,MECP_AREA,MECP_REGION,DISTRICT_OFFICE_NAME_EN,DISTRICT_OFFICE_PHONENUMBER,DISTRICT_OFFICE_TOLLFREENUMBER,DISTRICT_OFFICE_STREETNAME_EN,DISTRICT_OFFICE_CITY,DISTRICT_OFFICE_POSTAL_CODE,AREA_OFFICE_NAME_EN,AREA_OFFICE_PHONENUMBER,AREA_OFFICE_TOLLFREENUMBER_EN",
  "returnGeometry": "false",
  "f": "json"
}
```

> **Note:** Leave the Response JSON Path empty. Data transformation is handled by the consuming OmniScript or LWC component.

---

### Element 2: HTTP Action - Get Nearby EASR Registrations

**Type:** HTTP Action
**Name:** GetNearbyEASR

**Configuration:**

| Field            | Value                                                                                |
| ---------------- | ------------------------------------------------------------------------------------ |
| Path             | `/arcgis2/rest/services/Access_Environment/Access_Environment_Map/MapServer/3/query` |
| Method           | GET                                                                                  |
| Named Credential | Ontario_LIO_Services                                                                 |

**Query Parameters:**

```json
{
  "geometry": "%longitude%,%latitude%",
  "geometryType": "esriGeometryPoint",
  "inSR": "4326",
  "spatialRel": "esriSpatialRelIntersects",
  "distance": "%searchRadius%",
  "units": "esriSRUnit_Meter",
  "outFields": "APPROVAL_NUMBER,BUSINESS_NAME,ADDRESS,MUNICIPALITY,APPROVAL_DATE,APPROVAL_TYPE,PROJECT_TYPE,STATUS,MOE_DISTRICT,LATITUDE,LONGITUDE",
  "returnGeometry": "false",
  "orderByFields": "APPROVAL_DATE DESC",
  "resultRecordCount": "10",
  "f": "json"
}
```

**Default Values (Set in preceding Set Values element):**

```json
{
  "searchRadius": "1000"
}
```

> **Note:** Leave the Response JSON Path empty. Data transformation is handled by the consuming OmniScript or LWC component.

---

### Element 3: HTTP Action - Get Nearby ECAs

**Type:** HTTP Action
**Name:** GetNearbyECAs

**Configuration:**

| Field            | Value                                                                                |
| ---------------- | ------------------------------------------------------------------------------------ |
| Path             | `/arcgis2/rest/services/Access_Environment/Access_Environment_Map/MapServer/1/query` |
| Method           | GET                                                                                  |
| Named Credential | Ontario_LIO_Services                                                                 |

**Query Parameters:**

```json
{
  "geometry": "%longitude%,%latitude%",
  "geometryType": "esriGeometryPoint",
  "inSR": "4326",
  "spatialRel": "esriSpatialRelIntersects",
  "distance": "%searchRadius%",
  "units": "esriSRUnit_Meter",
  "outFields": "APPROVAL_NUMBER,BUSINESS_NAME,ADDRESS,MUNICIPALITY,APPROVAL_DATE,APPROVAL_TYPE,STATUS,MOE_DISTRICT",
  "returnGeometry": "false",
  "orderByFields": "APPROVAL_DATE DESC",
  "resultRecordCount": "10",
  "f": "json"
}
```

---

### Element 4: HTTP Action - Get Nearby Water Permits

**Type:** HTTP Action
**Name:** GetNearbyWaterPermits

**Configuration:**

| Field            | Value                                                                                |
| ---------------- | ------------------------------------------------------------------------------------ |
| Path             | `/arcgis2/rest/services/Access_Environment/Access_Environment_Map/MapServer/5/query` |
| Method           | GET                                                                                  |
| Named Credential | Ontario_LIO_Services                                                                 |

**Query Parameters:**

```json
{
  "geometry": "%longitude%,%latitude%",
  "geometryType": "esriGeometryPoint",
  "inSR": "4326",
  "spatialRel": "esriSpatialRelIntersects",
  "distance": "%searchRadius%",
  "units": "esriSRUnit_Meter",
  "outFields": "APPROVAL_NUMBER,BUSINESS_NAME,APPROVAL_TYPE,STATUS,LATITUDE,LONGITUDE",
  "returnGeometry": "false",
  "resultRecordCount": "10",
  "f": "json"
}
```

---

### Element 5: Response Action - Return Full Data

**Type:** Response Action
**Name:** Response

**Configuration:**

| Field                | Value         |
| -------------------- | ------------- |
| Return Full DataJSON | true          |
| Send JSON Path       | (leave empty) |

> **Important:** Due to OmniStudio limitations with accessing nested array elements via merge fields, use `returnFullDataJSON: true` and transform the data in the consuming OmniScript or LWC component. This returns the complete ArcGIS response for each HTTP Action, which can then be processed using JavaScript.

---

## Integration Procedure: EASR_GetSourceWaterProtection

This Integration Procedure retrieves source water protection area data for a given location.

### Create the Integration Procedure

**OmniStudio → Integration Procedures → New**

| Field    | Value                    |
| -------- | ------------------------ |
| Type     | EASR                     |
| SubType  | GetSourceWaterProtection |
| Language | English                  |

---

### Element 1: HTTP Action - Get Source Protection Area

**Type:** HTTP Action
**Name:** GetSourceProtectionArea

**Configuration:**

| Field            | Value                                                                |
| ---------------- | -------------------------------------------------------------------- |
| Path             | `/arcgis2/rest/services/MOE/SourceWaterProtection/MapServer/0/query` |
| Method           | GET                                                                  |
| Named Credential | Ontario_LIO_Services                                                 |

**Query Parameters:**

```json
{
  "geometry": "%longitude%,%latitude%",
  "geometryType": "esriGeometryPoint",
  "inSR": "4326",
  "spatialRel": "esriSpatialRelIntersects",
  "outFields": "*",
  "returnGeometry": "false",
  "f": "json"
}
```

> **Note:** The exact layer IDs and field names for source water protection may vary. Check the [Source Water Protection Viewer](https://www.lioapplications.lrc.gov.on.ca/SourceWaterProtection/) REST services for current layer structure.

---

## Using the Integration Procedure in OmniScript

### Step 1: Add Integration Procedure Action

In your OmniScript, add an **Integration Procedure Action** element:

| Property              | Value                   |
| --------------------- | ----------------------- |
| Name                  | GetLocationDetails      |
| Integration Procedure | EASR_GetLocationDetails |
| Extra Payload         | See below               |

**Extra Payload (from OmniScript data):**

```json
{
  "latitude": "%latitude%",
  "longitude": "%longitude%",
  "searchRadius": "1000"
}
```

### Step 2: Transform Data in Custom LWC Component

Since the Integration Procedure returns the full ArcGIS response, transform the data in your LWC component:

```javascript
// In your custom LWC component

/**
 * Extract MECP District information from the IP result
 */
get mecpDistrict() {
  const ipResult = this.omniJsonData?.GetLocationDetails;
  const attributes = ipResult?.GetMECPDistrict?.features?.[0]?.attributes;

  if (!attributes) return null;

  return {
    districtName: attributes.MECP_DISTRICT,
    areaName: attributes.MECP_AREA,
    regionName: attributes.MECP_REGION,
    districtOfficeName: attributes.DISTRICT_OFFICE_NAME_EN,
    districtPhone: attributes.DISTRICT_OFFICE_PHONENUMBER,
    districtTollFree: attributes.DISTRICT_OFFICE_TOLLFREENUMBER,
    districtAddress: attributes.DISTRICT_OFFICE_STREETNAME_EN,
    districtCity: attributes.DISTRICT_OFFICE_CITY,
    districtPostalCode: attributes.DISTRICT_OFFICE_POSTAL_CODE,
    areaOfficeName: attributes.AREA_OFFICE_NAME_EN,
    areaPhone: attributes.AREA_OFFICE_PHONENUMBER,
    areaTollFree: attributes.AREA_OFFICE_TOLLFREENUMBER_EN
  };
}

/**
 * Extract nearby EASR registrations from the IP result
 */
get nearbyEASR() {
  const ipResult = this.omniJsonData?.GetLocationDetails;
  const features = ipResult?.GetNearbyEASR?.features || [];
  return features.map(f => f.attributes);
}

/**
 * Extract nearby ECAs from the IP result
 */
get nearbyECAs() {
  const ipResult = this.omniJsonData?.GetLocationDetails;
  const features = ipResult?.GetNearbyECAs?.features || [];
  return features.map(f => f.attributes);
}

/**
 * Extract nearby water permits from the IP result
 */
get nearbyWaterPermits() {
  const ipResult = this.omniJsonData?.GetLocationDetails;
  const features = ipResult?.GetNearbyWaterPermits?.features || [];
  return features.map(f => f.attributes);
}
```

### Step 3: Display MECP District in Callout

Use the transformed data to display information:

```html
<template lwc:if="{mecpDistrict}">
  <c-sf-gps-ds-ca-on-callout
    type="highlight"
    heading="MECP District/Area Office"
  >
    <p><strong>{mecpDistrict.districtOfficeName}</strong></p>
    <p>Phone: {mecpDistrict.districtPhone}</p>
    <p>Toll-free: {mecpDistrict.districtTollFree}</p>
    <p>{mecpDistrict.districtAddress}</p>
    <p>{mecpDistrict.districtCity}, ON {mecpDistrict.districtPostalCode}</p>
  </c-sf-gps-ds-ca-on-callout>
</template>
```

### Step 4: Display Nearby EASR Registrations

```html
<template lwc:if="{hasNearbyEASR}">
  <h3>Nearby EASR Registrations</h3>
  <ul>
    <template for:each="{nearbyEASR}" for:item="registration">
      <li key="{registration.APPROVAL_NUMBER}">
        <strong>{registration.BUSINESS_NAME}</strong> -
        {registration.APPROVAL_NUMBER}
        <br />
        {registration.ADDRESS}, {registration.MUNICIPALITY}
      </li>
    </template>
  </ul>
</template>
```

```javascript
get hasNearbyEASR() {
  return this.nearbyEASR && this.nearbyEASR.length > 0;
}
```

---

## Testing the Integration Procedure

### Test in OmniStudio

1. Open the Integration Procedure
2. Click **Preview**
3. Enter test input:
   ```json
   {
     "latitude": 43.6532,
     "longitude": -79.3832,
     "searchRadius": 1000
   }
   ```
4. Click **Execute**
5. Verify the response contains MECP district and nearby registrations

### Sample Response (with returnFullDataJSON: true)

The Integration Procedure returns the full ArcGIS response for each HTTP Action:

```json
{
  "GetMECPDistrict": {
    "displayFieldName": "MECP_DISTRICT",
    "fieldAliases": { ... },
    "fields": [ ... ],
    "features": [
      {
        "attributes": {
          "MECP_DISTRICT": "Toronto",
          "MECP_AREA": "Toronto",
          "MECP_REGION": "Central",
          "DISTRICT_OFFICE_NAME_EN": "Toronto MECP District",
          "DISTRICT_OFFICE_PHONENUMBER": "(416) 326-6700",
          "DISTRICT_OFFICE_TOLLFREENUMBER": "1-800-810-8048",
          "DISTRICT_OFFICE_STREETNAME_EN": "8th floor, 5775 Yonge St.",
          "DISTRICT_OFFICE_CITY": "North York ON",
          "DISTRICT_OFFICE_POSTAL_CODE": "M2M 4J1",
          "AREA_OFFICE_NAME_EN": null,
          "AREA_OFFICE_PHONENUMBER": null,
          "AREA_OFFICE_TOLLFREENUMBER_EN": null
        }
      }
    ]
  },
  "GetNearbyEASR": {
    "displayFieldName": "BUSINESS_NAME",
    "fieldAliases": { ... },
    "fields": [ ... ],
    "features": [
      {
        "attributes": {
          "APPROVAL_NUMBER": "R-010-3118251465",
          "BUSINESS_NAME": "UNIVERSITY HEALTH NETWORK",
          "ADDRESS": "101 College ST",
          "MUNICIPALITY": "Toronto",
          "APPROVAL_DATE": 1767996055000,
          "APPROVAL_TYPE": "EASR-Air Emissions",
          "PROJECT_TYPE": "Air Emissions",
          "STATUS": "REGISTERED",
          "MOE_DISTRICT": "Toronto",
          "LATITUDE": 43.65972222,
          "LONGITUDE": -79.38861111
        }
      }
    ]
  },
  "GetNearbyECAs": { ... },
  "GetNearbyWaterPermits": { ... },
  "GetMECPDistrictStatus": true,
  "GetNearbyEASRStatus": true,
  "GetNearbyECAsStatus": true,
  "GetNearbyWaterPermitsStatus": true
}
```

> **Note:** The `APPROVAL_DATE` field is returned as a Unix timestamp in milliseconds. Convert it to a readable date format in your component:
>
> ```javascript
> const date = new Date(attributes.APPROVAL_DATE);
> const formattedDate = date.toLocaleDateString("en-CA"); // "2024-06-15"
> ```

---

## Available LIO REST API Endpoints

### Access Environment Services

| Layer                              | ID  | URL Path                                                       |
| ---------------------------------- | --- | -------------------------------------------------------------- |
| MOE Points of Interest             | 0   | `/Access_Environment/Access_Environment_Map/MapServer/0/query` |
| Environmental Compliance Approvals | 1   | `/Access_Environment/Access_Environment_Map/MapServer/1/query` |
| Renewable Energy Approval          | 2   | `/Access_Environment/Access_Environment_Map/MapServer/2/query` |
| EASR Registrations                 | 3   | `/Access_Environment/Access_Environment_Map/MapServer/3/query` |
| Pesticide Licenses                 | 4   | `/Access_Environment/Access_Environment_Map/MapServer/4/query` |
| Permit to Take Water               | 5   | `/Access_Environment/Access_Environment_Map/MapServer/5/query` |
| Record of Site Condition           | 6   | `/Access_Environment/Access_Environment_Map/MapServer/6/query` |

### MECP Boundary Services

| Layer          | ID  | URL Path                                      |
| -------------- | --- | --------------------------------------------- |
| MECP Districts | 0   | `/MOE/MECP_Full_Boundaries/MapServer/0/query` |

### Other Useful Services

| Service                           | URL Path                              |
| --------------------------------- | ------------------------------------- |
| Drinking Water                    | `/MOE/DrinkingWater/MapServer`        |
| Provincial Groundwater Monitoring | `/MOE/PGMN/MapServer`                 |
| Waste Sites                       | `/MOE/Waste/MapServer`                |
| LIO Open Data                     | `/LIO_OPEN_DATA/LIO_Open08/MapServer` |

---

## Query Parameter Reference

### Spatial Query Parameters

| Parameter      | Description                            | Example                    |
| -------------- | -------------------------------------- | -------------------------- |
| `geometry`     | Point coordinates (lon,lat)            | `-79.3832,43.6532`         |
| `geometryType` | Type of geometry                       | `esriGeometryPoint`        |
| `inSR`         | Input spatial reference                | `4326` (WGS84)             |
| `spatialRel`   | Spatial relationship                   | `esriSpatialRelIntersects` |
| `distance`     | Buffer distance (for proximity search) | `1000`                     |
| `units`        | Distance units                         | `esriSRUnit_Meter`         |

### Output Parameters

| Parameter           | Description                  | Example                     |
| ------------------- | ---------------------------- | --------------------------- |
| `outFields`         | Fields to return             | `*` or comma-separated list |
| `returnGeometry`    | Include geometry in response | `false`                     |
| `orderByFields`     | Sort order                   | `APPROVAL_DATE DESC`        |
| `resultRecordCount` | Max records                  | `10`                        |
| `f`                 | Output format                | `json`                      |

---

## Error Handling

### Common Errors

| Error                | Cause                   | Solution                                             |
| -------------------- | ----------------------- | ---------------------------------------------------- |
| 403 Forbidden        | CSP/CORS blocked        | Add Named Credential or Remote Site Setting          |
| Empty features array | No data at location     | Location may be outside Ontario or no nearby records |
| Timeout              | Large buffer search     | Reduce searchRadius or resultRecordCount             |
| Invalid geometry     | Wrong coordinate format | Ensure longitude,latitude order (not lat,lon)        |

### Integration Procedure Error Handling

Add a **Condition** element after each HTTP Action:

```json
{
  "conditionType": "Formula",
  "formula": "IF(ISBLANK(%GetMECPDistrict:error%), 'success', 'error')"
}
```

Then branch to handle errors appropriately.

---

## Known Limitations

### OmniStudio Merge Field Syntax

OmniStudio Integration Procedures have limited support for accessing nested array elements via merge fields. The following syntaxes do **not** work reliably for extracting data from ArcGIS responses:

```
# These do NOT work in Response Action sendJSONPath:
%ElementName:features:0:attributes:FIELD_NAME%
%ElementName:features[0]:attributes:FIELD_NAME%
%ElementName.features.0.attributes.FIELD_NAME%
%ElementName|features|0|attributes|FIELD_NAME%
```

Similarly, the Response JSON Path field on HTTP Actions may not correctly parse JSONPath expressions like `$.features[0].attributes`.

**Recommended Approach:** Use `returnFullDataJSON: true` in the Response Action and transform the data in your consuming OmniScript or LWC component using JavaScript.

### Date Field Format

ArcGIS REST API returns date fields as Unix timestamps in milliseconds (not seconds). For example, `APPROVAL_DATE: 1767996055000` represents a date in 2026.

Convert to a JavaScript Date object:

```javascript
const date = new Date(attributes.APPROVAL_DATE);
```

---

## Related Documentation

- [GIS Guide](./GIS_GUIDE.md) - GIS component setup and CSP configuration
- [OmniStudio Forms Guide](./OMNISTUDIO_FORMS.md) - Form component usage
- [Stormwater Works Guide](./STORMWATER_WORKS.md) - Full workflow implementation
