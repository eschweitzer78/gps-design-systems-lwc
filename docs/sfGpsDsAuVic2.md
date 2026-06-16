# sfGpsDsAuVic2 — Victorian Government Design System

`sfGpsDsAuVic2` is the Salesforce unlocked package in the `gps-design-systems-lwc` monorepo that implements version 2 of the **Ripple Design System** used by Victorian Government digital services. It depends on the core `sfGpsDs` package and provides 50+ LWC components that map directly to Ripple 2 UI patterns.

The documentation site is at `https://vic2.dsforce.dev` and that for the underlying design system is at `https://ripple.vic.gov.au`.

## Package identity

| Field                  | Value                                                 |
| ---------------------- | ----------------------------------------------------- |
| Salesforce API version | 65.0                                                  |
| Package name           | Salesforce Global Public Sector AU VIC2 Design System |
| Package ID             | 0Ho5j000000oMNRCA2                                    |
| Current version        | 0.8.7                                                 |
| Dependencies           | sfGpsDs (core), omnistudio 258.4                      |
| License                | BSD 3-Clause                                          |
| Render mode            | Light DOM throughout (Ripple CSS applies globally)    |

---

## Folder layout

```
sfGpsDsAuVic2/
└── main/default/
    ├── aura/                              Aura components
    ├── brandingSets/                      Branding configuration
    ├── classes/                           Apex classes (1 file)
    ├── communityTemplateDefinitions/      Community templates
    ├── communityThemeDefinitions/         Theme definitions
    ├── email/                             Email templates
    ├── flexipages/                        Flexible page layouts
    ├── lwc/                               Lightning Web Components
    │   ├── auth/                          Authentication components (Login, Register, etc.)
    │   ├── functions/                     HTML sanitisation plug-in functions
    │   ├── layout/                        Layout primitives (BackToTop, SkipLink, etc.)
    │   ├── layouts/                       Page layout skeletons (Sidebar, Standard)
    │   ├── mixins-composables/            Shared LWC mixins and composable patterns
    │   ├── omnistudio-managed-package-runtime-forms/  OmniStudio Managed Package form adapters
    │   ├── omnistudio-standard-runtime-forms/         OmniStudio Standard Runtime form adapters
    │   ├── typings/                       TypeScript type definitions
    │   └── sfGpsDsAuVic2*/               Design system components (see below)
    ├── permissionsets/                    Permission sets
    └── staticresources/                   Static assets (icons, fonts, images)
```

---

## LWC component groups

Component folders whose name begins with `sfGpsDsAuVic2` each represent a Ripple 2 design system pattern. Where a component exists in multiple runtime variants, those variants share the same folder via a nested `lwc/` sub-folder; only the canonical (no suffix) component is described below unless the variant differs materially.

**Runtime suffixes:**

| Suffix       | Runtime                                                             |
| ------------ | ------------------------------------------------------------------- |
| _(none)_     | OmniStudio Standard Runtime                                         |
| `Os` / `OsN` | OmniStudio Managed Package Runtime (build-time generated or ad hoc) |
| `Comm`       | Experience Cloud (Community)                                        |
| `Lwr`        | Lightning Web Runtime                                               |

---

### Utilities and constants

#### sfGpsDsAuVic2UiCoreConstants / sfGpsDsAuVic2UiCoreConstantsOs

Exports the `RplColorThemes` constant — an enumeration of Ripple colour theme names (`default`, `white`, `text`, `information`, `success`, `warning`, `error`, `inactive`). No UI, no properties; imported by other components that accept a `theme` or `colour` property.

---

#### sfGpsDsAuVic2MarkdownElementComm

Renders CommonMark markdown to sanitised HTML inside Experience Cloud pages. Uses the shared `SfGpsDsMarkdownElement` base class with VIC2-specific HTML sanitisation plug-ins from `functions/`. Adds `vic2-scope` to the host class so Ripple global CSS applies.

| Property    | Description               |
| ----------- | ------------------------- |
| `content`   | Markdown string to render |
| `className` | Additional CSS classes    |

---

#### sfGpsDsAuVic2MarkupElementComm

Renders arbitrary HTML markup directly into Experience Cloud pages, sanitising it first and adding `vic2-scope` to the host class.

