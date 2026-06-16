# sfGpsDsAuNsw — NSW Design System Package

`sfGpsDsAuNsw` is a Salesforce unlocked package that implements the **New South Wales Government Design System** (NSW DS) as Lightning Web Components for use in Salesforce Experience Cloud and Communities. It depends on the shared base package `sfGpsDs` and on Salesforce OmniStudio.

Documentation site: https://nsw.dsforce.dev

---

## Package identity

| Field               | Value                                                                                                   |
| ------------------- | ------------------------------------------------------------------------------------------------------- |
| Design system       | NSW Government Design System                                                                            |
| Runtime targets     | Experience Cloud LWR, Aura communities, Omnistudio Managed Package Runtime, Omnistudio Standard Runtime |
| Recommended runtime | OmniStudio Managed Package Runtime                                                                      |
| Base dependency     | `sfGpsDs` (core shared library)                                                                         |
| License             | BSD 3-Clause                                                                                            |

---

## Folder layout

```
sfGpsDsAuNsw/
└── main/default/
    ├── aura/                                    Aura components (header, theme layout)
    ├── brandingSets/                            Design tokens and colour definitions
    ├── classes/                                 Apex classes
    ├── communities/                             Community template and theme definitions
    ├── contentassets/                           CMS content assets
    ├── customMetadata/                          Custom metadata records
    ├── experiences/                             Pre-built flex pages (23+)
    ├── labels/                                  Custom labels
    ├── lwc/                                     Lightning Web Components (see below)
    │   ├── auth/                                Authentication form components
    │   ├── layout/                              LWR layout components
    │   ├── omnistudio-managed-package-runtime-forms/   OmniStudio MP form wrappers
    │   ├── omnistudio-standard-runtime-forms/          OmniStudio SR form wrappers
    │   ├── sfGpsDsAuNsw*/                       Core UI components (see sections below)
    │   └── sfGpsDsCore/                         Internal shared utilities
    ├── managedContentTypes/                     CMS content type schemas (Card, CardV2, ContentBlock)
    ├── navigationMenus/                         Navigation menu definitions
    ├── omniDataTransform/                       OmniStudio data transforms (CMS → LWC)
    ├── omniIntegrationProcedure/                OmniStudio integration procedures
    ├── permissionsets/                          Permission set (sfGpsDsAuNswUser)
    ├── scss/                                    SCSS source files (compiled to static resources)
    ├── siteDotComSites/                         Experience Cloud site definitions
    └── staticresources/                         Compiled CSS and theme assets
```

---

## Multi-runtime architecture

Every UI component ships in multiple variants to support the three Salesforce deployment contexts used across the NSW DS implementation:

| Suffix   | Context                                                   | Notes                                                                       |
| -------- | --------------------------------------------------------- | --------------------------------------------------------------------------- |
| _(none)_ | Standard LWC / Experience Cloud                           | Base component, no OmniStudio dependency                                    |
| `Comm`   | Experience Builder drag-and-drop                          | Adds `@api` properties for the page editor                                  |
| `Os`     | OmniStudio Managed Packae Runtime, build-time generated   | Used inside OmniStudio FlexCards and OmniScripts on Managed Package Runtime |
| `OsN`    | OmniStudio Managed Package Runtime, ad hoc implementation | Used inside OmniStudio FlexCards and OmniScripts on Managed Package Runtime |
| `Lwr`    | Lightning Web Runtime                                     | Layout and structural components for LWR-based sites only                   |

Components requiring OmniStudio form integration have additional `CommOs` / `CommOsN` variants combining the Community Builder and OmniStudio runtime concerns.

---

## UI components

### Accordion

Collapsible content sections for grouping related information.

| Property    | Description                                 |
| ----------- | ------------------------------------------- |
| `index`     | Identifier for this accordion item          |
| `header`    | Heading text (markdown supported)           |
| `closed`    | Whether the section is collapsed by default |
| `className` | Additional CSS classes                      |

Dispatches `expand` and `collapse` events.

---

### Alert

In-page status notification banner.

| Property    | Description                                     |
| ----------- | ----------------------------------------------- |
| `title`     | Alert heading                                   |
| `as`        | Severity: `info`, `warning`, `error`, `success` |
| `compact`   | Reduced-height variant                          |
| `className` | Additional CSS classes                          |

---

### Back to Top

Floating button that scrolls the user back to the top of the page. Appears after a configurable scroll offset is exceeded. Uses a debounced scroll listener (250 ms).

| Property       | Description                                       |
| -------------- | ------------------------------------------------- |
| `scrollOffset` | Pixel threshold before the button becomes visible |
| `className`    | Additional CSS classes                            |

---

### Breadcrumbs

Horizontal navigation trail showing the current page's position in the site hierarchy.

| Property             | Description                            |
| -------------------- | -------------------------------------- |
| `label`              | ARIA label for the nav element         |
| `items`              | Array of `{ label, url }` link objects |
| `containerClassName` | CSS classes on the outer container     |
| `className`          | CSS classes on the inner list          |

Includes a show-more toggle for mobile-optimised display.

---

### Button

The primary interactive element across the design system.

