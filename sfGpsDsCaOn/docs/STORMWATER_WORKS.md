# Stormwater Management Works - Implementation Guide

This guide explains how to implement the Stormwater Management Works activity flow using Ontario Design System components and OmniStudio.

---

## Overview

The Stormwater Management Works activity is a multi-step registration process with the following structure:

1. **Getting Started Dashboard** - Task list showing progress
2. **Operation Information** - Multi-step OmniScript
   - Step 1: Operation Name
   - Step 2: NAICS Code Selection
   - Step 3: Review & Confirmation
3. **Registration Sites** - Add and manage site(s)
4. **Before You Submit** - Activity requirements and attestation

---

## Page Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                   STORMWATER MANAGEMENT WORKS                   │
│                        (Getting Started)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ Getting started                                                  │
│ ┌─────────────────────────────────────┬────────────────────────┐│
│ │ Before you register                 │ [COMPLETED]            ││
│ ├─────────────────────────────────────┼────────────────────────┤│
│ │ Operation information               │ [NOT STARTED]          ││
│ └─────────────────────────────────────┴────────────────────────┘│
│                                                                  │
│ Registration site(s)                                             │
│ Your registration can have one or multiple site(s)...           │
│ ┌─────────────────────┐                                          │
│ │ ⊕ Add site(s)       │                                          │
│ └─────────────────────┘                                          │
│                                                                  │
│ Before you submit                                                │
│ ┌─────────────────────────────────────┬────────────────────────┐│
│ │ Activity requirements               │ [CANNOT START YET]     ││
│ ├─────────────────────────────────────┼────────────────────────┤│
│ │ Attestation                         │ [CANNOT START YET]     ││
│ └─────────────────────────────────────┴────────────────────────┘│
│                                                                  │
│ ┌─────────────────────┐                                          │
│ │   Save draft        │                                          │
│ └─────────────────────┘                                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              OPERATION INFORMATION - Step 1                     │
├─────────────────────────────────────────────────────────────────┤
│ < Back                                      Step X of X         │
│─────────────────────────────────────────────────────────────────│
│                                                                  │
│ Operation information                                            │
│                                                                  │
│ Operation name                                                   │
│                                                                  │
│ Operation name for this registration (required)                  │
│ [Description text about operation name...]                       │
│                                                                  │
│ ┌─────────────────────────────────────────────────┐              │
│ │                                                 │              │
│ └─────────────────────────────────────────────────┘              │
│                                                                  │
│ ┌─────────────────────┐ ┌─────────────────────┐                  │
│ │ Save and continue   │ │   Save draft        │        [↑ Top]  │
│ └─────────────────────┘ └─────────────────────┘                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              OPERATION INFORMATION - Step 2                     │
├─────────────────────────────────────────────────────────────────┤
│ < Back                                      Step X of X         │
│─────────────────────────────────────────────────────────────────│
│                                                                  │
│ Operation information                                            │
│                                                                  │
│ Select North American Industry Classification                    │
│ System (NAICS) code                                              │
│                                                                  │
│ [Description about NAICS codes...]                               │
│                                                                  │
│ Sector (required)         ┌──────────────────────────────────┐  │
│                           │ 56 Administrative and support... ▼│  │
│                           └──────────────────────────────────┘  │
│ Sub sector (required)     ┌──────────────────────────────────┐  │
│                           │ 561 Administrative and support   ▼│  │
│                           └──────────────────────────────────┘  │
│ Industry group (required) ┌──────────────────────────────────┐  │
│                           │ 5617 Services to buildings...    ▼│  │
│                           └──────────────────────────────────┘  │
│ Industry (required)       ┌──────────────────────────────────┐  │
│                           │ 56173 Landscaping services       ▼│  │
│                           └──────────────────────────────────┘  │
│ National industry (req'd) ┌──────────────────────────────────┐  │
│                           │ 561730 Landscaping services      ▼│  │
│                           └──────────────────────────────────┘  │
│                                                                  │
│ Selected NAICS code                                              │
│ 561730 Landscaping services                                      │
│                                                                  │
│ Clear selection                                                  │
│                                                                  │
│ ┌─────────────────────┐ ┌─────────────────────┐                  │
│ │ Add this code       │ │   Save draft        │        [↑ Top]  │
│ └─────────────────────┘ └─────────────────────┘                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              OPERATION INFORMATION - Review                     │
├─────────────────────────────────────────────────────────────────┤
│ < Back                                                           │
│─────────────────────────────────────────────────────────────────│
│                                                                  │
│ Review your answers                                              │
│                                                                  │
│ Operation information                                            │
│                                                                  │
│ Operation name                                        [Edit]     │
│ ─────────────────────────────────────────────────────────────── │
│ Operation name        │ Operation name placeholder               │
│                                                                  │
│ NAICS codes                                           [Edit]     │
│ ─────────────────────────────────────────────────────────────── │
│ 561730                │ Landscaping services                     │
│ 111110                │ Soybean farming                          │
│                                                                  │
│ Confirmation                                                     │
│ ☑ I confirm this information is complete and accurate.          │
│                                                                  │
│ ┌─────────────────────────┐ ┌─────────────────────┐              │
│ │ Complete this section   │ │   Save draft        │    [↑ Top]  │
│ └─────────────────────────┘ └─────────────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Mapping

### Getting Started Dashboard

| UI Element                    | Component                                 | Status     |
| ----------------------------- | ----------------------------------------- | ---------- |
| Page Title                    | HTML/Callout                              | **Exists** |
| Task List (Getting started)   | `sfGpsDsCaOnTaskListComm`                 | **Exists** |
| Task List (Before you submit) | `sfGpsDsCaOnTaskListComm`                 | **Exists** |
| Add site(s) button            | `sfGpsDsCaOnButtonComm` (icon: add)       | **Exists** |
| Save draft button             | `sfGpsDsCaOnButtonComm` (type: secondary) | **Exists** |
| Footer                        | `sfGpsDsCaOnFooterExpandedComm`           | **Exists** |

### Operation Information OmniScript

| UI Element                 | Component                        | Status         |
| -------------------------- | -------------------------------- | -------------- |
| Step Indicator             | `sfGpsDsCaOnStepIndicatorComm`   | **Exists**     |
| Back link                  | `sfGpsDsCaOnBackButtonComm`      | **Exists**     |
| Text Input                 | `sfGpsDsCaOnFormText`            | **Exists**     |
| Dropdown (Select)          | `sfGpsDsCaOnFormSelect`          | **Exists**     |
| **Cascading NAICS Picker** | `sfGpsDsCaOnFormNaicsCodePicker` | ✅ **Created** |
| Summary List               | `sfGpsDsCaOnSummaryListComm`     | **Exists**     |
| Checkbox                   | `sfGpsDsCaOnFormCheckbox`        | **Exists**     |
| Back to Top                | `sfGpsDsCaOnBackToTopComm`       | **Exists**     |
| Primary Button             | OmniScript Step navigation       | **Exists**     |
| Secondary Button           | OmniScript Save for Later        | **Exists**     |

---

## Component Details

### NAICS Code Picker (Created)

A composite component that encapsulates the 5-level cascading dropdown pattern for selecting NAICS codes.

**Components:**

- `sfGpsDsCaOnNaicsCodePicker` - Base component (internal)
- `sfGpsDsCaOnFormNaicsCodePicker` - OmniStudio form wrapper

**Features:**

- 5 cascading dropdowns (Sector → Sub sector → Industry group → Industry → National industry)
- Automatic filtering of child options based on parent selection
- Selected code display with "Clear selection" link
- Built-in validation
- Accessibility compliant

**Usage in OmniScript:**

1. Add a Custom LWC element to your OmniScript step
2. Set the LWC Name to `sfGpsDsCaOnFormNaicsCodePicker`
3. Configure Custom Properties with NAICS options JSON

---

## OmniScript Design

### OmniScript: EASR_StormwaterOperationInfo

**Type:** Standard OmniScript
**Steps:** 3

#### Step 1: OperationName

| Element       | Type | Properties                                              |
| ------------- | ---- | ------------------------------------------------------- |
| OperationName | Text | Required, Label: "Operation name for this registration" |

#### Step 2: NAICSCode

| Element          | Type          | Properties                           |
| ---------------- | ------------- | ------------------------------------ |
| Sector           | Select        | Required, Options: DataRaptor/SOQL   |
| SubSector        | Select        | Required, Dependent on Sector        |
| IndustryGroup    | Select        | Required, Dependent on SubSector     |
| Industry         | Select        | Required, Dependent on IndustryGroup |
| NationalIndustry | Select        | Required, Dependent on Industry      |
| SelectedCode     | Text Block    | Formula display of selected code     |
| ClearSelection   | Custom Action | Clears all selections                |
| NAICSCodes       | Edit Block    | Allows adding multiple codes         |

#### Step 3: ReviewConfirm

| Element             | Type       | Properties                                                       |
| ------------------- | ---------- | ---------------------------------------------------------------- |
| ReviewOperationName | Text Block | Display mode, Edit link                                          |
| ReviewNAICSCodes    | Text Block | Display mode, Edit link                                          |
| ConfirmCheckbox     | Checkbox   | Required, "I confirm this information is complete and accurate." |

### OmniScript Configuration

```json
{
  "type": "OmniScript",
  "subType": "EASR",
  "name": "StormwaterOperationInfo",
  "language": "English",
  "version": 1,
  "lwcTemplate": "sfGpsDsCaOnFormOsContainer",
  "steps": [
    {
      "name": "OperationName",
      "elements": [
        {
          "type": "Text",
          "name": "OperationName",
          "propSetMap": {
            "label": "Operation name for this registration",
            "required": true,
            "helpText": "The operation name is typically a unique name..."
          }
        }
      ]
    },
    {
      "name": "NAICSCode",
      "elements": [
        {
          "type": "Select",
          "name": "Sector",
          "propSetMap": {
            "label": "Sector",
            "required": true,
            "optionSource": {
              "source": "DataRaptor",
              "name": "GetNAICSSectors"
            }
          }
        },
        {
          "type": "Select",
          "name": "SubSector",
          "propSetMap": {
            "label": "Sub sector",
            "required": true,
            "controllingElement": "Sector",
            "optionSource": {
              "source": "DataRaptor",
              "name": "GetNAICSSubSectors"
            }
          }
        }
      ]
    }
  ]
}
```

---

## Create Site OmniScript

### OmniScript: EASR_CreateSite

**Type:** Standard OmniScript
**Steps:** 5

This OmniScript allows users to create a new site with site identifier, NAICS codes, and site contacts.

### Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│              CREATE SITE - Step 1 (Site Identifier)            │
├─────────────────────────────────────────────────────────────────┤
│ < Back                                      Step 1 of 3         │
│─────────────────────────────────────────────────────────────────│
│                                                                  │
│ Create site                                                      │
│                                                                  │
│ ┌────────────────────────────────────────────────────────────┐  │
│ │ ℹ This site will be saved to site information              │  │
│ │   Your site will be saved to your profile. You can reuse...│  │
│ └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│ Enter site identifier                                            │
│                                                                  │
│ Site identifier (required)                                       │
│ [Help text about site identifier...]                             │
│                                                                  │
│ ┌─────────────────────────────────────────────────┐              │
│ │ ABC - Mississauga                               │              │
│ └─────────────────────────────────────────────────┘              │
│                                                                  │
│ ┌─────────────────────┐ ┌─────────────────────┐                  │
│ │ Save and continue   │ │   Save draft        │        [↑ Top]  │
│ └─────────────────────┘ └─────────────────────┘                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              CREATE SITE - Step 2 (NAICS Code Picker)           │
├─────────────────────────────────────────────────────────────────┤
│ < Back                                      Step 2 of 3         │
│─────────────────────────────────────────────────────────────────│
│                                                                  │
│ Select North American Industry Classification                    │
│ System (NAICS) code                                              │
│                                                                  │
│ [Help text with link to Statistics Canada...]                    │
│                                                                  │
│ ┌──────────────── NAICS Code Picker Component ────────────────┐ │
│ │ Sector: [56 Administrative and support...]              ▼   │ │
│ │ Sub sector: [561 Administrative and support services]   ▼   │ │
│ │ Industry group: [5617 Services to buildings...]         ▼   │ │
│ │ Industry: [56173 Landscaping services]                  ▼   │ │
│ │ National industry: [561730 Landscaping services]        ▼   │ │
│ │                                                              │ │
│ │ Selected NAICS code: 561730 Landscaping services             │ │
│ │ Clear selection                                              │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ ┌─────────────────────┐ ┌─────────────────────┐                  │
│ │ Save and continue   │ │   Save draft        │        [↑ Top]  │
│ └─────────────────────┘ └─────────────────────┘                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              CREATE SITE - Step 3 (NAICS Codes List)            │
├─────────────────────────────────────────────────────────────────┤
│ < Back                                      Step 3 of 3         │
│─────────────────────────────────────────────────────────────────│
│                                                                  │
│ Select North American Industry Classification                    │
│ System (NAICS) code                                              │
│                                                                  │
│ [Help text mentioning "Add new NAICS code"...]                   │
│                                                                  │
│ Selected NAICS codes                                             │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ 561730    Landscaping services                 Remove  Edit  │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ ┌─────────────────────────┐                                      │
│ │ ⊕ Add new NAICS code    │                                      │
│ └─────────────────────────┘                                      │
│                                                                  │
│ ┌─────────────────────┐ ┌─────────────────────┐                  │
│ │ Save and continue   │ │   Save draft        │        [↑ Top]  │
│ └─────────────────────┘ └─────────────────────┘                  │
└─────────────────────────────────────────────────────────────────┘
```

### Step 1: SiteIdentifier

| Element        | Type       | Component Override         | Properties                         |
| -------------- | ---------- | -------------------------- | ---------------------------------- |
| InfoCallout    | Text Block | `sfGpsDsCaOnFormTextBlock` | Callout style, Info type           |
| SiteIdentifier | Text       | `sfGpsDsCaOnFormText`      | Required, Label: "Site identifier" |

**Text Block Callout Configuration:**

```json
{
  "type": "Text Block",
  "name": "InfoCallout",
  "propSetMap": {
    "calloutType": "info",
    "calloutHeading": "This site will be saved to site information",
    "text": "Your site will be saved to [your profile](%URL%). You can reuse it when applying or registering for other environmental permissions"
  }
}
```

### Step 2: NAICSCodeSelection

| Element     | Type       | Component Override               | Properties                   |
| ----------- | ---------- | -------------------------------- | ---------------------------- |
| NAICSPicker | Custom LWC | `sfGpsDsCaOnFormNaicsCodePicker` | Required, NAICS options JSON |

**NAICS Picker Configuration:**

```json
{
  "type": "Custom LWC",
  "name": "NAICSPicker",
  "propSetMap": {
    "lwcName": "sfGpsDsCaOnFormNaicsCodePicker",
    "label": "Select North American Industry Classification System (NAICS) code",
    "helpText": "The NAICS is a six digit code that represents your business at this facility or site. For more information about NAICS codes refer to [Statistics Canada](https://www.statcan.gc.ca/en/subjects/standard/naics/2022/v1/index).",
    "required": true,
    "sectorOptionsJson": "[...]",
    "subSectorOptionsJson": "[...]",
    "industryGroupOptionsJson": "[...]",
    "industryOptionsJson": "[...]",
    "nationalIndustryOptionsJson": "[...]"
  }
}
```

### Step 3: NAICSCodesList

| Element          | Type       | Component Override         | Properties                                       |
| ---------------- | ---------- | -------------------------- | ------------------------------------------------ |
| NAICSCodes       | Edit Block | `sfGpsDsCaOnFormEditBlock` | Mode: Table, Allow Edit, Allow Delete, Allow New |
| NAICSCode        | Text       | -                          | Display field for code                           |
| NAICSDescription | Text       | -                          | Display field for description                    |

**Edit Block Configuration:**

The Edit Block uses Table mode with `sfGpsDsCaOnFormEditBlock` which provides Ontario DS styled:

- Table header row
- Data rows with Edit/Remove links
- Add new button with Ontario secondary styling

```json
{
  "type": "Edit Block",
  "name": "NAICSCodes",
  "propSetMap": {
    "label": "Selected NAICS codes",
    "mode": "Table",
    "allowNew": true,
    "allowEdit": true,
    "allowDelete": true,
    "newLabel": "Add new NAICS code"
  },
  "children": [
    {
      "type": "Text",
      "name": "NAICSCode",
      "propSetMap": {
        "label": "Code",
        "readOnly": true
      }
    },
    {
      "type": "Text",
      "name": "NAICSDescription",
      "propSetMap": {
        "label": "Description",
        "readOnly": true
      }
    }
  ]
}
```

### Step 4: SelectSiteContacts

| Element        | Type        | Component Override               | Properties                |
| -------------- | ----------- | -------------------------------- | ------------------------- |
| ContactsLabel  | Text Block  | `sfGpsDsCaOnFormTextBlock`       | Label and help text       |
| Contacts       | Multiselect | `sfGpsDsCaOnFormSelectableCards` | Required, Contact options |
| PrimaryContact | Radio       | `sfGpsDsCaOnFormRadio`           | Conditionally shown       |

**Selectable Cards Configuration for Contacts:**

The `sfGpsDsCaOnSelectableCard` component now supports multi-line descriptions using `white-space: pre-line`. Use newline characters (`\n`) to format contact details:

```json
{
  "optionsJson": [
    {
      "value": "contact-1",
      "label": "Clair Taylor",
      "description": "Clairtaylor@ontario.ca\n416-997-8689"
    },
    {
      "value": "contact-2",
      "label": "Kristina Smith",
      "description": "Kristinasmith@ontario.ca\n416-557-8234"
    },
    {
      "value": "contact-3",
      "label": "Julia Wang",
      "description": "Juliawang@ontario.ca\n437-889-2304"
    }
  ]
}
```

**Primary Contact Handling:**

The "Primary contact" checkbox shown in the prototype can be implemented as:

- A separate Checkbox element that appears conditionally when a contact is selected
- Or a Radio group to select which contact is primary

### Step 5: NewSiteContact (Edit Block child step)

This step is shown when the user clicks "Create new site contact" button. It can be implemented as:

- An Edit Block in FullScreen (FS) mode, OR
- A separate OmniScript step with navigation

| Element      | Type      | Component Override         | Properties                     |
| ------------ | --------- | -------------------------- | ------------------------------ |
| FirstName    | Text      | `sfGpsDsCaOnFormText`      | Required                       |
| LastName     | Text      | `sfGpsDsCaOnFormText`      | Required                       |
| Email        | Email     | `sfGpsDsCaOnFormEmail`     | Required                       |
| ConfirmEmail | Email     | `sfGpsDsCaOnFormEmail`     | Required, validation match     |
| PhoneNumber  | Telephone | `sfGpsDsCaOnFormTelephone` | Required, Format: xxx-xxx-xxxx |

**New Contact Form Configuration:**

```json
{
  "type": "Edit Block",
  "name": "SiteContacts",
  "propSetMap": {
    "label": "Site contacts",
    "mode": "FS",
    "allowNew": true,
    "allowEdit": true,
    "allowDelete": true,
    "newLabel": "Create new site contact"
  },
  "children": [
    {
      "type": "Text",
      "name": "FirstName",
      "propSetMap": { "label": "First name", "required": true }
    },
    {
      "type": "Text",
      "name": "LastName",
      "propSetMap": { "label": "Last name", "required": true }
    },
    {
      "type": "Email",
      "name": "Email",
      "propSetMap": { "label": "Email", "required": true }
    },
    {
      "type": "Email",
      "name": "ConfirmEmail",
      "propSetMap": { "label": "Confirm email", "required": true }
    },
    {
      "type": "Telephone",
      "name": "PhoneNumber",
      "propSetMap": {
        "label": "Phone number",
        "required": true,
        "helpText": "Format: xxx-xxx-xxxx"
      }
    }
  ]
}
```

### Component Coverage

| Screenshot | Step | Component                                                                 | Status      |
| ---------- | ---- | ------------------------------------------------------------------------- | ----------- |
| 14         | 1    | `sfGpsDsCaOnFormTextBlock` (callout)                                      | ✅ Exists   |
| 14         | 1    | `sfGpsDsCaOnFormText` (site identifier)                                   | ✅ Exists   |
| 15         | 2    | `sfGpsDsCaOnFormNaicsCodePicker`                                          | ✅ Created  |
| 16         | 3    | `sfGpsDsCaOnFormEditBlock` (table mode)                                   | ✅ Exists   |
| 17         | 4    | `sfGpsDsCaOnFormSelectableCards` (multi-line)                             | ✅ Enhanced |
| 18         | 5    | `sfGpsDsCaOnFormText`, `sfGpsDsCaOnFormEmail`, `sfGpsDsCaOnFormTelephone` | ✅ Exists   |

### Edit Block Table Mode Styling

The `sfGpsDsCaOnFormEditBlock` component already provides Ontario DS styling for the NAICS codes list:

**Template:** `omniscriptEditBlock.html`

**Features:**

- Table header with column labels
- Data rows with proper Ontario DS spacing
- Edit/Delete action buttons (tertiary style)
- Add new button (secondary style with icon support)
- Selected row highlighting
- Proper ARIA attributes for accessibility

**CSS Classes Applied:**

- `.sfgpsdscaon-edit-block__table-header` - Header row styling
- `.sfgpsdscaon-edit-block__table-cell` - Cell padding and borders
- `.sfgpsdscaon-edit-block__table-actions` - Action button container
- `.ontario-button--tertiary` - Edit/Remove link styling

---

## Getting Started Dashboard Implementation

### Experience Builder Page

| Component       | Configuration                                                   |
| --------------- | --------------------------------------------------------------- |
| **Header**      | `sfGpsDsCaOnHeaderComm` (type: application)                     |
| **Back Button** | `sfGpsDsCaOnBackButtonComm`                                     |
| **Page Title**  | HTML: `<h1 class="ontario-h1">Stormwater management works</h1>` |

### Getting Started Task List

```json
{
  "itemsJson": [
    {
      "label": "Before you register",
      "hint": "",
      "status": "complete",
      "statusLabel": "Completed",
      "url": "/easr/stormwater/before-you-register"
    },
    {
      "label": "Operation information",
      "hint": "",
      "status": "not-started",
      "statusLabel": "Not started",
      "url": "/easr/stormwater/operation-info"
    }
  ]
}
```

### Before You Submit Task List

```json
{
  "itemsJson": [
    {
      "label": "Activity requirements",
      "status": "cannot-start-yet",
      "statusLabel": "Cannot start yet"
    },
    {
      "label": "Attestation",
      "status": "cannot-start-yet",
      "statusLabel": "Cannot start yet"
    }
  ]
}
```

---

## Data Model Integration

### BusinessLicenseApplication Fields

| Field           | Purpose                           |
| --------------- | --------------------------------- |
| `Name`          | Operation name                    |
| `Status`        | Application status                |
| `LicenseTypeId` | Links to Stormwater activity type |

### Custom Objects/Fields Needed

| Object/Field          | Purpose                                  |
| --------------------- | ---------------------------------------- |
| `NAICS_Code__c`       | Junction object for multiple NAICS codes |
| `Application_Step__c` | Track step completion status             |

---

## Summary List Configuration (Review Page)

### Operation Name Section

```json
{
  "heading": "Operation name",
  "headingActionLabel": "Edit",
  "headingActionUrl": "#step-1",
  "itemsJson": [
    {
      "key": "Operation name",
      "value": "{!OperationName}"
    }
  ]
}
```

### NAICS Codes Section

```json
{
  "heading": "NAICS codes",
  "headingActionLabel": "Edit",
  "headingActionUrl": "#step-2",
  "itemsJson": [
    {
      "key": "561730",
      "value": "Landscaping services"
    },
    {
      "key": "111110",
      "value": "Soybean farming"
    }
  ],
  "ratio": "1-2"
}
```

---

## Implementation Checklist

### Phase 1: Getting Started Dashboard

- [ ] Create Experience Builder page `/easr/stormwater`
- [ ] Add Task List for "Getting started" section
- [ ] Add "Add site(s)" button
- [ ] Add Task List for "Before you submit" section
- [ ] Add "Save draft" button
- [ ] Configure navigation links

### Phase 2: Operation Information OmniScript

- [ ] Create OmniScript: EASR_StormwaterOperationInfo
- [ ] Configure Step 1: Operation Name
- [ ] Configure Step 2: NAICS Code Selection
  - [ ] Create DataRaptor for NAICS sectors
  - [ ] Create DataRaptor for dependent subsectors
  - [ ] Configure dependent picklists
- [ ] Configure Step 3: Review & Confirm
- [ ] Add Summary List components
- [ ] Add confirmation checkbox
- [ ] Test navigation and save draft

### Phase 3: Data Integration

- [ ] Create/configure NAICS_Code\_\_c object
- [ ] Create Integration Procedure for saving
- [ ] Create DataRaptor for loading existing data
- [ ] Test end-to-end flow

---

## NAICS Code Picker Component

### Component: `sfGpsDsCaOnFormNaicsCodePicker`

The NAICS Code Picker is a custom OmniStudio component for selecting 6-digit NAICS codes through 5 cascading dropdowns.

### Properties

| Property                | Type    | Description                                                                               |
| ----------------------- | ------- | ----------------------------------------------------------------------------------------- |
| `label`                 | String  | Main label (default: "Select North American Industry Classification System (NAICS) code") |
| `helpText`              | String  | Description text                                                                          |
| `required`              | Boolean | Whether selection is required                                                             |
| `optional`              | Boolean | Whether to show "(optional)" flag                                                         |
| `disabled`              | Boolean | Disable all dropdowns                                                                     |
| `sectorLabel`           | String  | Label for Sector dropdown                                                                 |
| `subSectorLabel`        | String  | Label for Sub sector dropdown                                                             |
| `industryGroupLabel`    | String  | Label for Industry group dropdown                                                         |
| `industryLabel`         | String  | Label for Industry dropdown                                                               |
| `nationalIndustryLabel` | String  | Label for National industry dropdown                                                      |

### Options Configuration

In OmniScript Custom Properties, provide JSON arrays for each level:

```json
{
  "sectorOptionsJson": [
    { "value": "11", "label": "11 Agriculture, forestry, fishing and hunting" },
    {
      "value": "21",
      "label": "21 Mining, quarrying, and oil and gas extraction"
    },
    {
      "value": "56",
      "label": "56 Administrative and support, waste management and remediation services"
    }
  ],
  "subSectorOptionsJson": [
    { "value": "111", "label": "111 Crop production", "parentValue": "11" },
    {
      "value": "112",
      "label": "112 Animal production and aquaculture",
      "parentValue": "11"
    },
    {
      "value": "561",
      "label": "561 Administrative and support services",
      "parentValue": "56"
    }
  ],
  "industryGroupOptionsJson": [
    {
      "value": "1111",
      "label": "1111 Oilseed and grain farming",
      "parentValue": "111"
    },
    {
      "value": "5617",
      "label": "5617 Services to buildings and dwellings",
      "parentValue": "561"
    }
  ],
  "industryOptionsJson": [
    {
      "value": "11111",
      "label": "11111 Soybean farming",
      "parentValue": "1111"
    },
    {
      "value": "56173",
      "label": "56173 Landscaping services",
      "parentValue": "5617"
    }
  ],
  "nationalIndustryOptionsJson": [
    {
      "value": "111110",
      "label": "111110 Soybean farming",
      "parentValue": "11111"
    },
    {
      "value": "561730",
      "label": "561730 Landscaping services",
      "parentValue": "56173"
    }
  ]
}
```

### Data Integration

Options can be loaded dynamically via:

- **DataRaptor**: Query NAICS reference data from Salesforce
- **Integration Procedure**: Fetch from external Statistics Canada API
- **Static Resource**: Pre-loaded JSON for offline scenarios

### Events

| Event    | Detail                                                                           | Description                                    |
| -------- | -------------------------------------------------------------------------------- | ---------------------------------------------- |
| `change` | `{ value, sector, subSector, industryGroup, industry, nationalIndustry, label }` | Fired when a complete 6-digit code is selected |
| `clear`  | -                                                                                | Fired when selection is cleared                |

### Example OmniScript Configuration

```json
{
  "type": "Custom LWC",
  "name": "NAICSCodePicker",
  "propSetMap": {
    "lwcName": "sfGpsDsCaOnFormNaicsCodePicker",
    "label": "Select NAICS code",
    "required": true,
    "sectorOptionsJson": "[...]",
    "subSectorOptionsJson": "[...]",
    "industryGroupOptionsJson": "[...]",
    "industryOptionsJson": "[...]",
    "nationalIndustryOptionsJson": "[...]"
  }
}
```

---

## Add Sites Page

### Component Mapping

| UI Element                       | Component                                                      | Status          |
| -------------------------------- | -------------------------------------------------------------- | --------------- |
| Info Callout                     | `sfGpsDsCaOnCalloutComm`                                       | ✅ **Exists**   |
| Site Checkbox Cards              | `sfGpsDsCaOnSelectableCard` / `sfGpsDsCaOnFormSelectableCards` | ✅ **Enhanced** |
| Status badges (NEW, IN PROGRESS) | `badge` / `badgeVariant` properties                            | ✅ **Added**    |
| "More details" link              | `linkLabel` / `linkUrl` properties                             | ✅ **Added**    |
| "Create a new site" button       | `sfGpsDsCaOnButtonComm` (icon: add)                            | ✅ **Exists**   |
| "Add selected site(s)" button    | `sfGpsDsCaOnButtonComm`                                        | ✅ **Exists**   |

### Selectable Card Link Support

The `sfGpsDsCaOnSelectableCard` component now supports optional links below the description:

**New Properties:**

- `linkLabel` - Text for the link (e.g., "More details in your profile")
- `linkUrl` - URL for the link

### Selectable Card Badge Support (Status Indicators)

The `sfGpsDsCaOnSelectableCard` component supports status badges displayed next to the title (e.g., "NEW", "IN PROGRESS").

**New Properties:**

- `badge` - Badge text to display (e.g., "NEW", "IN PROGRESS", "COMPLETED")
- `badgeVariant` - Color variant: `success` (green), `info` (blue), `warning` (yellow), `error` (red)

**OmniScript Options JSON Format with Badges:**

```json
[
  {
    "value": "site-1",
    "label": "ABC - Mississauga",
    "description": "2323 Royal Windsor Drive W, Mississauga, ON L5J 1K5, Canada",
    "linkLabel": "More details in your profile",
    "linkUrl": "/profile/sites/site-1",
    "badge": "NEW",
    "badgeVariant": "success"
  },
  {
    "value": "site-2",
    "label": "Site 1 name identifier",
    "description": "1801-1234 St. Clair West, Toronto, ON A1A 2B2, Canada",
    "linkLabel": "More details in your profile",
    "linkUrl": "/profile/sites/site-2",
    "badge": "IN PROGRESS",
    "badgeVariant": "info"
  },
  {
    "value": "site-3",
    "label": "Site 2 name identifier",
    "description": "123 Lawrence West, Toronto, ON Z1Z 2X2, Canada",
    "linkLabel": "More details in your profile",
    "linkUrl": "/profile/sites/site-3"
  }
]
```

**Badge Styling:**

| Variant   | Color            | Use Case                     |
| --------- | ---------------- | ---------------------------- |
| `success` | Green (#118847)  | NEW, COMPLETED, ACTIVE       |
| `info`    | Blue (#0066cc)   | IN PROGRESS, PENDING         |
| `warning` | Yellow (#ffc107) | ATTENTION REQUIRED, EXPIRING |
| `error`   | Red (#cd0000)    | ERROR, REJECTED, EXPIRED     |

---

## Site Details Page

### Component Mapping

| UI Element                | Component                    | Status        |
| ------------------------- | ---------------------------- | ------------- |
| Section with Edit link    | `sfGpsDsCaOnSummaryListComm` | ✅ **Exists** |
| Field display (key-value) | Summary List items           | ✅ **Exists** |
| Continue button           | `sfGpsDsCaOnButtonComm`      | ✅ **Exists** |

### Summary List Configuration

Each section on the Site Details page uses `sfGpsDsCaOnSummaryListComm`:

```json
{
  "heading": "Site identifier",
  "headingActionLabel": "Edit",
  "headingActionUrl": "/easr/sites/site-1/edit",
  "itemsJson": [{ "key": "Site identifier", "value": "Site 1 name identifier" }]
}
```

```json
{
  "heading": "Site contact(s)",
  "subHeading": "Primary site contact",
  "headingActionLabel": "Edit",
  "headingActionUrl": "/easr/sites/site-1/contacts/edit",
  "itemsJson": [
    { "key": "Name", "value": "John Smith" },
    { "key": "Email address", "value": "john.smith@example.com" },
    { "key": "Phone number", "value": "XXX-XXX-XXXX" }
  ]
}
```

---

## Site Task Card Component

### Component: `sfGpsDsCaOnSiteTaskCardComm`

A card displaying a registration site with its associated tasks and progress summary.

### Properties

| Property       | Type    | Description                                   |
| -------------- | ------- | --------------------------------------------- |
| `siteId`       | String  | Unique identifier for this site               |
| `siteName`     | String  | Site name displayed in header                 |
| `tasksJson`    | String  | JSON array of task items                      |
| `allowRemove`  | Boolean | Whether to show Remove action (default: true) |
| `headingLevel` | String  | Heading level (h2, h3, h4)                    |

### Tasks JSON Format

```json
[
  {
    "label": "Activity information",
    "status": "not-started",
    "statusLabel": "Not started",
    "url": "/easr/stormwater/site-1/activity-info"
  },
  {
    "label": "Stormwater discharge location",
    "status": "not-started",
    "statusLabel": "Not started",
    "url": "/easr/stormwater/site-1/discharge"
  },
  {
    "label": "Related applications",
    "status": "not-started",
    "statusLabel": "Not started",
    "url": "/easr/stormwater/site-1/related"
  }
]
```

### Collection Component: `sfGpsDsCaOnSiteTaskCardCollection`

For displaying multiple sites, use the collection component:

```json
{
  "sites": [
    {
      "siteId": "site-1",
      "siteName": "Site 1 name identifier",
      "tasks": [
        {
          "label": "Activity information",
          "status": "not-started",
          "statusLabel": "Not started",
          "url": "..."
        },
        {
          "label": "Stormwater discharge location",
          "status": "not-started",
          "statusLabel": "Not started",
          "url": "..."
        },
        {
          "label": "Related applications",
          "status": "complete",
          "statusLabel": "Complete",
          "url": "..."
        }
      ]
    }
  ]
}
```

### Progress Calculation

The component automatically calculates and displays progress:

- **Not Started**: "0 out of 3 sections (Not started)" with error icon
- **In Progress**: "1 out of 3 sections (In progress)" with clock icon
- **Complete**: "3 out of 3 sections (Complete)" with checkmark icon

### Events

| Event        | Detail                 | Description                              |
| ------------ | ---------------------- | ---------------------------------------- |
| `remove`     | `{ siteId, siteName }` | Fired when Remove link is clicked        |
| `siteremove` | `{ siteId, siteName }` | Fired by collection when site is removed |

---

## GIS Components

For detailed documentation on the GIS-based location selection components, see the **[GIS Components Guide](./GIS_GUIDE.md)**.

The guide covers:

- **Site Selector Tool** - Address-based location selection with ESRI geocoding
- **Discharge Point Selector** - Coordinate entry (UTM, DMS, Decimal) with map visualization
- **MECP District Lookup** - Geographic boundary-based data lookup
- **CSP Configuration** - Required security settings for ESRI integration
- **Troubleshooting** - Common issues and solutions

### Quick Component Reference

| Use Case                      | Component                           | OmniScript LWC                          |
| ----------------------------- | ----------------------------------- | --------------------------------------- |
| Address selection             | `sfGpsDsCaOnSiteSelectorTool`       | `sfGpsDsCaOnFormSiteSelectorTool`       |
| Coordinate entry              | `sfGpsDsCaOnDischargePointSelector` | `sfGpsDsCaOnFormDischargePointSelector` |
| Coordinate input (standalone) | `sfGpsDsCaOnCoordinateInput`        | -                                       |
| Modal dialog                  | `sfGpsDsCaOnModal`                  | -                                       |

---

## Implementation Checklist Update

### Phase 4: Add Sites

- [ ] Create Add Sites Experience Builder page
- [ ] Configure `sfGpsDsCaOnCalloutComm` for info message
- [ ] Configure `sfGpsDsCaOnFormSelectableCards` for site selection
- [ ] Set up site options with `linkLabel` and `linkUrl`
- [x] Add badge support (`badge`, `badgeVariant`) for "NEW"/"IN PROGRESS" status
- [ ] Add "Create a new site" button
- [ ] Configure "Add selected site(s)" action

### Phase 5: Site Details

- [ ] Create Site Details Experience Builder page
- [ ] Configure multiple `sfGpsDsCaOnSummaryListComm` sections
- [ ] Set up Edit links for each section
- [ ] Add Continue button

### Phase 6: Registration Sites Display

- [ ] Add `sfGpsDsCaOnSiteTaskCardCollection` to Getting Started page
- [ ] Configure site data binding
- [ ] Implement remove site handler
- [ ] Test progress calculation

### Phase 7: Create Site OmniScript

- [ ] Create OmniScript: EASR_CreateSite
- [ ] Configure Step 1: Site Identifier
  - [ ] Add info callout Text Block
  - [ ] Add Site identifier Text field
- [ ] Configure Step 2: NAICS Code Selection
  - [ ] Add `sfGpsDsCaOnFormNaicsCodePicker` Custom LWC
  - [ ] Configure NAICS options JSON from DataRaptor
- [ ] Configure Step 3: NAICS Codes List
  - [ ] Add Edit Block in Table mode
  - [ ] Configure Add/Edit/Delete actions
  - [ ] Set up "Add new NAICS code" button label
- [ ] Configure Step 4: Select Site Contacts
  - [ ] Add `sfGpsDsCaOnFormSelectableCards` with multi-line descriptions
  - [ ] Configure contact options with email/phone in description
  - [ ] Add Primary Contact selection (Radio or Checkbox)
  - [ ] Add "Create new site contact" button
- [ ] Configure Step 5: New Site Contact Form (Edit Block FS mode)
  - [ ] Add First name, Last name Text fields
  - [ ] Add Email, Confirm email fields with validation
  - [ ] Add Phone number field with format hint
- [ ] Create Integration Procedure to save site
- [ ] Test end-to-end flow

### Phase 7b: Address Details Step (Create Site OmniScript)

- [ ] Configure Address Details step (after Site Selector)
  - [ ] Add Property ID number Text field (optional)
  - [ ] Add Assessment roll number Text field (optional)
  - [ ] Add Non-address information Textarea (optional)
  - [ ] Add Legal description Textarea (optional)
  - [ ] Add Location description Textarea (optional)
  - [ ] Add Part lot description Textarea (optional)
- [ ] Configure MECP District/Area Office display
  - [ ] Create Integration Procedure: `EASR_GetMECPDistrictByCoordinates`
  - [ ] Add `sfGpsDsCaOnFormTextBlock` with callout type for district info
  - [ ] Configure Set Values to populate district data from coordinates
- [ ] Verify Edit Block table styling matches Ontario DS

### Phase 8: Site Selector Tool

> See [GIS_GUIDE.md](./GIS_GUIDE.md) for detailed component documentation.

- [x] All components created and deployed
- [ ] Configure ESRI API key in utils\_\_mdt custom metadata
- [ ] Configure SiteName in utils\_\_mdt for community URL
- [ ] Configure CSP and Trusted Sites (see GIS_GUIDE.md)
- [ ] Test in OmniScript Create Site flow

### Phase 9: Discharge Point Selector

> See [GIS_GUIDE.md](./GIS_GUIDE.md) for detailed component documentation.

- [x] All components created and deployed
- [ ] Create Integration Procedure for source protection area lookup
- [ ] Configure Discharge Point Details display
- [ ] Test in Stormwater Discharge Location OmniScript

---

## Accessibility Considerations

1. **Step Indicator**: Announces current step to screen readers
2. **Dependent Dropdowns**: Each dropdown has proper labels and aria-describedby
3. **Clear Selection**: Keyboard accessible link
4. **Summary List**: Proper heading hierarchy with Edit links
5. **Confirmation Checkbox**: Required field with clear error messaging
6. **Site Task Cards**: Proper heading hierarchy, keyboard accessible Remove link
7. **Progress Status**: Uses role="status" for screen reader announcements

> For GIS component accessibility (Modal, Site Selector, Discharge Point Selector), see [GIS_GUIDE.md](./GIS_GUIDE.md#accessibility-considerations).

---

## Related Documentation

- [GIS_GUIDE.md](./GIS_GUIDE.md) - GIS components (Site Selector, Discharge Point, ESRI integration)
- [INDUSTRY_ELIGIBILITY_OMNISCRIPT.md](./INDUSTRY_ELIGIBILITY_OMNISCRIPT.md) - Industry Eligibility Check implementation guide
- [EASR_REGISTRATION_PAGE.md](./EASR_REGISTRATION_PAGE.md) - EASR Registration page guide
- [OMNISTUDIO_FORMS.md](./OMNISTUDIO_FORMS.md) - OmniStudio form components
- [BUILD_GUIDE.md](./BUILD_GUIDE.md) - Build and deployment guide
