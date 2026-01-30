# Ontario Design System - Post Deployment Guide

This guide covers the steps required to configure your LWR Digital Experience site after deploying the Ontario Design System static resources.

---

## Prerequisites

Before proceeding, ensure you have:

- [ ] Deployed the `sfGpsDsCaOn` package to your Salesforce org
- [ ] An LWR-based Digital Experience site created
- [ ] System Administrator or Experience Builder permissions

---

## Enable ExperienceBundle Metadata API (Recommended)

For deployable Experience Cloud site configurations, enable the ExperienceBundle Metadata API in your org:

1. Go to **Setup** → **Digital Experiences** → **Settings**
2. Check **Enable ExperienceBundle Metadata API**
3. Click **Save**

This enables:

- Deployment of site pages, themes, and routes via metadata
- Version control of Experience Cloud site configuration
- CI/CD pipeline integration for site deployments

For detailed instructions, see [EXPERIENCEBUNDLE_SETUP.md](./EXPERIENCEBUNDLE_SETUP.md).

---

## Step 1: Configure CSP Trusted Sites

The deployment includes CSP Trusted Site records that should be automatically activated. Verify they are enabled:

1. Go to **Setup** → **Security** → **CSP Trusted Sites**
2. Confirm these entries are **Active**:
   - `sfGpsDsCaOnFonts` (\*.force.com)
   - `sfGpsDsCaOnSiteAssets` (\*.salesforce-sites.com)

If they are not active, click **Edit** on each and check the **Active** checkbox.

---

## Step 2: Configure Site Head Markup

### Option A: Using Experience Builder (Recommended)

1. Open **Experience Builder** for your site
2. Click the **gear icon** (Settings) in the top-left
3. Select **Advanced** → **Edit Head Markup**

#### Understanding Existing Salesforce Stylesheets

Your LWR site likely has existing stylesheets that use LWR template syntax (`{ basePath }`, `{ versionKey }`). Here's what each does:

| Stylesheet                                       | Purpose                                    | Recommendation                                  |
| ------------------------------------------------ | ------------------------------------------ | ----------------------------------------------- |
| `salesforce-lightning-design-system-part1-4.css` | Core SLDS styles for Salesforce components | **Keep** - needed for native SF components      |
| `dxp-site-spacing-styling-hooks.min.css`         | Experience Builder layout spacing          | **Keep** - used by EB layouts                   |
| `dxp-styling-hooks.min.css`                      | DXP CSS custom properties                  | **Keep** - used by EB theming                   |
| `dxp-slds-extensions.min.css`                    | SLDS extensions for Experience Cloud       | **Keep** - used by EB components                |
| `styles/styles.css`                              | Theme-specific styles                      | Optional - can remove if fully using Ontario DS |
| `styles/print.css`                               | Print styles                               | Optional - keep if you need print support       |

#### Complete Head Markup

**IMPORTANT**:

- LWR sites do NOT support `{!basePath}` Visualforce merge fields in head markup
- Replace `/YOUR_SITE_PATH` with your actual site URL prefix (e.g., `/EASR`)
- Ontario DS styles must load **AFTER** Salesforce styles to properly override them

