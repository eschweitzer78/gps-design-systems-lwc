# EASR Registration Page - Implementation Guide

This guide explains how to build the EASR Registration page using Ontario Design System components in a Salesforce Digital Experience site.

---

## Overview

The EASR Registration page is the entry point for users to add EASR activities to their registration. It consists of 6 main sections:

1. **Ontario Header Bar** - Black bar with Ontario logo and language toggle
2. **Application Header** - Dark blue bar with title, Profile, and Menu
3. **Back Link** - Navigation back to previous page
4. **Page Content** - Title, section heading, description, and action buttons
5. **Footer** - Standard Ontario government expanded footer

---

## Component Mapping

| Section            | Component                                    | Experience Builder Name    |
| ------------------ | -------------------------------------------- | -------------------------- |
| Ontario Header     | `sfGpsDsCaOnHeaderComm` (type="ontario")     | Ontario DS Header          |
| Application Header | `sfGpsDsCaOnHeaderComm` (type="application") | Ontario DS Header          |
| Back Link          | `sfGpsDsCaOnBackButtonComm`                  | Ontario DS Back Button     |
| Primary Button     | `sfGpsDsCaOnButtonComm` (with icon)          | Ontario DS Button          |
| Secondary Button   | `sfGpsDsCaOnButtonComm`                      | Ontario DS Button          |
| Footer             | `sfGpsDsCaOnFooterExpandedComm`              | Ontario DS Footer Expanded |

---

## Page Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ [Ontario Logo]                                    Français      │
├─────────────────────────────────────────────────────────────────┤
│ Environmental Permissions Platform        Profile  [≡ Menu]    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ < Back                                                           │
│                                                                  │
│ EASR registration                                                │
│                                                                  │
│ EASR activity                                                    │
│                                                                  │
│ Add your EASR activities here. If your registration includes     │
│ more than one activity, you can submit them together, or         │
│ separately.                                                      │
│                                                                  │
│ ┌─────────────────────┐                                          │
│ │ ⊕ Add activity      │  ← Primary button with + icon            │
│ └─────────────────────┘                                          │
│                                                                  │
│ ┌─────────────────────┐                                          │
│ │   Back to home      │  ← Secondary (outlined) button           │
│ └─────────────────────┘                                          │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│ Ministry of the Environment,     │ Questions or comments         │
│ Conservation and Parks           │                               │
│                                  │ [Contact us]                  │
│ The Ministry works to protect... │                               │
├─────────────────────────────────────────────────────────────────┤
│ Accessibility   Privacy          │ © King's Printer for Ontario │
└─────────────────────────────────────────────────────────────────┘
```

---

## Experience Builder Setup

### 1. Create the Page

1. Go to Experience Builder
2. Create a new page from template or Build Your Own
3. Set page URL path: `/easr/register`
4. Set page title: "EASR Registration"

### 2. Page Structure

Create the following layout regions (top to bottom):

- **Header region** - For Ontario and Application headers
- **Content region** - Main content with padding
- **Footer region** - For expanded footer

---

## Component Configuration

### Header Section

Add **two** Ontario DS Header components:

#### Ontario Logo Header

| Property                    | Value                                                                     |
| --------------------------- | ------------------------------------------------------------------------- |
| **Header type**             | ontario                                                                   |
| **Language**                | en                                                                        |
| **Language toggle options** | `{"englishLink": "/en/easr/register", "frenchLink": "/fr/easr/register"}` |

#### Application Header

| Property                    | Value                                                                                |
| --------------------------- | ------------------------------------------------------------------------------------ |
| **Header type**             | application                                                                          |
| **Application header info** | `{"title": "Environmental Permissions Platform", "href": "/", "maxWidth": "1200px"}` |
| **Menu items**              | `[{"title": "Profile", "href": "/profile"}]`                                         |
| **Disable dynamic menu**    | true                                                                                 |

### Back Link

Add the **Ontario DS Back Button** component.

| Property  | Value           |
| --------- | --------------- |
| **Label** | Back            |
| **URL**   | /apply-register |

### Page Content

For the page title, section heading, and description, use an HTML block or custom content component:

```html
<h1 class="ontario-h1">EASR registration</h1>

<h2 class="ontario-h4">EASR activity</h2>

<p class="ontario-lead-statement">
  Add your EASR activities here. If your registration includes more than one
  activity, you can submit them together, or separately.
