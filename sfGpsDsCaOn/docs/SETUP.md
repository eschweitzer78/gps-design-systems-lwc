# Ontario Design System - Setup Guide

This guide covers the initial setup required before deploying the Ontario Design System package to Salesforce.

---

## Prerequisites

- Node.js v20 or higher
- npm v9 or higher
- Access to the project repository
- Salesforce CLI (sf) installed

---

## Step 1: Install Dependencies

```bash
npm install
```

This will install the Ontario Design System packages:
- `@ongov/ontario-design-system-component-library` - Stencil web components
- `@ongov/ontario-design-system-global-styles` - Global CSS and design tokens

---

## Step 2: Prepare Static Resources

Run the preparation script to copy the Ontario Design System files to the static resources:

```bash
npm run prep-caon
```

This script performs the following actions:
1. Copies the component library from `node_modules/@ongov/ontario-design-system-component-library/dist` to `sfGpsDsCaOnComponents/dist`
2. Removes bundled fonts (we use our own in `sfGpsDsCaOnGlobalStyles`)
3. Copies the global styles from `node_modules/@ongov/ontario-design-system-global-styles/dist` to `sfGpsDsCaOnGlobalStyles`

---

## Step 3: Verify Static Resources

After running the prep script, verify the following directories exist:

### sfGpsDsCaOnComponents/dist/ontario-design-system-components/
```
├── ontario-design-system-components.css
├── ontario-design-system-components.esm.js
├── ontario-design-system-components.js
├── p-*.js (chunk files)
└── ...
```

### sfGpsDsCaOnGlobalStyles/
```
├── assets/
│   ├── fonts/
│   ├── icons/
│   ├── logos/
│   └── favicons/
├── global.css
├── global.scss
├── ds-theme.css
├── byo_lwr.css
├── byo_lwr.scss
├── byo_lwr_omnistudio.css
├── byo_lwr_omnistudio.scss
├── head.txt
└── README.md
```

---

## Step 4: Compile SCSS (If Modified)

If you've made changes to the SCSS files, recompile them:

```bash
# Compile global styles
npx sass --no-source-map \
  sfGpsDsCaOn/main/default/staticresources/sfGpsDsCaOnGlobalStyles/global.scss \
  sfGpsDsCaOn/main/default/staticresources/sfGpsDsCaOnGlobalStyles/global.css

# Compile LWR overrides
npx sass --no-source-map \
  sfGpsDsCaOn/main/default/staticresources/sfGpsDsCaOnGlobalStyles/byo_lwr.scss \
  sfGpsDsCaOn/main/default/staticresources/sfGpsDsCaOnGlobalStyles/byo_lwr.css

# Compile OmniStudio styles
npx sass --no-source-map \
  sfGpsDsCaOn/main/default/staticresources/sfGpsDsCaOnGlobalStyles/byo_lwr_omnistudio.scss \
  sfGpsDsCaOn/main/default/staticresources/sfGpsDsCaOnGlobalStyles/byo_lwr_omnistudio.css
```

---

## Step 5: Deploy to Salesforce

Deploy the package to your Salesforce org:

```bash
# Deploy to default org
sf project deploy start --source-dir sfGpsDsCaOn

# Or deploy to a specific org
sf project deploy start --source-dir sfGpsDsCaOn --target-org myOrg
```

---

## Static Resources Overview

| Static Resource | Contents | Purpose |
|-----------------|----------|---------|
| `sfGpsDsCaOnGlobalStyles` | CSS, fonts, icons, logos | Global styling and assets |
| `sfGpsDsCaOnComponents` | Web component library | Ontario DS web components (ontario-button, etc.) |

---

## Component Library Structure

The Ontario Design System Component Library includes these web components:

| Web Component | LWC Wrapper | Description |
|---------------|-------------|-------------|
| `<ontario-button>` | `sfGpsDsCaOnButtonComm` | Interactive button |
| `<ontario-badge>` | `sfGpsDsCaOnBadgeComm` | Status badge |
| `<ontario-blockquote>` | `sfGpsDsCaOnBlockquoteComm` | Styled blockquote |
| `<ontario-page-alert>` | `sfGpsDsCaOnPageAlertComm` | Page-level alert |
| `<ontario-critical-alert>` | `sfGpsDsCaOnCriticalAlertComm` | Critical alert banner |

---

## Troubleshooting

### npm install fails

If npm install fails, ensure you have the correct Node.js version (^20) and try:

```bash
npm cache clean --force
npm install
```

The Ontario Design System packages are available from the public npm registry:
```bash
npm install @ongov/ontario-design-system-component-library @ongov/ontario-design-system-global-styles
```

### prep-caon script fails

Ensure the node_modules are installed:
```bash
ls node_modules/@ongov/
```

If the directory doesn't exist, run `npm install` first.

### Static resource size limits

Salesforce has a 5MB limit per static resource. If the component library exceeds this:
1. Consider splitting into multiple static resources
2. Or use a CDN for the component library

---

## Version Information

| Package | Version |
|---------|---------|
| `@ongov/ontario-design-system-component-library` | 5.0.0 |
| `@ongov/ontario-design-system-global-styles` | 5.0.0 |
| Design System Distribution (reference) | 2.2.0 |

---

## Next Steps

After completing the setup:
1. Deploy to Salesforce: See deployment commands above
2. Configure the site: See [POST_DEPLOYMENT.md](./POST_DEPLOYMENT.md)
3. Verify LWR compatibility: See [LWR_COMPATIBILITY.md](./LWR_COMPATIBILITY.md)
