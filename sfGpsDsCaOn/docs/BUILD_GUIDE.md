# Ontario Design System - Complete Build & Deploy Guide

This guide provides step-by-step instructions for building and deploying the `sfGpsDsCaOn` (Canada Ontario Design System) package to a Salesforce org. It is written for junior developers who may be new to the project.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Clone the Repository](#clone-the-repository)
3. [Install Dependencies](#install-dependencies)
4. [Build the Project](#build-the-project)
5. [Authenticate to Salesforce](#authenticate-to-salesforce)
6. [Deploy to Salesforce](#deploy-to-salesforce)
7. [Verify Deployment](#verify-deployment)
8. [Troubleshooting](#troubleshooting)
9. [Quick Reference](#quick-reference)

---

## Prerequisites

Before you begin, ensure you have the following tools installed on your machine.

### 1. Node.js (v20 or higher)

Node.js is required to run the build scripts and install npm packages.

**Check if installed:**

```bash
node --version
# Should output v20.x.x or higher
```

**Install Node.js:**

- **macOS (using Homebrew):**
  ```bash
  brew install node@20
  ```
- **Windows:** Download from [nodejs.org](https://nodejs.org/)
- **Using nvm (recommended for version management):**
  ```bash
  # Install nvm first: https://github.com/nvm-sh/nvm
  nvm install 20
  nvm use 20
  ```

### 2. npm (v9 or higher)

npm comes bundled with Node.js. Verify it's installed:

```bash
npm --version
# Should output 9.x.x or higher
```

### 3. Salesforce CLI (sf)

The Salesforce CLI is required to deploy metadata to Salesforce orgs.

**Check if installed:**

```bash
sf --version
# Should output @salesforce/cli/2.x.x or similar
```

**Install Salesforce CLI:**

- **macOS (using Homebrew):**
  ```bash
  brew install sf
  ```
- **Windows/macOS/Linux (using npm):**
  ```bash
  npm install -g @salesforce/cli
  ```
- **Or download from:** [developer.salesforce.com/tools/salesforcecli](https://developer.salesforce.com/tools/salesforcecli)

### 4. Git

Git is required to clone the repository.

**Check if installed:**

```bash
git --version
```

**Install Git:**

- **macOS:** `brew install git`
- **Windows:** Download from [git-scm.com](https://git-scm.com/)

### 5. A Text Editor or IDE

We recommend:

- **Visual Studio Code** with Salesforce Extension Pack
- **Cursor** (AI-powered IDE)

---

## Clone the Repository

If you haven't already, clone the repository to your local machine:

```bash
git clone https://github.com/eschweitzer78/gps-design-systems-lwc.git
cd gps-design-systems-lwc
```

Or if you're using a fork:

```bash
git clone https://github.com/YOUR_USERNAME/gps-design-systems-lwc.git
cd gps-design-systems-lwc
```

---

## Install Dependencies

Install all npm packages required by the project:

```bash
npm install
```

**What this does:**

- Installs the Ontario Design System packages:
  - `@ongov/ontario-design-system-component-library` (Stencil web components)
  - `@ongov/ontario-design-system-global-styles` (CSS and design tokens)
- Installs TypeScript, Sass, and other build tools
- Sets up Husky for git hooks

**Expected output:** You should see packages being installed. Ignore engine warnings if you're on a newer Node.js version.

**Troubleshooting:**

```bash
# If npm install fails, try clearing the cache:
npm cache clean --force
npm install
```

---

## Build the Project

The build process has two steps: **prepare assets** and **compile TypeScript**.

### Step 1: Prepare Static Resources

Copy the Ontario Design System files from node_modules to the static resources folder:

```bash
npm run prep-caon
```

**What this does:**

1. Copies the component library to `sfGpsDsCaOnComponents/dist/`
2. Copies global styles to `sfGpsDsCaOnGlobalStyles/`
3. Removes duplicate font files to keep static resources under Salesforce's 5MB limit
4. Creates the `sfGpsDsCaOnFull` directory placeholder

### Step 2: Compile TypeScript

Compile TypeScript files to JavaScript for both the base package (`sfGpsDs`) and the Ontario package (`sfGpsDsCaOn`):

```bash
npm run build-caon
```

**What this does:**

1. Compiles `sfGpsDs/main/default/lwc` TypeScript files
2. Compiles `sfGpsDsCaOn/main/default/lwc` TypeScript files

**Note:** The Ontario package depends on the base `sfGpsDs` package, so both must be compiled.

### Step 3: Create Placeholder Directories (First Time Only)

The `sfdx-project.json` file references directories that may not exist. Create them to avoid deployment errors:

```bash
mkdir -p sfGpsDsAuNswFull sfGpsDsAuNswSFull sfGpsDsAuQldFull sfGpsDsAuVic2Full sfGpsDsFrGovFull sfGpsDsUkGovFull sfGpsDsSgGovFull
```

**Note:** This step is only needed the first time or after a fresh clone.

---

## Authenticate to Salesforce

Before deploying, you must authenticate to your target Salesforce org.

### Option A: Login via Browser (Recommended)

```bash
sf org login web --alias YOUR_ORG_ALIAS --set-default
```

Replace `YOUR_ORG_ALIAS` with a memorable name (e.g., `mydevorg`, `sandbox1`, `EASR`).

This opens a browser window where you log in to Salesforce. After successful login, you'll see:

```
Successfully authorized username@example.com with org ID 00Dxx0000000000
```

### Option B: Login to Sandbox

```bash
sf org login web --alias YOUR_ORG_ALIAS --instance-url https://test.salesforce.com
```

### Option C: Check Existing Orgs

View all authenticated orgs:

```bash
sf org list --all
```

### Set Default Org

If you have multiple orgs, set the default:

```bash
sf config set target-org YOUR_ORG_ALIAS
```

---

## Deploy to Salesforce

Deploy both the base package (`sfGpsDs`) and the Ontario package (`sfGpsDsCaOn`):

```bash
sf project deploy start \
  --source-dir sfGpsDs \
  --source-dir sfGpsDsCaOn \
  --target-org YOUR_ORG_ALIAS \
  --wait 60
```

**What this deploys:**

- `sfGpsDs`: Base design system components, utilities, and Apex classes
- `sfGpsDsCaOn`: Ontario-specific LWC components and static resources

**Expected output:**

```
───── Deploying Metadata ─────
✔ Preparing
✔ Waiting for the org to respond
✔ Deploying Metadata
◯ Running Tests - Skipped
◯ Updating Source Tracking - Skipped
✔ Done

Status: Succeeded
```

### Deploy to Default Org

If you've set a default org, you can omit the `--target-org` flag:

```bash
sf project deploy start --source-dir sfGpsDs --source-dir sfGpsDsCaOn --wait 60
```

---

## Verify Deployment

After deployment, verify the components are available in Salesforce:

1. **Log in to your Salesforce org**
2. **Go to Setup** (gear icon → Setup)
3. **Search for "Lightning Components"** in Quick Find
4. **Look for components starting with:**
   - `sfGpsDs*` (base components)
   - `sfGpsDsCaOn*` (Ontario components)

### Verify Static Resources

1. In Setup, search for **"Static Resources"**
2. Verify these resources exist:
   - `sfGpsDsCaOnComponents`
   - `sfGpsDsCaOnGlobalStyles`

---

## Troubleshooting

### Error: "Static resource cannot exceed 5MB"

**Cause:** The `sfGpsDsCaOnGlobalStyles` static resource is too large.

**Solution:** The `prep-caon` script should remove duplicate fonts. If you still see this error:

```bash
rm -rf sfGpsDsCaOn/main/default/staticresources/sfGpsDsCaOnGlobalStyles/dist/fonts
```

Then redeploy.

### Error: "No base file for markup://c:sfGpsDs..."

**Cause:** TypeScript files haven't been compiled to JavaScript.

**Solution:** Run the build step:

```bash
npm run build-caon
```

### Error: "The path 'sfGpsDsAuNswFull' does not exist"

**Cause:** The sfdx-project.json references directories that don't exist.

**Solution:** Create placeholder directories:

```bash
mkdir -p sfGpsDsAuNswFull sfGpsDsAuNswSFull sfGpsDsAuQldFull sfGpsDsAuVic2Full sfGpsDsFrGovFull sfGpsDsUkGovFull sfGpsDsSgGovFull
```

### Error: "DomainNotFoundError" when deploying

**Cause:** The org may have expired (scratch org) or the authentication is stale.

**Solution:** Re-authenticate:

```bash
sf org login web --alias YOUR_ORG_ALIAS
```

### Error: "npm install" fails

**Possible causes:**

- Wrong Node.js version
- Network issues
- Corrupted cache

**Solutions:**

```bash
# Check Node.js version
node --version
# Should be v20.x.x or higher

# Clear npm cache and retry
npm cache clean --force
npm install

# Or delete node_modules and retry
rm -rf node_modules package-lock.json
npm install
```

### Deployment takes too long

**Tip:** Large deployments can take several minutes. The `--wait 60` flag waits up to 60 minutes. For very large deployments:

```bash
sf project deploy start --source-dir sfGpsDs --source-dir sfGpsDsCaOn --wait 120
```

---

## Quick Reference

### One-Time Setup (First Clone)

```bash
# 1. Clone the repo
git clone https://github.com/eschweitzer78/gps-design-systems-lwc.git
cd gps-design-systems-lwc

# 2. Install dependencies
npm install

# 3. Create placeholder directories
mkdir -p sfGpsDsAuNswFull sfGpsDsAuNswSFull sfGpsDsAuQldFull sfGpsDsAuVic2Full sfGpsDsFrGovFull sfGpsDsUkGovFull sfGpsDsSgGovFull

# 4. Authenticate to Salesforce
sf org login web --alias myorg --set-default
```

### Regular Build & Deploy

```bash
# 1. Prepare assets
npm run prep-caon

# 2. Build TypeScript
npm run build-caon

# 3. Deploy
sf project deploy start --source-dir sfGpsDs --source-dir sfGpsDsCaOn --wait 60
```

### All-in-One Command

```bash
npm run prep-caon && npm run build-caon && sf project deploy start --source-dir sfGpsDs --source-dir sfGpsDsCaOn --wait 60
```

---

## Available npm Scripts

| Script                       | Description                                    |
| ---------------------------- | ---------------------------------------------- |
| `npm run prep-caon`          | Copy Ontario DS assets to static resources     |
| `npm run build-caon`         | Compile TypeScript for sfGpsDs and sfGpsDsCaOn |
| `npm run lint-caon`          | Run ESLint on sfGpsDsCaOn files                |
| `npm run test-caon`          | Run Jest tests for sfGpsDsCaOn                 |
| `npm run test-caon:watch`    | Run tests in watch mode                        |
| `npm run test-caon:coverage` | Run tests with coverage report                 |
| `npm run test-caon:a11y`     | Run accessibility tests                        |

---

## Compiling SCSS (If Modified)

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

## Static Resources Overview

| Static Resource           | Contents                 | Purpose                                          |
| ------------------------- | ------------------------ | ------------------------------------------------ |
| `sfGpsDsCaOnGlobalStyles` | CSS, fonts, icons, logos | Global styling and assets                        |
| `sfGpsDsCaOnComponents`   | Web component library    | Ontario DS web components (ontario-button, etc.) |

---

## Component Library Structure

The Ontario Design System Component Library includes these web components:

| Web Component              | LWC Wrapper                    | Description           |
| -------------------------- | ------------------------------ | --------------------- |
| `<ontario-button>`         | `sfGpsDsCaOnButtonComm`        | Interactive button    |
| `<ontario-badge>`          | `sfGpsDsCaOnBadgeComm`         | Status badge          |
| `<ontario-blockquote>`     | `sfGpsDsCaOnBlockquoteComm`    | Styled blockquote     |
| `<ontario-page-alert>`     | `sfGpsDsCaOnPageAlertComm`     | Page-level alert      |
| `<ontario-critical-alert>` | `sfGpsDsCaOnCriticalAlertComm` | Critical alert banner |

---

## Next Steps

After successful deployment:

1. **Configure your Experience Cloud site** - See [POST_DEPLOYMENT.md](./POST_DEPLOYMENT.md)
2. **Set up OmniStudio forms** - See [OMNISCRIPT_SETUP.md](./OMNISCRIPT_SETUP.md)
3. **Understand the components** - See [COMPONENT_API.md](./COMPONENT_API.md)
4. **Debug issues** - See [DEBUG_GUIDE.md](./DEBUG_GUIDE.md)

---

## Version Information

| Package                                          | Version |
| ------------------------------------------------ | ------- |
| `@ongov/ontario-design-system-component-library` | 5.0.0   |
| `@ongov/ontario-design-system-global-styles`     | 5.0.0   |
| Node.js (required)                               | ^20     |
| Salesforce API Version                           | 65.0    |
