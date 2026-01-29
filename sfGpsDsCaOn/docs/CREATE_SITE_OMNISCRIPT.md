# Create Site OmniScript Implementation Guide

This guide covers the implementation of the Create Site OmniScript for the EASR (Environmental Activity and Sector Registry) application. The OmniScript allows users to create new sites with address information, NAICS codes, and site contacts.

---

## Overview

The Create Site OmniScript is a multi-step wizard that collects:

1. Site identifier (unique name)
2. NAICS code (industry classification)
3. Site contacts (primary and additional)
4. Site address (via Site Selector Tool with ESRI integration)
5. Additional address details

Upon completion, the site is saved to the user's profile and can be reused for other environmental registrations.

---

## OmniScript Structure

| Step | Name                       | Description                                      |
| ---- | -------------------------- | ------------------------------------------------ |
| 1    | Create Site                | Enter unique site identifier                     |
| 2    | Select NAICS Code          | Select industry classification (5-level cascade) |
| 3    | NAICS Code Summary         | Review selected NAICS codes                      |
| 4    | Select Site Contacts       | Choose or create site contacts                   |
| 5    | Address Details            | Enter site address via Site Selector Tool        |
| 6    | Additional Address Details | Property ID, legal description, etc.             |
| 7    | Review Your Site           | Summary and confirmation                         |

---

## Step 1: Create Site (Site Identifier)

### Screenshot Reference

`14_CreateSite.png`

### Purpose

Collect a unique, recognizable name for the site that describes the location.

### OmniScript Configuration

**Step Type:** Step

**Elements:**

| Element         | Type       | Name            | Configuration                  |
| --------------- | ---------- | --------------- | ------------------------------ |
| Callout         | Text Block | SiteInfoCallout | Info callout about site saving |
| Site Identifier | Text       | SiteIdentifier  | Required, text input           |

### Element Details

#### SiteInfoCallout (Text Block)

```
This site will be saved to site information

Your site will be saved to your profile. You can reuse it when applying or registering for other environmental permissions.
```

**Styling:** Use `sfGpsDsCaOnCallout` with `variant="info"`

#### SiteIdentifier (Text Input)

| Property     | Value                                                                                                                                                                                                                   |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Label        | Site identifier                                                                                                                                                                                                         |
| Required     | Yes                                                                                                                                                                                                                     |
| Help Text    | The site identifier can be a unique and recognizable name that describes the location where the prescribed activity takes place. If you have multiple locations, it can help you distinguish between various locations. |
| LWC Override | `c-sf-gps-ds-ca-on-form-text-input`                                                                                                                                                                                     |

---

## Step 2: Select NAICS Code

### Screenshot Reference

`15_CreateSite2.png`

### Purpose

Collect the North American Industry Classification System (NAICS) code that represents the business at the facility or site.

### OmniScript Configuration

**Step Type:** Step

**Elements:**

| Element      | Type       | Name             | Configuration              |
| ------------ | ---------- | ---------------- | -------------------------- |
| Description  | Text Block | NAICSDescription | Intro text with link       |
| NAICS Picker | Custom LWC | NAICSCode        | Cascading 5-level dropdown |

### NAICS Code Picker Configuration

**Element Type:** Custom LWC
**LWC Name:** `c-sf-gps-ds-ca-on-form-naics-code-picker`

#### JSON Editor Configuration

For Custom LWC elements, use `config*` prefixed properties directly in `propSetMap`:

```json
{
  "type": "Custom LWC",
  "lwcComponentOverride": "c-sf-gps-ds-ca-on-form-naics-code-picker",
  "propSetMap": {
    "configLabel": "Select NAICS Code",
    "configHelpText": "The NAICS is a six digit code that represents your business.",
    "configSectorLabel": "Sector",
    "configSubSectorLabel": "Sub sector",
    "configIndustryGroupLabel": "Industry group",
    "configIndustryLabel": "Industry",
    "configNationalIndustryLabel": "National industry",
    "configSectorOptionsJson": "%NAICSSectorOptions%",
    "configSubSectorOptionsJson": "%NAICSSubSectorOptions%",
    "configIndustryGroupOptionsJson": "%NAICSIndustryGroupOptions%",
    "configIndustryOptionsJson": "%NAICSIndustryOptions%",
    "configNationalIndustryOptionsJson": "%NAICSNationalIndustryOptions%"
  }
}
```