| Property    | Description               |
| ----------- | ------------------------- |
| `markup`    | Raw HTML string to render |
| `className` | Additional CSS classes    |

---

#### sfGpsDsAuVic2UpdatedDateComm

Displays a "last updated" date stamp on Experience Cloud pages.

| Property    | Description            |
| ----------- | ---------------------- |
| `date`      | Date value to display  |
| `className` | Additional CSS classes |

---

### Page structure components

#### sfGpsDsAuVic2Acknowledgement

Displays an Aboriginal and Torres Strait Islander peoples acknowledgement of country, including both flags.

| Property    | Description            |
| ----------- | ---------------------- |
| `message`   | Acknowledgement text   |
| `className` | Additional CSS classes |

---

#### sfGpsDsAuVic2ContainerLwr

A generic full-width container block for LWR pages with a default slot.

| Property    | Description            |
| ----------- | ---------------------- |
| `className` | Additional CSS classes |

---

#### sfGpsDsAuVic2GridLwr

A 12-column grid container for LWR pages. Each column slot has its own configurable class name.

| Property                           | Description                                    |
| ---------------------------------- | ---------------------------------------------- |
| `type`                             | Grid type: `default` or `row-flush`            |
| `col1ClassName` … `col12ClassName` | CSS classes applied to each column slot (1–12) |
| `className`                        | Additional CSS classes on the grid wrapper     |

---

#### sfGpsDsAuVic2Header

The page header wrapper. Manages visibility of named slots (behind, upper, lower, aside) based on slot content presence.

| Property         | Description                                           |
| ---------------- | ----------------------------------------------------- |
| `fullWidth`      | Allows header content to span the full viewport width |
| `limitContent`   | Constrains content to a max-width container           |
| `hasTitle`       | Shows a site-title area                               |
| `hasSidebar`     | Adjusts layout for sidebar presence                   |
| `pageBackground` | Background colour or theme for the header area        |
| `className`      | Additional CSS classes                                |

---

#### sfGpsDsAuVic2Footer

The site footer with navigation sections, branding logos, acknowledgement of country, and copyright.

| Property            | Description                          |
| ------------------- | ------------------------------------ |
| `nav`               | Array of navigation section objects  |
| `links`             | Array of footer utility link objects |
| `logos`             | Array of logo image objects          |
| `credit`            | Credit or attribution text           |
| `acknowledgement`   | Acknowledgement of country text      |
| `copyright`         | Copyright statement                  |
| `variant`           | Footer style: `default` or `neutral` |
| `disableFooterLogo` | Hides the Vic Gov footer logo        |
| `className`         | Additional CSS classes               |

Dispatches `navigate`, `linksnavigate`, and `navnavigate` when footer links and nav items are clicked.

---

### Navigation components

#### sfGpsDsAuVic2PrimaryNav

The primary site navigation bar with optional search toggle and quick-exit button.

| Property        | Description                                      |
| --------------- | ------------------------------------------------ |
| `primaryLogo`   | Primary logo object                              |
| `secondaryLogo` | Secondary or agency logo object                  |
| `items`         | Nested navigation item array                     |
| `showSearch`    | Shows the search toggle button (default: `true`) |
| `showQuickExit` | Shows the quick-exit button (default: `true`)    |

Exposes `toggleNavItem(level, item, open)`, `toggleMobileMenu(text)`, and `toggleSearch()` as imperative methods. Dispatches `togglemenu` with `{ text, action }` and `togglesearch` with `{ action }`.

---

#### sfGpsDsAuVic2VerticalNav

A hierarchical sidebar navigation tree with expand/collapse support for nested items.

| Property         | Description                                          |
| ---------------- | ---------------------------------------------------- |
| `title`          | Navigation section heading                           |
| `preventDefault` | Suppresses default link navigation (for SPA routing) |
| `className`      | Additional CSS classes                               |

Dispatches `togglemenuitem` when an item is expanded/collapsed and `navigate` when a link is clicked.

---

#### sfGpsDsAuVic2InPageNavigation

A "On this page" jump-link table of contents for long-form content pages.

| Property    | Description                                 |
| ----------- | ------------------------------------------- |
| `title`     | Section heading (default: `"On this page"`) |
| `items`     | Array of anchor items with label and href   |
| `className` | Additional CSS classes                      |

