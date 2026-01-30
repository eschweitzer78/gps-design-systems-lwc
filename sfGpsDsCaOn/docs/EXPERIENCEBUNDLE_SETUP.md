# Enable ExperienceBundle Metadata API

This guide explains how to enable the ExperienceBundle Metadata API for deploying Ontario Design System Experience Cloud sites.

---

## Overview

The ExperienceBundle metadata type provides a more granular way to deploy Experience Cloud site content and configuration. This approach offers several benefits over the traditional Network metadata approach:

- **Version control friendly**: Site pages, themes, and routes are stored as individual JSON files
- **Partial deployments**: Deploy specific pages or components without affecting the entire site
- **CI/CD integration**: Better support for automated deployment pipelines
- **Conflict resolution**: Easier to merge changes when multiple developers work on the same site

---

## Prerequisites

Before using ExperienceBundle deployment:

1. **Enable Enhanced Domains** (if not already enabled)
2. **Enable ExperienceBundle Metadata API** in your org
3. **API version 48.0 or higher** (this project uses API version 65.0)

---

## Step 1: Enable ExperienceBundle Metadata API in Salesforce

### Option A: Enable via Setup UI

1. Log in to your Salesforce org as a System Administrator
2. Go to **Setup** → **Digital Experiences** → **Settings**
3. Find the **Enable ExperienceBundle Metadata API** checkbox
4. Check the box and click **Save**

### Option B: Enable via Metadata API

Deploy the following `ExperienceCloudSettings` metadata:

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<ExperienceCloudSettings xmlns="http://soap.sforce.com/2006/04/metadata">
    <enableExperienceBundleMetadataApi>true</enableExperienceBundleMetadataApi>
</ExperienceCloudSettings>
```

You can also use `sf` CLI:

```bash
# Create a temporary directory for the settings
mkdir -p temp-metadata/main/default/settings

# Create the settings file
cat > temp-metadata/main/default/settings/ExperienceCloud.settings-meta.xml << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<ExperienceCloudSettings xmlns="http://soap.sforce.com/2006/04/metadata">
    <enableExperienceBundleMetadataApi>true</enableExperienceBundleMetadataApi>
</ExperienceCloudSettings>
EOF

# Deploy
sf project deploy start --source-dir temp-metadata --target-org YOUR_ORG_ALIAS

# Clean up
rm -rf temp-metadata
```

---

## Step 2: Verify Configuration

After enabling ExperienceBundle Metadata API:

1. Go to **Setup** → **Digital Experiences** → **All Sites**
2. Open Experience Builder for your site
3. The site should now support ExperienceBundle-based deployments

---

## Understanding the Metadata Structure

### Directory Layout

The ExperienceBundle metadata is organized in the following structure:

```
sfGpsDsCaOnShowcase/
└── main/
    └── default/
        ├── digitalExperienceConfigs/
        │   └── sfGpsDsCaOn1.digitalExperienceConfig-meta.xml
        ├── digitalExperiences/
        │   └── site/
        │       └── sfGpsDsCaOn1/
        │           ├── sfGpsDsCaOn1.digitalExperience-meta.xml
        │           ├── sfdc_cms__appPage/       # Application pages
        │           ├── sfdc_cms__route/         # URL routes
        │           ├── sfdc_cms__view/          # Page views/content
        │           ├── sfdc_cms__theme/         # Site theme
        │           ├── sfdc_cms__themeLayout/   # Theme layouts
        │           ├── sfdc_cms__brandingSet/   # Branding configuration
        │           ├── sfdc_cms__styles/        # CSS styles
        │           └── sfdc_cms__site/          # Site configuration
        ├── networks/
        │   └── sfGpsDsCaOn.network-meta.xml
        └── sites/
            └── sfGpsDsCaOn.site-meta.xml