> **Note:** The NAICS options should be loaded from a DataRaptor or Integration Procedure. See [OMNISTUDIO_FORMS.md](./OMNISTUDIO_FORMS.md) for detailed configuration.

---

## Step 3: NAICS Code Summary

### Screenshot Reference

`16_CreateSite3.png`

### Purpose

Display selected NAICS codes and allow adding additional codes.

### OmniScript Configuration

**Step Type:** Step

**Elements:**

| Element             | Type       | Name               | Configuration                 |
| ------------------- | ---------- | ------------------ | ----------------------------- |
| Description         | Text Block | NAICSSummaryText   | Instructions for adding codes |
| Selected Codes List | Edit Block | SelectedNAICSCodes | Repeatable list of codes      |
| Add NAICS Button    | Button     | AddNAICSCode       | Add new NAICS code            |

### Selected NAICS Codes Display

Each selected code displays:

- NAICS Code (6-digit)
- Description (e.g., "Landscaping services")
- Remove link
- Edit link

**Styling:** Use summary list component `sfGpsDsCaOnSummaryList`

---

## Step 4: Select Site Contacts

### Screenshot Reference

`17_CreateSiteContacts.png`

### Purpose

Select site contact(s) from existing contacts or create new ones.

### OmniScript Configuration

**Step Type:** Step

**Elements:**

| Element               | Type         | Name               | Configuration                |
| --------------------- | ------------ | ------------------ | ---------------------------- |
| Description           | Text Block   | ContactDescription | Instructions                 |
| Contact Selection     | Multi-select | SiteContacts       | Checkbox list of contacts    |
| Create Contact Button | Button       | CreateNewContact   | Navigate to contact creation |

### Contact Selection Configuration

Display existing contacts from user's profile with:

- Name
- Email address
- Phone number
- Primary contact checkbox

**LWC Override:** Use a custom selectable card group or checkbox group.

```json
{
  "propSetMap": {
    "label": "Select the site contact(s) that is associated with this site",
    "required": true,
    "options": "%ProfileContacts%"
  }
}
```

### Create New Contact Sub-OmniScript

When "Create new site contact" is clicked, navigate to a sub-step or embedded OmniScript.

---

## Step 4a: New Site Contact

### Screenshot Reference

`18_CreateNewSiteContact.png`

### Purpose

Create a new site contact with required information.

### OmniScript Configuration

**Step Type:** Step (or embedded OmniScript)

**Elements:**

| Element       | Type      | Name         | Configuration                  |
| ------------- | --------- | ------------ | ------------------------------ |
| First Name    | Text      | FirstName    | Required                       |
| Last Name     | Text      | LastName     | Required                       |
| Email         | Email     | Email        | Required                       |
| Confirm Email | Email     | ConfirmEmail | Required, must match Email     |
| Phone Number  | Telephone | PhoneNumber  | Required, format: xxx-xxx-xxxx |

### Element Configuration

All fields use Ontario DS form components:

- **LWC Override:** `c-sf-gps-ds-ca-on-form-text-input`
- **Telephone LWC Override:** `c-sf-gps-ds-ca-on-form-telephone`
- **Email LWC Override:** `c-sf-gps-ds-ca-on-form-email`

---

## Step 5: Address Details (Site Selector Tool)

### Screenshot Reference

`19_AddressSiteSelectorTool.png`, `20_AddressSiteSelectorToolSearchByAddress.png`, `21_AddressSiteSelectorToolSaveAddress.png`

### Purpose

Collect site address using the ESRI-integrated Site Selector Tool.

### OmniScript Configuration

**Step Type:** Step

**Elements:**

| Element             | Type       | Name                | Configuration               |
| ------------------- | ---------- | ------------------- | --------------------------- |
| Search Instructions | Text Block | AddressInstructions | Instructions for using tool |
| Site Selector Tool  | Custom LWC | SiteAddress         | ESRI map integration        |

### Site Selector Tool Configuration

**Element Type:** Custom LWC
**LWC Name:** `c-sf-gps-ds-ca-on-form-site-selector-tool`