</p>
```

### Primary Button (Add Activity)

Add the **Ontario DS Button** component.

| Property          | Value              |
| ----------------- | ------------------ |
| **Label**         | Add activity       |
| **Target URL**    | /easr/activity/new |
| **Type**          | primary            |
| **Icon**          | add                |
| **Icon position** | left               |

### Secondary Button (Back to Home)

Add a second **Ontario DS Button** component.

| Property       | Value        |
| -------------- | ------------ |
| **Label**      | Back to home |
| **Target URL** | /            |
| **Type**       | secondary    |

### Footer

Add the **Ontario DS Footer Expanded** component.

| Property                 | Value                                                                                                                                                                                                                                                                           |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Ministry name**        | Ministry of the Environment, Conservation and Parks                                                                                                                                                                                                                             |
| **Ministry description** | The Ministry of the Environment, Conservation and Parks works to protect and sustain the quality of Ontario's air, land, and water. We also coordinate Ontario's actions on climate change in the name of healthier communities, ecological protection and economic prosperity. |
| **Contact heading**      | Questions or comments                                                                                                                                                                                                                                                           |
| **Contact text**         | There are many ways to contact the Government of Ontario.                                                                                                                                                                                                                       |
| **Contact button label** | Contact us                                                                                                                                                                                                                                                                      |
| **Contact button URL**   | https://www.ontario.ca/feedback/contact-us                                                                                                                                                                                                                                      |
| **Footer links**         | `[{"title": "Accessibility", "href": "https://www.ontario.ca/page/accessibility"}, {"title": "Privacy", "href": "https://www.ontario.ca/page/privacy-statement"}]`                                                                                                              |
| **Copyright text**       | © King's Printer for Ontario, 2012-24                                                                                                                                                                                                                                           |

---

## Button Icon Reference

The enhanced **Ontario DS Button** component now supports the following icons:

| Icon Name      | Description      | Use Case           |
| -------------- | ---------------- | ------------------ |
| `add`          | Plus sign        | Add new items      |
| `remove`       | Minus sign       | Remove items       |
| `edit`         | Pencil           | Edit actions       |
| `delete`       | Trash can        | Delete actions     |
| `chevronLeft`  | Left arrow       | Back navigation    |
| `chevronRight` | Right arrow      | Forward navigation |
| `arrowForward` | Forward arrow    | Continue/Next      |
| `arrowBack`    | Back arrow       | Previous           |
| `search`       | Magnifying glass | Search actions     |
| `download`     | Download arrow   | File downloads     |
| `upload`       | Upload arrow     | File uploads       |
| `check`        | Checkmark        | Confirm/Save       |
| `close`        | X mark           | Close/Cancel       |
| `save`         | Floppy disk      | Save actions       |
| `print`        | Printer          | Print actions      |
| `home`         | House            | Home navigation    |

---

## CSS Styling

Add custom CSS for spacing and layout:

```css
/* Page content spacing */
.easr-registration-content {
  max-width: 800px;
  padding: 2rem 1rem;
}

/* Button group spacing */
.easr-button-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
  max-width: 200px;
}