| Property          | Description                                                                                                     |
| ----------------- | --------------------------------------------------------------------------------------------------------------- |
| `label`           | Button text                                                                                                     |
| `cstyle`          | Visual style: `dark`, `dark-outline`, `dark-outline-solid`, `light`, `light-outline`, `white`, `danger`, `info` |
| `rendering`       | `button` (default) or `a` (renders as anchor)                                                                   |
| `link` / `target` | URL and link target when `rendering="a"`                                                                        |
| `type`            | HTML button type (`button`, `submit`, `reset`)                                                                  |
| `iconName`        | Optional icon                                                                                                   |
| `iconStyle`       | Icon placement: `none`, `before`, `after`                                                                       |
| `disabled`        | Disabled state                                                                                                  |
| `mobileFullWidth` | Stretches to full width on small screens                                                                        |

---

### Button Menu

A trigger button that opens a dropdown action menu.

| Property          | Description                                                 |
| ----------------- | ----------------------------------------------------------- |
| `label`           | Optional text label displayed on the trigger button         |
| `iconName`        | Optional icon displayed on the trigger button               |
| `buttonAriaLabel` | ARIA label for the trigger button (default: `"Open menu"`)  |
| `variant`         | Padding variant: `padded` (default), `unpadded`             |
| `menuPosition`    | Dropdown alignment: `left` (default), `right`               |
| `items`           | Array of `{ text, url }` link objects shown in the dropdown |
| `preventDefault`  | Prevents default navigation when an item is clicked         |
| `className`       | Additional CSS classes                                      |

Exposes `open()`, `close()`, `toggle()`, `focus()`, and `blur()` imperative methods. Dispatches `itemselected` with the clicked item index. Closes automatically on click-outside.

---

### Callout

A highlighted content block used to draw attention to important information.

| Property     | Description                                                      |
| ------------ | ---------------------------------------------------------------- |
| `title`      | Callout heading                                                  |
| `level`      | Heading element level: `h1`–`h6` (default `h4`)                  |
| `firstChild` | Renders without top padding when nested inside another component |
| `className`  | Additional CSS classes                                           |

---

### Card

Content card for presenting individual items or collections. Available in two generations:

- **Card (v1)** — original layout
- **CardV2** — revised layout with updated spacing and structure

Each generation ships with standard, `Comm`, `Os`, and `OsN` variants. CMS-backed variants are supported via OmniStudio Integration Procedures and Data Transforms that map Salesforce CMS content to card properties.

**CardV2 properties:**

| Property             | Description                                                           |
| -------------------- | --------------------------------------------------------------------- |
| `title`              | Card heading                                                          |
| `link`               | URL the card navigates to when clicked                                |
| `tag`                | Optional category tag text                                            |
| `image` / `imageAlt` | Optional image URL and alt text                                       |
| `cstyle`             | Colour style: `white` (default), `dark`, `light`                      |
| `orientation`        | Layout direction: `vertical` (default), `horizontal`                  |
| `headline`           | Renders the card in headline style                                    |
| `border`             | Adds a visible card border                                            |
| `highlight`          | Applies highlight styling                                             |
| `date`               | Publication date (ISO 8601 string or `Date` object)                   |
| `dateStyle`          | Date format: `full`, `long`, `medium` (default), `short`              |
| `preventDefault`     | Prevents default link navigation; dispatches `navigate` event instead |
| `className`          | Additional CSS classes                                                |

**CardCollectionComm properties** (CMS-backed collection variant):

| Property                                                  | Description                                                |
| --------------------------------------------------------- | ---------------------------------------------------------- |
| `cstyle`                                                  | Card colour style passed to each card                      |
| `headline`                                                | Headline style passed to each card                         |
| `orientation`                                             | Layout orientation passed to each card                     |
| `displayDate`                                             | Whether to display publication dates                       |
| `dateStyle`                                               | Date format for all cards                                  |
| `xsWidth` / `smWidth` / `mdWidth` / `lgWidth` / `xlWidth` | Bootstrap-style column widths (1–12) per breakpoint        |
| `ipName`                                                  | OmniStudio Integration Procedure name to call for CMS data |
| `inputJSON`                                               | JSON input to the Integration Procedure                    |
| `optionsJSON`                                             | Options JSON for the Integration Procedure                 |
| `className`                                               | Additional CSS classes                                     |

---

### Card Carousel

A horizontally scrollable container for a collection of cards with previous/next controls and dot navigation.

| Property               | Description                                                  |
| ---------------------- | ------------------------------------------------------------ |
| `title`                | Carousel heading (used as accessible label)                  |
| `accessibilityLabel`   | Additional accessible description (`data-description`)       |
| `items`                | Array of card data objects to display                        |
| `navigation`           | Shows previous/next arrow controls (default: `true`)         |
| `navigationPagination` | Renders dot navigation as numbered pagination                |
| `loop`                 | Enables infinite loop (only active when `navigation` is off) |
| `counter`              | Shows a current/total item counter                           |
| `drag`                 | Enables touch/mouse drag-to-scroll                           |
| `overflowItems`        | Allows items to overflow the visible area                    |
| `justifyContent`       | Centres items when fewer items than visible slots exist      |
| `className`            | Additional CSS classes                                       |

---

### Content Block

A flexible content section combining a title, optional image or icon, body copy, and one or more links.

| Property             | Description                     |
| -------------------- | ------------------------------- |
| `title`              | Section heading                 |
| `image` / `imageAlt` | Optional image URL and alt text |
| `icon`               | Optional icon name              |
| `mainLink`           | Primary CTA link                |
| `links`              | Array of secondary link objects |
| `className`          | Additional CSS classes          |

CMS-backed via OmniStudio, like Card.

---

### Cookie Consent

Privacy consent banner for cookie acceptance flows. Renders a banner and an optional preferences dialog.