#### JSON Editor Configuration

For Custom LWC elements, use `config*` prefixed properties directly in `propSetMap`:

```json
{
  "type": "Custom LWC",
  "lwcComponentOverride": "c-sf-gps-ds-ca-on-form-site-selector-tool",
  "propSetMap": {
    "configLabel": "Search for address",
    "configHelpText": "Select the \"site selector tool\" to locate the site address location on the map. Ensure that the populated details are accurate as this information is essential for ensuring a complete registration.",
    "configRequired": true,
    "configButtonLabel": "Site selector tool",
    "configModalTitle": "Site",
    "configDefaultLatitude": "43.6532",
    "configDefaultLongitude": "-79.3832",
    "configVfPageUrl": ""
  }
}
```

> **Note:** The `configVfPageUrl` can be left empty - the component will automatically fetch the VF domain URL using an Apex controller. The nested `propSetMap` structure is only required for **LWC Overrides** of built-in element types (e.g., Multi-select, Select). For **Custom LWC** elements, use `config*` prefixed properties directly in `propSetMap`.

### Site Selector Modal Features

The modal provides three tabs:

| Tab            | Function                                           |
| -------------- | -------------------------------------------------- |
| **Search**     | Address search by street number, name, and city    |
| **Site point** | Click on map to select location                    |
| **Layers**     | Toggle map layers (imagery, protected areas, etc.) |

### Search Tab Configuration

**Search Parameters Dropdown:**

- Address (default)
- Coordinates
- Property ID

**Address Search:**

- Input: Street number, street name, and city
- Auto-complete with ESRI geocoding
- Results displayed in "Site location details" section

### Output Data Structure

When "Save site address" is clicked, the following fields are populated:

| Field         | Type    | Description                                       |
| ------------- | ------- | ------------------------------------------------- |
| streetAddress | String  | Street address (e.g., "2323 Royal Windsor Drive") |
| city          | String  | City name (e.g., "Toronto")                       |
| province      | String  | Province code (e.g., "ON")                        |
| postalCode    | String  | Postal code (e.g., "L5J 1K5")                     |
| country       | String  | Country (e.g., "Canada")                          |
| fullAddress   | String  | Complete formatted address                        |
| latitude      | Decimal | Latitude coordinate                               |
| longitude     | Decimal | Longitude coordinate                              |

---

## Step 6: Additional Address Details

### Screenshot Reference

`22_AddressDetails.png`

### Purpose

Collect additional optional address information for the site.

### OmniScript Configuration

**Step Type:** Step

**Elements:**

| Element              | Type      | Name                  | Configuration                    |
| -------------------- | --------- | --------------------- | -------------------------------- |
| Property ID          | Text      | PropertyIdNumber      | Optional                         |
| Assessment Roll      | Text      | AssessmentRollNumber  | Optional                         |
| Non-address Info     | Text Area | NonAddressInformation | Optional, with hint text         |
| Legal Description    | Text Area | LegalDescription      | Optional                         |
| Location Description | Text Area | LocationDescription   | Optional                         |
| Part Lot Description | Text Area | PartLotDescription    | Optional                         |
| MECP District        | Display   | MECPDistrictOffice    | Auto-populated based on location |

### Element Details

#### PropertyIdNumber

| Property     | Value                               |
| ------------ | ----------------------------------- |
| Label        | Property ID number                  |
| Required     | No                                  |
| LWC Override | `c-sf-gps-ds-ca-on-form-text-input` |

#### AssessmentRollNumber

| Property     | Value                               |
| ------------ | ----------------------------------- |
| Label        | Assessment roll number              |
| Required     | No                                  |
| LWC Override | `c-sf-gps-ds-ca-on-form-text-input` |

#### NonAddressInformation

| Property     | Value                                                                                 |
| ------------ | ------------------------------------------------------------------------------------- |
| Label        | Non-address information                                                               |
| Required     | No                                                                                    |
| Help Text    | Placeholder hint text that explains this field is notes you want to include for late. |
| LWC Override | `c-sf-gps-ds-ca-on-form-text-area`                                                    |

#### LegalDescription

