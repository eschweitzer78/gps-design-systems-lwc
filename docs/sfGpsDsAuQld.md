# sfGpsDsAuQld — Queensland Government Design System

`sfGpsDsAuQld` is the Salesforce unlocked package in the `gps-design-systems-lwc` monorepo that implements the **Queensland Government Design System**. It depends on the core `sfGpsDs` package and provides 35+ LWC components that map to QLD Design System UI patterns.

The documentation site for the underlying design system is at `https://www.designsystem.qld.gov.au`.

## Package identity

| Field                  | Value                                                |
| ---------------------- | ---------------------------------------------------- |
| Salesforce API version | 65.0                                                 |
| Package name           | Salesforce Global Public Sector AU QLD Design System |
| Current version        | 1.3.4                                                |
| Dependencies           | sfGpsDs (core), omnistudio 258.4                     |
| License                | BSD 3-Clause                                         |
| Render mode            | Light DOM throughout (QLD DS CSS applies globally)   |

Related packages shipped from this folder:

| Package            | Purpose                             |
| ------------------ | ----------------------------------- |
| `sfGpsDsAuQld`     | Core package (unmanaged)            |
| `sfGpsDsAuQldFull` | Full managed package                |
| `sfGpsDsAuQldSr`   | OmniStudio Standard Runtime variant |

---

## Folder layout

```
sfGpsDsAuQld/
└── main/default/
    ├── cspTrustedSites/                   Content Security Policy trusted sites
    ├── lwc/                               Lightning Web Components
    │   ├── auth/                          Authentication components (Login, Register, etc.)
    │   ├── layouts/                       Page layout skeletons
    │   ├── mixins/                        Shared LWC animation mixin
    │   ├── omnistudio-managed-package-runtime-forms/  OmniStudio Managed Package form adapters
    │   ├── omnistudio-standard-runtime-forms/         OmniStudio Standard Runtime form adapters
    │   └── sfGpsDsAuQld*/                Design system components (see below)
    ├── messageChannels/                   Lightning message channels (e.g. main nav toggle)
    ├── permissionsets/                    Permission sets
    └── staticresources/                   Static assets (icons, images, fonts)
```

---

## LWC component groups

Component folders whose name begins with `sfGpsDsAuQld` each represent a QLD Design System pattern. Where a component exists in multiple runtime variants those variants share the same folder via a nested `lwc/` sub-folder; only the canonical (no suffix) component is described below unless the variant differs materially.

**Runtime suffixes:**

| Suffix       | Runtime                                                             |
| ------------ | ------------------------------------------------------------------- |
| _(none)_     | OmniStudio Standard Runtime                                         |
| `Os` / `OsN` | OmniStudio Managed Package Runtime (build-time generated or ad hoc) |
| `Comm`       | Experience Cloud (Community)                                        |
| `Lwr`        | Lightning Web Runtime                                               |

---

### Page structure components

#### sfGpsDsAuQldBodyLwr

A full-width page body container for LWR pages. Supports configurable colour styles and width modes.

| Property    | Description                                                                                     |
| ----------- | ----------------------------------------------------------------------------------------------- |
| `container` | Optional container CSS class                                                                    |
| `cstyle`    | Colour style: `default`, `light`, `alternate`, `dark`, or `dark-alternate` (default: `default`) |
| `width`     | Width mode: `full-width`, `half-width`, `custom-class`, or `none` (default: `full-width`)       |
| `className` | Additional CSS classes                                                                          |

---

#### sfGpsDsAuQldHeader

The full page header, combining a pre-header utility bar and the main header band with site branding, search, and mobile menu trigger.