```html
<!-- ============================================
     SALESFORCE/EXPERIENCE BUILDER BASE STYLES
     Keep these for native Salesforce components
     ============================================ -->
<link
  rel="stylesheet"
  href="{ basePath }/assets/styles/slds/salesforce-lightning-design-system-part1.css?{ versionKey }"
/>
<link
  rel="stylesheet"
  href="{ basePath }/assets/styles/slds/salesforce-lightning-design-system-part2.css?{ versionKey }"
/>
<link
  rel="stylesheet"
  href="{ basePath }/assets/styles/slds/salesforce-lightning-design-system-part3.css?{ versionKey }"
/>
<link
  rel="stylesheet"
  href="{ basePath }/assets/styles/slds/salesforce-lightning-design-system-part4.css?{ versionKey }"
/>
<link
  rel="stylesheet"
  href="{ basePath }/assets/styles/dxp-site-spacing-styling-hooks.min.css?{ versionKey }"
/>
<link
  rel="stylesheet"
  href="{ basePath }/assets/styles/dxp-styling-hooks.min.css?{ versionKey }"
/>
<link
  rel="stylesheet"
  href="{ basePath }/assets/styles/dxp-slds-extensions.min.css?{ versionKey }"
/>

<!-- ============================================
     ONTARIO DESIGN SYSTEM STYLES
     Load AFTER Salesforce styles to override
     ============================================ -->
<!-- Favicons -->
<link
  rel="icon"
  href="/YOUR_SITE_PATH/sfsites/c/resource/sfGpsDsCaOnGlobalStyles/assets/favicons/favicon.ico"
  sizes="48x48"
/>
<link
  rel="icon"
  href="/YOUR_SITE_PATH/sfsites/c/resource/sfGpsDsCaOnGlobalStyles/assets/favicons/favicon.svg"
  type="image/svg+xml"
/>
<link
  rel="apple-touch-icon"
  href="/YOUR_SITE_PATH/sfsites/c/resource/sfGpsDsCaOnGlobalStyles/assets/favicons/apple-touch-icon.png"
/>

<!-- Ontario Design System Global Styles (includes font declarations) -->
<link
  rel="stylesheet"
  href="/YOUR_SITE_PATH/sfsites/c/resource/sfGpsDsCaOnGlobalStyles/global.css"
/>
<link
  rel="stylesheet"
  href="/YOUR_SITE_PATH/sfsites/c/resource/sfGpsDsCaOnGlobalStyles/ds-theme.css"
/>

<!-- Ontario Design System Component Library (Web Components) -->
<!-- REQUIRED for: ontario-button, ontario-badge, ontario-blockquote, ontario-page-alert, ontario-critical-alert -->
<script
  type="module"
  src="/YOUR_SITE_PATH/sfsites/c/resource/sfGpsDsCaOnComponents/dist/ontario-design-system-components/ontario-design-system-components.esm.js"
></script>
<script
  nomodule
  src="/YOUR_SITE_PATH/sfsites/c/resource/sfGpsDsCaOnComponents/dist/ontario-design-system-components/ontario-design-system-components.js"
></script>
<!-- NOTE: Do NOT include ontario-design-system-components.css - it uses relative font paths that don't resolve in Salesforce.
     Fonts are already loaded via global.css above, and component styles are embedded in the web components. -->
```

4. Click **Save**

**Important Notes:**

- The component library scripts are required for the following components to work:
  - Ontario DS Button
  - Ontario DS Badge
  - Ontario DS Blockquote
  - Ontario DS Page Alert
  - Ontario DS Critical Alert
- **Do NOT load `ontario-design-system-components.css`** - This CSS file uses relative font paths (e.g., `../../../fonts/...`) that cannot resolve correctly when loaded from a Salesforce static resource. Fonts are already declared in `global.css` with correct paths.
- **Load order matters** - Ontario DS styles must come after Salesforce/SLDS styles to properly override them.

### Option B: Using Site Configuration Files

If you're managing site configuration as code, add the stylesheet references to your site's theme configuration.

---

## Step 3: Add OmniStudio Styles (If Using OmniStudio)

If your site includes OmniStudio FlexCards or OmniScripts, add the additional stylesheet:

```html
<link
  rel="stylesheet"
  href="/YOUR_SITE_PATH/sfsites/c/resource/sfGpsDsCaOnGlobalStyles/byo_lwr_omnistudio.css"
/>
```

---

## Step 4: Configure Theme Branding (Optional)

To ensure consistent branding throughout your site:

1. In Experience Builder, go to **Theme** → **Branding**
2. Set the following CSS variables in your theme CSS:

```css
:root {
  /* Primary brand color - Ontario Blue */
  --sds-c-button-brand-color-background: #0066cc;
  --sds-c-button-brand-color-border: #0066cc;

  /* Focus color */
  --sds-c-button-color-focus: #009adb;

  /* Typography */
  --sds-c-body-font-family:
    "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
}
```

---

## Step 5: Verify Font Loading

After publishing your site, verify that fonts are loading correctly:

1. Open your site in a browser
2. Open **Developer Tools** (F12 or Cmd+Option+I)
3. Go to the **Network** tab
4. Filter by **Font**
5. Refresh the page
6. Verify you see requests for:
   - `open-sans-400.woff2`
   - `open-sans-600.woff2`
   - `open-sans-700.woff2`
   - `raleway-modified-*.woff2`

If fonts are not loading, check:

- CSP Trusted Sites are active
- Static resource permissions are correctly assigned

---

## Step 6: Assign Permission Set (If Required)

If components are not rendering:

1. Go to **Setup** → **Permission Sets**
2. Find `sfGpsDsCaOnUser`
3. Click **Manage Assignments**
4. Add the guest user profile for your site

---

## Step 7: Publish Your Site

