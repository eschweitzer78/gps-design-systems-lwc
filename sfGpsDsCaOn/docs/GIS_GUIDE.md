# GIS Components Guide - Ontario Design System

This guide covers the Geographic Information System (GIS) components for the Ontario Design System, including ESRI map integration, address selection, and coordinate entry.

---

## Overview

The GIS components provide interactive map-based selection tools for:

- **Site Selection** - Address-based location selection with geocoding
- **Discharge Point Selection** - Coordinate-based location entry (UTM, DMS, Decimal)
- **MECP District Lookup** - Geographic boundary-based data lookup

All components use a shared architecture based on the **PSA-ESRI-MAPS-LWR-DEV** accelerator pattern.

---

## Shared Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ OmniStudio Wrapper (sfGpsDsCaOnForm*Selector)               │
│   - Extends OmniscriptBaseMixin                             │
│   - Maps data to OmniScript fields                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ Main Selector Component                                      │
│   ┌─────────────────────────────────────────────────────┐   │
│   │ sfGpsDsCaOnModal (Ontario DS Modal)                 │   │
│   │   ┌─────────────────┬───────────────────────────┐   │   │
│   │   │ Left Panel      │ Right Panel (VF iframe)   │   │   │
│   │   │  - Controls     │  - ESRI Map               │   │   │
│   │   │  - Search/Input │    - Zoom controls        │   │   │
│   │   │  - Results      │    - Pin marker           │   │   │
│   │   │                 │    - Scale bar            │   │   │
│   │   │ Tab Bar         │                           │   │   │
│   │   └─────────────────┴───────────────────────────┘   │   │
│   └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ <iframe> + postMessage
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ Visualforce Page (sfGpsDsCaOnSiteSelectorPage)              │
│   - ESRI ArcGIS JavaScript SDK 4.29                         │
│   - Geocoding / Reverse geocoding                           │
│   - Map interaction (pin placement)                         │
│   - postMessage communication                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Site Selector Tool

The Site Selector Tool provides ESRI-integrated address selection with geocoding and map visualization.

### Screenshots Reference

| Screenshot | Description                                |
| ---------- | ------------------------------------------ |
| 19         | Entry point - "Site selector tool" button  |
| 20         | Modal with ESRI map and address search     |
| 21         | Address found with parsed location details |

### Components

| Component                          | Description                  | Status      |
| ---------------------------------- | ---------------------------- | ----------- |
| `sfGpsDsCaOnModal`                 | Ontario DS modal overlay     | ✅ Deployed |
| `sfGpsDsCaOnSiteSelectorTool`      | Main site selector with tabs | ✅ Deployed |
| `sfGpsDsCaOnFormSiteSelectorTool`  | OmniStudio wrapper           | ✅ Deployed |
| `sfGpsDsCaOnSiteSelectorPage.page` | VF page with ESRI map        | ✅ Deployed |
| `sfGpsDsCaOnSiteSelectorCtr.cls`   | Apex controller              | ✅ Deployed |

### Modal Component

Base modal component with Ontario DS styling:

| Property          | Type    | Description                        |
| ----------------- | ------- | ---------------------------------- |
| `title`           | String  | Modal title in header              |
| `size`            | String  | `small`, `medium`, `large`, `full` |
| `isOpen`          | Boolean | Controls modal visibility          |
| `hideCloseButton` | Boolean | Hide the X close button            |
| `hideHeader`      | Boolean | Hide the header section            |
| `hideFooter`      | Boolean | Hide the footer section            |

**Features:**

- Dark header matching Ontario branding
- Focus trapping for accessibility
- Escape key to close
- Body scroll lock when open
- Slots for content and footer

**Usage:**

```html
<c-sf-gps-ds-ca-on-modal
  title="Site"
  size="large"
  is-open="{isModalOpen}"
  onclose="{handleModalClose}"
>
  <div slot="content">
    <!-- Modal content -->
  </div>
  <div slot="footer">
    <button>Save site address</button>
  </div>
</c-sf-gps-ds-ca-on-modal>
```

### Read-Only Mode (Back-Office Review)

The Site Selector Tool supports a read-only mode for back-office personnel to review locations captured during application submission.