| Property                  | Description                                                                     |
| ------------------------- | ------------------------------------------------------------------------------- |
| `siteLogo`                | Main site logo URL                                                              |
| `siteLogoAlt`             | Alt text for the site logo                                                      |
| `siteLogoSecondary`       | Secondary logo URL (desktop)                                                    |
| `siteLogoSecondaryMobile` | Secondary logo URL (mobile)                                                     |
| `title`                   | Site title                                                                      |
| `subtitle`                | Site sub-title or descriptor                                                    |
| `headerUrl`               | URL the logo/title links to                                                     |
| `headerStyle`             | Header colour style: `light`, `dark`, or `dark-alternate` (default: `light`)    |
| `searchLabel`             | Label for the search button                                                     |
| `searchFieldLabel`        | Label for the search input field                                                |
| `menuLabel`               | Label for the mobile menu button                                                |
| `contentId`               | ID of the main content element (for skip links)                                 |
| `mainNavId`               | ID of the associated main nav element                                           |
| `preHeaderLink`           | Pre-header utility link object                                                  |
| `preHeaderLogo`           | Pre-header logo URL                                                             |
| `preHeaderLogoAlt`        | Alt text for the pre-header logo                                                |
| `preHeaderStyle`          | Pre-header colour style: `light`, `dark`, or `dark-alternate` (default: `dark`) |
| `ctaOneLink`              | First call-to-action link object                                                |
| `ctaOneIcon`              | Icon for the first call-to-action                                               |
| `ctaTwoLink`              | Second call-to-action link object                                               |
| `ctaTwoIcon`              | Icon for the second call-to-action                                              |
| `profileLink`             | Profile/account link object                                                     |
| `profileIcon`             | Icon for the profile link                                                       |
| `authMode`                | Authentication mode: `hide`, `login-logout`, or `all` (default: `hide`)         |
| `className`               | Additional CSS classes                                                          |

Dispatches `search` with the query term string when the search form is submitted.

---

#### sfGpsDsAuQldBanner

A hero banner supporting multiple complexity levels from a simple heading to a full image/CTA composition.

| Property                       | Description                                                                                           |
| ------------------------------ | ----------------------------------------------------------------------------------------------------- |
| `mode`                         | Banner complexity: `default`, `basic`, `intermediate`, or `advanced` (default: `default`)             |
| `headingPrimary`               | Primary heading text                                                                                  |
| `headingSecondary`             | Secondary or sub-heading text                                                                         |
| `headingBackgroundDisplay`     | Adds a background behind the heading text (default: `false`)                                          |
| `heroImage`                    | Hero image URL                                                                                        |
| `heroImageResponsiveTreatment` | How the hero image scales: `crop` or `scale` (default: `crop`)                                        |
| `heroImageAlignment`           | Image alignment context: `grid` or `page` (default: `grid`)                                           |
| `heroImagePadding`             | Adds padding around the hero image (default: `false`)                                                 |
| `backgroundType`               | Background treatment: `solid`, `image`, or `texture` (default: `solid`)                               |
| `backgroundColour`             | Background colour: `default`, `light`, `alternate`, `dark`, or `dark-alternate`                       |
| `backgroundImageSm`            | Background image URL for small viewports                                                              |
| `backgroundImageLg`            | Background image URL for large viewports                                                              |
| `backgroundImageAlt`           | Alt text for the background image                                                                     |
| `backgroundImageAlignment`     | CSS `object-position` value for the background image                                                  |
| `backgroundMinHeight`          | Minimum height CSS value for the banner                                                               |
| `ctaType`                      | Call-to-action layout: `none`, `buttons`, `icon-tiles`, or `link-list` (default: `buttons`)           |
| `buttonPrimary`                | Primary button object: `{ url, text }`                                                                |
| `buttonSecondary`              | Secondary button object: `{ url, text }`                                                              |
| `linkList`                     | Array of link list items (used when `ctaType="link-list"`)                                            |
| `iconTiles`                    | Array of icon tile objects (used when `ctaType="icon-tiles"`)                                         |
| `iconTilesLabel`               | Heading label for the icon tiles area                                                                 |
| `iconTileBackground`           | Icon tile colour background: `default`, `alternate`, `dark`, or `dark-alternate` (default: `default`) |
| `breadcrumbsItems`             | Array of breadcrumb items to render inside the banner                                                 |
| `className`                    | Additional CSS classes                                                                                |

---

#### sfGpsDsAuQldFooter

The site footer with navigation, social media links, acknowledgement of country, logo, and copyright.