Dispatches `navigate` when a jump link is clicked.

---

#### sfGpsDsAuVic2Breadcrumbs

A breadcrumb trail with optional collapsing of middle items for deep hierarchies.

| Property                | Description                                             |
| ----------------------- | ------------------------------------------------------- |
| `items`                 | Array of breadcrumb link objects                        |
| `collapse`              | Enables collapsing of middle breadcrumb items           |
| `displayBeforeCollapse` | Number of items to show before triggering collapse      |
| `currentClassName`      | CSS class applied to the current (last) item            |
| `currentDir`            | Text direction for the current item                     |
| `besideQuickExit`       | Adjusts layout when rendered beside a quick-exit button |
| `preventDefault`        | Suppresses default link navigation                      |
| `className`             | Additional CSS classes                                  |

Dispatches `navigate` with `{ action, text, value, index }`.

---

#### sfGpsDsAuVic2Sitemap

Renders a full-site sitemap as a hierarchical link tree.

| Property    | Description               |
| ----------- | ------------------------- |
| `items`     | Nested sitemap item array |
| `className` | Additional CSS classes    |

---

#### sfGpsDsAuVic2PageLinks

Previous / next page navigation links for multi-page content sequences.

| Property    | Description               |
| ----------- | ------------------------- |
| `next`      | Next page link object     |
| `prev`      | Previous page link object |
| `className` | Additional CSS classes    |

---

#### sfGpsDsAuVic2Pagination

Full-featured pagination control supporting complex (numbered) and simple (prev/next) variants.

| Property           | Description                                             |
| ------------------ | ------------------------------------------------------- |
| `totalPages`       | Total number of pages                                   |
| `currentPage`      | Currently active page number                            |
| `surroundingPages` | Number of page links shown around the current page      |
| `contentType`      | Content type label used in the tally (e.g. `"results"`) |
| `label`            | ARIA label for the pagination `<nav>`                   |
| `prevLabel`        | Label for the previous button                           |
| `nextLabel`        | Label for the next button                               |
| `variant`          | Layout variant: `complex` or `simple`                   |
| `showTally`        | Shows a results count/tally summary                     |
| `className`        | Additional CSS classes                                  |

Dispatches `change` with `{ text, action, value }` when a page is selected.

---

### Interactive UI components

#### sfGpsDsAuVic2Button

A versatile button/link component that renders as a `<button>`, `<a>`, or LWC navigation link.

| Property         | Description                                          |
| ---------------- | ---------------------------------------------------- |
| `label`          | Button text                                          |
| `url`            | URL for link variants                                |
| `el`             | Element type: `button`, `a`, or `link`               |
| `variant`        | Visual style: `filled`, `outlined`, `elevated`, etc. |
| `theme`          | Colour theme: `default`, `primary`, or `secondary`   |
| `iconName`       | Optional icon name to display                        |
| `iconPosition`   | Icon placement: `left` or `right`                    |
| `disabled`       | Disables the button                                  |
| `busy`           | Displays a loading/busy state                        |
| `preventDefault` | Suppresses default link navigation                   |
| `ariaBusy`       | ARIA busy attribute                                  |
| `ariaControls`   | ARIA controls attribute                              |
| `ariaSelected`   | ARIA selected attribute                              |
| `className`      | Additional CSS classes                               |

Exposes `focus()` imperative method. Dispatches `buttonclick` with `{ label, url, el }`.

---

#### sfGpsDsAuVic2Link

A lightweight anchor/link component with optional navigation prevention for SPA routing.

| Property         | Description                           |
| ---------------- | ------------------------------------- |
| `url`            | Link href                             |
| `target`         | Link target attribute (e.g. `_blank`) |
| `index`          | Index within a list of links          |
| `tabIndex`       | Tab index                             |
| `preventDefault` | Suppresses default browser navigation |
| `className`      | Additional CSS classes                |

Exposes `focus()` imperative method.

---

#### sfGpsDsAuVic2Accordion

A collapsible accordion group supporting numbered items and programmatic expand/collapse control.

| Property       | Description                                      |
| -------------- | ------------------------------------------------ |
| `numbered`     | Numbers the accordion items (default: `false`)   |
| `className`    | Additional CSS classes                           |
| `allExpanded`  | _(readonly)_ `true` when all items are expanded  |
| `allCollapsed` | _(readonly)_ `true` when all items are collapsed |