| Property                                                  | Description                                                                    |
| --------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `title`                                                   | Banner heading (default: `"Cookie use on our website"`)                        |
| `acceptAllBtn`                                            | Label for the accept-all button                                                |
| `acceptNecessaryBtn`                                      | Label for the necessary-only button                                            |
| `showPreferencesBtn`                                      | Label for the manage-preferences button                                        |
| `dialogTitle`                                             | Heading of the preferences dialog                                              |
| `dialogAcceptAllBtn`                                      | Accept-all button label inside the dialog                                      |
| `dialogAcceptNecessaryBtn`                                | Necessary-only button label inside the dialog                                  |
| `dialogSavePreferencesBtn`                                | Save-selection button label inside the dialog                                  |
| `dialogTab1Title` / `dialogTab2Title` / `dialogTab3Title` | Tab headings inside the preferences dialog                                     |
| `sections`                                                | Array of `{ linkedCategory, label, description, checked }` preference sections |
| `isBannerRendered`                                        | Controls banner visibility (default: `true`)                                   |
| `isDialogRendered`                                        | Controls dialog visibility (default: `true`)                                   |
| `isLoading`                                               | Shows a loading state inside the dialog                                        |
| `isEmpty`                                                 | Shows an empty state inside the dialog                                         |
| `isConfirmed`                                             | Suppresses the confirmation message if `true`                                  |
| `className`                                               | Additional CSS classes                                                         |

Dispatches `confirm` with `{ role, sections }` detail when any consent action is taken. Exposes `showBanner()` and `showDialog()` imperative methods.

---

### Dialog

A modal overlay for confirmations, alerts, and contextual prompts.

| Property                                    | Description                                     |
| ------------------------------------------- | ----------------------------------------------- |
| `title`                                     | Dialog heading                                  |
| `bstyle`                                    | Visual variant: `dark`, `danger`                |
| `isOpen`                                    | Controls visibility                             |
| `isDismissible`                             | Shows a close button                            |
| `primaryButtonText` / `secondaryButtonText` | Action button labels                            |
| `hasCustomFooter`                           | Exposes a footer slot for custom button layouts |

Dispatches `primaryclick`, `secondaryclick`, and `close` events.

---

### Global Alert

A full-width banner displayed above the main content area for site-wide notifications.

| Property              | Description                                    |
| --------------------- | ---------------------------------------------- |
| `title`               | Alert heading                                  |
| `copy`                | Body text                                      |
| `as`                  | Visual variant: `default`, `light`, `critical` |
| `ctaText` / `ctaHref` | Call-to-action label and URL                   |
| `ctaStyle`            | CTA rendered as `link` or `button`             |

---

### Hero Banner

A large-format page header section with a background image and a call-to-action.

**Standard variant properties:**

| Property              | Description                                                   |
| --------------------- | ------------------------------------------------------------- |
| `title`               | Banner heading                                                |
| `subtitle`            | Optional sub-heading                                          |
| `cta`                 | Call-to-action link object (`{ text, url }`)                  |
| `image`               | Banner image object (`{ src, alt }`)                          |
| `cstyle`              | Colour style: `dark` (default), `light`, `off-white`, `white` |
| `wide`                | Applies wider layout                                          |
| `featured`            | Applies featured/highlighted styling                          |
| `lines`               | Shows decorative line elements                                |
| `links`               | Array of secondary link objects                               |
| `ctaPreventDefault`   | Prevents CTA link navigation; dispatches `navclick` instead   |
| `linksPreventDefault` | Prevents secondary link navigation                            |
| `className`           | Additional CSS classes                                        |

**Alt variant properties** (`sfGpsDsAuNswHeroBannerAlt`):

| Property                | Description                                                   |
| ----------------------- | ------------------------------------------------------------- |
| `titleUrl`              | URL for the title link                                        |
| `titleLabel`            | Text for the title link                                       |
| `imageSrc` / `imageAlt` | Image URL and alt text                                        |
| `titlePreventDefault`   | Prevents title link navigation; dispatches `navclick` instead |
| `className`             | Additional CSS classes                                        |

---

### Hero Search

A search-focused hero section with a text input, configurable label, and an icon or text submit button.

| Property            | Description                                                                        |
| ------------------- | ---------------------------------------------------------------------------------- |
| `title`             | Section heading                                                                    |
| `intro`             | Optional introductory paragraph                                                    |
| `links`             | Array of supplementary links                                                       |
| `value`             | Current search input value (two-way bindable)                                      |
| `searchLabel`       | Label for the search input (default: `"Search site for:"`)                         |
| `searchButtonLabel` | Search button text (default: `"Search"`)                                           |
| `button`            | Button style: `icon` (default), `text`                                             |
| `label`             | Whether to display the search label visually (default: hidden, screen-reader-only) |
| `className`         | Additional CSS classes                                                             |

Dispatches `search` when the button is clicked or Enter is pressed.

---

### In-Page Navigation

A table-of-contents style component that renders jump links to sections within the current page.

| Property     | Description                                                       |
| ------------ | ----------------------------------------------------------------- |
| `title`      | Navigation section heading                                        |
| `items`      | Array of `{ text, url }` link objects pointing to page anchors    |
| `firstChild` | Removes top padding when nested as the first child of a container |
| `className`  | Additional CSS classes                                            |

---

### Link List

A styled vertical list of navigation links.