| Property                  | Description                                                          |
| ------------------------- | -------------------------------------------------------------------- |
| `title`                   | Footer site title                                                    |
| `navHeading`              | Heading for the navigation section                                   |
| `linksHeading`            | Heading for the utility links section                                |
| `socialHeading`           | Heading for the social media section                                 |
| `facebookUrl`             | Facebook profile URL                                                 |
| `linkedInUrl`             | LinkedIn profile URL                                                 |
| `youTubeUrl`              | YouTube channel URL                                                  |
| `instagramUrl`            | Instagram profile URL                                                |
| `twitterXUrl`             | Twitter / X profile URL                                              |
| `acknowledgementsHeading` | Heading for the acknowledgement section                              |
| `acknowledgements`        | Acknowledgement of country text                                      |
| `logo`                    | Footer logo URL                                                      |
| `logoUrl`                 | URL the footer logo links to                                         |
| `logoAlt`                 | Alt text for the footer logo                                         |
| `copyrightLinkText`       | Copyright link label                                                 |
| `copyrightLinkUrl`        | Copyright link URL                                                   |
| `cstyle`                  | Colour style: `light`, `dark`, or `dark-alternate` (default: `dark`) |
| `className`               | Additional CSS classes                                               |

---

### Navigation components

#### sfGpsDsAuQldMainNav

The primary responsive navigation drawer, supporting mega-menu mode and an optional pre-header actions area.

| Property         | Description                                                                                    |
| ---------------- | ---------------------------------------------------------------------------------------------- |
| `navItems`       | Nested array of navigation item objects                                                        |
| `homeUrl`        | URL for the home link                                                                          |
| `homeShow`       | Shows the home link (default: `true`)                                                          |
| `isActive`       | Whether the mobile nav drawer is open                                                          |
| `mainNavId`      | DOM ID used for ARIA coordination with the header (default: `"mainmenu"`)                      |
| `megaMenu`       | Enables mega-menu layout for sub-navigation (default: `false`)                                 |
| `cstyle`         | Navigation colour style: `light` or `dark` (default: `dark`)                                   |
| `preHeaderStyle` | Pre-header colour style: `light`, `dark`, or `dark-alternate` (default: `light`)               |
| `descLevel`      | Shows item descriptions up to a given level: `none`, `level 1`, or `level 2` (default: `none`) |
| `ctaOneLink`     | First call-to-action link object                                                               |
| `ctaOneIcon`     | Icon for the first call-to-action                                                              |
| `ctaTwoLink`     | Second call-to-action link object                                                              |
| `ctaTwoIcon`     | Icon for the second call-to-action                                                             |
| `profileLink`    | Profile link object                                                                            |
| `profileIcon`    | Icon for the profile link                                                                      |
| `authMode`       | Authentication mode: `hide`, `login-logout`, or `all` (default: `hide`)                        |

Exposes a `close()` imperative method. Dispatches `navigate` with the clicked item index and `closemenu` when the drawer should close.

---

#### sfGpsDsAuQldBreadcrumbs

A breadcrumb trail with automatic overflow detection and collapsing of middle items on narrow viewports.

| Property    | Description                                                                       |
| ----------- | --------------------------------------------------------------------------------- |
| `items`     | Array of breadcrumb link objects: `{ url, text }`                                 |
| `label`     | ARIA label for the `<nav>` element (default: `"breadcrumbs"`)                     |
| `mode`      | Responsive mode: `default`, `desktop`, `mobile`, or `tablet` (default: `default`) |
| `className` | Additional CSS classes                                                            |

---

#### sfGpsDsAuQldSideNav

A hierarchical sidebar navigation tree for section-level navigation.

| Property    | Description                             |
| ----------- | --------------------------------------- |
| `navItems`  | Nested array of navigation item objects |
| `title`     | Navigation section heading              |
| `url`       | URL for the section heading link        |
| `className` | Additional CSS classes                  |

Dispatches `navigate` with the clicked item index.

---

#### sfGpsDsAuQldVerticalNav

A vertical navigation list with expand/collapse support for nested items.

| Property    | Description                             |
| ----------- | --------------------------------------- |
| `navItems`  | Nested array of navigation item objects |
| `className` | Additional CSS classes                  |

Dispatches `navigate` with the clicked item index.

---

#### sfGpsDsAuQldInPageNav