1. In Experience Builder, click **Publish**
2. Confirm the publish action
3. Access your site URL to verify the styling is applied

---

## Data-Connected Components

Some Ontario DS components include data-connected versions that automatically fetch data from Salesforce.

### Ontario DS Notification Card (Data Connected)

This component automatically fetches notification counts based on the selected notification type.

**Component Name in Experience Builder**: `Ontario DS Notification Card (Data Connected)`

**Properties**:

| Property                 | Description                                                         |
| ------------------------ | ------------------------------------------------------------------- |
| **Notification Type**    | `action`, `reminder`, or `status` - determines what data is queried |
| **Heading Override**     | Optional: Override the default heading text                         |
| **Description Override** | Optional: Override the default description                          |
| **URL Override**         | Optional: Override the destination URL                              |

**Data Sources by Type**:

| Type         | What It Queries                                                           |
| ------------ | ------------------------------------------------------------------------- |
| **action**   | High-priority Tasks (`Priority = 'High'`) that are due today or overdue   |
| **reminder** | Tasks due within the next 7 days                                          |
| **status**   | Tasks updated in the last 24 hours by someone other than the current user |

**Customizing Data Sources**:

To customize what data is queried, modify the `SfGpsDsCaOnNotificationController` Apex class:

- `getActionNotifications()` - Modify for action items
- `getReminderNotifications()` - Modify for reminders
- `getStatusNotifications()` - Modify for status updates

### Ontario DS Task List (Salesforce)

This component displays Salesforce Tasks in the Ontario DS Task List format.

**Component Name in Experience Builder**: `Ontario DS Task List (Salesforce)`

**Properties**:

| Property           | Description                                                                             |
| ------------------ | --------------------------------------------------------------------------------------- |
| **Record ID**      | Optional: Show tasks related to a specific record. If empty, shows current user's tasks |
| **Show Completed** | Whether to include completed tasks                                                      |
| **Max Records**    | Maximum number of tasks to display (default: 50)                                        |
| **Empty Message**  | Message to show when no tasks are found                                                 |

---

## Ontario DS Header Configuration

The **Ontario DS Header** component supports three header types and accepts JSON configuration for customization.

### Header Types

| Type             | Description                                                                           |
| ---------------- | ------------------------------------------------------------------------------------- |
| `ontario`        | Standard Ontario.ca header (for pages on main ontario.ca website)                     |
| `application`    | Application header with custom name and navigation (recommended for Salesforce sites) |
| `serviceOntario` | ServiceOntario branded header (for ServiceOntario teams only)                         |

### JSON Configuration Properties

#### Application Header Info (JSON)

Used when `Header type` is set to `application`. Configures the application name and navigation behavior.

```json
{
  "title": "My Application Name",
  "href": "/home",
  "maxSubheaderDesktopLinks": 5,
  "maxSubheaderTabletLinks": 2,
  "maxSubheaderMobileLinks": 1
}
```

| Property                   | Type   | Description                                                                      |
| -------------------------- | ------ | -------------------------------------------------------------------------------- |
| `title`                    | string | The application name displayed in the dark grey subheader                        |
| `href`                     | string | URL the application name links to (usually your home page)                       |
| `maxSubheaderDesktopLinks` | number | Number of menu links visible on desktop before overflow to dropdown (default: 5) |
| `maxSubheaderTabletLinks`  | number | Number of menu links visible on tablet before overflow to dropdown (default: 2)  |
| `maxSubheaderMobileLinks`  | number | Number of menu links visible on mobile before overflow to dropdown (default: 1)  |

#### Menu Items (JSON)

An array of navigation menu items. For application headers, excess items appear in a dropdown menu.

```json
[
  { "title": "Dashboard", "href": "/dashboard", "linkIsActive": true },
  { "title": "Applications", "href": "/applications" },
  { "title": "Profile", "href": "/profile" },
  { "title": "Help", "href": "/help" }
]
```

| Property       | Type    | Description                                                 |
| -------------- | ------- | ----------------------------------------------------------- |
| `title`        | string  | The menu item label displayed in the header                 |
| `href`         | string  | URL the menu item links to                                  |
| `linkIsActive` | boolean | Optional: Set to `true` to show active/current page styling |

**Best Practices:**

- Limit to 7 menu items maximum
- Keep labels concise
- Order items by importance (first items show in subheader, rest go to dropdown)

#### Language Toggle Options (JSON)

Configures the English/French language toggle URLs.