Exposes `toggleAll()` and `toggleItemByIndex(index)` imperative methods. Dispatches `toggleall` and `toggleitem`.

---

#### sfGpsDsAuVic2Alert

An alert/notification banner with optional dismiss action.

| Property        | Description                                             |
| --------------- | ------------------------------------------------------- |
| `variant`       | Alert type: `information`, `warning`, or `error`        |
| `iconName`      | Icon to display alongside the message                   |
| `message`       | Alert message text                                      |
| `linkText`      | Label for an optional call-to-action link               |
| `linkUrl`       | URL for the call-to-action link                         |
| `isDismissible` | Shows a dismiss button                                  |
| `dismissed`     | Controls the dismissed state                            |
| `alertId`       | Unique ID for the alert (included in the dismiss event) |
| `className`     | Additional CSS classes                                  |

Dispatches `dismiss` with `{ id, action, label, text }`.

---

#### sfGpsDsAuVic2Chip

A filterable chip/tag group for selection filters or navigation.

| Property         | Description                                           |
| ---------------- | ----------------------------------------------------- |
| `items`          | Array of chip item objects                            |
| `label`          | Label for a standalone chip (default: `""`)           |
| `url`            | URL for a standalone chip (default: `"#"`)            |
| `variant`        | Visual style (default: `"default"`)                   |
| `preventDefault` | Suppresses default link navigation (default: `false`) |
| `className`      | Additional CSS classes                                |

Dispatches `navigate` with `{ action, value, text, index }`.

---

#### sfGpsDsAuVic2Expandable

A single expandable/collapsible content panel.

| Property     | Description                                  |
| ------------ | -------------------------------------------- |
| `expanded`   | Whether the panel is open (default: `false`) |
| `labelledby` | ID of the element that labels this panel     |
| `isHidden`   | Hides the panel entirely                     |
| `className`  | Additional CSS classes                       |

---

#### sfGpsDsAuVic2Modal

An accessible modal dialog with focus trapping and escape-key handling.

| Property     | Description                                     |
| ------------ | ----------------------------------------------- |
| `isOpen`     | Controls the open/closed state                  |
| `closeLabel` | Label for the close button (default: `"Close"`) |
| `className`  | Additional CSS classes                          |

Dispatches `close` with `{ action, text }`.

---

#### sfGpsDsAuVic2SearchBar

A full-featured search bar with optional typeahead suggestions dropdown, clear button, and multiple visual variants.

| Property                  | Description                                             |
| ------------------------- | ------------------------------------------------------- |
| `inputLabel`              | Visible label for the search input                      |
| `submitLabel`             | Label for the submit button                             |
| `placeholder`             | Placeholder text                                        |
| `variant`                 | Visual style: `default`, `reverse`, or `menu`           |
| `iconPosition`            | Search icon placement: `left`, `right`, or `none`       |
| `inputValue`              | Current search input value                              |
| `suggestions`             | Array of suggestion objects for the dropdown            |
| `maxSuggestionsDisplayed` | Maximum number of suggestions to show                   |
| `showNoResults`           | Shows a "no results" message when suggestions are empty |
| `showLabel`               | Shows the visible input label                           |
| `showClearButton`         | Shows a clear (×) button                                |
| `showSubmitButton`        | Shows the submit/search button                          |
| `isFreeText`              | Allows submission without selecting a suggestion        |
| `autoFocus`               | Focuses the input on mount                              |
| `submitOnClear`           | Submits the form when the clear button is pressed       |
| `submitOnSuggestionOnly`  | Only submits when a suggestion is explicitly selected   |
| `className`               | Additional CSS classes                                  |

Exposes `focus()` imperative method. Dispatches `submit` and `updateinputvalue`.

---

#### sfGpsDsAuVic2Tabs / sfGpsDsAuVic2TabsLwr

A tabbed-panel interface for LWR pages supporting up to 10 slot-based panels with optional icons.

| Property                         | Description                         |
| -------------------------------- | ----------------------------------- |
| `mode`                           | Layout mode: `horizontal` (default) |
| `tab1Label` … `tab10Label`       | Label for each tab (1–10)           |
| `tab1IconName` … `tab10IconName` | Optional icon for each tab (1–10)   |
| `className`                      | Additional CSS classes              |