A "On this page" jump-link list for intra-page navigation.

| Property    | Description                                   |
| ----------- | --------------------------------------------- |
| `title`     | Section heading                               |
| `items`     | Array of anchor items: `{ index, text, url }` |
| `className` | Additional CSS classes                        |

---

#### sfGpsDsAuQldCta

A directional call-to-action link.

| Property    | Description                                            |
| ----------- | ------------------------------------------------------ |
| `label`     | Link label                                             |
| `url`       | Link URL                                               |
| `mode`      | CTA mode: `default` or `view-all` (default: `default`) |
| `className` | Additional CSS classes                                 |

---

#### sfGpsDsAuQldDirectionLink

A link with a directional arrow icon.

| Property    | Description                                                          |
| ----------- | -------------------------------------------------------------------- |
| `label`     | Link label                                                           |
| `url`       | Link URL                                                             |
| `direction` | Arrow direction: `down`, `left`, `right`, or `up` (default: `right`) |
| `className` | Additional CSS classes                                               |

---

### Interactive UI components

#### sfGpsDsAuQldButton

A button or anchor link with icon support and multiple visual variants.

| Property         | Description                                                              |
| ---------------- | ------------------------------------------------------------------------ |
| `label`          | Button text                                                              |
| `url`            | URL for link variant (default: `""`)                                     |
| `el`             | Element type: `a` or `button` (default: `button`)                        |
| `variant`        | Visual style: `primary`, `secondary`, or `tertiary` (default: `primary`) |
| `iconName`       | Optional icon name                                                       |
| `iconPosition`   | Icon placement: `lead` or `trail` (default: `lead`)                      |
| `disabled`       | Disables the button (default: `false`)                                   |
| `preventDefault` | Suppresses default link navigation                                       |
| `className`      | Additional CSS classes                                                   |

Exposes `focus()` imperative method. Dispatches `buttonclick` with `{ label, url, el }`.

---

#### sfGpsDsAuQldAccordion

A collapsible accordion group with optional numbered items and programmatic expand/collapse control.

| Property       | Description                                        |
| -------------- | -------------------------------------------------- |
| `headingLevel` | Heading level for accordion item titles            |
| `cstyle`       | Colour style: `light` or `dark` (default: `light`) |
| `className`    | Additional CSS classes                             |
| `allExpanded`  | _(readonly)_ `true` when all items are expanded    |
| `allCollapsed` | _(readonly)_ `true` when all items are collapsed   |

Exposes `toggleAll()` and `toggleItemByIndex(index)` imperative methods. Dispatches `toggleall` with `"open"` or `"close"` and `toggleitem` with `{ index, action }`.

---

#### sfGpsDsAuQldAccordionItem

An individual accordion panel, intended for use inside `sfGpsDsAuQldAccordion`.

| Property       | Description                                     |
| -------------- | ----------------------------------------------- |
| `title`        | Item heading text                               |
| `content`      | Item body markup                                |
| `headingLevel` | Heading level (default: `3`)                    |
| `active`       | Whether the item is expanded (default: `false`) |
| `index`        | Item index within its parent accordion          |
| `className`    | Additional CSS classes                          |

Dispatches `toggle` with `{ index, active }`.

---

#### sfGpsDsAuQldTabs

A tabbed-panel interface. Extends the `sfGpsDsTabSetLwr` base class with QLD-specific CSS (`qld__tab-container`, `qld__tab-container__fixed`).

Inherits all properties from `sfGpsDsTabSetLwr` in the core `sfGpsDs` package.

---

#### sfGpsDsAuQldPagination

A pagination control for navigating multi-page content.

| Property     | Description                                                     |
| ------------ | --------------------------------------------------------------- |
| `lastPage`   | Total number of pages                                           |
| `activePage` | Currently active page number                                    |
| `ariaLabel`  | ARIA label for the pagination `<nav>` (default: `"Pagination"`) |
| `className`  | Additional CSS classes                                          |

Dispatches `pagechange` with the selected page number.

---

#### sfGpsDsAuQldTags

A tag/filter chip group supporting multiple interaction modes.