| Property            | Description                                                          |
| ------------------- | -------------------------------------------------------------------- |
| `title`             | Optional list heading                                                |
| `links`             | Array of `{ text, url }` link objects                                |
| `highlightExternal` | Appends a visual indicator and screen-reader text for external links |
| `firstChild`        | Removes top padding when nested as the first child                   |
| `className`         | Additional CSS classes                                               |

---

### List Item

A single item for use within a list, combining a title, optional image, date, label, and tags.

| Property             | Description                                              |
| -------------------- | -------------------------------------------------------- |
| `title`              | Item heading                                             |
| `link`               | URL the item navigates to                                |
| `label`              | Optional category or section label                       |
| `image` / `imageAlt` | Optional thumbnail image                                 |
| `tags`               | Array of `{ text }` tag objects                          |
| `date`               | Publication date (ISO 8601 string or `Date` object)      |
| `dateStyle`          | Date format: `full`, `long`, `medium` (default), `short` |
| `isBlock`            | Block-style layout variant                               |
| `isReversed`         | Reversed (image-right) layout variant                    |
| `showLink`           | Renders an explicit "read more" link                     |
| `preventDefault`     | Prevents navigation; dispatches `navigate` event instead |
| `className`          | Additional CSS classes                                   |

---

### List View

A record-list display component that maps Salesforce sObject data to `ListItem` rows.

**ListViewItem properties** (the individual row):

| Property                         | Description                                                                               |
| -------------------------------- | ----------------------------------------------------------------------------------------- |
| `record`                         | Salesforce sObject record data (columns map)                                              |
| `displayColumns`                 | Array of column definition objects to render                                              |
| `recordId`                       | Salesforce record ID                                                                      |
| `labelColumn`                    | Field API name to use as the `ListItem` label                                             |
| `titleColumn`                    | Field API name to use as the `ListItem` title                                             |
| `dateColumn`                     | Field API name to use as the `ListItem` date                                              |
| `tagsColumn`                     | Field API name to use as the `ListItem` tags (semicolon-separated)                        |
| `imageColumn` / `imageAltColumn` | Field API names for image and alt text                                                    |
| `link`                           | Override URL for the item                                                                 |
| `contentMarkdown`                | Markdown template string; `[!Item.FieldName]` placeholders are replaced with field values |

Dispatches `navigate` with `{ recordId, objectApiName }` detail.

---

### Loader

A loading spinner displayed during asynchronous operations.

| Property    | Description                                    |
| ----------- | ---------------------------------------------- |
| `label`     | Accessible text label (screen-reader-only)     |
| `size`      | Spinner size: `xl` (default), `lg`, `md`, `sm` |
| `className` | Additional CSS classes                         |

---

### Markdown Element / Markup Element

Components for rendering rich-text content:

- **Markdown Element** — parses and renders CommonMark markdown to sanitised HTML. Properties: `content` (markdown string), `className`.
- **Markup Element (v2)** — renders pre-rendered HTML markup. Properties: `markup` (HTML string), `mode` (`reparent` replaces the container element with the markup fragment), `className`.

Both use the `HtmlSanitizer` from `sfGpsDsHelpers` to strip unsafe content before DOM insertion.

---

### Masthead

The top-of-page utility bar providing skip navigation links and branding.

| Property       | Description                          |
| -------------- | ------------------------------------ |
| `arLabel`      | ARIA label for the masthead landmark |
| `navLabel`     | Skip-link label for main navigation  |
| `contentLabel` | Skip-link label for main content     |
| `cstyle`       | Visual style: `default`, `light`     |

---

### Media

A responsive image or video wrapper with an optional caption.

| Property     | Description                                                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `image`      | Image URL                                                                                                                      |
| `imageAlt`   | Image alt text                                                                                                                 |
| `video`      | Embedded video URL (iframe `src`)                                                                                              |
| `videoTitle` | Accessible title for the video iframe                                                                                          |
| `caption`    | Optional figure caption                                                                                                        |
| `cstyle`     | Background style: `default`, `dark`, `light`, `transparent`                                                                    |
| `position`   | Image focal-point crop: `default`, `60`, `70`, `80`, `90`, `left-30`, `left-40`, `left-50`, `right-30`, `right-40`, `right-50` |
| `className`  | Additional CSS classes                                                                                                         |

---

### Pagination

Page navigation control for paginated data sets or search results.

| Property                        | Description                                                      |
| ------------------------------- | ---------------------------------------------------------------- |
| `activePage`                    | Currently selected page number                                   |
| `lastPage`                      | Total number of pages                                            |
| `ariaLabel`                     | ARIA label for the nav element                                   |
| `srOnlyPre` / `srOnlyPost`      | Screen-reader-only prefix and suffix text around the page number |
| `srOnlyPrevious` / `srOnlyNext` | Screen-reader labels for previous/next buttons                   |

Renders smart ellipsis for large page ranges. Dispatches a `pagechange` event with the selected page number.

---

### Progress Indicator

A step-count display for multi-step processes (e.g. "Step 2 of 5").

| Property | Description                                                                                             |
| -------- | ------------------------------------------------------------------------------------------------------- |
| `step`   | Current step number                                                                                     |
| `of`     | Total number of steps                                                                                   |
| `mode`   | `cumulative` (all previous steps active), `current` (only current step), `label-only` (no progress bar) |

---

### Quick Exit

A "Leave this site" button that immediately redirects the browser to a safe URL using `window.location.replace` (which clears history). Intended for pages dealing with sensitive or potentially unsafe topics.