```

### Key Files

| File                                 | Purpose                                                 |
| ------------------------------------ | ------------------------------------------------------- |
| `*.digitalExperienceConfig-meta.xml` | Maps site configuration to the digital experience space |
| `*.digitalExperience-meta.xml`       | Root metadata for the experience bundle                 |
| `sfdc_cms__view/*`                   | Individual page definitions (stored as JSON)            |
| `sfdc_cms__route/*`                  | URL routing configurations                              |
| `sfdc_cms__theme/*`                  | Theme settings and component placement                  |
| `sfdc_cms__themeLayout/*`            | Layout templates for headers, footers                   |

---

## Step 3: Deploy Using ExperienceBundle

### Deploy the Complete Package

Deploy both the component package and showcase site:

```bash
sf project deploy start \
  --source-dir sfGpsDs \
  --source-dir sfGpsDsCaOn \
  --source-dir sfGpsDsCaOnShowcase \
  --target-org YOUR_ORG_ALIAS \
  --wait 60
```

### Deploy Only the Site

If you've already deployed the components and only need to update the site:

```bash
sf project deploy start \
  --source-dir sfGpsDsCaOnShowcase \
  --target-org YOUR_ORG_ALIAS \
  --wait 60
```

### Deploy Specific Pages (Partial Deployment)

To deploy only specific pages without affecting the entire site:

```bash
sf project deploy start \
  --source-dir sfGpsDsCaOnShowcase/main/default/digitalExperiences/site/sfGpsDsCaOn1/sfdc_cms__view/home \
  --target-org YOUR_ORG_ALIAS \
  --wait 60
```

---

## Step 4: Retrieve ExperienceBundle from Org

To retrieve the current site configuration from your org:

```bash
sf project retrieve start \
  --metadata DigitalExperience:site/sfGpsDsCaOn1 \
  --target-org YOUR_ORG_ALIAS \
  --output-dir sfGpsDsCaOnShowcase
```

Or retrieve all digital experience metadata:

```bash
sf project retrieve start \
  --metadata DigitalExperience \
  --metadata DigitalExperienceConfig \
  --target-org YOUR_ORG_ALIAS \
  --output-dir sfGpsDsCaOnShowcase
```

---

## Network Configuration

The `network-meta.xml` file includes a key setting for ExperienceBundle:

```xml
<enableExperienceBundleBasedSnaOverrideEnabled
>true</enableExperienceBundleBasedSnaOverrideEnabled>
```

This setting enables ExperienceBundle-based Site Navigation and Audience (SNA) overrides, which is required for proper ExperienceBundle deployments.

---

## Troubleshooting

### Error: "ExperienceBundle metadata type is not enabled"

**Cause**: The ExperienceBundle Metadata API is not enabled in your org.

**Solution**: Follow Step 1 above to enable it via Setup or Metadata API.

### Error: "Cannot deploy DigitalExperience"

**Cause**: The digital experience metadata doesn't match the existing site configuration.

**Solutions**:

1. Retrieve the current site configuration first and merge your changes
2. Ensure the site exists before deploying the digital experience
3. Verify the `urlPathPrefix` matches in both the site and digitalExperienceConfig

### Error: "Space does not exist"

**Cause**: The `space` reference in `digitalExperienceConfig` points to a non-existent directory.

**Solution**: Ensure the directory path matches:

```xml
<space>site/sfGpsDsCaOn1</space>
```

Should match:

```
digitalExperiences/site/sfGpsDsCaOn1/
```

### Deployment Conflicts

When multiple developers work on the same site:

1. Always retrieve the latest site configuration before making changes
2. Use partial deployments for specific pages when possible
3. Communicate with team members about concurrent site changes
4. Consider using feature branches for significant site changes

---

## Best Practices

### 1. Version Control

- Commit ExperienceBundle files to version control
- Use meaningful commit messages for site changes
- Review page JSON changes carefully before merging

### 2. Development Workflow

```bash
# 1. Retrieve latest from sandbox
sf project retrieve start --metadata DigitalExperience:site/sfGpsDsCaOn1 --target-org sandbox

# 2. Make changes in Experience Builder or directly in JSON files

# 3. Deploy changes to your dev org for testing
sf project deploy start --source-dir sfGpsDsCaOnShowcase --target-org mydevorg

# 4. Once verified, deploy to sandbox/production
sf project deploy start --source-dir sfGpsDsCaOnShowcase --target-org sandbox
```

### 3. CI/CD Integration

Include ExperienceBundle deployment in your CI/CD pipeline:

```yaml
# Example GitHub Actions step
- name: Deploy Experience Site
  run: |
    sf project deploy start \
      --source-dir sfGpsDsCaOnShowcase \
      --target-org ${{ secrets.SF_ORG_ALIAS }} \
      --wait 60
```

---

## Related Documentation

- [BUILD_GUIDE.md](./BUILD_GUIDE.md) - Complete build and deploy instructions
- [POST_DEPLOYMENT.md](./POST_DEPLOYMENT.md) - Post-deployment configuration steps
- [LWR_GUIDE.md](./LWR_GUIDE.md) - LWR site configuration guide

---

## Version Information

| Setting                          | Value |
| -------------------------------- | ----- |
| Salesforce API Version           | 65.0  |
| Minimum API for ExperienceBundle | 48.0  |
| Recommended API                  | 58.0+ |