/* Section heading */
.easr-section-heading {
  margin-top: 2rem;
  margin-bottom: 0.5rem;
}
```

---

## Navigation Flow

| Action              | Destination                                          |
| ------------------- | ---------------------------------------------------- |
| Back link           | `/apply-register` (Apply or Register page)           |
| Add activity button | `/easr/activity/new` (Activity selection OmniScript) |
| Back to home button | `/` (Home page)                                      |

---

## Add Activity Page Setup

When the user clicks the "Add activity" button, they navigate to a separate page (`/easr/activity/new`) that displays the OmniScript for selecting activity types.

### 1. Create the Add Activity Page

1. Go to **Experience Builder**
2. Click **Pages** → **New Page**
3. Select **Standard Page** or **Build Your Own**
4. Set the page properties:

| Property | Value             |
| -------- | ----------------- |
| **Name** | Add Activity      |
| **URL**  | easr/activity/new |

### 2. Configure Page Layout

Add the following components to the page:

#### Header Section

Use the same header configuration as the EASR Registration page (see [Header Section](#header-section) above).

#### Back Link

| Property  | Value          |
| --------- | -------------- |
| **Label** | Back           |
| **URL**   | /easr/register |

#### Page Title

```html
<h1 class="ontario-h1">Add activity</h1>
```

#### OmniScript Embed

Add the **OmniScript** component from the Experience Builder component palette.

| Property               | Value       |
| ---------------------- | ----------- |
| **OmniScript Type**    | EASR        |
| **OmniScript SubType** | AddActivity |
| **Language**           | English     |

> **Note**: The OmniScript Type and SubType must match the OmniScript you've created in OmniStudio. See [Add Activity OmniScript](#add-activity-omniscript) below for the OmniScript configuration.

### 3. OmniScript Navigation

Configure the OmniScript to handle navigation after completion:

| User Action      | OmniScript Behavior                                      |
| ---------------- | -------------------------------------------------------- |
| **Add selected** | Save data, navigate to `/easr/register` with new records |
| **Cancel**       | Navigate back to `/easr/register`                        |
| **Back to home** | Navigate to `/`                                          |

In the OmniScript, use a **Navigate Action** element or **Set Values** with `window.location` to redirect:

```javascript
// In OmniScript Custom LWC or Action
window.location.href = "/easr/register";
```

Or use the OmniScript **Navigate** action with:

| Property         | Value          |
| ---------------- | -------------- |
| **Target Type**  | URL            |
| **Target Value** | /easr/register |

---

## Accessibility Considerations

1. **Heading Hierarchy**:
   - "EASR registration" is `h1`
   - "EASR activity" is `h2` (styled as h4 for visual hierarchy)

2. **Button Purpose**:
   - Icon + text clearly indicates the action
   - "Add activity" is the primary action (visually prominent)
   - "Back to home" is secondary (outlined style)

3. **Keyboard Navigation**:
   - Back link is keyboard accessible
   - Buttons receive visible focus indicators

4. **Screen Reader**:
   - Icons are marked with `aria-hidden="true"`
   - Button labels provide clear context

---

## Testing Checklist

- [ ] Ontario logo header displays correctly
- [ ] Application header shows "Environmental Permissions Platform"
- [ ] Back link navigates to Apply or Register page
- [ ] Page title "EASR registration" displays as h1
- [ ] Section heading "EASR activity" displays correctly
- [ ] Description text is readable
- [ ] "Add activity" button shows + icon
- [ ] "Add activity" button navigates to activity flow
- [ ] "Back to home" button has outlined style
- [ ] "Back to home" button navigates to home page
- [ ] Footer displays ministry information
- [ ] Footer links work correctly
- [ ] Page is keyboard navigable
- [ ] Page passes WCAG 2.1 AA accessibility checks

---

## Add Activity OmniScript

When the user clicks "Add activity", an OmniScript displays a selection panel with available EASR activity types. This uses the new **Selectable Cards** component.

### OmniScript Structure

```
OmniScript: EASR_AddActivity
├── Step: SelectActivities
│   ├── Selectable Cards Element (sfGpsDsCaOnFormSelectableCards)
│   │   └── Activity options with descriptions
│   └── Navigation buttons (Add selected, Cancel)
```

### Add Activity Panel Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ Add activity                                              [X]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ ☐ Air emissions                                                 │
│   If your business engages in activities that discharge or      │
│   may discharge contaminants into the air...                    │
│   ⌄ View more                                                   │
│                                                                  │
│ ☐ Automotive refurbishing facility                              │
│   Register your refinishing facility in the EASR to legally     │
│   operate spray booths and apply coatings...                    │
│   ⌄ View more                                                   │
│                                                                  │
│ ☐ End-of-life vehicle waste disposal sites                      │
│   Ensure your ELV site is compliant—register in the EASR to     │
│   safely manage, depollute, and process vehicles...             │
│   ⌄ View more                                                   │
│                                                                  │
│ ☐ Printing facility                                             │
│   If your commercial printing operation meets eligibility       │
│   criteria, register in the EASR...                             │
│   ⌄ View more                                                   │
│                                                                  │
│ ☐ Solar facility                                                │
│   Register your small ground-mounted solar facility in the      │
│   EASR to begin operations quickly...                           │
│   ⌄ View more                                                   │
│                                                                  │
│ ☐ Stormwater management works                                   │
│   Accelerate your infrastructure project—register eligible      │
│   stormwater works in the EASR...                               │
│   ⌄ View more                                                   │
│                                                                  │
│ ☐ Waste management system                                       │
│   If your system involves the collection, handling,             │
│   transportation, or transfer of non-hazardous waste...         │
│   ⌄ View more                                                   │
│                                                                  │
│ ☐ Water taking activities                                       │
│   For highway, transit, dewatering, or pumping test projects,   │
│   register your water taking activity...                        │
│   ⌄ View more                                                   │
│                                                                  │
│ ┌─────────────────┐                                              │
│ │  Add selected   │   Cancel                                     │
│ └─────────────────┘                                              │
│                                                                  │
│ ┌─────────────────┐                                              │
│ │  Back to home   │                                              │
│ └─────────────────┘                                              │
└─────────────────────────────────────────────────────────────────┘
```

