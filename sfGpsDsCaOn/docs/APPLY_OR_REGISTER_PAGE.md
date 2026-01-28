# Apply or Register Page - Implementation Guide

This guide explains how to build the "Apply or Register" page using Ontario Design System components in a Salesforce Digital Experience site.

---

## Overview

The "Apply or Register" page allows users to select which environmental permission they want to apply for or register. It consists of 5 main sections:

1. **Header** - Application title with navigation and breadcrumb
2. **Page Title** - "Apply or register" heading with description
3. **Action Cards** - 5 permission type cards with apply buttons
4. **Back to Top** - Accessibility navigation aid
5. **Footer** - Standard Ontario government footer

---

## Component Mapping

| Section      | Component                             | Experience Builder Name           |
| ------------ | ------------------------------------- | --------------------------------- |
| Header       | `sfGpsDsCaOnHeaderComm`               | Ontario DS Header                 |
| Page Title   | `sfGpsDsCaOnCalloutComm`              | Ontario DS Callout                |
| Action Cards | `sfGpsDsCaOnActionCardCollectionComm` | Ontario DS Action Card Collection |
| Each Card    | `sfGpsDsCaOnActionCardComm`           | Ontario DS Action Card            |
| Back to Top  | `sfGpsDsCaOnBackToTopComm`            | Ontario DS Back To Top            |
| Footer       | `sfGpsDsCaOnFooterExpandedComm`       | Ontario DS Footer Expanded        |

---

## Page Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ Header: Environmental Permissions Platform                       │
│ [Home] [Profile] [Menu]                                          │
├─────────────────────────────────────────────────────────────────┤
│ Breadcrumb: Home > Apply or register                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ APPLY OR REGISTER                                                │
│ Apply, renew or register for environmental permissions.          │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ ┌─────────────────────────┐ ┌─────────────────────────┐         │
│ │ ████ ECA ████████████  │ │ ████ EASR ███████████  │         │
│ │ Environmental Compliance│ │ Environmental Activity  │         │
│ │ Approval                │ │ Sector Registry         │         │
│ │                         │ │                         │         │
│ │ For activities that may │ │ For routine activities  │         │
│ │ have a significant...   │ │ that pose a lower...    │         │
│ │                         │ │                         │         │
│ │ [     Apply Now      ]  │ │ [    Register Now    ]  │         │
│ │    More information     │ │    More information     │         │
│ └─────────────────────────┘ └─────────────────────────┘         │
│                                                                  │
│ ┌─────────────────────────┐ ┌─────────────────────────┐         │
│ │ ████ RSC ████████████  │ │ ████ PTTW ███████████  │         │
│ │ Record of Site          │ │ Permit to Take Water    │         │
│ │ Condition               │ │                         │         │
│ │                         │ │                         │         │
│ │ Required before a       │ │ Required if you are     │         │
│ │ property with a...      │ │ taking more than...     │         │
│ │                         │ │                         │         │
│ │ [     Apply Now      ]  │ │ [     Apply Now      ]  │         │
│ │    More information     │ │    More information     │         │
│ └─────────────────────────┘ └─────────────────────────┘         │
│                                                                  │
│ ┌─────────────────────────┐                                      │
│ │ ████ Pesticide ██████  │                                      │
│ │ Pesticide Licence       │                                      │
│ │                         │                                      │
│ │ Required for the sale,  │                                      │
│ │ use, or application...  │                                      │
│ │                         │                                      │
│ │ [     Apply Now      ]  │                                      │
│ │    More information     │                                      │
│ └─────────────────────────┘                                      │
│                                                                  │
│                                           [↑ Top]               │
├─────────────────────────────────────────────────────────────────┤
│ Footer                                                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Experience Builder Setup

### 1. Create the Page

1. Go to Experience Builder
2. Create a new page from template or Build Your Own
3. Set page URL path: `/apply-register`
4. Set page title: "Apply or Register"

### 2. Apply Theme Layout

Configure the theme to include Ontario DS styles:

- Add `sfGpsDsCaOnGlobalStyles` static resource to head
- Configure header with Ontario DS Header component
- Configure footer with Ontario DS Footer component

### 3. Add Page Regions

Create the following layout regions (top to bottom):

- **Header region** - Full width for header
- **Content region** - Main content area with padding
- **Footer region** - Full width for footer

---

## Component Configuration

**IMPORTANT**: When configuring components in Experience Builder, use the full static resource URL path. Replace `/YOUR_SITE_PATH` with your actual site URL prefix (e.g., `/EASR`).

### Page Title Section

Use the **Ontario DS Callout** component for the page introduction.

