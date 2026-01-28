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

**Response JSON Path:**

```
$.features[0].attributes
```

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

**Response JSON Path:**

```
$.features[*].attributes
```

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

### Element 5: Response Action - Format Output

**Type:** Response Action
**Name:** FormatResponse

**Send JSON Path:**

```json
{
  "mecpDistrict": {
    "districtName": "%GetMECPDistrict:MECP_DISTRICT%",
    "areaName": "%GetMECPDistrict:MECP_AREA%",
    "regionName": "%GetMECPDistrict:MECP_REGION%",
    "districtOfficeName": "%GetMECPDistrict:DISTRICT_OFFICE_NAME_EN%",
    "districtPhone": "%GetMECPDistrict:DISTRICT_OFFICE_PHONENUMBER%",
    "districtTollFree": "%GetMECPDistrict:DISTRICT_OFFICE_TOLLFREENUMBER%",
    "districtAddress": "%GetMECPDistrict:DISTRICT_OFFICE_STREETNAME_EN%",
    "districtCity": "%GetMECPDistrict:DISTRICT_OFFICE_CITY%",
    "districtPostalCode": "%GetMECPDistrict:DISTRICT_OFFICE_POSTAL_CODE%",
    "areaOfficeName": "%GetMECPDistrict:AREA_OFFICE_NAME_EN%",
    "areaPhone": "%GetMECPDistrict:AREA_OFFICE_PHONENUMBER%",
    "areaTollFree": "%GetMECPDistrict:AREA_OFFICE_TOLLFREENUMBER_EN%"
  },
  "nearbyEASR": "%GetNearbyEASR%",
  "nearbyECAs": "%GetNearbyECAs%",
  "nearbyWaterPermits": "%GetNearbyWaterPermits%"
}
```

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

### Step 2: Display MECP District in Callout

Add a **Set Values** element to format the callout content:

```json
{
  "mecpCalloutContent": "**%IPResult:mecpDistrict:districtOfficeName%**\n\nPhone: %IPResult:mecpDistrict:districtPhone%\nToll-free: %IPResult:mecpDistrict:districtTollFree%\n\n%IPResult:mecpDistrict:districtAddress%\n%IPResult:mecpDistrict:districtCity%, ON %IPResult:mecpDistrict:districtPostalCode%"
}
```

Then add a **Text Block** element configured as a callout:

| Property           | Value                     |
| ------------------ | ------------------------- |
| Component Override | sfGpsDsCaOnFormTextBlock  |
| calloutType        | highlight                 |
| calloutHeading     | MECP district/Area office |
| text               | %mecpCalloutContent%      |

### Step 3: Display Nearby EASR Registrations

For displaying nearby registrations, use an **Edit Block** or custom component:

```javascript
// In a custom LWC, access the IP result:
const nearbyEASR = this.omniJsonData?.IPResult?.nearbyEASR || [];

// Render as a list or table
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

### Sample Response

```json
{
  "mecpDistrict": {
    "districtName": "Toronto",
    "areaName": "Toronto and Area",
    "regionName": "Central Region",
    "districtOfficeName": "Toronto District Office",
    "districtPhone": "416-326-6700",
    "districtTollFree": "1-800-387-7109",
    "districtAddress": "5775 Yonge Street, 8th Floor",
    "districtCity": "Toronto",
    "districtPostalCode": "M2M 4J1",
    "areaOfficeName": "Toronto Area Office",
    "areaPhone": "416-326-6700",
    "areaTollFree": "1-800-387-7109"
  },
  "nearbyEASR": [
    {
      "APPROVAL_NUMBER": "EASR-2024-001234",
      "BUSINESS_NAME": "ABC Construction Ltd",
      "ADDRESS": "100 King Street West",
      "MUNICIPALITY": "Toronto",
      "APPROVAL_DATE": "2024-06-15",
      "APPROVAL_TYPE": "Stormwater Management Works",
      "PROJECT_TYPE": "New",
      "STATUS": "Active",
      "MOE_DISTRICT": "Toronto District Office"
    }
  ],
  "nearbyECAs": [],
  "nearbyWaterPermits": []
}
```

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

## Related Documentation

- [GIS Guide](./GIS_GUIDE.md) - GIS component setup and CSP configuration
- [OmniStudio Forms Guide](./OMNISTUDIO_FORMS.md) - Form component usage
- [Stormwater Works Guide](./STORMWATER_WORKS.md) - Full workflow implementation