**Properties:**

| Property   | Type    | Description                                         |
| ---------- | ------- | --------------------------------------------------- |
| `readOnly` | Boolean | Enables read-only mode for location review          |
| `value`    | Object  | Pre-populated location data (address + coordinates) |

**Features in Read-Only Mode:**

- Search and input controls are hidden
- Save button is replaced with Close button
- Map displays the submitted location with a pin marker
- Ontario LIO layers are visible for context (EASR, ECA, etc.)
- Layer list is expanded by default
- Modal title shows "View Only" suffix
- Trigger button shows "View location" instead of "Site selector tool"

**Usage in Experience Builder (Application Review Page):**

```html
<c-sf-gps-ds-ca-on-site-selector-tool
  read-only="true"
  value="{applicationLocation}"
  modal-title="Site Location"
  vf-page-url="/apex/sfGpsDsCaOnSiteSelectorPage"
></c-sf-gps-ds-ca-on-site-selector-tool>
```

**Usage in LWC (Dynamic):**

```javascript
// In your review component
get siteLocationValue() {
  return JSON.stringify({
    address: {
      streetAddress: this.record.Site_Street__c,
      city: this.record.Site_City__c,
      province: this.record.Site_Province__c,
      postalCode: this.record.Site_Postal_Code__c,
      country: "Canada"
    },
    coordinates: {
      latitude: this.record.Site_Latitude__c,
      longitude: this.record.Site_Longitude__c
    }
  });
}
```

```html
<c-sf-gps-ds-ca-on-site-selector-tool
  read-only
  value="{siteLocationValue}"
  modal-title="Site Location"
  vf-page-url="{vfPageUrl}"
></c-sf-gps-ds-ca-on-site-selector-tool>
```

**Use Cases:**

1. **Application Review** - Reviewers can see exactly where the applicant selected their site
2. **Approval Workflow** - Approvers can verify location against nearby environmental data
3. **Audit Trail** - Captured location is displayed without modification risk
4. **Customer Service** - Support staff can view submitted location details

---

### Site Selector Data Structure

The Site Selector Tool returns structured address data to OmniScript:

```json
{
  "address": {
    "streetAddress": "2323 Royal Windsor Drive",
    "city": "Toronto",
    "province": "ON",
    "postalCode": "L5J 1K5",
    "country": "Canada",
    "fullAddress": "2323 Royal Windsor Drive, Toronto, ON, L5J 1K5, Canada"
  },
  "coordinates": {
    "latitude": 43.5081,
    "longitude": -79.6384
  }
}
```

### OmniScript Configuration

**Element Type:** Custom LWC
**LWC Name:** `sfGpsDsCaOnFormSiteSelectorTool`

**Custom Properties:**

```json
{
  "label": "Site address",
  "helpText": "Use the site selector tool to find the address.",
  "required": true,
  "buttonLabel": "Site selector tool",
  "modalTitle": "Site"
}
```

---

## Discharge Point Selector

The Discharge Point Selector allows users to enter geographic coordinates for stormwater discharge points using multiple input formats.

### Screenshots Reference

| Screenshot                         | Description                                                          |
| ---------------------------------- | -------------------------------------------------------------------- |
| 40                                 | Stormwater discharge location page with "Add discharge point" button |
| 41_AddDischargeLocation            | Modal with coordinate format selection                               |
| 41_AddDischargeLocationCoordinates | DMS coordinate entry fields                                          |
| 41_AddDischargeLocationSearch      | Coordinates searched with pin on map                                 |
| 41_DischargePointDetails           | Detailed output with UTM, watershed, source protection data          |

### Key Differences from Site Selector

| Feature       | Site Selector         | Discharge Point Selector                   |
| ------------- | --------------------- | ------------------------------------------ |
| Primary Input | Address search        | **Coordinate entry**                       |
| Input Formats | Address, Coordinates  | **UTM, DMS, Decimal**                      |
| Modal Title   | "Site"                | "Source"                                   |
| Tab Label     | "Site point"          | "Drop point"                               |
| Output Data   | Address + coordinates | **Coordinates + UTM + environmental data** |

### Components