| Property          | Value                                                                                              |
| ----------------- | -------------------------------------------------------------------------------------------------- |
| **Heading**       | Apply or register                                                                                  |
| **Heading Level** | h1                                                                                                 |
| **Content**       | Apply, renew or register for environmental permissions. Select the permission type below to begin. |
| **Type**          | info                                                                                               |

### Action Card Collection

Add the **Ontario DS Action Card Collection** component.

| Property          | Value             |
| ----------------- | ----------------- |
| **Cards per row** | 2                 |
| **Class name**    | easr-action-cards |

### Action Cards

Add 5 **Ontario DS Action Card** components inside the collection. Configure each as follows:

#### Card 1: Environmental Compliance Approval (ECA)

| Property          | Value                                                                                                                                         |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Icon URL**      | /YOUR_SITE_PATH/sfsites/c/resource/sfGpsDsCaOnGlobalStyles/icons/eca-icon.svg                                                                 |
| **Icon alt text** | (leave empty - decorative)                                                                                                                    |
| **Heading**       | Environmental Compliance Approval (ECA)                                                                                                       |
| **Heading level** | h2                                                                                                                                            |
| **Header colour** | dark-blue                                                                                                                                     |
| **Description**   | For activities that may have a significant impact on the environment. ECAs are required for industrial, commercial, and municipal operations. |
| **Button label**  | Apply Now                                                                                                                                     |
| **Button URL**    | /eca/apply                                                                                                                                    |
| **Link label**    | More information about ECAs                                                                                                                   |
| **Link URL**      | https://www.ontario.ca/page/environmental-compliance-approval                                                                                 |

#### Card 2: Environmental Activity Sector Registry (EASR)

| Property          | Value                                                                                                                    |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Icon URL**      | /YOUR_SITE_PATH/sfsites/c/resource/sfGpsDsCaOnGlobalStyles/icons/easr-icon.svg                                           |
| **Icon alt text** | (leave empty - decorative)                                                                                               |
| **Heading**       | Environmental Activity Sector Registry (EASR)                                                                            |
| **Heading level** | h2                                                                                                                       |
| **Header colour** | blue                                                                                                                     |
| **Description**   | For routine activities that pose a lower environmental risk. Register your activity instead of applying for an approval. |
| **Button label**  | Register Now                                                                                                             |
| **Button URL**    | /easr/register                                                                                                           |
| **Link label**    | More information about EASR                                                                                              |
| **Link URL**      | https://www.ontario.ca/page/environmental-activity-sector-registry                                                       |

#### Card 3: Record of Site Condition (RSC)

| Property          | Value                                                                                                                                    |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Icon URL**      | /YOUR_SITE_PATH/sfsites/c/resource/sfGpsDsCaOnGlobalStyles/icons/rsc-icon.svg                                                            |
| **Icon alt text** | (leave empty - decorative)                                                                                                               |
| **Heading**       | Record of Site Condition (RSC)                                                                                                           |
| **Heading level** | h2                                                                                                                                       |
| **Header colour** | teal                                                                                                                                     |
| **Description**   | Required before a property with a history of industrial or commercial use can be used for a more sensitive purpose, such as residential. |
| **Button label**  | Apply Now                                                                                                                                |
| **Button URL**    | /rsc/apply                                                                                                                               |
| **Link label**    | More information about RSC                                                                                                               |
| **Link URL**      | https://www.ontario.ca/page/records-site-condition                                                                                       |

#### Card 4: Permit to Take Water (PTTW)

| Property          | Value                                                                                                                  |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Icon URL**      | /YOUR_SITE_PATH/sfsites/c/resource/sfGpsDsCaOnGlobalStyles/icons/pttw-icon.svg                                         |
| **Icon alt text** | (leave empty - decorative)                                                                                             |
| **Heading**       | Permit to Take Water (PTTW)                                                                                            |
| **Heading level** | h2                                                                                                                     |
| **Header colour** | green                                                                                                                  |
| **Description**   | Required if you are taking more than 50,000 litres of water per day from a lake, river, stream, or groundwater source. |
| **Button label**  | Apply Now                                                                                                              |
| **Button URL**    | /pttw/apply                                                                                                            |
| **Link label**    | More information about PTTW                                                                                            |
| **Link URL**      | https://www.ontario.ca/page/taking-water-permits                                                                       |

#### Card 5: Pesticide Licence