### Component Configuration

#### Selectable Cards Element

Use the **Multiselect** element type in OmniScript with Custom LWC Override:

| OmniScript Property | Value                          |
| ------------------- | ------------------------------ |
| **Element Type**    | Multiselect                    |
| **Custom LWC**      | sfGpsDsCaOnFormSelectableCards |
| **Label**           | Add activity                   |
| **Options Source**  | Picklist or DataRaptor         |

##### Step 1: Configure Picklist Options

In the Multiselect element properties, add the picklist options:

| Label                              | Value (Name)            |
| ---------------------------------- | ----------------------- |
| Air emissions                      | air-emissions           |
| Automotive refurbishing facility   | automotive-refurbishing |
| End-of-life vehicle waste disposal | elv-disposal            |
| Printing facility                  | printing-facility       |
| Solar facility                     | solar-facility          |
| Stormwater management works        | stormwater-management   |
| Waste management system            | waste-management        |
| Water taking activities            | water-taking            |

> **Important:** You must configure BOTH the Label AND the Name/Value for each option. The Name/Value is what gets stored in the data. If you only configure the Label, the cards will display the label as both the title and the value identifier.

##### Step 2: Add optionsJson via JSON Editor

The picklist only provides basic label/value pairs. To add descriptions, badges, and expandable content, you need to add the `optionsJson` property via the **JSON Editor**:

1. With the Multiselect element selected, click the **JSON Editor** button (curly braces icon `{}`) in the Properties panel
2. Locate the `propSetMap` object in the JSON
3. Add a **nested `propSetMap`** object inside the existing `propSetMap` with your `optionsJson`:

```json
{
  "propSetMap": {
    "label": "Add activity",
    "required": false,
    "propSetMap": {
      "optionsJson": [
        // ... array of extended options (see below)
      ]
    }
  }
}
```

> **Important:** Custom properties must be placed inside a **nested `propSetMap`** object. OmniStudio uses the outer `propSetMap` for standard properties, while custom properties for LWC overrides go inside the inner `propSetMap`.

#### optionsJson Property Value

Add the following JSON array as the value of `optionsJson` in the element's `propSetMap`:

```json
[
  {
    "value": "air-emissions",
    "label": "Air emissions",
    "description": "If your business engages in activities that discharge or may discharge contaminants into the air, you may be required to register in the Environmental Activity and Sector Registry.",
    "expandedContent": "Air emissions registrations apply to facilities with industrial processes, fuel burning equipment, or other sources that emit air contaminants. Common activities include manufacturing, painting, printing, and fuel storage."
  },
  {
    "value": "automotive-refurbishing",
    "label": "Automotive refurbishing facility",
    "description": "Register your refinishing facility in the EASR to legally operate spray booths and apply coatings within regulated limits that protect air quality and nearby communities.",
    "expandedContent": "This applies to body shops, paint booths, and refinishing operations. Registration ensures compliance with air quality standards for volatile organic compounds (VOCs) and particulate emissions."
  },
  {
    "value": "elv-disposal",
    "label": "End-of-life vehicle waste disposal sites",
    "description": "Ensure your ELV site is compliant—register in the EASR to safely manage, depollute, and process vehicles while meeting strict environmental standards.",
    "expandedContent": "End-of-life vehicle sites must properly drain fluids, remove hazardous materials, and process vehicle components according to environmental regulations."
  },
  {
    "value": "printing-facility",
    "label": "Printing facility",
    "description": "If your commercial printing operation meets eligibility criteria, register in the EASR to streamline approvals and maintain compliance with emissions and material usage limits.",
    "expandedContent": "Printing facilities using solvent-based inks, cleaning solutions, or coatings may be required to register. This includes offset, flexographic, and screen printing operations."
  },
  {
    "value": "solar-facility",
    "label": "Solar facility",
    "description": "Register your small ground-mounted solar facility in the EASR to begin operations quickly while following standardized environmental siting and design rules.",
    "expandedContent": "Solar facilities under 10 MW capacity with minimal environmental impact can register through EASR for streamlined approval."
  },
  {
    "value": "stormwater-management",
    "label": "Stormwater management works",
    "description": "Accelerate your infrastructure project—register eligible stormwater works in the EASR to bypass lengthy approvals while ensuring environmental safeguards are in place.",
    "expandedContent": "Stormwater ponds, infiltration galleries, and other management works that meet design standards can be registered. This applies to municipal and private development projects."
  },
  {
    "value": "waste-management",
    "label": "Waste management system",
    "description": "If your system involves the collection, handling, transportation, or transfer of non-hazardous waste using trucks only, register in the EASR to operate legally and efficiently under Ontario's streamlined environmental framework.",
    "expandedContent": "This registration is for waste haulers and transfer stations handling non-hazardous materials. Hazardous waste operations require a separate Environmental Compliance Approval."
  },
  {
    "value": "water-taking",
    "label": "Water taking activities",
    "description": "For highway, transit, dewatering, or pumping test projects, register your water taking activity in the EASR to operate efficiently under clear environmental guidelines.",
    "expandedContent": "Construction dewatering, road building, and similar activities that take water temporarily can often use EASR registration instead of a full Permit to Take Water."
  }
]
```