---

#### sfGpsDsAuVic2Spinner

A Ripple-styled loading spinner.

| Property    | Description                   |
| ----------- | ----------------------------- |
| `size`      | Spinner size (default: `"m"`) |
| `className` | Additional CSS classes        |

---

### Content display components

#### sfGpsDsAuVic2Card

A flexible content card supporting multiple layout types.

| Property    | Description                                                                              |
| ----------- | ---------------------------------------------------------------------------------------- |
| `el`        | Host element type: `div` or `li`                                                         |
| `type`      | Card layout: `promo`, `avatar`, `nav`, `call-to-action`, `key-dates`, or `category-grid` |
| `link`      | URL the card links to                                                                    |
| `highlight` | Applies a highlight colour accent                                                        |
| `className` | Additional CSS classes                                                                   |

Slots: `meta`, `upper`, `lower`.

---

#### sfGpsDsAuVic2Blockquote

A styled blockquote with optional author attribution.

| Property      | Description                        |
| ------------- | ---------------------------------- |
| `authorName`  | Name of the person being quoted    |
| `authorTitle` | Title or role of the quoted person |
| `className`   | Additional CSS classes             |

---

#### sfGpsDsAuVic2Callout

A styled callout highlight box with a heading and body.

| Property    | Description            |
| ----------- | ---------------------- |
| `title`     | Callout heading        |
| `content`   | Callout body text      |
| `variant`   | Visual variant         |
| `className` | Additional CSS classes |

---

#### sfGpsDsAuVic2Campaign

A full-width campaign or hero section with a heading, call-to-action link, and image.

| Property         | Description                        |
| ---------------- | ---------------------------------- |
| `title`          | Campaign heading                   |
| `link`           | Call-to-action link object         |
| `image`          | Hero image object                  |
| `preventDefault` | Suppresses default link navigation |
| `className`      | Additional CSS classes             |

Dispatches `navigate` with `{ action, label, text, value, options, type }`.

---

#### sfGpsDsAuVic2ContactUs

A "Contact us" information block with address and contact method items.

| Property    | Description                                               |
| ----------- | --------------------------------------------------------- |
| `title`     | Section heading (default: `"Contact us"`)                 |
| `address`   | Postal or physical address text                           |
| `items`     | Array of contact method objects (phone, email, web, etc.) |
| `className` | Additional CSS classes                                    |

Dispatches `itemClick` when a contact item is clicked.

---

#### sfGpsDsAuVic2Content

Renders sanitised HTML content with Ripple-scoped styling.

| Property    | Description                                                    |
| ----------- | -------------------------------------------------------------- |
| `html`      | Raw HTML string; sanitised with VIC2 plug-ins before insertion |
| `className` | Additional CSS classes                                         |

---

#### sfGpsDsAuVic2DataTable

A responsive data table with configurable columns, optional caption/footer, and heading orientation control.

| Property           | Description                                                  |
| ------------------ | ------------------------------------------------------------ |
| `caption`          | Table caption (default: `""`)                                |
| `footer`           | Footer text or HTML (default: `""`)                          |
| `columns`          | Column definition array                                      |
| `items`            | Row data array                                               |
| `headingType`      | Heading orientation: `{ horizontal: true, vertical: false }` |
| `showExtraContent` | Shows additional expandable content areas per row            |
| `offset`           | Row number offset for display (default: `1`)                 |
| `className`        | Additional CSS classes                                       |

---

#### sfGpsDsAuVic2DescriptionList

A styled definition/description list.

| Property    | Description                                                    |
| ----------- | -------------------------------------------------------------- |
| `items`     | Array of `{ term, description }` objects                       |
| `variant`   | Visual style (default: `"default"`)                            |
| `inline`    | Renders terms and descriptions side by side (default: `false`) |
| `className` | Additional CSS classes                                         |

---

#### sfGpsDsAuVic2Document

A document download link card showing file name, type, and size.

| Property          | Description                                                        |
| ----------------- | ------------------------------------------------------------------ |
| `url`             | Document URL                                                       |
| `download`        | Download filename attribute                                        |
| `openInNewWindow` | Opens the link in a new tab (default: `false`)                     |
| `globalEvents`    | Makes the `download` event bubble to the window (default: `false`) |
| `className`       | Additional CSS classes                                             |