| Property    | Description                                                                     |
| ----------- | ------------------------------------------------------------------------------- |
| `tags`      | Array of tag strings or tag objects: `{ text, url?, closed?, className? }`      |
| `mode`      | Interaction mode: `action`, `default`, `filter`, or `info` (default: `default`) |
| `size`      | Tag size: `default` or `large` (default: `default`)                             |
| `className` | Additional CSS classes                                                          |

Dispatches `clear` with `{ index, closed }` when a tag is removed, and `clearall` when all tags are cleared.

---

#### sfGpsDsAuQldLoadingSpinner

A QLD-styled loading/busy spinner.

| Property    | Description                                                            |
| ----------- | ---------------------------------------------------------------------- |
| `label`     | Accessible label (default: `"Loading..."`)                             |
| `mode`      | Visual mode: `default`, `landscape`, or `minimal` (default: `default`) |
| `className` | Additional CSS classes                                                 |

---

### Content display components

#### sfGpsDsAuQldCard

A content card supporting icon, image, and plain layout types.

| Property        | Description                                                     |
| --------------- | --------------------------------------------------------------- |
| `type`          | Card layout: `default`, `icon`, or `image` (default: `default`) |
| `nameText`      | Card title text                                                 |
| `nameUrl`       | URL the card title links to                                     |
| `icon`          | Icon name for icon-type cards                                   |
| `iconAlign`     | Icon alignment: `left` or `top` (default: `top`)                |
| `thumbnail`     | Thumbnail image URL for image-type cards                        |
| `tags`          | Array of tag strings                                            |
| `tagsMode`      | Display mode for tags                                           |
| `actions`       | Array of action link objects                                    |
| `headingLevel`  | Heading element level: `h2`–`h6` (default: `h3`)                |
| `displayArrow`  | Shows a directional arrow on the card                           |
| `displayFooter` | Shows the card footer area (default: `false`)                   |
| `className`     | Additional CSS classes                                          |

---

#### sfGpsDsAuQldCallout

A styled highlight callout box with an optional heading.

| Property        | Description                                                        |
| --------------- | ------------------------------------------------------------------ |
| `heading`       | Callout heading text                                               |
| `level`         | Heading level 1–6 (default: `3`)                                   |
| `type`          | Callout type: `default` or `calendar-event` (default: `default`)   |
| `headingSrOnly` | Visually hides the heading (screen-reader only) (default: `false`) |
| `className`     | Additional CSS classes                                             |

---

#### sfGpsDsAuQldGlobalAlert

A site-wide alert banner with optional link and dismiss action.

| Property             | Description                                                                                                 |
| -------------------- | ----------------------------------------------------------------------------------------------------------- |
| `alertId`            | Unique identifier for the alert                                                                             |
| `title`              | Alert heading                                                                                               |
| `content`            | Alert body text                                                                                             |
| `linkText`           | Label for the alert call-to-action link                                                                     |
| `linkUrl`            | URL for the call-to-action link                                                                             |
| `linkPreventDefault` | Suppresses default link navigation (default: `false`)                                                       |
| `level`              | Alert severity: `alert`, `critical`, `warning`, `default`, `information`, or `general` (default: `warning`) |
| `dismissible`        | Shows a dismiss button (default: `true`)                                                                    |
| `className`          | Additional CSS classes                                                                                      |

Dispatches `linkclick` when the CTA link is clicked and `close` when the alert is dismissed.

---

#### sfGpsDsAuQldInPageAlert

An inline contextual alert for form feedback or page-level messaging.

| Property    | Description                                                            |
| ----------- | ---------------------------------------------------------------------- |
| `heading`   | Alert heading                                                          |
| `type`      | Alert type: `error`, `info`, `success`, or `warning` (default: `info`) |
| `className` | Additional CSS classes                                                 |

---

#### sfGpsDsAuQldQuote

A styled blockquote with optional author attribution and source link.

| Property     | Description                    |
| ------------ | ------------------------------ |
| `authorName` | Name of the quoted person      |
| `sourceUrl`  | URL for the source attribution |
| `className`  | Additional CSS classes         |

---

#### sfGpsDsAuQldLinkList

A configurable link collection supporting single-column and multi-column grid layouts with an optional call-to-action.