### OmniScript Design Considerations

1. **Single Step OmniScript**: The activity selection should be a single-step OmniScript for simplicity

2. **Multiple Selection**: Users can select multiple activities to add in one operation

3. **View More Content**: Each card's expandable content provides detailed information about the activity type

4. **Navigation Flow**:
   - "Add selected" → Proceeds to the next step (activity details)
   - "Cancel" → Returns to the EASR Registration page
   - "Back to home" → Returns to the home page

5. **Data Binding**: The selected values are stored in the OmniScript data JSON and can be used in subsequent steps or Integration Procedures

### Troubleshooting Selectable Cards

#### Cards only show value identifiers (e.g., "air-emissions") instead of labels

**Cause:** The `optionsJson` property is not configured in the element's JSON, or the picklist options only have Label configured without Name/Value.

**Solution:**

1. Ensure picklist options have BOTH Label AND Name/Value configured
2. Add the `optionsJson` property to `propSetMap` via JSON Editor (see Step 2 above)

#### No description, badge, or "View more" content appears

**Cause:** The `optionsJson` property is missing from `propSetMap` or is malformed.

**Solution:** Open the JSON Editor and add the `optionsJson` property inside `propSetMap` with valid JSON containing `description`, `expandedContent`, and other extended properties.

#### All checkboxes get selected when clicking one

**Cause:** The picklist options only have Label configured, resulting in undefined values.

**Solution:** Configure BOTH Label AND Name/Value for each picklist option. The Name/Value field provides the unique identifier used for selection tracking.

#### Styling issues (no checkbox visible, no fonts)

**Cause:** CSS files not loading correctly in LWR site.

**Solution:** Ensure the site is republished after deploying component updates. Hard refresh the browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows) to clear CDN cache.

### Alternative: Experience Builder Implementation

For non-OmniScript implementations, use the **Ontario DS Selectable Card Group** component directly in Experience Builder:

| Property           | Value                    |
| ------------------ | ------------------------ |
| **Legend**         | Add activity             |
| **Options (JSON)** | (See options JSON above) |
| **Required**       | false                    |

---

## Activity Steps View (After Activities Added)

Once activities have been added to the registration, the page displays **Activity Status Cards** showing progress for each BusinessLicenseApplication record.