| Property     | Value                              |
| ------------ | ---------------------------------- |
| Label        | Legal description                  |
| Required     | No                                 |
| LWC Override | `c-sf-gps-ds-ca-on-form-text-area` |

#### LocationDescription

| Property     | Value                              |
| ------------ | ---------------------------------- |
| Label        | Location description               |
| Required     | No                                 |
| LWC Override | `c-sf-gps-ds-ca-on-form-text-area` |

#### PartLotDescription

| Property     | Value                              |
| ------------ | ---------------------------------- |
| Label        | Part lot description               |
| Required     | No                                 |
| LWC Override | `c-sf-gps-ds-ca-on-form-text-area` |

### MECP District/Area Office Display

Display auto-populated district information based on the site location:

| Field        | Example                     |
| ------------ | --------------------------- |
| Office Name  | Halton-Peel District Office |
| Phone Number | 905-319-3847                |
| Toll-free    | 1-800-335-5906              |

**Styling:** Use a card or callout component to display district information.

---

## Step 7: Review Your Site

### Screenshot Reference

`23_SiteCompletion.png`

### Purpose

Display a summary of all entered site information before final submission.

### OmniScript Configuration

**Step Type:** Step

**Elements:**

| Section                   | Content                             | Edit Link |
| ------------------------- | ----------------------------------- | --------- |
| Site identifier           | Site name                           | Edit      |
| NAICS code(s)             | Code and description                | Edit      |
| Site contact(s)           | Primary and additional contacts     | Edit      |
| Site address(s)           | Primary and adjacent addresses      | Edit      |
| Address details           | Property details, legal description | Edit      |
| Geo reference information | Lat/Long, UTM coordinates           | Edit      |
| Confirmation              | Checkbox to confirm accuracy        | -         |

### Summary Display

Use `sfGpsDsCaOnSummaryList` component for each section.

### Confirmation Checkbox

```json
{
  "type": "Checkbox",
  "name": "ConfirmAccuracy",
  "propSetMap": {
    "label": "I confirm this information is complete and accurate.",
    "required": true
  }
}
```

### Complete Site Creation Button

Primary action button: "Complete site creation"

---

## Step 8: Site Creation Complete

### Screenshot Reference

`24_SiteCreationComplete.png`

### Purpose

Confirm site creation and allow user to add site to current registration.

### OmniScript Configuration

**Step Type:** Step

**Elements:**

| Element         | Type         | Name           | Configuration          |
| --------------- | ------------ | -------------- | ---------------------- |
| Success Message | Callout      | SuccessCallout | Green success callout  |
| Site Selection  | Multi-select | SelectSites    | Selectable card list   |
| Create New Site | Button       | CreateNewSite  | Link to create another |

### Success Callout

```
Site creation is now complete.

Your site information has been saved to site information. You can add this site to your current registration now, and reuse it later when applying or registering for other environmental permissions.
```

**Styling:** Use `sfGpsDsCaOnCallout` with `variant="success"`

### Sites Selection

Display available sites from profile using selectable cards:

| Field     | Description                                   |
| --------- | --------------------------------------------- |
| Site Name | Site identifier with badge (NEW, IN PROGRESS) |
| Address   | Full address                                  |
| Link      | "More details in your profile"                |

**LWC Override:** `c-sf-gps-ds-ca-on-selectable-card-group`

---

## Data Integration

### DataRaptors Required

| Name                  | Type    | Purpose                                |
| --------------------- | ------- | -------------------------------------- |
| DR_GetProfileContacts | Extract | Retrieve contacts from user profile    |
| DR_GetNAICSCodes      | Extract | Retrieve NAICS code hierarchy          |
| DR_GetProfileSites    | Extract | Retrieve existing sites from profile   |
| DR_SaveSite           | Save    | Save new site to profile               |
| DR_GetMECPDistrict    | Extract | Get MECP district based on coordinates |

### Integration Procedures

| Name                     | Purpose                           |
| ------------------------ | --------------------------------- |
| IP_CreateSite            | Orchestrate site creation process |
| IP_ValidateSiteAddress   | Validate address with ESRI        |
| IP_GetSiteSelectorConfig | Get ESRI configuration            |

---

## Component Dependencies

### Ontario DS Components Used