| Component                               | Description                                 | Status      |
| --------------------------------------- | ------------------------------------------- | ----------- |
| `sfGpsDsCaOnCoordinateInput`            | Reusable coordinate input (UTM/DMS/Decimal) | ✅ Deployed |
| `sfGpsDsCaOnDischargePointSelector`     | Main selector with modal and map            | ✅ Deployed |
| `sfGpsDsCaOnFormDischargePointSelector` | OmniStudio wrapper                          | ✅ Deployed |

### Coordinate Input Component

The `sfGpsDsCaOnCoordinateInput` component supports three coordinate formats:

**Properties:**

| Property       | Type    | Description                |
| -------------- | ------- | -------------------------- |
| `format`       | String  | `utm`, `dms`, or `decimal` |
| `required`     | Boolean | Whether input is required  |
| `disabled`     | Boolean | Disable all fields         |
| `errorMessage` | String  | Error message to display   |

**UTM Format:**

- UTM Zone (1-60)
- UTM East (M)
- UTM North (M)

**DMS Format (Degrees, Minutes, Seconds):**

- Latitude: [degrees]° [minutes]' [seconds]"
- Longitude: [degrees]° [minutes]' [seconds]"

**Decimal Format:**

- Latitude (-90 to 90)
- Longitude (-180 to 180)

**API Methods:**

- `getValue()` - Returns current coordinate values
- `setValue(value)` - Sets coordinate values programmatically
- `validate()` - Validates input, returns `{ valid, errors }`
- `toDecimal()` - Converts to decimal lat/lng

### Discharge Point Selector Properties

| Property           | Type    | Description                                          |
| ------------------ | ------- | ---------------------------------------------------- |
| `buttonLabel`      | String  | Trigger button text (default: "Add discharge point") |
| `modalTitle`       | String  | Modal header title (default: "Source")               |
| `vfPageUrl`        | String  | Visualforce page URL for ESRI map                    |
| `defaultLatitude`  | Decimal | Default map center latitude                          |
| `defaultLongitude` | Decimal | Default map center longitude                         |

**Events:**

- `continue` - Fired when user clicks Continue with valid coordinates

**Usage in Experience Builder:**

```html
<c-sf-gps-ds-ca-on-discharge-point-selector
  button-label="Add discharge point"
  modal-title="Source"
  vf-page-url="/apex/sfGpsDsCaOnSiteSelectorPage"
  default-latitude="43.6532"
  default-longitude="-79.3832"
  oncontinue="{handleDischargePointSelected}"
></c-sf-gps-ds-ca-on-discharge-point-selector>
```

### OmniScript Configuration

**Element Type:** Custom LWC
**LWC Name:** `sfGpsDsCaOnFormDischargePointSelector`

**Custom Properties:**

```json
{
  "label": "Discharge point location",
  "helpText": "Enter the coordinates of the discharge point.",
  "required": true,
  "buttonLabel": "Add discharge point",
  "modalTitle": "Source"
}
```

**Output Fields:**
The component updates OmniScript data with:

- `latitude` - Decimal latitude
- `longitude` - Decimal longitude
- `utmZone` - UTM zone (if entered as UTM)
- `utmEast` - UTM east coordinate
- `utmNorth` - UTM north coordinate

### Discharge Point Details (Post-Selection)

After selecting coordinates, an Integration Procedure should fetch additional data:

| Data Category              | Fields                                                           |
| -------------------------- | ---------------------------------------------------------------- |
| **Geographic Coordinates** | Method of collection, Accuracy estimate, UTM (Zone, East, North) |
| **Watershed Info**         | Watershed name, Watershed use (Annual, Summer)                   |
| **Source Protection Area** | 20+ fields including wellhead protection, intake zones, aquifers |

This requires a server-side Integration Procedure that queries spatial data based on the coordinates.

---

## MECP District/Area Office Lookup

After selecting an address using the Site Selector Tool, the "Address Details" OmniScript step displays the corresponding MECP (Ministry of Environment, Conservation and Parks) district office information.

### Screenshot Reference

| Screenshot | Description                                                 |
| ---------- | ----------------------------------------------------------- |
| 22         | Address Details step showing MECP district/Area office card |

### Architecture