| Property          | Description                                                                    |
| ----------------- | ------------------------------------------------------------------------------ |
| `title`           | Section heading                                                                |
| `links`           | Array of link objects: `{ url, text, icon? }`                                  |
| `cvaUrl`          | Call-to-action URL                                                             |
| `cvaText`         | Call-to-action label                                                           |
| `listMode`        | Layout mode: `list`, `1 column`, `2 columns`, or `3 columns` (default: `list`) |
| `titleClassName`  | CSS classes for the heading                                                    |
| `linkClassName`   | CSS classes for each link item                                                 |
| `anchorClassName` | CSS classes for each anchor element                                            |
| `iconClassName`   | CSS classes for each icon                                                      |
| `className`       | Additional CSS classes                                                         |

---

#### sfGpsDsAuQldHorizontalRule

A styled horizontal divider.

| Property    | Description                                                      |
| ----------- | ---------------------------------------------------------------- |
| `size`      | Divider weight: `small`, `medium`, or `large` (default: `small`) |
| `className` | Additional CSS classes                                           |

---

#### sfGpsDsAuQldUpdatedDate

Displays a "last updated" date stamp.

| Property    | Description                                            |
| ----------- | ------------------------------------------------------ |
| `date`      | Date value (Date instance, string, or ISO 8601 string) |
| `className` | Additional CSS classes                                 |

---

#### sfGpsDsAuQldVideoPlayer

An embedded video player for YouTube or Vimeo with optional transcript and download link.

| Property         | Description                                                                                             |
| ---------------- | ------------------------------------------------------------------------------------------------------- |
| `videoType`      | Video platform: `youtube` or `vimeo` (default: `youtube`)                                               |
| `videoId`        | Video ID on the platform                                                                                |
| `caption`        | Caption text below the player                                                                           |
| `duration`       | Video duration string                                                                                   |
| `transcriptLink` | URL or anchor for a linked transcript                                                                   |
| `transcript`     | Inline transcript text (shown in an expandable panel)                                                   |
| `layout`         | Player layout: `stack`, `stack centered`, `two-column top`, or `two-column centered` (default: `stack`) |
| `size`           | Player width: `default` or `75%` (default: `default`)                                                   |
| `cstyle`         | Colour style: `default`, `light`, `alternate`, `dark`, or `dark-alternate` (default: `default`)         |
| `className`      | Additional CSS classes                                                                                  |

---

#### sfGpsDsAuQldPromoPanel (Comm)

A promotional panel with configurable background colour, optional image, and link/button call-to-action types. Only available as an Experience Cloud variant.

| Property           | Description                                                                      |
| ------------------ | -------------------------------------------------------------------------------- |
| `type`             | Panel layout: `large-text`, `contained`, or `full-image` (default: `large-text`) |
| `title`            | Panel heading                                                                    |
| `abstract`         | Summary text                                                                     |
| `icon`             | Icon name                                                                        |
| `content`          | Body content (markdown)                                                          |
| `image`            | Panel image URL                                                                  |
| `imageAlignment`   | Image side: `left` or `right` (default: `left`)                                  |
| `backgroundColour` | Background: `light`, `alternate`, `dark`, or `dark-alternate` (default: `light`) |
| `linkType`         | Call-to-action style: `none`, `button`, or `cta` (default: `none`)               |
| `cta`              | CTA as a markdown link string                                                    |
| `buttonPrimary`    | Primary button as a markdown link string                                         |
| `buttonSecondary`  | Secondary button as a markdown link string                                       |
| `className`        | Additional CSS classes                                                           |

---

#### sfGpsDsAuQldMarkdownElementComm

Renders CommonMark markdown to sanitised HTML inside Experience Cloud pages.

| Property    | Description               |
| ----------- | ------------------------- |
| `content`   | Markdown string to render |
| `className` | Additional CSS classes    |

---

#### sfGpsDsAuQldMarkupElementComm

Renders sanitised raw HTML markup directly into Experience Cloud pages.

| Property    | Description               |
| ----------- | ------------------------- |
| `markup`    | Raw HTML string to render |
| `className` | Additional CSS classes    |

---