### Activity Status Card Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ < Back                                                           │
│                                                                  │
│ EASR registration                                                │
│                                                                  │
│ EASR activity                                                    │
│                                                                  │
│ Add your EASR activities here...                                 │
│                                                                  │
│ ┌─────────────────────────────┐ ┌─────────────────────────────┐ │
│ │ Air emissions      [Remove] │ │ Stormwater mgmt    [Remove] │ │
│ │                             │ │                             │ │
│ │ Business name:              │ │ Business name:              │ │
│ │ Registration site(s):       │ │ Registration site(s):       │ │
│ │                             │ │                             │ │
│ │ ⚠ 0 out of X steps completed│ │ ⚠ 0 out of X steps completed│ │
│ │                             │ │                             │ │
│ │ [Start]                     │ │ [Start]                     │ │
│ └─────────────────────────────┘ └─────────────────────────────┘ │
│                                                                  │
│ ┌─────────────────────┐                                          │
│ │ ⊕ Add activity      │                                          │
│ └─────────────────────┘                                          │
│                                                                  │
│ ┌─────────────────────┐                                          │
│ │   Back to home      │                                          │
│ └─────────────────────┘                                          │
└─────────────────────────────────────────────────────────────────┘
```

### Component: Ontario DS Activity Status Card Collection

A new component designed to display [BusinessLicenseApplication](https://developer.salesforce.com/docs/atlas.en-us.psc_api.meta/psc_api/sforce_api_objects_businesslicenseapplication.htm) records from Public Sector Solutions.

| Property       | Type    | Description               |
| -------------- | ------- | ------------------------- |
| `activities`   | JSON    | Array of activity records |
| `cardsPerRow`  | String  | Cards per row (1, 2, 3)   |
| `allowRemove`  | Boolean | Show remove link          |
| `headingLevel` | String  | h2, h3, h4                |

### Activities JSON Format

Each activity object maps to a BusinessLicenseApplication record:

```json
[
  {
    "recordId": "0PK000000000001",
    "activityName": "Air emissions",
    "businessName": "Acme Manufacturing Inc.",
    "registrationSites": "Main Facility - 123 Industrial Rd",
    "stepsCompleted": 0,
    "totalSteps": 5,
    "actionUrl": "/easr/activity/0PK000000000001"
  },
  {
    "recordId": "0PK000000000002",
    "activityName": "Stormwater management works",
    "businessName": "",
    "registrationSites": "",
    "stepsCompleted": 0,
    "totalSteps": 4,
    "actionUrl": "/easr/activity/0PK000000000002"
  }
]
```

### BusinessLicenseApplication Field Mapping

| Card Field        | BusinessLicenseApplication Field | Notes                     |
| ----------------- | -------------------------------- | ------------------------- |
| recordId          | `Id`                             | Unique identifier         |
| activityName      | `LicenseType.Name` or `Name`     | Activity type name        |
| businessName      | `Account.Name`                   | Related account           |
| registrationSites | Custom field or related records  | Site information          |
| stepsCompleted    | Custom calculation               | Based on completed steps  |
| totalSteps        | `LicenseType` metadata           | Total steps for this type |
| actionUrl         | Computed                         | URL to OmniScript flow    |

### Progress Status Icons

| Status      | Icon Color  | Condition                       |
| ----------- | ----------- | ------------------------------- |
| Not Started | Red (error) | stepsCompleted = 0              |
| In Progress | Blue        | 0 < stepsCompleted < totalSteps |
| Complete    | Green       | stepsCompleted >= totalSteps    |

### Action Button Labels

| Status      | Button Label |
| ----------- | ------------ |
| Not Started | Start        |
| In Progress | Continue     |
| Complete    | View         |

### Events

The component dispatches these events:

| Event            | Detail                                  | Description                      |
| ---------------- | --------------------------------------- | -------------------------------- |
| `removeactivity` | `{ recordId, activityName }`            | User clicked Remove              |
| `activityaction` | `{ recordId, activityName, actionUrl }` | User clicked Start/Continue/View |

### Data Integration Options

#### Option 1: Wire Service (Recommended)

Create a custom LWC that wires to an Apex controller to fetch BusinessLicenseApplication records:

```javascript
import { wire } from 'lwc';
import getActivities from '@salesforce/apex/EASRActivityController.getActivities';

@wire(getActivities)
wiredActivities({ error, data }) {
  if (data) {
    this.activities = data.map(record => ({
      recordId: record.Id,
      activityName: record.LicenseType?.Name || record.Name,
      businessName: record.Account?.Name || '',
      registrationSites: record.RegistrationSites__c || '',
      stepsCompleted: record.CompletedSteps__c || 0,
      totalSteps: record.TotalSteps__c || 5,
      actionUrl: `/easr/activity/${record.Id}`
    }));
  }
}
```

#### Option 2: OmniStudio DataRaptor

Use a DataRaptor Extract to query BusinessLicenseApplication records and transform them to the expected JSON format.

#### Option 3: Flow

Use a Screen Flow with a Get Records element to fetch applications and pass data to the component.

### Experience Builder Configuration

| Property              | Value                                      |
| --------------------- | ------------------------------------------ |
| **Activities (JSON)** | (Wire from data source or use merge field) |
| **Cards per row**     | 2                                          |
| **Allow remove**      | true                                       |
| **Heading level**     | h3                                         |

---

## Related Documentation

- [APPLY_OR_REGISTER_PAGE.md](./APPLY_OR_REGISTER_PAGE.md) - Apply or Register page guide
- [EASR_HOME_PAGE.md](./EASR_HOME_PAGE.md) - Home page implementation guide
- [BUILD_GUIDE.md](./BUILD_GUIDE.md) - Build and deployment guide
- [OMNISTUDIO_FORMS.md](./OMNISTUDIO_FORMS.md) - OmniStudio form components