```json
{
  "englishLink": "/en/home",
  "frenchLink": "/fr/home"
}
```

| Property      | Type   | Description                                     |
| ------------- | ------ | ----------------------------------------------- |
| `englishLink` | string | URL for the English version of the current page |
| `frenchLink`  | string | URL for the French version of the current page  |

### Example Configuration

For a typical Salesforce Experience Cloud site:

**Header Type**: `application`

**Application Header Info (JSON)**:

```json
{
  "title": "EASR Portal",
  "href": "/",
  "maxSubheaderDesktopLinks": 4,
  "maxSubheaderTabletLinks": 2
}
```

**Menu Items (JSON)**:

```json
[
  { "title": "Home", "href": "/", "linkIsActive": true },
  { "title": "Apply", "href": "/apply" },
  { "title": "My Applications", "href": "/applications" },
  { "title": "Help", "href": "/help" }
]
```

**Language Toggle Options (JSON)**:

```json
{
  "englishLink": "/en",
  "frenchLink": "/fr"
}
```

**Additional Settings**:

- **Disable dynamic menu**: `true` (recommended - prevents API errors from Ontario's external menu service)
- **Language**: `en` (or `fr` for French pages)

---

## Using Ontario Design System Icons

### In LWC Components

To use icons from the Ontario icon sprite in your Lightning Web Components:

```html
<template>
  <svg
    class="ontario-icon"
    aria-hidden="true"
    focusable="false"
    width="24"
    height="24"
  >
    <use href="{iconUrl}"></use>
  </svg>
</template>
```

```javascript
import { LightningElement } from "lwc";
import ICONS from "@salesforce/resourceUrl/sfGpsDsCaOnGlobalStyles";

export default class MyComponent extends LightningElement {
  get iconUrl() {
    return `${ICONS}/assets/icons/ontario-icons-primary.svg#ontario-icon-search`;
  }
}
```

### Available Icon IDs

Common icons from `ontario-icons-primary.svg`:

- `ontario-icon-search`
- `ontario-icon-menu`
- `ontario-icon-close`
- `ontario-icon-chevron-down`
- `ontario-icon-chevron-up`
- `ontario-icon-chevron-left`
- `ontario-icon-chevron-right`
- `ontario-icon-alert-error`
- `ontario-icon-alert-warning`
- `ontario-icon-alert-success`
- `ontario-icon-alert-information`
- `ontario-icon-email`
- `ontario-icon-phone`
- `ontario-icon-help`
- `ontario-icon-expand`
- `ontario-icon-collapse`

---

## Using Ontario Logos

Reference logos in your components:

```javascript
import ASSETS from "@salesforce/resourceUrl/sfGpsDsCaOnGlobalStyles";

// Desktop logo
const desktopLogo = `${ASSETS}/assets/logos/ontario-logo--desktop.svg`;

// Mobile logo
const mobileLogo = `${ASSETS}/assets/logos/ontario-logo--mobile.svg`;

// Footer logo
const footerLogo = `${ASSETS}/assets/logos/footer-default-supergraphic-logo.svg`;
```

---

## CSS Custom Properties Reference

The following CSS custom properties are available for use in your components:

### Colors

```css
/* Greyscale */
--ontario-colour-white: #ffffff;
--ontario-colour-black: #1a1a1a;
--ontario-colour-greyscale-5: #f2f2f2;
--ontario-colour-greyscale-20: #cccccc;
--ontario-colour-greyscale-40: #999999;
--ontario-colour-greyscale-60: #666666;
--ontario-colour-greyscale-70: #4d4d4d;

/* System Colors */
--ontario-colour-link: #0066cc;
--ontario-colour-link-hover: #00478f;
--ontario-colour-focus: #009adb;
--ontario-colour-alert: #cd0000;
--ontario-colour-warning: #ffd440;
--ontario-colour-success: #118847;
--ontario-colour-information: #1080a6;
```

### Typography

```css
--ontario-font-open-sans:
  "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
--ontario-font-raleway-modified:
  "Raleway Modified", "Open Sans", "Helvetica Neue", Helvetica, Arial,
  sans-serif;
--ontario-font-courier-prime:
  "Courier Prime", Courier, "Courier New", monospace;