#### sfGpsDsAuQldBackToTopComm

A "Back to top" scroll shortcut for Experience Cloud pages.

| Property    | Description                    |
| ----------- | ------------------------------ |
| `label`     | Link label                     |
| `targetId`  | ID of the element to scroll to |
| `className` | Additional CSS classes         |

---

### Layout components

#### sfGpsDsAuQldCardListLwr

A grid layout wrapper for card lists in LWR pages (part of the `sfGpsDsAuQldCard` component group).

No public properties beyond slot content.

---

#### Layout skeletons (`layouts/`)

The `layouts/` sub-folder provides LWR page skeleton components for use in Lightning App Builder or as theme layouts. They have no significant public properties — their purpose is to wire up standard slot areas (header, footer, main, left nav) and apply the correct QLD DS body classes.

| Component                              | Purpose                                                                   |
| -------------------------------------- | ------------------------------------------------------------------------- |
| `sfGpsDsAuQldDefaultPageLayoutLwr`     | Default page layout wrapper                                               |
| `sfGpsDsAuQldThemeLayoutLwr`           | Main theme layout with header and footer slots                            |
| `sfGpsDsAuQldLeftNavThemeLayoutLwr`    | Theme layout with a left-navigation panel                                 |
| `sfGpsDsAuQldNoContentIdPageLayoutLwr` | Variant without a content ID anchor (for pages without skip-link targets) |
| `sfGpsDsAuQldAppExampleThemeLayoutLwr` | Example layout for App Builder previews                                   |

---

## Apex classes

None. `sfGpsDsAuQld` is a purely LWC-based package with no server-side Apex.

---

## Multi-runtime architecture

The QLD package follows the same multi-runtime convention as the rest of the monorepo. Most components use Light DOM (`renderMode: 'light'`) so QLD Design System global CSS applies without Shadow DOM piercing. OmniStudio form adapters are provided in two variants:

- `omnistudio-managed-package-runtime-forms/` — Managed Package Runtime (30+ form components)
- `omnistudio-standard-runtime-forms/` — Standard Runtime (30+ form components)

A Lightning message channel is used for cross-component communication (e.g. the header broadcasting main nav open/close state to the nav drawer).

---

## Mixins and utilities

### sfGpsDsAuQldAnimateMixin

An interval-based animation mixin (60 FPS capped) used internally for smooth open/close transitions in navigation and accordion components. Key methods:

| Method                                                 | Description                                                                                                |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| `run(options)`                                         | Animates a CSS property (`height`, `width`, etc.) from its current value to `endSize` at the given `speed` |
| `toggle(options)`                                      | Toggles an element between open and closed sizes with pre/post callbacks                                   |
| `stop(element)`                                        | Cancels any running animation on the element                                                               |
| `calculateAnimationSpecs(initialSize, endSize, speed)` | Computes step size and interval duration for a given animation                                             |
| `calculateAuto(element, dimension)`                    | Resolves an `auto` dimension to a concrete pixel value                                                     |

---

## Key design decisions

- **Colour style system** — Many components expose a `cstyle` property (`light`, `dark`, `dark-alternate`, etc.) that maps directly to QLD DS CSS modifier classes, allowing the same component to be used in both light and dark page sections without duplication.
- **Banner complexity tiers** — `sfGpsDsAuQldBanner` supports four `mode` values (`default`, `basic`, `intermediate`, `advanced`), progressively unlocking image, CTA, and icon-tile features without requiring separate components.
- **Header/nav coordination via message channel** — The header and main nav are separate components that communicate via a Lightning message channel, enabling them to be placed independently on a page while still coordinating open/close state.
- **Animation mixin over CSS transitions** — `sfGpsDsAuQldAnimateMixin` provides JavaScript-driven animations for components where CSS transitions alone cannot handle dynamic `height: auto` targets (e.g. accordion, mobile nav).
- **No Apex** — All data-driven features (navigation, content) are handled at the LWC layer, either through passed-in properties or OmniStudio Integration Procedures via the base `sfGpsDs` package.
- **TypeScript throughout** — Core components are authored in TypeScript with shared type definitions in the base `sfGpsDs` typings folder.
