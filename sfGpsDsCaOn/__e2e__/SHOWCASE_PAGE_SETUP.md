# Showcase Page Setup Guide for E2E Testing

This guide explains how to configure each showcase page in Experience Builder to enable automated E2E testing.

---

## Prerequisites

1. Log into your Salesforce org (EASR)
2. Navigate to **Setup > Digital Experiences > All Sites**
3. Click **Builder** next to `sfGpsDsCaOn`
4. For each page below, create a new page or configure an existing one

---

## Page 1: Map Selector (`/map-selector`)

### Purpose

Tests ESRI map integration, address search, and coordinate input.

### Components to Add

1. **Add an HTML component** as wrapper with this content:

```html
<div data-testid="map-selector-showcase" class="showcase-container">
  <h1>Map Selector Showcase</h1>
</div>
```

2. **Add the Site Selector Tool component**:
   - Drag `c-sf-gps-ds-ca-on-site-selector-tool-comm` onto the page
   - Configure properties:
     - `vfDomain`: Your Visualforce domain (e.g., `dfn00000c2gpmeaf--c.vf.force.com`)
     - `coordinateFormat`: `decimal`
   - Wrap or place inside a div with `data-testid="map-selector-section"`

3. **Add the Discharge Point Selector** (optional):
   - Drag `c-sf-gps-ds-ca-on-discharge-point-selector-comm` onto the page

### Expected HTML Structure

```html
<div data-testid="map-selector-showcase" class="showcase-container">
  <h1>Map Selector Showcase</h1>
  <section data-testid="map-selector-section">
    <c-sf-gps-ds-ca-on-site-selector-tool-comm>
      <!-- Contains iframe with visualforce -->
    </c-sf-gps-ds-ca-on-site-selector-tool-comm>
  </section>
</div>
```

---

## Page 2: Search (`/search`)

### Purpose

Tests search autocomplete, debouncing, and keyboard navigation.

### Components to Add

1. **Add an HTML wrapper**:

```html
<div data-testid="search-showcase" class="showcase-container">
  <h1>Search Component Showcase</h1>

  <section data-testid="basic-search">
    <h2>Basic Search</h2>
    <!-- Place Search component here -->
  </section>

  <section data-testid="community-search">
    <h2>Community/Einstein Search</h2>
    <!-- Place SearchComm component here -->
  </section>
</div>
```

2. **Add Search components**:
   - `c-sf-gps-ds-ca-on-search-comm` inside `basic-search` section
   - `c-sf-gps-ds-ca-on-search-einstein-comm` inside `community-search` section (if available)

### Component Properties

- `label`: "Search"
- `placeholder`: "Search..."
- `debounceMs`: 300

---

## Page 3: Accordion (`/accordion`)

### Purpose

Tests accordion expand/collapse behavior and ARIA states.

### Components to Add

1. **Add an HTML wrapper**:

```html
<div data-testid="accordion-showcase" class="showcase-container">
  <h1>Accordion Showcase</h1>

  <section data-testid="basic-accordion">
    <h2>Basic Accordion</h2>
  </section>

  <section data-testid="single-open-accordion">
    <h2>Single Open Mode</h2>
  </section>
</div>
```

2. **Add Accordion component**:
   - `c-sf-gps-ds-ca-on-accordion-comm`
   - Configure with sections JSON:

```json
[
  {
    "id": "section-1",
    "title": "Section 1",
    "content": "Content for section 1"
  },
  {
    "id": "section-2",
    "title": "Section 2",
    "content": "Content for section 2"
  },
  {
    "id": "section-3",
    "title": "Section 3",
    "content": "Content for section 3"
  }
]
```

### Required Attributes on Accordion Buttons

The accordion component should render buttons with:

- `data-testid="accordion-button"` on each section header button
- `aria-expanded="true"` or `aria-expanded="false"`
- `aria-controls="[section-id]"`

---

## Page 4: Modal (`/modal`)

### Purpose

Tests modal focus trap, keyboard navigation, and scroll lock.

### Components to Add

1. **Add an HTML wrapper with trigger buttons**:

```html
<div data-testid="modal-showcase" class="showcase-container">
  <h1>Modal Showcase</h1>

  <section>
    <h2>Basic Modal</h2>
    <button
      data-testid="open-basic-modal"
      onclick="document.querySelector('[data-testid=basic-modal]').open()"
    >
      Open Basic Modal
    </button>
  </section>

  <section>
    <h2>Confirmation Modal</h2>
    <button data-testid="open-confirm-modal">Open Confirmation Modal</button>
  </section>

  <section>
    <h2>Form Modal</h2>
    <button data-testid="open-form-modal">Open Form Modal</button>
  </section>
</div>
```