| Property      | Description                                                                             |
| ------------- | --------------------------------------------------------------------------------------- |
| `safeUrl`     | Destination URL when activated (default: `https://www.google/webhp`)                    |
| `enableEsc`   | Activates the button on two rapid Esc key presses (defers to modals and focused inputs) |
| `enableCloak` | Immediately hides the page via `display:none` before navigating                         |
| `focusFirst`  | Focuses the Quick Exit button on the user's first Tab key press on the page             |
| `className`   | Additional CSS classes                                                                  |

---

### Results Bar

A summary bar shown above search or filtered list results displaying a count and an optional sort control.

| Property       | Description                                                                                                                                                |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from`         | Index of the first result on the current page                                                                                                              |
| `to`           | Index of the last result on the current page                                                                                                               |
| `total`        | Total number of results                                                                                                                                    |
| `resultsText`  | Template string for the results summary (default: `"Showing results {from} - {to} of {total} results"`; supports `{from}`, `{to}`, `{total}` placeholders) |
| `noResultText` | Message shown when `total` is 0                                                                                                                            |
| `sortOptions`  | Array of `{ label, value, selected }` sort option objects                                                                                                  |
| `value`        | Currently selected sort option value                                                                                                                       |
| `name`         | Accessible name / label prefix for the sort select                                                                                                         |
| `className`    | Additional CSS classes                                                                                                                                     |

Dispatches `change` with the selected sort value when the sort selection changes.

---

### Side Navigation

A hierarchical sidebar navigation tree supporting multiple levels of nesting and active-state tracking.

| Property     | Description                             |
| ------------ | --------------------------------------- |
| `title`      | Navigation section heading              |
| `url`        | URL of the parent page                  |
| `parentText` | Label for the parent page link          |
| `navItems`   | Nested array of navigation item objects |
| `className`  | Additional CSS classes                  |

Collapses to a mobile-friendly toggle on small screens.

---

### Status Label

A small badge used to communicate the status of a record or item.

| Property | Description                                                     |
| -------- | --------------------------------------------------------------- |
| `label`  | Badge text                                                      |
| `status` | Colour variant: `info` (default), `success`, `warning`, `error` |

---

### Steps

A process indicator rendering an ordered list of step items, each slotted as a child component.

| Property     | Description                                                                                 |
| ------------ | ------------------------------------------------------------------------------------------- |
| `type`       | Modifier flags (space-separated): `fill` applies fill styling, `counter` shows step numbers |
| `cstyle`     | Colour style: `default`, `dark`, `light`, `supplementary`                                   |
| `size`       | Size variant: `large` (default), `medium`, `small`                                          |
| `firstChild` | Removes top padding when nested as the first child                                          |
| `className`  | Additional CSS classes                                                                      |

---

### Sticky Container

A fixed-to-viewport container for content that should remain visible as the user scrolls (e.g. a cookie banner or a floating action bar). Automatically adjusts `document.body` bottom padding to prevent content being obscured.

| Property    | Description            |
| ----------- | ---------------------- |
| `className` | Additional CSS classes |

Exposes `updateStickyBodyPadding()` for imperative recalculation (e.g. after the container's content changes height). Uses a `ResizeObserver` to keep body padding in sync automatically.

---

### Support List

A section listing supporting government departments and partner logos.

| Property       | Description                                                                                                           |
| -------------- | --------------------------------------------------------------------------------------------------------------------- |
| `header`       | Section heading (default: `"Supported by"`)                                                                           |
| `departments`  | Array of `{ text, url }` department link objects                                                                      |
| `supportLogos` | Array of `{ text, url }` logo link objects                                                                            |
| `logoPosition` | Where NSW Government logos are placed relative to department text: `labels` (default, above), `logos` (below), `none` |
| `className`    | Additional CSS classes                                                                                                |

Accepts up to four named logo slots (`SupportLogo1`–`SupportLogo4`) for custom logo images.

---

### Table

A data table component with configurable headers, striping, and borders.

| Property           | Description                                   |
| ------------------ | --------------------------------------------- |
| `caption`          | Table caption text                            |
| `captionLocation`  | `top` (default), `bottom`, or `none`          |
| `headers`          | Array of `{ name, label }` column definitions |
| `content`          | Array of row data objects                     |
| `isStriped`        | Alternating row shading                       |
| `isBordered`       | Cell border rendering                         |
| `offset` / `limit` | Client-side pagination slice                  |

Supports record links via `data-record-id` and `data-object-api-name` attributes for automatic Salesforce record URL generation.

---

### Tabs

A tabbed-panel interface. The `sfGpsDsTabs` base component from `sfGpsDs` is extended with NSW DS styling. The LWR variant (`sfGpsDsAuNswTabSetLwr`) composes four sub-components:

- `sfGpsDsAuNswTabSetLwr` — the outer tab set container
- `sfGpsDsAuNswTabBarLwr` — the row of tab buttons
- `sfGpsDsAuNswTabLwr` — a single tab button
- `sfGpsDsAuNswTabContainerLwr` — the panel that shows when a tab is active

**TabSetLwr properties:**

| Property     | Description                                        |
| ------------ | -------------------------------------------------- |
| `firstChild` | Removes top padding when nested as the first child |
| `className`  | Additional CSS classes (inherited from base)       |

---

### Tags

An interactive tag or chip list, optionally rendered as checkboxes.

| Property       | Description                                            |
| -------------- | ------------------------------------------------------ |
| `tags`         | Array of `{ label, url, checked }` tag objects         |
| `asCheckboxes` | Renders tags as togglable checkboxes rather than links |
| `className`    | Additional CSS classes                                 |

Dispatches a `change` event with the tag index and new checked state.

---

### Toggletip

An accessible alternative to a tooltip: a small informational overlay triggered by a button, implemented as a live region so screen readers announce its content on activation. Uses Floating UI for smart positioning.

| Property | Description                                                                  |
| -------- | ---------------------------------------------------------------------------- |
| `title`  | Text content of the toggletip overlay (default: `"Toggletip"`)               |
| `anchor` | DOM element to anchor the floating overlay to (typically the trigger button) |

Exposes `showToggletip()`, `closeToggletip()`, and `toggleToggletip()` imperative methods.

---

### Utility List

A compact toolbar of page utility actions: print, copy link, and share (via social networks or a toggletip).

| Property      | Description                                                                                            |
| ------------- | ------------------------------------------------------------------------------------------------------ |
| `printLabel`  | Label for the print action (default: `"Print this page"`)                                              |
| `copyLabel`   | Label for the copy-link action (default: `"Copy link"`)                                                |
| `copiedLabel` | Label shown after a successful clipboard copy (default: `"Copied"`)                                    |
| `shareLabel`  | Label for the share action (default: `"Share this page"`)                                              |
| `shareUrl`    | URL to copy/share (default: `https://www.digital.nsw.gov.au`)                                          |
| `shareConfig` | Array of `{ network, url }` social sharing configurations (`facebook`, `linkedin`, `twitter`, `email`) |
| `orientation` | Layout direction: `vertical` (default), `horizontal`                                                   |
| `className`   | Additional CSS classes                                                                                 |