Dispatches `download` with `{ action, text, value }`.

---

#### sfGpsDsAuVic2File

A file attachment display showing name, extension, size, and last-updated date.

| Property    | Description                         |
| ----------- | ----------------------------------- |
| `name`      | File name                           |
| `url`       | File URL                            |
| `extension` | File extension (e.g. `pdf`, `docx`) |
| `size`      | Human-readable file size string     |
| `updated`   | Last updated date                   |
| `className` | Additional CSS classes              |

Dispatches `download` with `{ action, value, text, type, size }`.

---

#### sfGpsDsAuVic2Icon

A single Ripple icon. Can be configured via individual properties or by passing a composite `icon` object.

| Property    | Description                                                                                              |
| ----------- | -------------------------------------------------------------------------------------------------------- |
| `name`      | Icon name from the Ripple icon set                                                                       |
| `icon`      | Icon config object (overrides individual properties): `{ name, size, colour, padded, title, className }` |
| `size`      | Icon size: `s`, `m`, `l`, or `xl`                                                                        |
| `colour`    | Icon colour from `RplColorThemes`                                                                        |
| `padded`    | Adds padding around the icon                                                                             |
| `title`     | Accessible title for the SVG element                                                                     |
| `className` | Additional CSS classes                                                                                   |

---

#### sfGpsDsAuVic2Image

A responsive image with srcset, aspect ratio, focal point, and loading priority support.

| Property     | Description                                           |
| ------------ | ----------------------------------------------------- |
| `src`        | Image source URL                                      |
| `alt`        | Alt text                                              |
| `width`      | Intrinsic width                                       |
| `height`     | Intrinsic height                                      |
| `srcSet`     | Responsive srcset string                              |
| `sizes`      | Responsive sizes attribute string                     |
| `circle`     | Renders as a circle (avatar style)                    |
| `focalPoint` | CSS `object-position` focal point value               |
| `aspect`     | Aspect ratio                                          |
| `fit`        | CSS `object-fit` mode                                 |
| `priority`   | Loading priority: `eager` or `lazy`                   |
| `image`      | Image config object (overrides individual properties) |
| `className`  | Additional CSS classes                                |

---

#### sfGpsDsAuVic2List

A flexible list supporting ordered, unordered, and icon-prefixed types with optional nesting.

| Property         | Description                                                   |
| ---------------- | ------------------------------------------------------------- |
| `items`          | Array of list items (may be nested)                           |
| `type`           | List type: `unordered` (default), `ordered`, or icon-based    |
| `iconPlacement`  | Icon position relative to text: `before` (default) or `after` |
| `depth`          | Current nesting depth for recursive rendering (default: `0`)  |
| `maxDepth`       | Maximum nesting depth to render                               |
| `withLinkIds`    | Adds ID attributes to link items                              |
| `itemClassName`  | CSS class applied to each list item                           |
| `preventDefault` | Suppresses default link navigation                            |
| `className`      | Additional CSS classes                                        |

Dispatches `itemclick` with `{ action, value, text, index, id, type }`.

---

#### sfGpsDsAuVic2Media

A media embed component for images, video, audio, and data visualisation, with optional fullscreen, transcript, and data-view actions.

| Property          | Description                                |
| ----------------- | ------------------------------------------ |
| `type`            | Media type: image, video, audio, etc.      |
| `variant`         | Visual variant                             |
| `src`             | Media source URL                           |
| `title`           | Media title                                |
| `alt`             | Alt text for images                        |
| `size`            | Media display size                         |
| `showTitle`       | Displays the title below the media element |
| `caption`         | Caption text                               |
| `sourceCaption`   | Source attribution text                    |
| `transcriptUrl`   | URL or anchor for a text transcript        |
| `allowFullscreen` | Enables the fullscreen button              |
| `fullscreenLabel` | Label for the fullscreen button            |
| `downloadUrl`     | URL for a download action                  |
| `downloadLabel`   | Label for the download button              |
| `dSlot`           | Data slot identifier                       |
| `dLabel`          | Data label                                 |
| `className`       | Additional CSS classes                     |