The MECP District lookup uses an Integration Procedure triggered by the address coordinates:

```
┌─────────────────────────────────────────────────────────────┐
│ Address Details OmniScript Step                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ [Form fields: Property ID, Assessment roll, etc.]           │
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐│
│ │ MECP district/Area office                                ││
│ │                                                          ││
│ │ Halton-Peel District Office                              ││
│ │ Phone number: 905-319-3847                               ││
│ │ Toll-free: 1-800-335-5906                                ││
│ └──────────────────────────────────────────────────────────┘│
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              ↑
                              │ Data from Integration Procedure
                              │
┌─────────────────────────────────────────────────────────────┐
│ Integration Procedure: GetMECPDistrictByCoordinates         │
│   - Input: latitude, longitude                              │
│   - Query: MECP District boundaries (spatial query)         │
│   - Output: districtName, phoneNumber, tollFree             │
└─────────────────────────────────────────────────────────────┘
```

### Component Usage

Use the existing `sfGpsDsCaOnCallout` component to display the MECP district information:

**OmniScript Configuration:**

| Element      | Type       | Component Override         | Properties                             |
| ------------ | ---------- | -------------------------- | -------------------------------------- |
| MECPDistrict | Text Block | `sfGpsDsCaOnFormTextBlock` | Callout type, populated via Set Values |

**Callout Configuration:**

```json
{
  "type": "Text Block",
  "name": "MECPDistrictCallout",
  "propSetMap": {
    "calloutType": "highlight",
    "calloutHeading": "MECP district/Area office",
    "text": "%MECPDistrictName%\nPhone number: %MECPPhone%\nToll-free: %MECPTollFree%"
  }
}
```

**Alternative: Custom LWC with Callout**

For more control over styling, use the base `sfGpsDsCaOnCalloutComm` component:

```html
<c-sf-gps-ds-ca-on-callout-comm
  heading="MECP district/Area office"
  type="highlight"
  content="{districtInfo}"
>
</c-sf-gps-ds-ca-on-callout-comm>
```

### Integration Procedure Design

**Name:** `EASR_GetMECPDistrictByCoordinates`

**Input:**

```json
{
  "latitude": 43.5081,
  "longitude": -79.6384
}
```

**Output:**

```json
{
  "districtName": "Halton-Peel District Office",
  "phoneNumber": "905-319-3847",
  "tollFree": "1-800-335-5906",
  "address": "4145 North Service Rd, Burlington, ON L7L 6A3"
}
```

**Implementation Options:**

1. **Spatial Query** - Query a custom object `MECP_District__c` with polygon boundaries
2. **External API** - Call an Ontario government API with the coordinates
3. **Static Lookup** - Use a DataRaptor with postal code/region mapping

### Data Model

If using option 1 (Spatial Query), create a custom object:

| Object             | Field          | Type                | Description         |
| ------------------ | -------------- | ------------------- | ------------------- |
| `MECP_District__c` | `Name`         | Text                | District name       |
|                    | `Phone__c`     | Phone               | Main phone number   |
|                    | `Toll_Free__c` | Phone               | Toll-free number    |
|                    | `Address__c`   | Text                | Office address      |
|                    | `Boundary__c`  | Geolocation/Polygon | Geographic boundary |

---

## Ontario LIO (Land Information Ontario) Integration

The GIS components integrate with Ontario's Land Information Ontario (LIO) ArcGIS REST services to provide access to provincial environmental data layers.

### Available Layers

