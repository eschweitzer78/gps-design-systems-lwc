# Industry Eligibility Check OmniScript Implementation Guide

This guide provides detailed configuration instructions for implementing the Industry Eligibility Check OmniScript using Ontario Design System components.

## Table of Contents

1. [Overview](#overview)
2. [OmniScript Structure](#omniscript-structure)
3. [Step 1: Industry Eligibility Check](#step-1-industry-eligibility-check)
4. [Step 2: Activity Related Information](#step-2-activity-related-information)
5. [Step 3: Storm Water Management Report](#step-3-storm-water-management-report)
6. [Step 4: Confirmation](#step-4-confirmation)
7. [Conditional Logic Rules](#conditional-logic-rules)
8. [Hard Stop Configuration](#hard-stop-configuration)
9. [Data Model](#data-model)
10. [Testing Checklist](#testing-checklist)

---

## Overview

### Purpose

The Industry Eligibility Check OmniScript determines whether a user's storm water management works are eligible for registration in the Environmental Activity and Sector Registry (EASR).

### Flow Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                    Industry Eligibility Check                    │
│                         (Questions 1-8)                          │
│                                                                   │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐          │
│  │   Q1    │ → │   Q2    │ → │   Q3    │ → │   Q4    │ ─────┐   │
│  │ Yes/No  │   │ Yes/No  │   │ NAICS   │   │ Yes/No  │      │   │
│  └─────────┘   └─────────┘   └─────────┘   └─────────┘      │   │
│                                                 │            │   │
│                                            Yes  ▼       No   │   │
│                                         ┌──────────┐         │   │
│                                         │HARD STOP │         │   │
│                                         └──────────┘         │   │
│                                                              ▼   │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────────────┐  │
│  │ Q5a/5b  │ → │   Q6    │ → │   Q7    │ → │   Q8a/8b/8c     │  │
│  └─────────┘   └─────────┘   └─────────┘   └─────────────────┘  │
│                     │             │                              │
│                Yes  ▼        Yes  ▼                              │
│              ┌──────────┐  ┌──────────┐                          │
│              │HARD STOP │  │HARD STOP │                          │
│              └──────────┘  └──────────┘                          │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Activity Related Information                    │
│                        (Questions 9-18)                          │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                 Storm Water Management Report                    │
│                       (Questions 19-24)                          │
│              + Licensed Engineering Practitioners                │
│                   + Supporting Documentation                     │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Confirmation                             │
└─────────────────────────────────────────────────────────────────┘
```

### Components Used

| Component  | OmniStudio Override         | Usage                  |
| ---------- | --------------------------- | ---------------------- |
| Radio      | `sfGpsDsCaOnFormRadio`      | Yes/No questions       |
| Checkbox   | `sfGpsDsCaOnFormCheckbox`   | Multi-select lists     |
| Text       | `sfGpsDsCaOnFormTextInput`  | Short text/numbers     |
| Textarea   | `sfGpsDsCaOnFormTextarea`   | Long text descriptions |
| Date       | `sfGpsDsCaOnFormDatePicker` | Date inputs            |
| Messaging  | `sfGpsDsCaOnFormMessaging`  | Hard stop alerts       |
| Disclosure | Native OmniStudio           | Expandable help text   |
| File       | `sfGpsDsCaOnFormFileUpload` | Document upload        |

---

## OmniScript Structure

### Create OmniScript

1. Navigate to **OmniStudio** → **OmniScripts**
2. Create new OmniScript:
   - **Type**: `IndustryEligibility`
   - **Sub Type**: `Check`
   - **Language**: `English`
   - **Version**: `1`

### Global Properties

| Property                   | Value                           |
| -------------------------- | ------------------------------- |
| **LWC Enabled**            | `true`                          |
| **Lightning Web Security** | `true`                          |
| **Save for Later**         | `true`                          |
| **Save Object Type**       | Custom Object or Platform Event |
| **Cancel Redirect URL**    | `/easr/registration`            |

---

## Step 1: Industry Eligibility Check

### Step Configuration

| Property                | Value                        |
| ----------------------- | ---------------------------- |
| **Name**                | `IndustryEligibilityCheck`   |
| **Label**               | `Industry eligibility check` |
| **Show Step Indicator** | `true`                       |
| **Chart Label**         | `Activity information`       |

### Question 1: Stormwater Works Activity

**Element Type**: Radio

| Property     | Value                                                                                                                                    |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**     | `Q1_StormwaterActivity`                                                                                                                  |
| **Label**    | `1. Are you engaging in an activity that requires you to use, operate, establish, alter, extend or replace stormwater management works?` |
| **Required** | `true`                                                                                                                                   |
| **Options**  | `[{"label": "Yes", "value": "Yes"}, {"label": "No", "value": "No"}]`                                                                     |

**Custom LWC**: `sfGpsDsCaOnFormRadio`

---

### Question 2: Environmental Permission Required

**Element Type**: Radio

| Property      | Value                                                                                                                                                        |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Name**      | `Q2_EnvironmentalPermission`                                                                                                                                 |
| **Label**     | `2. Do you require an environmental permission under the Ontario Water Resource Act (OWRA) and/or Environmental Protection Act (EPA) to manage storm water?` |
| **Required**  | `true`                                                                                                                                                       |
| **Help Text** | (See Markdown content below)                                                                                                                                 |

**Help Text (Markdown)**:

```markdown
In Ontario, you need an environmental permission to use, operate, establish, alter, extend or replace new or existing sewage works including storm water management works learn more by viewing Environmental Permissions for Sewage and storm water management on the ministry website [(add link)](#).
```

**Custom LWC**: `sfGpsDsCaOnFormRadio`

---

### Question 3: NAICS Codes Selection

**Element Type**: Checkbox

| Property      | Value                                                                                                                                                                                    |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**      | `Q3_NAICSCodes`                                                                                                                                                                          |
| **Label**     | `3. Please select all North American Industry Classification System (NAICS) codes that apply to activities that your storm water management works service or will service at your site.` |
| **Required**  | `true`                                                                                                                                                                                   |
| **Help Text** | `The NAICS code(s) included are associated with the site you have selected, please go to your Sites tab of your ministry profile if any updates are required.`                           |

**Options Source**: DataRaptor or Integration Procedure to fetch NAICS codes from the selected Site record.

**JSON Options Format**:

```json
[
  { "label": "561730 - Landscaping services", "value": "561730" },
  { "label": "111110 - Soybean farming", "value": "111110" }
]
```

**Custom LWC**: `sfGpsDsCaOnFormCheckbox`

---

### Question 4: Site Types (with Hard Stop)

**Element Type**: Radio

| Property     | Value                                                                                |
| ------------ | ------------------------------------------------------------------------------------ |
| **Name**     | `Q4_SiteTypes`                                                                       |
| **Label**    | `4. Will your storm water management works be servicing any of the following sites?` |
| **Required** | `true`                                                                               |

**Help Text (Bulleted List)**:

```markdown
- A waste disposal site as defined in Part V of the Act.
- An abandoned motor vehicle site as defined in Part VII of the Act.
- A snow disposal facility or a site for the storage of snow where the predominant use of the site is for the retention, control, storage or disposal of snow.
- A bulk plant as defined in [Ontario Regulation 217/01 (Liquid Fuels)](#) made under the Technical Standards and Safety Act, 2000.
- A golf course.
- A road salt storage facility.
- An aerodrome as defined in the Aeronautics Act (Canada).
- A shipyard and any associated maintenance facility.
- A renewable energy generation facility.
- A greenhouse
- An outdoor surface consisting of aggregate that includes basic oxygen furnace slag.
- A site at which any of the following activities take place:
- Outdoor repair and maintenance of motorized vehicles, equipment and heavy machinery.
```

**Custom LWC**: `sfGpsDsCaOnFormRadio`

---

### Question 4: Hard Stop Messaging (Conditional)

**Element Type**: Messaging

| Property           | Value                     |
| ------------------ | ------------------------- |
| **Name**           | `Q4_HardStop`             |
| **Type**           | `Error`                   |
| **Show Condition** | `%Q4_SiteTypes% == "Yes"` |

**Content (Markdown)**:

```markdown
Based on your answer, you do not meet the requirements to register your storm water management works in the Environmental Activity and Sector Registry and may need to [apply for an Environmental Compliance Approval (ECA)](#).

The use, operation, establishment, alteration, extension or replacement of any new or existing storm water management works that services any of these sites is not prescribed for the purposes of [subsection 20.21 (1) of the Act](#).
```

**Custom LWC**: `sfGpsDsCaOnFormMessaging`

---

### Question 5a: Environmental Assessment Act

**Element Type**: Radio

| Property     | Value                                                                                                                  |
| ------------ | ---------------------------------------------------------------------------------------------------------------------- |
| **Name**     | `Q5a_EnvironmentalAssessment`                                                                                          |
| **Label**    | `5.a. Are your storm water management works part of an undertaking to which the Environmental Assessment Act applies?` |
| **Required** | `true`                                                                                                                 |

---

### Question 5b: Notice to Proceed (Conditional)

**Element Type**: Radio

| Property           | Value                                                                           |
| ------------------ | ------------------------------------------------------------------------------- |
| **Name**           | `Q5b_NoticeToProceed`                                                           |
| **Label**          | `5.b. Have you satisfied all requirements and received your notice to proceed?` |
| **Required**       | `true`                                                                          |
| **Show Condition** | `%Q5a_EnvironmentalAssessment% == "Yes"`                                        |

---

### Question 6: Process Water Discharge (with Hard Stop)

**Element Type**: Radio

| Property     | Value                                                                                                                             |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| **Name**     | `Q6_ProcessWaterDischarge`                                                                                                        |
| **Label**    | `6. Does your storm water management works receive any discharge of process water, cooling water, wash water or sanitary sewage?` |
| **Required** | `true`                                                                                                                            |

---

### Question 6: Hard Stop Messaging (Conditional)

**Element Type**: Messaging

| Property           | Value                                 |
| ------------------ | ------------------------------------- |
| **Name**           | `Q6_HardStop`                         |
| **Type**           | `Error`                               |
| **Show Condition** | `%Q6_ProcessWaterDischarge% == "Yes"` |

**Content (Markdown)**:

```markdown
The use, operation, establishment, alteration, extension or replacement of any new or existing storm water management works that receives or is proposed to receive any process water or cooling water or wash water or sanitary sewage is NOT prescribed for the purposes of [subsection 20.21 (1) of the Act](#). This means you cannot register your works and may need to apply for or continue to follow your Environmental Compliance Approval (ECA).
```

---

### Question 7: Municipality Ownership (with Hard Stop)

**Element Type**: Radio

| Property     | Value                                                                                                 |
| ------------ | ----------------------------------------------------------------------------------------------------- |
| **Name**     | `Q7_MunicipalityOwnership`                                                                            |
| **Label**    | `7. Are the storm water management works owned or planned to be transferred to any of the following?` |
| **Required** | `true`                                                                                                |

**Help Text (Bulleted List)**:

```markdown
- A municipality within the meaning of the [Municipal Act, 2001](#)
- Any of the following bodies that is established for the purpose of managing public utilities on behalf of or for a municipality within the meaning of the [Municipal Act, 2001](#):
  - A public utility commission or a municipal service board
  - A municipal service board or a city board
  - A municipal corporation
```

**Disclosure Element** (below radio):

- **Label**: `What do these mean?`
- **Content**: Definitions of each term

---

### Question 7: Hard Stop Messaging (Conditional)

**Element Type**: Messaging

| Property           | Value                                 |
| ------------------ | ------------------------------------- |
| **Name**           | `Q7_HardStop`                         |
| **Type**           | `Error`                               |
| **Show Condition** | `%Q7_MunicipalityOwnership% == "Yes"` |

**Content (Markdown)**:

```markdown
Based on your answer, you do not meet the requirements to register your storm water management works in the Environmental Activity and Sector Registry.

If your works will be assumed or transferred to the municipality, contact them for direction.
```

---

### Question 8a: Property Ownership

**Element Type**: Radio

| Property     | Value                                                                                      |
| ------------ | ------------------------------------------------------------------------------------------ |
| **Name**     | `Q8a_PropertyOwnership`                                                                    |
| **Label**    | `8.a. Do you own the property where the storm water management works will be constructed?` |
| **Required** | `true`                                                                                     |

---

### Question 8b: Landowner Consent (Conditional)

**Element Type**: Radio

| Property           | Value                                                  |
| ------------------ | ------------------------------------------------------ |
| **Name**           | `Q8b_LandownerConsent`                                 |
| **Label**          | `8.b. Do you have written consent from the landowner?` |
| **Required**       | `true`                                                 |
| **Show Condition** | `%Q8a_PropertyOwnership% == "No"`                      |

---

### Question 8c: Indoor Activities

**Element Type**: Radio

| Property     | Value                                                                          |
| ------------ | ------------------------------------------------------------------------------ |
| **Name**     | `Q8c_IndoorActivities`                                                         |
| **Label**    | `8.c. Are all processing, maintenance or repair activities completed indoors?` |
| **Required** | `true`                                                                         |

---

## Step 2: Activity Related Information

### Step Configuration

| Property        | Value                          |
| --------------- | ------------------------------ |
| **Name**        | `ActivityRelatedInfo`          |
| **Label**       | `Activity related information` |
| **Chart Label** | `Activity information`         |

---

### Question 9: Primary Land Use (with Expandable Help)

**Element Type**: Radio

| Property     | Value                                                                        |
| ------------ | ---------------------------------------------------------------------------- |
| **Name**     | `Q9_PrimaryLandUse`                                                          |
| **Label**    | `9. What is the primary land use that the waste management system services?` |
| **Required** | `true`                                                                       |

**Options**:

```json
[
  { "label": "Urban", "value": "Urban" },
  { "label": "Rural", "value": "Rural" },
  { "label": "Industrial indoor processes", "value": "IndustrialIndoor" },
  { "label": "Industrial outdoor processes", "value": "IndustrialOutdoor" },
  { "label": "Agricultural", "value": "Agricultural" },
  { "label": "Green Space", "value": "GreenSpace" }
]
```

**Implementation with Disclosure Elements**:

After the Radio element, add Disclosure elements for each option:

```
Block: Q9_HelpContent
├── Disclosure: Q9_Help_Urban
│   ├── Label: "What does urban mean?"
│   └── Content Block: Definition of urban land use
├── Disclosure: Q9_Help_Rural
│   ├── Label: "What does rural mean?"
│   └── Content Block: Definition of rural land use
├── Disclosure: Q9_Help_IndustrialIndoor
│   ├── Label: "What does industrial indoor processes mean?"
│   └── Content Block: Definition
├── Disclosure: Q9_Help_IndustrialOutdoor
│   ├── Label: "What does industrial mean?"
│   └── Content Block: Definition
```

---

### Question 10: Primary Activity (Long Checkbox List)

**Element Type**: Checkbox (Multi-select)

| Property     | Value                                           |
| ------------ | ----------------------------------------------- |
| **Name**     | `Q10_PrimaryActivity`                           |
| **Label**    | `10. What is the primary activity at the site?` |
| **Required** | `true`                                          |

**Options** (Grouped for organization):

```json
[
  {
    "label": "Amusement parks",
    "value": "AmusementParks",
    "group": "Entertainment"
  },
  {
    "label": "Commercial/Business parks",
    "value": "BusinessParks",
    "group": "Commercial"
  },
  {
    "label": "Convention/Conference centres",
    "value": "ConventionCentres",
    "group": "Commercial"
  },
  {
    "label": "Distribution facilities",
    "value": "DistributionFacilities",
    "group": "Industrial"
  },
  { "label": "Retail store(s)", "value": "RetailStores", "group": "Retail" },
  { "label": "Theatre", "value": "Theatre", "group": "Entertainment" },
  { "label": "Rental store", "value": "RentalStore", "group": "Retail" },
  { "label": "Gas stations", "value": "GasStations", "group": "Retail" },
  {
    "label": "Hotels, motels, lodges and resorts",
    "value": "Hotels",
    "group": "Hospitality"
  },
  {
    "label": "Commercial warehouses",
    "value": "CommercialWarehouses",
    "group": "Industrial"
  },
  {
    "label": "Museums and art galleries",
    "value": "Museums",
    "group": "Entertainment"
  },
  {
    "label": "Nursery stores and garden centers",
    "value": "NurseryStores",
    "group": "Retail"
  },
  {
    "label": "Office building(s)",
    "value": "OfficeBuildings",
    "group": "Commercial"
  },
  {
    "label": "Malls, plazas and shopping centres",
    "value": "Malls",
    "group": "Retail"
  },
  { "label": "Parking lot(s)", "value": "ParkingLots", "group": "Commercial" },
  {
    "label": "Self-storage mini warehouses",
    "value": "SelfStorage",
    "group": "Industrial"
  },
  {
    "label": "Recreational centre",
    "value": "RecreationalCentre",
    "group": "Entertainment"
  },
  { "label": "Community hall", "value": "CommunityHall", "group": "Civic" },
  {
    "label": "Sport complexes",
    "value": "SportComplexes",
    "group": "Entertainment"
  },
  {
    "label": "Hospitals and other health care facilities",
    "value": "Hospitals",
    "group": "Healthcare"
  },
  {
    "label": "Nursing/long-term care homes",
    "value": "NursingHomes",
    "group": "Healthcare"
  },
  {
    "label": "Medical Office(s)",
    "value": "MedicalOffices",
    "group": "Healthcare"
  },
  {
    "label": "Places of worship",
    "value": "PlacesOfWorship",
    "group": "Civic"
  },
  {
    "label": "Retirement homes",
    "value": "RetirementHomes",
    "group": "Residential"
  },
  { "label": "Daycare facility", "value": "DaycareFacility", "group": "Civic" },
  { "label": "Restaurant", "value": "Restaurant", "group": "Hospitality" },
  { "label": "Arena", "value": "Arena", "group": "Entertainment" },
  {
    "label": "Correctional facility (jail, detention, prison)",
    "value": "CorrectionalFacility",
    "group": "Civic"
  },
  {
    "label": "School, college, university",
    "value": "School",
    "group": "Education"
  },
  {
    "label": "Autobody shops and paint sites",
    "value": "AutobodyShops",
    "group": "Industrial"
  },
  {
    "label": "Automobile dealerships (Cars, RVs, motor homes etc. - used and new)",
    "value": "AutoDealerships",
    "group": "Retail"
  },
  {
    "label": "Cardlock facilities (unmanned fuel stations for business vehicles i.e., not for public use)",
    "value": "CardlockFacilities",
    "group": "Industrial"
  },
  {
    "label": "Industrial warehouses",
    "value": "IndustrialWarehouses",
    "group": "Industrial"
  },
  {
    "label": "Houses (attached and detached)",
    "value": "Houses",
    "group": "Residential"
  },
  {
    "label": "Apartment or condominium building(s)",
    "value": "Apartments",
    "group": "Residential"
  },
  { "label": "Other", "value": "Other", "group": "Other" }
]
```

**CSS Styling Note**: For long lists, the component automatically handles scrolling. Consider grouping using Block elements if visual separation is desired.

---

### Question 11: Activity Summary

**Element Type**: Text

| Property        | Value                                                                                 |
| --------------- | ------------------------------------------------------------------------------------- |
| **Name**        | `Q11_ActivitySummary`                                                                 |
| **Label**       | `11. Please provide a short summary of the activity you are undertaking at the site.` |
| **Required**    | `true`                                                                                |
| **Placeholder** | `Placeholder.`                                                                        |

---

### Question 12: Site Assessment by LEP

**Element Type**: Radio

| Property     | Value                                                                                                                                                   |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**     | `Q12_SiteAssessment`                                                                                                                                    |
| **Label**    | `12. Has an assessment of the site, where the storm water management works will be constructed, been completed by a licensed engineering practitioner?` |
| **Required** | `true`                                                                                                                                                  |

---

### Question 13: Works Summary

**Element Type**: Text

| Property     | Value                                                                                              |
| ------------ | -------------------------------------------------------------------------------------------------- |
| **Name**     | `Q13_WorksSummary`                                                                                 |
| **Label**    | `13. Please provide a short summary of the storm water management works that is being registered.` |
| **Required** | `true`                                                                                             |

---

### Question 14: Catchment Area Size

**Element Type**: Text (Number)

| Property       | Value                                                     |
| -------------- | --------------------------------------------------------- |
| **Name**       | `Q14_CatchmentArea`                                       |
| **Label**      | `14. Provide the size in hectares of the catchment area.` |
| **Required**   | `true`                                                    |
| **Input Type** | `number`                                                  |
| **Suffix**     | `ha`                                                      |

---

### Question 15: Components

**Element Type**: Checkbox

| Property     | Value                                                                                           |
| ------------ | ----------------------------------------------------------------------------------------------- |
| **Name**     | `Q15_Components`                                                                                |
| **Label**    | `15. Please select the following component(s) of your storm water management works that apply:` |
| **Required** | `true`                                                                                          |

**Options**:

```json
[
  { "label": "Storm sewers", "value": "StormSewers" },
  { "label": "Other", "value": "Other" }
]
```

---

### Question 16: Design Capacity

**Element Type**: Select

| Property     | Value                                                                  |
| ------------ | ---------------------------------------------------------------------- |
| **Name**     | `Q16_DesignCapacity`                                                   |
| **Label**    | `16. What is the design capacity of the storm water management works?` |
| **Required** | `true`                                                                 |

**Options**:

```json
[
  { "label": "1 to 5 year storm", "value": "1to5Year" },
  { "label": "5 to 10 year storm", "value": "5to10Year" },
  { "label": "10 to 25 year storm", "value": "10to25Year" },
  { "label": "25 to 100 year storm", "value": "25to100Year" },
  { "label": "Greater than 100 year storm", "value": "GreaterThan100Year" }
]
```

---

### Questions 17a-17d: Discharge and Protection

**Element Type**: Radio (each)

**Q17a**:
| Property | Value |
|----------|-------|
| **Name** | `Q17a_DischargeToEnvironment` |
| **Label** | `17.a. Does your current or proposed storm water management works discharge to the natural environment?` |
| **Required** | `true` |

**Q17b** (Conditional on Q17a = Yes):
| Property | Value |
|----------|-------|
| **Name** | `Q17b_EnhancedProtection` |
| **Label** | `17.b. Are your storm water management works been designed to achieve enhanced level protection as defined in Stormwater Management Planning and Design Manual, 2003?` |
| **Required** | `true` |
| **Show Condition** | `%Q17a_DischargeToEnvironment% == "Yes"` |

**Q17c**:
| Property | Value |
|----------|-------|
| **Name** | `Q17c_OperatingUnderECA` |
| **Label** | `17.c. Are you currently operating your storm water management works under an Environmental Compliance Approval (ECA)?` |
| **Required** | `true` |

**Q17d**:
| Property | Value |
|----------|-------|
| **Name** | `Q17d_DischargeToSewage` |
| **Label** | `17.d. Does your current or proposed storm water management works discharge to another sewage works?` |
| **Required** | `true` |

---

### Questions 18a-18c: Design Considerations

**Q18a** (Textarea):
| Property | Value |
|----------|-------|
| **Name** | `Q18a_DesignConsiderations` |
| **Label** | `18.a. Provide a description of design considerations made by a licensed engineering practitioner to ensure that the discharge from your storm water management works would not cause an adverse effect.` |
| **Required** | `true` |
| **Rows** | `5` |

**Q18b** (Radio):
| Property | Value |
|----------|-------|
| **Name** | `Q18b_OutdoorHandling` |
| **Label** | `18.b. Do you have, or do you expect to have any outdoor handling or storage of soil, raw material, intermediate products, finished products or by-products occurring at the property serviced by your works?` |
| **Required** | `true` |

**Q18c** (Textarea, Conditional):
| Property | Value |
|----------|-------|
| **Name** | `Q18c_MitigationDescription` |
| **Label** | `18.c. Provide the description of design considerations included in your storm water management report to mitigate the potential for the discharge of storm water from the works to cause an adverse effect.` |
| **Required** | `true` |
| **Show Condition** | `%Q18b_OutdoorHandling% == "Yes"` |
| **Help Text** | (See Markdown below) |

**Help Text (Markdown)**:

```markdown
[O. Reg. 137/25](#) requires when there is or is expected to be outdoor handling or storage of soil, raw material, intermediate products, finished products or by-products occurring at the property at which the works is located or proposed to be located, the storm water management report must include a description of design considerations that are included to mitigate the potential for the discharge of storm water from the works to cause an adverse effect.
```

---

## Step 3: Storm Water Management Report

### Step Configuration

| Property        | Value                           |
| --------------- | ------------------------------- |
| **Name**        | `StormWaterReport`              |
| **Label**       | `Storm water management report` |
| **Chart Label** | `Activity information`          |

---

### Questions 19a-19c: Works Status

**Q19a** (Radio):
| Property | Value |
|----------|-------|
| **Name** | `Q19a_WorksConstructed` |
| **Label** | `19.a. Have your storm water management works been constructed?` |
| **Required** | `true` |

**Q19b** (Radio):
| Property | Value |
|----------|-------|
| **Name** | `Q19b_LEPStatement` |
| **Label** | `19.b. Does your storm water management report have a statement, confirmed by a licensed engineering practitioner, that includes the information in the storm water management report is accurate as of the date it is signed and sealed, the information includes the results of the site assessment and the works are designed in a manner that mitigates any adverse effects?` |
| **Required** | `true` |

**Q19c** (Radio):
| Property | Value |
|----------|-------|
| **Name** | `Q19c_StartedOperating` |
| **Label** | `19.c. Have you started operating your storm water management works?` |
| **Required** | `true` |

**Q19c.i** (Date, Conditional):
| Property | Value |
|----------|-------|
| **Name** | `Q19ci_StartDate` |
| **Label** | `19.c.i. Please provide the start date.` |
| **Required** | `true` |
| **Show Condition** | `%Q19c_StartedOperating% == "Yes"` |
| **Format** | `YYYY/MM/DD` |

---

### Question 20: SWM Report Signed

**Element Type**: Radio

| Property     | Value                                                                                                                               |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Name**     | `Q20_ReportSigned`                                                                                                                  |
| **Label**    | `20. Do you have a storm water management report that has been signed and sealed by a qualified Licensed Engineering Practitioner?` |
| **Required** | `true`                                                                                                                              |

---

### Question 21: Report Contents Confirmation

**Element Type**: Block with multiple Radio elements

| Property  | Value                                                                               |
| --------- | ----------------------------------------------------------------------------------- |
| **Name**  | `Q21_ReportContents`                                                                |
| **Label** | `21. Please confirm that your storm water management report contains the following` |

**Sub-elements** (Radio each):

**Q21a**:
| Property | Value |
|----------|-------|
| **Name** | `Q21a_SitePlan` |
| **Label** | `a. Site plan` |
| **Required** | `true` |

**Q21b**:
| Property | Value |
|----------|-------|
| **Name** | `Q21b_OperationMaintenance` |
| **Label** | `b. Operation and maintenance section to be implemented by the owner` |
| **Required** | `true` |

**Q21c**:
| Property | Value |
|----------|-------|
| **Name** | `Q21c_ESCP` |
| **Label** | `c. Erosion and sediment control plan (ESCP)` |
| **Required** | `true` |

**Q21d**:
| Property | Value |
|----------|-------|
| **Name** | `Q21d_InspectionProcedures` |
| **Label** | `d. Procedures for inspecting the works` |
| **Required** | `true` |

---

### Question 22: Inspection Frequency

**Element Type**: Text

| Property     | Value                                                                                                                |
| ------------ | -------------------------------------------------------------------------------------------------------------------- |
| **Name**     | `Q22_InspectionFrequency`                                                                                            |
| **Label**    | `22. Based on the procedures for inspecting the works outlined in the report, what is the frequency of inspections?` |
| **Required** | `true`                                                                                                               |

---

### Questions 23a-23b: ESCP Procedures

**Q23a** (Radio):
| Property | Value |
|----------|-------|
| **Name** | `Q23a_ESCPProcedures` |
| **Label** | `23.a. Does the Erosion and Sediment Control Plan (ESCP) contain procedures for implementing and inspecting erosion and sediment control measures during construction activities?` |
| **Required** | `true` |

**Q23b** (Text, Conditional):
| Property | Value |
|----------|-------|
| **Name** | `Q23b_ESCPInspectionFrequency` |
| **Label** | `23.b. What is the frequency of inspection?` |
| **Required** | `true` |
| **Show Condition** | `%Q23a_ESCPProcedures% == "Yes"` |

---

### Question 24: ESCP Records

**Element Type**: Radio

| Property     | Value                                                                                                                                                      |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**     | `Q24_ESCPRecords`                                                                                                                                          |
| **Label**    | `24. Does the ESCP contain procedures for keeping records relating to the inspections and maintenance of temporary erosion and sediment control measures?` |
| **Required** | `true`                                                                                                                                                     |

---

### Licensed Engineering Practitioner Display

Use `sfGpsDsCaOnSummaryListComm` component to display practitioner information.

**Block**: `LicensedPractitioners`

**Practitioner 1** (Summary List):
| Property | Value |
|----------|-------|
| **Name** | `Practitioner1_Summary` |
| **Label** | `Licensed engineering practitioner 1` |
| **Show Edit Link** | `true` |
| **Edit Action** | Navigate to Practitioner Edit page |

**Fields**:

```json
[
  { "label": "First name", "value": "%Practitioner1_FirstName%" },
  { "label": "Last name", "value": "%Practitioner1_LastName%" },
  { "label": "License number", "value": "%Practitioner1_LicenseNumber%" },
  { "label": "Date signed", "value": "%Practitioner1_DateSigned%" }
]
```

**Practitioner 2** (Summary List):
| Property | Value |
|----------|-------|
| **Name** | `Practitioner2_Summary` |
| **Label** | `Licensed engineering practitioner 2` |

**Fields**: Same structure as Practitioner 1

---

### Supporting Documentation Upload

**Element Type**: File

| Property           | Value                                                                                           |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| **Name**           | `SupportingDocumentation`                                                                       |
| **Label**          | `Please upload a copy of your storm water management report and any addenda to the SWM report.` |
| **Required**       | `true`                                                                                          |
| **Help Text**      | (See Markdown below)                                                                            |
| **Accepted Types** | `.pdf`                                                                                          |

**Help Text (Markdown)**:

```markdown
The SWM report must be prepared by a licensed engineering practitioner (LEP) and follow all the requirements in sections 7 through 13 of [O. Reg. 137/25 registrations under part II.2 of the act - storm water management works](#). You may use a SWM report that has been prepared for an ECA application, but before it is uploaded, the SWM report must be revised and updated by a LEP to meet all the requirements in Ontario Regulation 137/25.
```

---

## Step 4: Confirmation

### Step Configuration

| Property        | Value          |
| --------------- | -------------- |
| **Name**        | `Confirmation` |
| **Label**       | `Confirmation` |
| **Chart Label** | `Confirmation` |

---

### Confirmation Checkbox

**Element Type**: Checkbox

| Property     | Value                                                  |
| ------------ | ------------------------------------------------------ |
| **Name**     | `ConfirmationCheckbox`                                 |
| **Label**    | `I confirm this information is complete and accurate.` |
| **Required** | `true`                                                 |

---

### Action Buttons

| Button                    | Type      | Label                   | Action          |
| ------------------------- | --------- | ----------------------- | --------------- |
| **Save and Continue**     | Primary   | `Save and continue`     | Submit/Navigate |
| **Save Draft**            | Secondary | `Save draft`            | Save for Later  |
| **Complete this section** | Primary   | `Complete this section` | Final Submit    |

---

## Conditional Logic Rules

### Summary of Conditional Visibility

| Element      | Condition                       | Show When |
| ------------ | ------------------------------- | --------- |
| Q4 Hard Stop | `%Q4_SiteTypes%`                | = "Yes"   |
| Q5b          | `%Q5a_EnvironmentalAssessment%` | = "Yes"   |
| Q6 Hard Stop | `%Q6_ProcessWaterDischarge%`    | = "Yes"   |
| Q7 Hard Stop | `%Q7_MunicipalityOwnership%`    | = "Yes"   |
| Q8b          | `%Q8a_PropertyOwnership%`       | = "No"    |
| Q17b         | `%Q17a_DischargeToEnvironment%` | = "Yes"   |
| Q18c         | `%Q18b_OutdoorHandling%`        | = "Yes"   |
| Q19c.i       | `%Q19c_StartedOperating%`       | = "Yes"   |
| Q23b         | `%Q23a_ESCPProcedures%`         | = "Yes"   |

### Hard Stop Behavior

When a hard stop is triggered:

1. Display the error message with links
2. Allow the user to change their answer
3. If answer remains "Yes", allow navigation but record the ineligibility
4. Consider adding a Decision element to track eligibility status

---

## Hard Stop Configuration

### Messaging Component Properties

For each hard stop message, use the `sfGpsDsCaOnFormMessaging` component:

```json
{
  "lwc": "sfGpsDsCaOnFormMessaging",
  "properties": {
    "type": "error",
    "showIcon": true
  }
}
```

### Markdown Link Syntax

Links in messaging content use standard Markdown:

```markdown
[link text](URL)
```

Example:

```markdown
[apply for an Environmental Compliance Approval (ECA)](https://www.ontario.ca/page/environmental-compliance-approvals)
```

---

## Data Model

### OmniScript Data JSON Structure

```json
{
  "IndustryEligibilityCheck": {
    "Q1_StormwaterActivity": "Yes",
    "Q2_EnvironmentalPermission": "Yes",
    "Q3_NAICSCodes": ["561730", "111110"],
    "Q4_SiteTypes": "No",
    "Q5a_EnvironmentalAssessment": "Yes",
    "Q5b_NoticeToProceed": "Yes",
    "Q6_ProcessWaterDischarge": "No",
    "Q7_MunicipalityOwnership": "No",
    "Q8a_PropertyOwnership": "Yes",
    "Q8c_IndoorActivities": "Yes"
  },
  "ActivityRelatedInfo": {
    "Q9_PrimaryLandUse": "IndustrialOutdoor",
    "Q10_PrimaryActivity": ["IndustrialWarehouses", "ParkingLots"],
    "Q11_ActivitySummary": "Manufacturing facility with outdoor storage",
    "Q12_SiteAssessment": "Yes",
    "Q13_WorksSummary": "Stormwater retention pond and storm sewers",
    "Q14_CatchmentArea": 3.1,
    "Q15_Components": ["StormSewers"],
    "Q16_DesignCapacity": "1to5Year",
    "Q17a_DischargeToEnvironment": "Yes",
    "Q17b_EnhancedProtection": "No",
    "Q17c_OperatingUnderECA": "No",
    "Q17d_DischargeToSewage": "Yes",
    "Q18a_DesignConsiderations": "...",
    "Q18b_OutdoorHandling": "Yes",
    "Q18c_MitigationDescription": "..."
  },
  "StormWaterReport": {
    "Q19a_WorksConstructed": "Yes",
    "Q19b_LEPStatement": "Yes",
    "Q19c_StartedOperating": "Yes",
    "Q19ci_StartDate": "2023-09-15",
    "Q20_ReportSigned": "Yes",
    "Q21a_SitePlan": "Yes",
    "Q21b_OperationMaintenance": "Yes",
    "Q21c_ESCP": "Yes",
    "Q21d_InspectionProcedures": "Yes",
    "Q22_InspectionFrequency": "Monthly",
    "Q23a_ESCPProcedures": "Yes",
    "Q23b_ESCPInspectionFrequency": "Weekly during construction",
    "Q24_ESCPRecords": "Yes",
    "Practitioners": [
      {
        "FirstName": "John",
        "LastName": "Harper",
        "LicenseNumber": "966010",
        "DateSigned": "2023-09-19"
      },
      {
        "FirstName": "Alex",
        "LastName": "Wong",
        "LicenseNumber": "855020",
        "DateSigned": "2023-05-15"
      }
    ],
    "SupportingDocumentation": {
      "filename": "SWM_Report_Final.pdf",
      "contentDocumentId": "069XXXXXXXXXXXX"
    }
  },
  "Confirmation": {
    "ConfirmationCheckbox": true
  },
  "EligibilityStatus": {
    "IsEligible": true,
    "HardStopsTriggered": []
  }
}
```

### Salesforce Object Mapping

| OmniScript Field        | Salesforce Object         | Field            |
| ----------------------- | ------------------------- | ---------------- |
| Q3_NAICSCodes           | Site\_\_c / Account       | NAICS_Codes\_\_c |
| Practitioner info       | LicensedPractitioner\_\_c | Various          |
| SupportingDocumentation | ContentDocument           | Linked to record |
| All responses           | IndustryEligibility\_\_c  | Custom fields    |

---

## Testing Checklist

### Functional Testing

- [ ] **Step 1: Eligibility Questions**
  - [ ] All radio buttons selectable
  - [ ] NAICS codes populate from site data
  - [ ] Hard stop on Q4 = Yes
  - [ ] Hard stop on Q6 = Yes
  - [ ] Hard stop on Q7 = Yes
  - [ ] Q5b appears when Q5a = Yes
  - [ ] Q8b appears when Q8a = No

- [ ] **Step 2: Activity Information**
  - [ ] Q9 radio with expandable help text works
  - [ ] Q10 long checkbox list scrolls properly
  - [ ] Numeric input accepts decimals (Q14)
  - [ ] Q17b conditional visibility
  - [ ] Q18c conditional visibility

- [ ] **Step 3: Report Section**
  - [ ] Date picker works (Q19c.i)
  - [ ] Q19c.i appears when Q19c = Yes
  - [ ] Practitioner summary displays
  - [ ] Edit link navigates correctly
  - [ ] File upload accepts PDF
  - [ ] File upload shows uploaded filename

- [ ] **Step 4: Confirmation**
  - [ ] Confirmation checkbox required
  - [ ] Submit button works

### Accessibility Testing

- [ ] All form fields have labels
- [ ] Required fields indicated
- [ ] Error messages announced
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Focus visible on all elements

### Ontario DS Compliance

- [ ] Uses Ontario form styling
- [ ] Error alerts match ontario-page-alert
- [ ] Buttons match Ontario button styles
- [ ] Typography follows Ontario DS
- [ ] Spacing/layout consistent

---

## Related Documentation

- [OMNISTUDIO_FORMS.md](./OMNISTUDIO_FORMS.md) - Component configuration reference
- [COMPONENT_API.md](./COMPONENT_API.md) - Component API reference
- [STORMWATER_WORKS.md](./STORMWATER_WORKS.md) - Stormwater registration flow
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Testing procedures