```

### Spacing

```css
--ontario-spacing-1: 0.25rem; /* 4px */
--ontario-spacing-2: 0.5rem; /* 8px */
--ontario-spacing-3: 0.75rem; /* 12px */
--ontario-spacing-4: 1rem; /* 16px */
--ontario-spacing-5: 1.5rem; /* 24px */
--ontario-spacing-6: 2rem; /* 32px */
--ontario-spacing-7: 2.5rem; /* 40px */
--ontario-spacing-8: 3rem; /* 48px */
```

---

## Troubleshooting

### Fonts Not Loading (404 Errors)

If you see 404 errors for fonts like `open-sans-400.woff2`, `open-sans-400.otf`, `open-sans-400.ttf`:

1. **Ensure Latest Version is Deployed**: The `ds-theme.css` file has been updated to remove duplicate `@font-face` declarations that used incorrect relative paths. Redeploy the `sfGpsDsCaOnGlobalStyles` static resource to get the fix.

2. **Do NOT include Component Library CSS**: Do NOT include `ontario-design-system-components.css` in your head markup. This CSS file uses relative font paths (e.g., `../../../fonts/...`) that don't resolve in Salesforce. Fonts are already loaded via `global.css`.

3. **Verify global.css is Loaded First**: Ensure your head markup includes `global.css` which contains the correct font declarations:

   ```html
   <link
     rel="stylesheet"
     href="/YOUR_SITE_PATH/sfsites/c/resource/sfGpsDsCaOnGlobalStyles/global.css"
   />
   <link
     rel="stylesheet"
     href="/YOUR_SITE_PATH/sfsites/c/resource/sfGpsDsCaOnGlobalStyles/ds-theme.css"
   />
   ```

   Load order matters - `global.css` must load before `ds-theme.css`.

4. **Check CSP Settings**: Ensure CSP Trusted Sites are active

5. **Verify Static Resource**: Confirm `sfGpsDsCaOnGlobalStyles` is deployed and up to date

6. **Clear Cache**: Try a hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Styles Not Applied

1. **Check Head Markup**: Verify stylesheet links are correctly added
2. **Check Order**: Ensure Ontario CSS loads before your custom CSS
3. **Publish Site**: Make sure you've published after making changes
4. **Check Console**: Look for CSS loading errors in browser console

### Icons Not Displaying

1. **Check Path**: Verify the icon sprite URL is correct
2. **Check Icon ID**: Confirm the icon ID exists in the sprite file
3. **CSP Issues**: SVG use elements may be blocked by CSP - verify trusted sites

### OmniStudio Styling Issues

1. **Add OmniStudio CSS**: Ensure `byo_lwr_omnistudio.css` is included
2. **Check Load Order**: OmniStudio CSS should load after global CSS
3. **Specificity**: You may need to increase specificity for some overrides

### Expected Console Warnings (Can Be Ignored)

The following console messages are expected and can be safely ignored:

| Message                                                                                                                     | Explanation                                                                                                                                                                                                                                                                           |
| --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `An iframe which has both allow-scripts and allow-same-origin for its sandbox attribute can escape its sandboxing`          | Standard Salesforce LWR Locker Service security message. This is informational, not an error.                                                                                                                                                                                         |
| `The HTML document lang attribute value of en-US is not a valid language value for the <ontario-language-toggle> component` | Salesforce sets `lang="en-US"` but Ontario components expect `en` or `fr`. It defaults to `en` automatically.                                                                                                                                                                         |
| `Unable to retrieve data from Ontario Menu API`                                                                             | The Ontario header/footer web components try to fetch menu data from Ontario government servers. This fails in Salesforce due to CORS/CSP restrictions. Use the LWC wrapper components (`sfGpsDsCaOnHeaderComm`, `sfGpsDsCaOnFooterComm`) instead, which don't rely on external APIs. |

---

## Related Documentation

- [BUILD_GUIDE.md](./BUILD_GUIDE.md) - Complete build and deploy instructions
- [EXPERIENCEBUNDLE_SETUP.md](./EXPERIENCEBUNDLE_SETUP.md) - Enable ExperienceBundle Metadata API for site deployments
- [LWR_GUIDE.md](./LWR_GUIDE.md) - LWR site configuration guide
- [OMNISCRIPT_SETUP.md](./OMNISCRIPT_SETUP.md) - OmniStudio forms configuration

---

## Support

For issues with the Ontario Design System implementation:

- Review the [Ontario Design System documentation](https://designsystem.ontario.ca/)
- Check the component README files in this repository
- Open an issue in the project repository

---

## Version Information

- **Ontario Design System Version**: 2.2.0
- **Package**: sfGpsDsCaOn
- **Static Resource**: sfGpsDsCaOnGlobalStyles