---

## Footer components

The page footer is split into two cooperating components.

### Upper Footer (`sfGpsDsAuNswUpperFooter`)

A multi-column navigation area above the footer rule.

| Property    | Description                                                                                   |
| ----------- | --------------------------------------------------------------------------------------------- |
| `items`     | Nested array of `AdaptedNavigationMenuItem` objects (hierarchy maps to columns and sub-lists) |
| `className` | Additional CSS classes                                                                        |

Dispatches `navclick` with the clicked item's index when a link is clicked.

### Lower Footer (`sfGpsDsAuNswLowerFooter`)

A slim bar at the bottom of the footer containing secondary links and an acknowledgement statement.

| Property    | Description                                        |
| ----------- | -------------------------------------------------- |
| `items`     | Array of `AdaptedNavigationMenuItem` link objects  |
| `statement` | Acknowledgement of country or legal statement text |
| `className` | Additional CSS classes                             |

Dispatches `navclick` with the clicked item's index when a link is clicked.

---

## Header and navigation components

The page header is assembled from two closely coupled components — `sfGpsDsAuNswHeader` (the top bar) and `sfGpsDsAuNswMainNav` (the navigation drawer). `sfGpsDsAuNswHeaderProfile` / `sfGpsDsAuNswHeaderProfileIp` are optional additions. `sfGpsDsAuNswMasthead`, `sfGpsDsAuNswSideNav`, and `sfGpsDsAuNswInPageNavigation` are independent standalone components already documented in the UI components section above.

Aura variants (`sfGpsDsAuNswHeaderAura`, `sfGpsDsAuNswHeaderMainNavAura`) exist for Aura-based community templates.

---

### sfGpsDsAuNswHeader

The top bar of the page, containing the NSW Government masterbrand logo, an optional agency logo, a mobile hamburger button, an optional collapsible search field, and an optional profile area.

| Property             | Description                                                                        |
| -------------------- | ---------------------------------------------------------------------------------- |
| `masterbrand`        | URL of the NSW Government waratah masterbrand image                                |
| `masterbrandAlt`     | Alt text for the masterbrand image                                                 |
| `srMasterbrandLabel` | Screen-reader label for the masterbrand (default: `"NSW Government"`)              |
| `logo`               | URL of the agency/department logo                                                  |
| `logoAlt`            | Alt text for the agency logo                                                       |
| `siteTitle`          | Site or department name displayed next to the logo                                 |
| `siteDescriptor`     | Optional sub-title displayed below `siteTitle`                                     |
| `headerUrl`          | URL the logo/title links to (default: `"#"`, falls back to community base path)    |
| `menuLabel`          | Label for the mobile hamburger button (default: `"menu"`)                          |
| `search`             | Shows the search icon button and expandable search input                           |
| `searchLabel`        | Label for the search input (default: `"Search site for:"`)                         |
| `searchAriaLabel`    | ARIA label for the search toggle button (default: `"search"`)                      |
| `value`              | Current search input value (two-way bindable)                                      |
| `profile`            | Shows the profile slot/area                                                        |
| `mobile`             | Enables mobile-specific layout behaviours                                          |
| `mobileLogoStacking` | How logos are arranged on mobile: `horizontal` (default), `vertical`               |
| `mainNavId`          | ID of the associated `sfGpsDsAuNswMainNav` element (used for ARIA `aria-controls`) |
| `mainNavIsOpen`      | Whether the main nav drawer is currently open (drives ARIA `aria-expanded`)        |
| `className`          | Additional CSS classes                                                             |

Dispatches `search` when the search is submitted, `openmenu` when the mobile menu button is clicked, and `home` when the logo is clicked and no `headerUrl` is set.

---

### sfGpsDsAuNswMainNav and sfGpsDsAuNswMainNavItem

