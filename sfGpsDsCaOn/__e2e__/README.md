# E2E Testing for sfGpsDsCaOn Components

End-to-end tests for Ontario Design System components using Playwright.

## Prerequisites

Before running E2E tests, ensure:

1. **Experience Cloud site is deployed and published**
2. **Guest user access is enabled** for the site
3. **Showcase pages are created** with components configured
4. **ESRI map access is configured** (for map-selector tests) - see below

### Guest User Access for ESRI Maps

The map-selector tests require the ESRI Visualforce page to be accessible without authentication. This requires:

1. **Create a Salesforce Site** (Setup → Sites → New)
   - Site Name: `esrimap`
   - Home Page: `sfGpsDsCaOnSiteSelectorPage`
2. **Configure Guest Access** (Site → Public Access Settings)
   - Add `sfGpsDsCaOnSiteSelectorPage` to Visualforce Page Access
   - Add `sfGpsDsCaOnSiteSelectorCtr` to Apex Class Access

3. **Configure Custom Metadata** (Setup → Custom Metadata Types → utils)
   - `VF_Site_URL`: Your Site URL (e.g., `https://yourorg.my.salesforce-sites.com/esrimap`)
   - `ESRI_API_Key`: Your ESRI ArcGIS API key

4. **Update Experience Builder CSP** (Settings → Security)
   - Add `https://yourorg.my.salesforce-sites.com` to frame-src

For complete setup instructions, see [GIS_GUIDE.md](../docs/GIS_GUIDE.md) and [POST_DEPLOYMENT.md](../docs/POST_DEPLOYMENT.md).

## Setup

```bash
cd sfGpsDsCaOn/__e2e__
npm install
npx playwright install
```

## Running Tests

### All Tests

```bash
npm test
```

### By Priority

```bash
npm run test:priority1    # External integrations (maps, search, places)
npm run test:priority2    # Complex interactions (modal, accordion, naics)
npm run test:priority3    # Form components
npm run test:accessibility # WCAG compliance scans
```

### By Browser

```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
npm run test:mobile
```

### Interactive Mode

```bash
npm run test:ui      # Playwright UI mode
npm run test:debug   # Debug mode
npm run test:headed  # Visible browser
```

## Configuration

Set the `BASE_URL` environment variable to your Experience Cloud site:

```bash
export BASE_URL=https://dfn00000c2gpmeaf.my.site.com/sfGpsDsCaOn
npm test
```

## Test Structure

```
sfGpsDsCaOn/__e2e__/
├── playwright.config.ts    # Playwright configuration
├── tests/
│   ├── priority1/          # External API integrations
│   │   ├── map-selector.spec.ts
│   │   ├── search.spec.ts
│   │   └── places-typeahead.spec.ts
│   ├── priority2/          # Complex UI interactions
│   │   ├── modal.spec.ts
│   │   ├── accordion.spec.ts
│   │   └── naics-picker.spec.ts
│   ├── priority3/          # Form components
│   └── accessibility/      # WCAG compliance
│       └── axe-scans.spec.ts
├── fixtures/
│   └── test-data.ts        # Shared test data
└── utils/
    └── page-helpers.ts     # Common page interactions
```

## Showcase Pages Required

Create these pages in your Experience Cloud site (or deploy the `sfGpsDsCaOnShowcase` package):

| Page         | Path                | Components                               |
| ------------ | ------------------- | ---------------------------------------- |
| Map Selector | `/map-selector`     | SiteSelectorTool, DischargePointSelector |
| Search       | `/search`           | Search, SearchComm                       |
| Places       | `/places-typeahead` | FormPlacesTypeahead                      |
| Modal        | `/modal`            | Modal dialogs                            |
| Accordion    | `/accordion`        | Accordion, AccordionGroup                |
| NAICS Picker | `/naics-picker`     | NaicsCodePicker                          |

> **Note**: Pages must be accessible to guest users. In Experience Builder, ensure each page has guest access enabled (Page Properties → Access).

## CI/CD

The `.github/workflows/e2e-tests.yml` workflow:

1. Creates a scratch org
2. Deploys packages
3. Publishes Experience site
4. Runs Playwright tests
5. Uploads test reports
6. Cleans up scratch org

### Required Secrets

- `SFDX_AUTH_URL`: DevHub authentication URL
- `ESRI_API_KEY`: (Optional) ESRI ArcGIS API key
- `GOOGLE_MAPS_API_KEY`: (Optional) Google Maps API key

## Viewing Reports

After tests run:

```bash
npm run report
```

Or view `playwright-report/index.html` in a browser.

## Accessibility Testing

Uses axe-core for automated WCAG 2.1 AA compliance testing:

- Color contrast validation
- ARIA attribute validation
- Form label association
- Keyboard navigation
- Focus management

## API Keys and Configuration

Some tests require valid API keys and additional org configuration:

### ESRI Maps (map-selector tests)

1. **ESRI API Key**: Configure in `utils__mdt` custom metadata as `ESRI_API_Key`
2. **VF Site URL**: Configure in `utils__mdt` as `VF_Site_URL` for guest access
3. **CSP Configuration**: ESRI domains must be added to CSP Trusted Sites

Without proper ESRI configuration, map-selector tests will timeout waiting for the map to load.

### Google Places (places-typeahead tests)

- **Google Maps API Key**: Set `GOOGLE_MAPS_API_KEY` environment variable or configure in org

### Test Behavior

- Tests will skip gracefully if they detect a login page or missing showcase components
- Map tests will timeout (not skip) if the ESRI infrastructure isn't configured
- Accessibility tests will skip pages that aren't accessible to guest users

### Troubleshooting

| Issue                         | Cause                          | Solution                                     |
| ----------------------------- | ------------------------------ | -------------------------------------------- |
| Tests timeout on map-selector | ESRI map not loading           | Configure VF Site URL and CSP                |
| Tests redirect to login       | Guest access not configured    | Enable guest access for pages                |
| "Page Not Found" errors       | Wrong baseURL or page paths    | Verify playwright.config.ts baseURL          |
| Elements not found            | Missing data-testid attributes | Verify showcase page component configuration |