| Property          | Value                                                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Icon URL**      | /YOUR_SITE_PATH/sfsites/c/resource/sfGpsDsCaOnGlobalStyles/icons/pesticide-icon.svg                                                         |
| **Icon alt text** | (leave empty - decorative)                                                                                                                  |
| **Heading**       | Pesticide Licence                                                                                                                           |
| **Heading level** | h2                                                                                                                                          |
| **Header colour** | gold                                                                                                                                        |
| **Description**   | Required for the sale, use, or application of certain classes of pesticides in Ontario. Both individuals and businesses may need a licence. |
| **Button label**  | Apply Now                                                                                                                                   |
| **Button URL**    | /pesticide/apply                                                                                                                            |
| **Link label**    | More information about Pesticide Licences                                                                                                   |
| **Link URL**      | https://www.ontario.ca/page/pesticides-licences-and-permits                                                                                 |

### Back to Top

Add the **Ontario DS Back To Top** component at the bottom of the content area.

| Property      | Value                      |
| ------------- | -------------------------- |
| **Label**     | Top                        |
| **Target ID** | (leave empty for page top) |

---

## Icon Setup

The action cards use icons in the header bar. You have several options:

### Option 1: Add to Static Resource (Recommended)

1. Create an `icons/` folder in the `sfGpsDsCaOnGlobalStyles` static resource
2. Add SVG icons for each permission type:
   - `eca-icon.svg`
   - `easr-icon.svg`
   - `rsc-icon.svg`
   - `pttw-icon.svg`
   - `pesticide-icon.svg`
3. Redeploy the static resource
4. Reference as: `/YOUR_SITE_PATH/sfsites/c/resource/sfGpsDsCaOnGlobalStyles/icons/eca-icon.svg`

### Option 2: Use Ontario DS Icons

Reference icons from the Ontario Design System icon set (if deployed):

```
/YOUR_SITE_PATH/sfsites/c/resource/sfGpsDsFrGov/icons/system/industry.svg
```

### Option 3: No Icons

Leave the Icon URL property empty. The card will display without an icon in the header.

---

## Custom CSS (Optional)

Add custom CSS for additional styling:

```css
/* Action cards section spacing */
.easr-action-cards {
  margin-top: 2rem;
  margin-bottom: 2rem;
}

/* Ensure consistent card heights */
.sfgpsdscaon-action-card {
  min-height: 280px;
}

/* Page introduction styling */
.easr-page-intro {
  max-width: 800px;
  margin-bottom: 2rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .sfgpsdscaon-action-card-collection--2-per-row {
    grid-template-columns: 1fr;
  }
}
```

---

## Breadcrumb Configuration

If using a breadcrumb component, configure as:

| Level | Label             | URL             |
| ----- | ----------------- | --------------- |
| 1     | Home              | /               |
| 2     | Apply or register | /apply-register |

---

## Navigation Flow

The action cards link to the following application flows:

| Card      | Button URL         | Flow                              |
| --------- | ------------------ | --------------------------------- |
| ECA       | `/eca/apply`       | OmniScript: ECA Application       |
| EASR      | `/easr/register`   | OmniScript: EASR Registration     |
| RSC       | `/rsc/apply`       | OmniScript: RSC Application       |
| PTTW      | `/pttw/apply`      | OmniScript: PTTW Application      |
| Pesticide | `/pesticide/apply` | OmniScript: Pesticide Application |

Ensure these pages are created and the OmniScripts are deployed and embedded.

---

## Accessibility Considerations

1. **Heading Hierarchy**:
   - Page title is `h1`
   - Card headings are `h2`
2. **Button Purpose**: Button labels clearly indicate the action ("Apply Now", "Register Now")

3. **Link Context**: Secondary links include context ("More information about ECAs")

4. **Color Contrast**: Header bar colors meet WCAG AA contrast requirements for white text

5. **Keyboard Navigation**: All interactive elements are keyboard accessible

6. **Focus Indicators**: Visible focus states on buttons and links

7. **Screen Reader Support**:
   - Cards use semantic HTML structure
   - Icons are marked as decorative (`aria-hidden`)

---

## Testing Checklist

- [ ] All 5 action cards display correctly
- [ ] Header icons load (if configured)
- [ ] Apply/Register buttons navigate to correct pages
- [ ] "More information" links open external sites
- [ ] Cards display in 2-column grid on desktop
- [ ] Cards stack to single column on mobile
- [ ] Keyboard navigation works for all interactive elements
- [ ] Screen reader announces card content correctly
- [ ] Back to Top button scrolls to page top

---

## Related Documentation

- [EASR_HOME_PAGE.md](./EASR_HOME_PAGE.md) - Home page implementation guide
- [BUILD_GUIDE.md](./BUILD_GUIDE.md) - Build and deployment guide
- [OMNISTUDIO_FORMS.md](./OMNISTUDIO_FORMS.md) - OmniStudio form components