The navigation drawer that slides in on mobile and sits inline on desktop. Navigation items are rendered internally from the `navItems` array; there is no separate item component file — item markup is managed inside `sfGpsDsAuNswMainNav` itself.

| Property         | Description                                                                     |
| ---------------- | ------------------------------------------------------------------------------- |
| `navItems`       | Nested array of `AdaptedNavigationMenuItem` objects; hierarchy drives sub-menus |
| `navAriaLabel`   | ARIA label for the `<nav>` element (default: `"Main Navigation"`)               |
| `navTitle`       | Heading shown inside the mobile drawer (default: `"Menu"`)                      |
| `closeMenuLabel` | Label for the close button in the mobile drawer (default: `"Close Menu"`)       |
| `mainNavId`      | ID attribute set on the nav element; coordinates with `sfGpsDsAuNswHeader`      |
| `isActive`       | Controls open/closed state of the mobile drawer                                 |
| `megaMenu`       | Enables mega-menu mode: sub-navs render as fly-out panels instead of accordion  |
| `className`      | Additional CSS classes                                                          |

Exposes a `close()` imperative method. Dispatches `navigate` with the clicked item index and `closemenu` when the drawer should close. Active-page highlighting is derived automatically from the current URL via a `CurrentPageReference` wire; it re-evaluates on every page navigation.

---

### sfGpsDsAuNswHeaderProfile

A profile dropdown button shown inside the header, switching between a sign-in call-to-action (guest state) and an authenticated user menu.

| Property      | Description                                                                  |
| ------------- | ---------------------------------------------------------------------------- |
| `isGuest`     | If `true`, renders a sign-in link; if `false`, renders the user menu         |
| `userAlias`   | Display name or initials shown on the profile button when authenticated      |
| `signInLabel` | Label for the sign-in link (default: `"Log in"`)                             |
| `navItems`    | Array of `AdaptedNavigationMenuItem` objects for the authenticated user menu |
| `className`   | Additional CSS classes                                                       |

Dispatches `login` when the sign-in link is clicked, and `navigate` with the clicked item index when a menu item is selected. Closes automatically on click-outside.

---

### sfGpsDsAuNswHeaderProfileIp

An Integration-Procedure-powered variant of the profile dropdown. Fetches user menu items from an OmniStudio Integration Procedure or an Experience Cloud navigation menu rather than accepting them via a property.

| Property            | Description                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------------ |
| `isGuest`           | If `true`, renders a sign-in link; if `false`, renders the user menu                             |
| `userAlias`         | Display name or initials shown on the profile button when authenticated                          |
| `mode`              | Data source mode: `ip` (Integration Procedure) or `experience-cloud` (Experience Cloud nav menu) |
| `ipName`            | OmniStudio Integration Procedure name (used when `mode="ip"`)                                    |
| `inputJSON`         | JSON input passed to the Integration Procedure                                                   |
| `optionsJSON`       | Options JSON passed to the Integration Procedure                                                 |
| `navigationDevName` | Developer name of the Experience Cloud navigation menu (used when `mode="experience-cloud"`)     |
| `className`         | Additional CSS classes                                                                           |

---

### sfGpsDsAuNswMasthead