2. **Add Modal components**:
   - `c-sf-gps-ds-ca-on-modal-comm` with `data-testid="basic-modal"`
   - Configure with heading, content, and action buttons

### Modal Component Properties

- `heading`: "Modal Title"
- `isOpen`: false (controlled by button click)
- `showCloseButton`: true

---

## Page 5: NAICS Picker (`/naics-picker`)

### Purpose

Tests 5-level cascading dropdown for industry codes.

### Components to Add

1. **Add an HTML wrapper**:

```html
<div data-testid="naics-picker-showcase" class="showcase-container">
  <h1>NAICS Code Picker Showcase</h1>

  <section data-testid="naics-cascade-demo">
    <h2>Industry Code Selection</h2>
  </section>

  <section data-testid="naics-selection-display">
    <h2>Selected Code</h2>
    <div id="selected-code-display"></div>
  </section>
</div>
```

2. **Add NAICS Picker component**:
   - `c-sf-gps-ds-ca-on-naics-code-picker-comm`
   - Place inside the `naics-cascade-demo` section

### Component Properties

- `label`: "Select Industry Code"
- `required`: true

---

## Page 6: Places Typeahead (`/places-typeahead`)

### Purpose

Tests Google Places API integration for address autocomplete.

### Components to Add

1. **Add an HTML wrapper**:

```html
<div data-testid="places-typeahead-showcase" class="showcase-container">
  <h1>Places Typeahead Showcase</h1>

  <section data-testid="places-input-section">
    <h2>Address Search</h2>
  </section>

  <section data-testid="selected-address-display">
    <h2>Selected Address</h2>
  </section>
</div>
```

2. **Add Places Typeahead component**:
   - This is typically used in OmniStudio forms
   - For standalone testing, you may need a wrapper component

### Required Configuration

- Google Maps API key must be configured in Remote Site Settings
- CSP Trusted Sites must include `maps.googleapis.com`

---

## General Setup Steps

### 1. Enable Guest User Access

For each page:

1. In Experience Builder, go to **Settings > General**
2. Enable **Public Access**
3. Click **Administration > Pages**
4. For each showcase page, set access to **Public**

### 2. Add CSP Trusted Sites

Go to **Setup > CSP Trusted Sites** and ensure these are added:

- `https://js.arcgis.com` (ESRI)
- `https://maps.googleapis.com` (Google Places)
- `https://geocode.arcgis.com` (ESRI Geocoding)

### 3. Publish the Site

After configuring all pages:

1. Click **Publish** in Experience Builder
2. Wait for the site to become available

---

## Verification

After setup, verify each page by visiting:

| Page             | URL                                                                 |
| ---------------- | ------------------------------------------------------------------- |
| Map Selector     | `https://dfn00000c2gpmeaf.my.site.com/sfGpsDsCaOn/map-selector`     |
| Search           | `https://dfn00000c2gpmeaf.my.site.com/sfGpsDsCaOn/search`           |
| Accordion        | `https://dfn00000c2gpmeaf.my.site.com/sfGpsDsCaOn/accordion`        |
| Modal            | `https://dfn00000c2gpmeaf.my.site.com/sfGpsDsCaOn/modal`            |
| NAICS Picker     | `https://dfn00000c2gpmeaf.my.site.com/sfGpsDsCaOn/naics-picker`     |
| Places Typeahead | `https://dfn00000c2gpmeaf.my.site.com/sfGpsDsCaOn/places-typeahead` |

Each page should:

1. Load without requiring login (guest access)
2. Display the showcase container with `data-testid` attribute
3. Show the component(s) properly rendered

---

## Running Tests After Setup

Once pages are configured:

```bash
cd sfGpsDsCaOn/__e2e__
PLAYWRIGHT_BROWSERS_PATH=0 npx playwright test --project=chromium
```

Or to run a specific page's tests:

```bash
# Map selector tests only
PLAYWRIGHT_BROWSERS_PATH=0 npx playwright test map-selector --project=chromium

# Accordion tests only
PLAYWRIGHT_BROWSERS_PATH=0 npx playwright test accordion --project=chromium
```

---

## Troubleshooting

### Components not rendering

- Check browser console for JavaScript errors
- Verify LWC component is properly deployed
- Check component has `isExposed: true` in meta XML

### Guest access denied

- Verify page is set to Public in Experience Builder
- Check Guest User Profile has access to Apex classes
- Verify Remote Site Settings for external APIs

### ESRI map not loading

- Check CSP Trusted Sites include ESRI domains
- Verify Visualforce page is accessible
- Check API key configuration
