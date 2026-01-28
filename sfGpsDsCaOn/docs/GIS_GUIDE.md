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

## CSP and Trusted Sites Configuration

> **CRITICAL**: Without proper CSP configuration, the ESRI map will not display and Visualforce iframes will be blocked.

### Step 1: CSP Trusted Sites (Setup → Security → CSP Trusted Sites)

Add each of the following as trusted sites with **all CSP directives enabled** (Connect, Font, Img, Script, Style, Frame):

| Trusted Site Name | Trusted Site URL                    | Purpose                         |
| ----------------- | ----------------------------------- | ------------------------------- |
| ESRI_JS           | `https://js.arcgis.com`             | ESRI JavaScript API, CSS, fonts |
| ESRI_Static       | `https://static.arcgis.com`         | ESRI static assets, fonts       |
| ESRI_Services     | `https://services.arcgisonline.com` | Map tile services               |
| ESRI_Geocode      | `https://geocode.arcgis.com`        | Geocoding/address search        |
| ESRI_Basemaps     | `https://basemaps.arcgis.com`       | Basemap services                |
| ESRI_Online       | `https://www.arcgis.com`            | ArcGIS Online services          |
| ESRI_Tiles        | `https://tiles.arcgis.com`          | Map tiles                       |

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

| Error                       | Cause                       | Solution                                    |
| --------------------------- | --------------------------- | ------------------------------------------- |
| "Refused to frame"          | Missing frame-src           | Add VF domain to Experience Builder CSP     |
| "Refused to load script"    | Missing script-src          | Add `js.arcgis.com` to CSP Trusted Sites    |
| "Loading font violates CSP" | Missing font-src            | Enable Font directive on ESRI trusted sites |
| Map tiles not loading       | Missing connect-src/img-src | Add ESRI domains to trusted sites           |
| postMessage not working     | Origin mismatch             | Configure SiteName in utils\_\_mdt          |
| UTM conversion fails        | Client-side limitation      | UTM→Decimal requires server-side processing |

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
- [ ] Create Integration Procedure for source protection area lookup
- [ ] Configure Discharge Point Details display
- [ ] Test in Stormwater Discharge Location OmniScript

---

## Accessibility Considerations

1. **Modal Component**: Focus trapping, Escape key to close, aria-modal="true"
2. **Tab Interface**: role="tablist" with proper aria-selected states
3. **Coordinate Input**: Proper field labels, aria-labels for DMS fields
4. **Error Messaging**: role="alert" with aria-live for dynamic errors
5. **Keyboard Navigation**: All controls accessible via keyboard

---

## Related Documentation

- [STORMWATER_WORKS.md](./STORMWATER_WORKS.md) - Stormwater Management Works implementation guide
- [OMNISTUDIO_FORMS.md](./OMNISTUDIO_FORMS.md) - OmniStudio form components
- [BUILD_GUIDE.md](./BUILD_GUIDE.md) - Build and deployment guide