The top-of-page utility bar providing skip navigation links and the NSW DS branding strip. See the [Masthead](#masthead) entry in the UI components section for the full property table. This component is independent and can be used outside of the header assembly.

---

### sfGpsDsAuNswSideNav

A hierarchical sidebar navigation tree for section-level navigation. See the [Side Navigation](#side-navigation) entry in the UI components section for the full property table. This component is independent of the page header.

---

### sfGpsDsAuNswInPageNavigation

A table-of-contents style jump-link list for long-form content pages. See the [In-Page Navigation](#in-page-navigation) entry in the UI components section for the full property table. This component is independent of the page header.

---

## Layout components (LWR)

These components are used exclusively in Lightning Web Runtime sites as structural containers and theme wrappers. They do not render design-system-specific HTML themselves; they provide the slot structure that page regions slot into.

| Component                    | Purpose                                        |
| ---------------------------- | ---------------------------------------------- |
| `sfGpsDsAuNswBlockLwr`       | Generic content block container                |
| `sfGpsDsAuNswContainerLwr`   | Responsive max-width container                 |
| `sfGpsDsAuNswGridLwr`        | CSS grid layout wrapper                        |
| `sfGpsDsAuNswLayoutLwr`      | Full-page layout with header/main/footer slots |
| `sfGpsDsAuNswSectionLwr`     | Thematic section divider                       |
| `sfGpsDsAuNswThemeLayoutLwr` | Applies the NSW DS theme tokens to the page    |

---

## OmniStudio form components

Form components live in two mirrored directories — one per OmniStudio runtime — and wrap each field type in NSW DS styling. They are consumed inside OmniScripts.

### Form structure

| Component                                                     | Purpose                                          |
| ------------------------------------------------------------- | ------------------------------------------------ |
| `sfGpsDsAuNswForm`                                            | Root form container                              |
| `sfGpsDsAuNswFormBlock`                                       | Fieldset / form section                          |
| `sfGpsDsAuNswFormStep`                                        | A single step in a multi-step form               |
| `sfGpsDsAuNswFormStepNoButton`                                | Step variant without a built-in next/back button |
| `sfGpsDsAuNswFormStepChart` / `sfGpsDsAuNswFormStepChartItem` | Step progress chart                              |

### Input fields

| Category      | Components                                                                                                                                                                                  |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Text          | `sfGpsDsAuNswFormText`, `sfGpsDsAuNswFormEmail`, `sfGpsDsAuNswFormPassword`, `sfGpsDsAuNswFormUrl`, `sfGpsDsAuNswFormNumber`, `sfGpsDsAuNswFormCurrency`                                    |
| Free-form     | `sfGpsDsAuNswInput`, `sfGpsDsAuNswMaskedInput`, `sfGpsDsAuNswTextarea`                                                                                                                      |
| Date and time | `sfGpsDsAuNswFormDate`, `sfGpsDsAuNswFormDateV2`, `sfGpsDsAuNswFormDateTime`, `sfGpsDsAuNswFormTime`, `sfGpsDsAuNswDatePicker`, `sfGpsDsAuNswTimePicker`, `sfGpsDsAuNswDatetimePicker`      |
| Selection     | `sfGpsDsAuNswFormSelect`, `sfGpsDsAuNswFormRadio`, `sfGpsDsAuNswFormCheckbox`, `sfGpsDsAuNswFormMultiselect`, `sfGpsDsAuNswCombobox`, `sfGpsDsAuNswCheckboxGroup`, `sfGpsDsAuNswRadioGroup` |
| Typeahead     | `sfGpsDsAuNswFormTypeahead`, `sfGpsDsAuNswTypeahead`, `sfGpsDsAuNswFormAddressTypeahead`, `sfGpsDsAuNswFormPlacesTypeahead`                                                                 |
| Advanced      | `sfGpsDsAuNswFormFile`, `sfGpsDsAuNswFormLookup`, `sfGpsDsAuNswPredictiveList`, `sfGpsDsAuNswFormDisclosure`, `sfGpsDsAuNswFormFormula`                                                     |
| Utilities     | `sfGpsDsAuNswFormMessaging`, `sfGpsDsAuNswFormHelper`, `sfGpsDsAuNswFormEditBlock`, `sfGpsDsAuNswSaveForLaterAck`                                                                           |

---

## Authentication components

Located in `auth/lwc/`, these implement the NSW DS visual style over Salesforce's standard authentication flows.

| Component                        | Purpose                                  |
| -------------------------------- | ---------------------------------------- |
| `sfGpsDsAuNswLoginComm`          | Login form                               |
| `sfGpsDsAuNswRegisterComm`       | User registration form                   |
| `sfGpsDsAuNswForgotPasswordComm` | Password reset request form              |
| `sfGpsDsAuNswCheckPasswordComm`  | Password strength and validation display |

---

## CMS integration

Three Salesforce CMS content types are defined with matching OmniStudio pipelines:

| Content type  | Integration Procedure                   | Data Transform                                           |
| ------------- | --------------------------------------- | -------------------------------------------------------- |
| Card          | Fetches Card CMS items for a collection | Maps CMS fields to `sfGpsDsAuNswCard` properties         |
| CardV2        | Fetches CardV2 CMS items                | Maps CMS fields to `sfGpsDsAuNswCardV2` properties       |
| Content Block | Fetches Content Block CMS items         | Maps CMS fields to `sfGpsDsAuNswContentBlock` properties |

---

## Theming and static resources

| Resource                            | Contents                                                             |
| ----------------------------------- | -------------------------------------------------------------------- |
| `sfGpsDsAuNsw`                      | Compiled NSW DS CSS and assets (fonts, icons, logos)                 |
| `sfGpsDsAuNsw_showcase`             | Additional assets used in demo/showcase pages                        |
| `sfGpsDsAuNswAuraThemePreview1/2/3` | Preview images for the Aura theme definition                         |
| `brandingSets/`                     | Design-token colour and typography values for the Experience Builder |

SCSS sources are maintained in `scss/` and compiled into the static resource bundles as part of the build pipeline.

---

## Aura components

| Component                       | Purpose                                          |
| ------------------------------- | ------------------------------------------------ |
| `sfGpsDsAuNswAuraThemeLayout`   | Theme wrapper for Aura-based community templates |
| `sfGpsDsAuNswHeaderAura`        | Full page header for Aura templates              |
| `sfGpsDsAuNswHeaderHome`        | Home link within the Aura header                 |
| `sfGpsDsAuNswHeaderMainNavAura` | Main navigation bar for Aura templates           |
| `sfGpsDsAuNswHeaderOpenMenu`    | Mobile hamburger menu trigger                    |
| `sfGpsDsAuNswHeaderSearch`      | Search bar integrated into the Aura header       |

---

## Key design patterns

- **Light DOM** — all components use `renderMode: 'light'` so NSW DS global CSS applies without needing Shadow DOM piercing.
- **Base class inheritance** — every component extends `SfGpsDsElement` (from `sfGpsDs`) for lifecycle hooks, property normalisation, and error surfacing.
- **Enum validation** — public `@api` properties that accept a fixed set of values (e.g. `as`, `cstyle`, `rendering`) are normalised through `normaliseString` with an `validValues` allowlist; invalid values fall back to a defined default rather than throwing.
- **Markdown-first labels** — heading and label properties accept CommonMark markdown, rendered through `sfGpsDsMarkdown` for consistent rich-text support without a CMS dependency.
- **Debounced event handlers** — scroll and resize listeners use a 250 ms debounce to avoid layout thrashing.
- **No Shadow DOM CSS isolation** — NSW DS styles are loaded as a static resource at the page level; Light DOM rendering ensures they reach component internals without `::part` or CSS variable workarounds.