The following layers from the Ontario [Access Environment Map Viewer](https://www.lioapplications.lrc.gov.on.ca/Access_Environment/index.html) are available:

| Layer                              | Service URL                          | Description                                               |
| ---------------------------------- | ------------------------------------ | --------------------------------------------------------- |
| EASR Registrations                 | `Access_Environment_Map/MapServer/3` | Existing Environmental Activity and Sector Registry sites |
| Environmental Compliance Approvals | `Access_Environment_Map/MapServer/1` | ECA permits and approvals                                 |
| Permit to Take Water               | `Access_Environment_Map/MapServer/5` | Water taking permits                                      |
| Record of Site Condition           | `Access_Environment_Map/MapServer/6` | Environmental site assessments                            |
| MECP District Boundaries           | `MECP_Full_Boundaries/MapServer/0`   | Ministry district office boundaries                       |

**Base URL:** `https://ws.lioservices.lrc.gov.on.ca/arcgis2/rest/services/`

### MECP District Office Lookup

When a user selects a location on the map, the system automatically queries the MECP District Boundaries layer to determine which Ministry of Environment, Conservation and Parks district office serves that location.

**Data Returned:**

```json
{
  "name": "mecpDistrictFound",
  "mecpDistrict": {
    "districtName": "Halton-Peel District Office",
    "areaOffice": "Central Region",
    "phone": "905-319-3847",
    "tollFree": "1-800-335-5906",
    "address": "4145 North Service Rd",
    "city": "Burlington",
    "postalCode": "L7L 6A3",
    "fullAddress": "4145 North Service Rd, Burlington, ON L7L 6A3"
  }
}
```

### Controlling Ontario Layers via postMessage

The parent LWC can control Ontario LIO layers using these messages:

**Toggle all Ontario layers:**

```javascript
iframe.contentWindow.postMessage(
  {
    title: "toggleOntarioLayers",
    detail: { visible: true }
  },
  communityUrl
);
```

**Toggle MECP district boundaries:**

```javascript
iframe.contentWindow.postMessage(
  {
    title: "showMECPDistricts",
    detail: { visible: true }
  },
  communityUrl
);
```

**Query MECP district for specific coordinates:**

```javascript
iframe.contentWindow.postMessage(
  {
    title: "queryMECPDistrict",
    detail: { latitude: 43.6532, longitude: -79.3832 }
  },
  communityUrl
);
```

---

## CSP and Trusted Sites Configuration

> **CRITICAL**: Without proper CSP configuration, the ESRI map will not display, Visualforce iframes will be blocked, and Ontario LIO layers will fail to load.

### Step 1: CSP Trusted Sites (Setup → Security → CSP Trusted Sites)

Add each of the following as trusted sites with **all CSP directives enabled** (Connect, Font, Img, Script, Style, Frame):

**ESRI Services (Required):**

| Trusted Site Name | Trusted Site URL                    | Purpose                         |
| ----------------- | ----------------------------------- | ------------------------------- |
| ESRI_JS           | `https://js.arcgis.com`             | ESRI JavaScript API, CSS, fonts |
| ESRI_Static       | `https://static.arcgis.com`         | ESRI static assets, fonts       |
| ESRI_Services     | `https://services.arcgisonline.com` | Map tile services               |
| ESRI_Geocode      | `https://geocode.arcgis.com`        | Geocoding/address search        |
| ESRI_Basemaps     | `https://basemaps.arcgis.com`       | Basemap services                |
| ESRI_Online       | `https://www.arcgis.com`            | ArcGIS Online services          |
| ESRI_Tiles        | `https://tiles.arcgis.com`          | Map tiles                       |

**Ontario LIO Services (Required for Ontario Data Layers):**

| Trusted Site Name | Trusted Site URL                            | Purpose                                    |
| ----------------- | ------------------------------------------- | ------------------------------------------ |
| Ontario_LIO       | `https://ws.lioservices.lrc.gov.on.ca`      | LIO ArcGIS REST services (layers, queries) |
| Ontario_LIO_Apps  | `https://www.lioapplications.lrc.gov.on.ca` | LIO application services                   |

> **Important**: Enable the `Font` directive - commonly missed but required for ESRI map fonts!

### Step 2: Trusted URLs (Setup → Security → Trusted URLs)

| API Name      | URL                                  | Description                  |
| ------------- | ------------------------------------ | ---------------------------- |
| ESRI_Wildcard | `https://*.arcgis.com`               | All ESRI services            |
| VF_Domain     | `https://<your-org>--c.vf.force.com` | Visualforce pages in iframes |

To find your VF domain, run in Developer Console:

```apex
System.debug('VF Domain: https://' + DomainCreator.getVisualforceHostname(''));
```

### Step 3: Experience Builder CSP (Experience Builder → Settings → Security)

In your Experience Cloud site, add these to the Content Security Policy:

**Frame Sources (frame-src)**

```
https://<your-org>--c.vf.force.com
https://<your-org>.my.salesforce.com
https://<your-org>.lightning.force.com
```

**Script/Style/Font Sources**

```
https://js.arcgis.com
https://static.arcgis.com
```

**Connect/Image Sources**

```
https://services.arcgisonline.com
https://geocode.arcgis.com
https://basemaps.arcgis.com
https://*.arcgis.com
https://ws.lioservices.lrc.gov.on.ca
https://www.lioapplications.lrc.gov.on.ca
```

### Step 4: Session Settings (Setup → Security → Session Settings)

For Visualforce iframes to work:

- **Uncheck** "Enable clickjack protection for customer Visualforce pages with headers disabled"

> **Security Note**: Consider implementing CSP `frame-ancestors` headers on VF pages for production.

### Step 5: Custom Metadata (Setup → Custom Metadata Types → utils → Manage Records)

| Record Developer Name | Value                           | Description                       |
| --------------------- | ------------------------------- | --------------------------------- |
| `ApiKey`              | Your ESRI ArcGIS API Key        | Required for map services         |
| `SiteName`            | Your Experience Cloud site name | For postMessage origin validation |
| `Default_Latitude`    | `43.6532`                       | Default map center (Toronto)      |
| `Default_Longitude`   | `-79.3832`                      | Default map center (Toronto)      |

---

## Troubleshooting

| Error                          | Cause                            | Solution                                           |
| ------------------------------ | -------------------------------- | -------------------------------------------------- |
| "Refused to frame"             | Missing frame-src                | Add VF domain to Experience Builder CSP            |
| "Refused to load script"       | Missing script-src               | Add `js.arcgis.com` to CSP Trusted Sites           |
| "Loading font violates CSP"    | Missing font-src                 | Enable Font directive on ESRI trusted sites        |
| Map tiles not loading          | Missing connect-src/img-src      | Add ESRI domains to trusted sites                  |
| postMessage not working        | Origin mismatch                  | Ensure Apex returns origin only (no path)          |
| "Origin mismatch" in console   | Apex returns full URL not origin | Fix `fetchVFDomainURL()` to return protocol://host |
| Site Point cursor not changing | VF page mode not recognized      | Verify mode URL param is in valid list             |
| Iframe reloads after search    | URL has reactive properties      | Use static URL, update via postMessage             |
| Tab state not resetting        | Tab reset after URL build        | Reset `_activeTab` before `_buildVfPageUrl()`      |
| UTM conversion fails           | Client-side limitation           | UTM→Decimal requires server-side processing        |
| Ontario layers not loading     | Missing LIO CSP configuration    | Add `ws.lioservices.lrc.gov.on.ca` to CSP          |
| MECP district query fails      | CORS/CSP blocked                 | Add Ontario LIO trusted sites                      |
| Layer list empty               | Layers not visible by default    | Use Layer List widget to toggle visibility         |
| "Location outside Ontario"     | Point outside MECP boundaries    | Normal behavior for non-Ontario locations          |

### postMessage Origin Issues

The Apex controller `sfGpsDsCaOnSiteSelectorCtr.fetchVFDomainURL()` must return only the **origin** (protocol + hostname), not the full URL path. JavaScript's `event.origin` only contains the origin, so comparing against a full URL will always fail.

```apex
// CORRECT - returns origin only
return urlObj.getProtocol() + '://' + urlObj.getHost();
// Example: https://yoursite.my.site.com

// INCORRECT - includes path
return details[0].SecureURL;
// Example: https://yoursite.my.site.com/EASRvforcesite
```

### VF Page Mode Parameter

The VF page reads the initial mode from the URL's `mode` parameter:

```javascript
var urlParams = new URLSearchParams(window.location.search);
var initialMode = urlParams.get("mode") || "search";
```

Valid modes: `search`, `sitepoint`, `layers`, `readonly`, `discharge`

The mode is applied when the map is ready, setting cursor style and search widget visibility.

---

## Implementation Checklist

### Site Selector Tool

- [x] Create `sfGpsDsCaOnModal` component
  - [x] Ontario DS dark header styling
  - [x] Focus trapping for accessibility
  - [x] Keyboard navigation (Escape to close)
  - [x] Size variants (small, medium, large, full)
- [x] Create `sfGpsDsCaOnSiteSelectorTool` composite component
  - [x] Two-panel layout (left: controls, right: map)
  - [x] Tab interface (Search, Site point, Layers)
  - [x] Address search with results display
  - [x] Address details panel
  - [x] "Save site address" action
  - [x] LWR/LWS compatible
- [x] Create `sfGpsDsCaOnSiteSelectorPage.page` Visualforce page
  - [x] ESRI ArcGIS JavaScript SDK 4.29
  - [x] Search widget for address geocoding
  - [x] Point marker (red pin)
  - [x] Reverse geocoding (pin → address)
  - [x] Structured address data return
  - [x] postMessage communication
- [x] Create `sfGpsDsCaOnSiteSelectorCtr.cls` Apex controller
  - [x] API key from custom metadata (utils\_\_mdt)
  - [x] Community URL handling
  - [x] VF domain URL for postMessage
- [x] Create `sfGpsDsCaOnFormSiteSelectorTool` OmniStudio wrapper
  - [x] Uses OmniscriptBaseMixin
  - [x] Maps address data to OmniScript fields
  - [x] Flattened field output (streetAddress, city, etc.)
- [ ] Configure ESRI API key in utils\_\_mdt custom metadata
- [ ] Configure SiteName in utils\_\_mdt for community URL
- [ ] Test in OmniScript Create Site flow

### Discharge Point Selector

- [x] Create `sfGpsDsCaOnCoordinateInput` component
  - [x] UTM format (Zone, East, North)
  - [x] DMS format (Degrees, Minutes, Seconds)
  - [x] Decimal format (Latitude, Longitude)
  - [x] Validation and conversion methods
- [x] Create `sfGpsDsCaOnDischargePointSelector` composite component
  - [x] Two-panel layout (reuses modal infrastructure)
  - [x] Tab interface (Search, Drop point, Layers)
  - [x] Coordinate format selection dropdown
  - [x] Coordinate input fields
  - [x] Continue button with validation
- [x] Create `sfGpsDsCaOnFormDischargePointSelector` OmniStudio wrapper
  - [x] Uses OmniscriptBaseMixin
  - [x] Maps coordinates to OmniScript fields
- [x] Update VF page to support coordinate navigation with marker placement
- [x] Add Ontario LIO layers (Access Environment, MECP Boundaries)
- [x] Add automatic MECP district lookup on location selection
- [x] Document Integration Procedure for LIO data retrieval
- [ ] Configure Discharge Point Details display
- [ ] Test in Stormwater Discharge Location OmniScript

### Ontario LIO Integration

- [x] Add MECP District Boundaries layer
- [x] Add Access Environment layers (EASR, ECA, PTTW)
- [x] Add automatic MECP district query on pin placement
- [x] Add layer toggle controls via postMessage
- [x] Document CSP configuration for LIO services
- [x] Create Integration Procedure documentation
- [ ] Create Integration Procedure: EASR_GetLocationDetails
- [ ] Create Integration Procedure: EASR_GetSourceWaterProtection
- [ ] Test Integration Procedures with sample coordinates

---

## Accessibility Considerations

1. **Modal Component**: Focus trapping, Escape key to close, aria-modal="true"
2. **Tab Interface**: role="tablist" with proper aria-selected states
3. **Coordinate Input**: Proper field labels, aria-labels for DMS fields
4. **Error Messaging**: role="alert" with aria-live for dynamic errors
5. **Keyboard Navigation**: All controls accessible via keyboard

---

## Related Documentation

- [ONTARIO_LIO_INTEGRATION_PROCEDURE.md](./ONTARIO_LIO_INTEGRATION_PROCEDURE.md) - Integration Procedure setup for LIO services
- [STORMWATER_WORKS.md](./STORMWATER_WORKS.md) - Stormwater Management Works implementation guide
- [OMNISTUDIO_FORMS.md](./OMNISTUDIO_FORMS.md) - OmniStudio form components
- [BUILD_GUIDE.md](./BUILD_GUIDE.md) - Build and deployment guide