| Component                         | Usage                  |
| --------------------------------- | ---------------------- |
| `sfGpsDsCaOnFormTextInput`        | Text fields            |
| `sfGpsDsCaOnFormTextArea`         | Multi-line text fields |
| `sfGpsDsCaOnFormEmail`            | Email fields           |
| `sfGpsDsCaOnFormTelephone`        | Phone number fields    |
| `sfGpsDsCaOnFormNaicsCodePicker`  | NAICS code selection   |
| `sfGpsDsCaOnFormSiteSelectorTool` | ESRI address selection |
| `sfGpsDsCaOnCallout`              | Info/success messages  |
| `sfGpsDsCaOnSummaryList`          | Review sections        |
| `sfGpsDsCaOnSelectableCardGroup`  | Site/contact selection |
| `sfGpsDsCaOnButton`               | Action buttons         |

### Visualforce Pages

| Page                          | Purpose                                     |
| ----------------------------- | ------------------------------------------- |
| `sfGpsDsCaOnSiteSelectorPage` | ESRI map integration for Site Selector Tool |

---

## Accessibility Compliance

All steps follow WCAG 2.1 AA guidelines:

- Form labels associated with inputs
- Error messages linked to fields
- Keyboard navigation supported
- Focus management between steps
- Screen reader announcements for step changes
- Color contrast meets minimum requirements

---

## Troubleshooting

### Site Selector Tool not opening

**Cause:** VF Page URL not configured or inaccessible.

**Solution:** Verify `vfPageUrl` in JSON Editor points to correct Visualforce page and page is deployed. The component can auto-fetch the VF domain URL if `configVfPageUrl` is left blank.

### Site Point tab not working

**Symptoms:** Cursor doesn't change to crosshair, search widget stays visible.

**Cause:** VF page mode parameter not recognized or postMessage origin mismatch.

**Solutions:**

1. Verify the VF page supports the `mode` URL parameter (search, sitepoint, layers, readonly, discharge)
2. Check browser console for "Message rejected, origin mismatch" errors
3. Ensure the Apex controller returns only the origin (protocol://hostname), not the full URL path

### Map reloads when searching

**Symptoms:** Map zooms in then immediately zooms back out.

**Cause:** Iframe URL changes reactively when search results update coordinates.

**Solution:** The component should use a static iframe URL set once when the modal opens. Coordinate updates should happen via postMessage, not URL changes. This was fixed in recent versions.

### NAICS codes not loading

**Cause:** DataRaptor not configured or returning empty.

**Solution:** Verify DataRaptor `DR_GetNAICSCodes` is active and returning data.

### Address not saving

**Cause:** PostMessage communication blocked or field mapping incorrect.

**Solutions:**

1. Check browser console for PostMessage errors
2. Verify field names match expected output (streetAddress, city, province, postalCode, country, latitude, longitude)
3. Ensure the community URL origin matches in both LWC and VF page

### MECP District not displaying

**Cause:** Coordinates not passed to lookup or integration not configured.

**Solution:** Verify `latitude` and `longitude` are populated before MECP lookup runs.

### Console shows "origin mismatch" errors

**Cause:** The Apex controller was returning the full community URL (including path) instead of just the origin.

**Solution:** The `sfGpsDsCaOnSiteSelectorCtr.fetchVFDomainURL()` method must return only the origin (`https://yoursite.my.site.com`), not the full URL with path (`https://yoursite.my.site.com/SiteName`). This was fixed in recent versions.

### Tab state not resetting on modal reopen

**Symptoms:** After switching to Site Point tab, closing, and reopening, the modal opens in Site Point mode instead of Search.

**Cause:** The `_activeTab` property was being set after the iframe URL was built.

**Solution:** The LWC's `open()` method must reset `_activeTab` before calling `_buildVfPageUrl()`. This was fixed in recent versions.

---

## Related Documentation

- [EASR Registration Page](./EASR_REGISTRATION_PAGE.md)
- [EASR Implementation Guide](./EASR_IMPLEMENTATION_GUIDE.md)
- [OmniStudio Forms Guide](./OMNISTUDIO_FORMS.md)
- [GIS Guide](./GIS_GUIDE.md)