Dispatches `viewfullscreen`, `viewdata`, `viewtranscript`, and `downloadImage`.

---

#### sfGpsDsAuVic2PageAction

A slot-based page action bar (e.g. for sharing, printing, or feedback actions). Content is entirely slot-driven.

| Property    | Description            |
| ----------- | ---------------------- |
| `className` | Additional CSS classes |

---

#### sfGpsDsAuVic2Profile

A user profile summary card with an optional avatar image.

| Property    | Description                   |
| ----------- | ----------------------------- |
| `items`     | Array of profile detail items |
| `image`     | Profile image object          |
| `className` | Additional CSS classes        |

---

#### sfGpsDsAuVic2Progress

A step-progress indicator for multi-step processes with optional expand/collapse for step details.

| Property            | Description                                               |
| ------------------- | --------------------------------------------------------- |
| `steps`             | Array of step objects                                     |
| `currentStep`       | Index of the active step (default: `1`)                   |
| `title`             | Progress section heading (default: `"Progress"`)          |
| `expandable`        | Allows individual steps to be expanded (default: `false`) |
| `autoExpandable`    | Auto-expands the current step (default: `false`)          |
| `initiallyExpanded` | All steps start expanded (default: `false`)               |
| `className`         | Additional CSS classes                                    |

---

#### sfGpsDsAuVic2RelatedLinks

A "Related links" section listing outbound links with a configurable heading.

| Property    | Description                                  |
| ----------- | -------------------------------------------- |
| `title`     | Section heading (default: `"Related Links"`) |
| `items`     | Array of link objects                        |
| `className` | Additional CSS classes                       |

Dispatches `navigate` with the clicked item detail.

---

#### sfGpsDsAuVic2SocialShare

A social sharing widget pre-configured for common networks (Facebook, Twitter/X, LinkedIn, email).

| Property    | Description                                                      |
| ----------- | ---------------------------------------------------------------- |
| `title`     | Widget heading (default: `"Share this page"`)                    |
| `pagetitle` | Title of the page being shared                                   |
| `url`       | URL to share                                                     |
| `email`     | Recipient email address (for email sharing)                      |
| `networks`  | Array of network identifiers to show (defaults to all available) |
| `className` | Additional CSS classes                                           |

---

#### sfGpsDsAuVic2Tag

A single category or topic tag.

| Property    | Description                         |
| ----------- | ----------------------------------- |
| `label`     | Tag display text                    |
| `variant`   | Visual style (default: `"default"`) |
| `className` | Additional CSS classes              |

---

#### sfGpsDsAuVic2Timeline

A vertical timeline of events or steps with optional navigation links.

| Property         | Description                                           |
| ---------------- | ----------------------------------------------------- |
| `items`          | Array of timeline entry objects                       |
| `title`          | Timeline heading (default: `""`)                      |
| `preventDefault` | Suppresses default link navigation (default: `false`) |
| `className`      | Additional CSS classes                                |

Dispatches `navigate` with `{ text, value, index }`.

---

### Layout components

#### sfGpsDsAuVic2LayoutSkipLink

Renders an accessible "skip to content" shortcut link.

| Property   | Description                         |
| ---------- | ----------------------------------- |
| `targetId` | ID of the target element to skip to |

---

#### sfGpsDsAuVic2LayoutBackToTop

A "Back to top" scroll shortcut link.

| Property       | Description                                                  |
| -------------- | ------------------------------------------------------------ |
| `label`        | Link label (default: `"Back to top"`)                        |
| `topElementId` | ID of the element to scroll to (default: `"rpl-skip-links"`) |
| `className`    | Additional CSS classes                                       |

---

#### sfGpsDsAuVic2PageComponentLwr

A named section container for LWR page builders, with a title, anchor ID, and optional full-width mode.

| Property    | Description                                         |
| ----------- | --------------------------------------------------- |
| `title`     | Section title                                       |
| `cid`       | Component ID for anchor link targeting              |
| `fullWidth` | Renders the component full-width (default: `false`) |
| `className` | Additional CSS classes                              |

---

#### sfGpsDsAuVic2SidebarComponentLwr

A two-column (main + sidebar) layout block for LWR pages with configurable grid column classes.

| Property             | Description                                |
| -------------------- | ------------------------------------------ |
| `hasSidebar`         | Shows the sidebar column (default: `true`) |
| `aboveBodyClassName` | CSS classes for the above-body slot area   |
| `bodyClassName`      | CSS classes for the body grid wrapper      |
| `mainClassName`      | CSS classes for the main content column    |
| `sidebarClassName`   | CSS classes for the sidebar column         |
| `belowBodyClassName` | CSS classes for the below-body slot area   |

---

#### sfGpsDsAuVic2CardGridLwr

A responsive card grid layout block for LWR pages.

| Property     | Description                                              |
| ------------ | -------------------------------------------------------- |
| `hasSidebar` | Adjusts the grid for sidebar presence (default: `false`) |
| `className`  | Additional CSS classes                                   |

---

#### sfGpsDsAuVic2StandardPageLayoutLwr

A full-page layout skeleton for standard LWR pages with above-body, main, sidebar, and below-body slot areas.

| Property             | Description                                       |
| -------------------- | ------------------------------------------------- |
| `hasAboveBody`       | Shows the above-body slot area (default: `false`) |
| `hasSidebar`         | Shows the sidebar column (default: `false`)       |
| `hasBelowBody`       | Shows the below-body slot area (default: `false`) |
| `aboveBodyClassName` | CSS classes for the above-body area               |
| `bodyClassName`      | CSS classes for the body grid                     |
| `mainClassName`      | CSS classes for the main content column           |
| `sidebarClassName`   | CSS classes for the sidebar column                |
| `belowBodyClassName` | CSS classes for the below-body area               |

---

#### sfGpsDsAuVic2SidebarPageLayoutLwr

A full-page layout skeleton for sidebar-first LWR pages. Mirrors `sfGpsDsAuVic2StandardPageLayoutLwr` but defaults `hasSidebar` to `true`.

| Property             | Description                                |
| -------------------- | ------------------------------------------ |
| `hasSidebar`         | Shows the sidebar column (default: `true`) |
| `aboveBodyClassName` | CSS classes for the above-body area        |
| `bodyClassName`      | CSS classes for the body grid              |
| `mainClassName`      | CSS classes for the main content column    |
| `sidebarClassName`   | CSS classes for the sidebar column         |
| `belowBodyClassName` | CSS classes for the below-body area        |

---

## Apex classes

| Class                                  | Description                                                      |
| -------------------------------------- | ---------------------------------------------------------------- |
| `SfGpsDsAuVic2EmailTemplateController` | Controller for email templates built with the VIC2 design system |

---

## Multi-runtime architecture

The VIC2 package follows the same multi-runtime convention as `sfGpsDs` and `sfGpsDsAuNsw`. Most interactive components use Light DOM (`renderMode: 'light'`), which allows Ripple 2's global CSS to apply directly without Shadow DOM piercing. The `sfGpsDsAuVic2MarkdownElementComm` component is an exception — it uses Shadow DOM for style isolation.

OmniStudio form adapters are provided in two variants mirroring the base package:

- `omnistudio-managed-package-runtime-forms/` — Managed Package Runtime
- `omnistudio-standard-runtime-forms/` — Standard Runtime

---

## Key design decisions

- **Ripple 2 alignment** — Every component maps directly to a Ripple 2 pattern. Property names mirror the Vue-based Ripple component API where practical, easing migration from Ripple's native implementation.
- **Icon system** — Icons are accessed by name from the Ripple SVG sprite in the static resource. `sfGpsDsAuVic2Icon` abstracts over the sprite reference and exposes Ripple colour and size tokens.
- **Colour themes via `RplColorThemes`** — Components that accept a `theme` or `colour` property are constrained to the `RplColorThemes` enumeration, enforcing design-system colour discipline.
- **Composable mixins** — Complex behaviours (expandable state, breakpoints, step navigation, window resize, accessible containers) are factored into reusable mixins in `mixins-composables/` rather than duplicated across components.
- **HTML sanitisation** — `sfGpsDsAuVic2Content` and `sfGpsDsAuVic2MarkupElementComm` sanitise HTML before injection, using VIC2-specific plug-ins from `functions/` that allow safe Ripple-specific markup patterns through the whitelist.
- **TypeScript throughout** — All core components are authored in TypeScript with shared type definitions in `typings/`.
