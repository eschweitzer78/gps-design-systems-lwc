## Change log

### 3 June 2024

#### NSW DS: Added support for the Steps element

We added support for the steps element, enabling to draw a connection for the user between linear pieces of information. Markdown content is supported in Aura and up to 12 steps with a slot can be configured in LWR.

Refer to [`sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswSteps/lwc/sfGpsDsAuNswStepsComm`](sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswSteps/lwc/sfGpsDsAuNswStepsComm) and [`sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswSteps/lwc/sfGpsDsAuNswStepsLwr`](sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswSteps/lwc/sfGpsDsAuNswStepsLwr)

### 2 June 2024

#### NSW DS: Added support Breadcrumbs in the LWR runtime

The default styling of the Breadcrumbs is slightly different in the LWR runtime and we added a specific element so as not to impact existing Aura sites.

Refer to [`sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswBreadcrumbs/lwc/sfGpsDsAuNswBreadcrumbsLwr`](sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswBreadcrumbs/lwc/sfGpsDsAuNswBreadcrumbsLwr)

#### NSW DS: Added support for NSW Grid in the LWR runtime

The NSW Grid element for LWR allows up to 12 columns over 1 or multiple rows. All the configuration is based on CSS classes applied on the grid or columns. Read digital.NSW's grid guide for more details on these.

Refer to [`sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswGridLwr`](sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswGridLwr)

#### NSW DS: Added a stylesheet for the LWR BYO template

Refer to [`sfGpsDsAuNsw/main/default/staticresources/sfGpsDsAuNsw/byo_lwr-min.css`](sfGpsDsAuNsw/main/default/staticresources/sfGpsDsAuNsw/byo_lwr-min.css)

### 21 May 2024

#### NSW DS: Added a theme configuration to show standard Omniscript action buttons in the NSW Design System template

We added a checkbox in the theme layout configuration used in the NSW Design System template so that designer have the option of showing the standard Omniscript action buttons (previous, next, etc...). This is useful when the library's Omniscript Step override is not used.

### VIC DS: Coping with Customer Service Template heading styling changes

The Summer'24 release Customer Service Template introduced a change to headings with bold font-weight being added to h2 and h4. We adjusted stylesheets to align with VIC DS where h2 and h4 use the heading font with normal font-weight.

Refer to [`sfGpsDsAuVic/main/default/staticresources/sfGpsDsAuVic/customer_service-min.scss`](sfGpsDsAuVic/main/default/staticresources/sfGpsDsAuVic/customer_service-min.scss)

### 9 May 2024

#### VIC2 DS: Released new VIC2 Design System aligned with the Australian State of Victoria Government Ripple v2 Design System

We added support for the Victorian Government [Ripple v2 Design System](https://www.ripple.sdp.vic.gov.au) pursuant to the deprecation of Ripple v1. This is largerly a new build with an LWR-first approach (but compatible with Aura sites). The current support is for Experience Cloud components (a vast majority of those published by VIC SDP) with Omnistudio form components planned for later this year.

Refer to [`sfGpsDsAuVic2/main/default`](sfGpsDsAuVic2/main/default)

### 10 April 2024

#### VIC DS: Added Places Typeahead for Omnistudio

We added support for the Omnistudio Places Typeahead (a Typeahead element where the `Enabled Google Maps Autocomplete` option is checked).

Refer to [`sfGpsDsAuVic/main/default/lwc/sfGpsDsAuVicFormPlacesTypeaheadOsN`](sfGpsDsAuVic/main/default/lwc/sfGpsDsAuVicFormPlacesTypeaheadOsN)

#### Base: packaged as an unmanaged package for third-party use

While the base content is now released as a part of all the design system libraries' packages in this repo, we have resumed publishing it as a separate package for third-party use.

### 30 January 2024

#### FrGov DS: Released Omnistudio support for the French Government Design System

We added support for Omnistudio elements aligning with the French Government Design System also known as [Système de Design de l'État](https://www.systeme-de-design.gouv.fr). This complements the [Salesforce support library for Experience Cloud elements](https://github.com/pegros/DSFR_LWR) maintained by [Pierre-Emmanuel Gros](https://github.com/pegros).

Refer to [`sfGpsDsFrGov/main/default`](sfGpsDsFrGov/main/default)

### 2 January 2024

#### Base: Fix the debounce implementation in Helpers

The debounce helper function now works as intended.

Refer to [`sfGpsDs/main/default/lwc/sfGpsDsHelpers/jsutil_v6.js`](./sfGpsDs/main/default/lwc/sfGpsDsHelpers/jsutil_v6.js)

#### NSW DS: Support for back to top widget as a theme setting

The NSW Design System theme now has an option to activate the back to top widget.

Refer to [`sfGpsDsAuNsw/main/default/aura/sfGpsDsAuNswAuraThemeLayout`](./sfGpsDsAuNsw/main/default/aura/sfGpsDsAuNswAuraThemeLayout) and [`sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswBackToTop`](./sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswBackToTop)

#### NSW DS: Fix the navigation issue for Main Nav mega menus with three levels of nesting

Navigation and rendering will work as required depending on the screen form-factor (mobile or desktop).

Refer to [`sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswHeaderMainNav/lwc/sfGpsDsAuNswMainNav`](./sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswHeaderMainNav/lwc/sfGpsDsAuNswMainNav)

#### NSW DS: Correct the semantical mix-up between title and headline in Card and Content Block

Both Card and Content Block used to have mixed-up semantics for headline with the title text being referred to as the
headline, whereas headline is actually a styling attribute that applies to the title in a card only. As a result, we are deprecating `sfGpsDsAuNswCardComm` and `sfGpsDsAuNswContentBlockComm` and replacing them by `sfGpsDsAuNswCardV2Comm` and `sfGpsDsAuContentBlockV2Comm`.

A new `sfGpsDsAuNswCardV2` content types have also been introduced.

Thoroughly check implications if you have been leveraging the base `sfGpsDsAuNswCard` and `sfGpsDsAuNswContentBlock` LWC elements in your own LWCs.

Refer to [`sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswCard/lwc/sfGpsDsAuNswCardV2Comm`](./sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswCard/lwc/sfGpsDsAuNswCardV2Comm), [`sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswContentBlock/lwc/sfGpsDsAuNswContentBlockV2Comm`](./sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswContentBlock/lwc/sfGpsDsAuNswContentBlockV2Comm/sfGpsDsAuNswContentBlockV2Comm.js), and [`sfGpsDsAuNsw/main/default/managedContentTypes/sfGpsDsAuNswCardV2.managedContentType-meta.xml`](./sfGpsDsAuNsw/main/default/managedContentTypes/sfGpsDsAuNswCardV2.managedContentType-meta.xml).

#### NSW DS: New Media widget

Media lets display an image or a video; future versions will aim at supporting image src sets.

Refer to [`sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswMedia`](./sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswMedia)

#### NSW DS: Further support for LWR with Blocks, Columns, Layouts and a refreshed Section elements.

Refer to [`sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswBlockLwr`](./sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswBlockLwr), [`sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswColumnsLwr`](./sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswColumnsLwr),
[`sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswLayoutLwr`](./sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswLayoutLwr)
and [`sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswSectionLwr`](./sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswSectionLwr)

### 1 December 2023

#### NSW DS: Mark Main Nav pages as active

When using the one-level version of `sfGpsDsAuNswMainNav`, entries are now marked active when the current visible page's URL starts with the entry's URL.

Refer to [`sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswHeaderMainNav/lwc/sfGpsDsAuNswMainNav`](./sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswHeaderMainNav/lwc/sfGpsDsAuNswMainNav)

#### NSW DS: Support for social media icons in the Footer

We now support adding social media icons and links for LinkedIn, Twitter/X and Facebook in the footer.

Refer to [`sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswFooter/lwc/sfGpsDsAuNswFooterComm`](./sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswFooter/lwc/sfGpsDsAuNswFooterComm)

#### NSW DS: Support multiple modes for the Progress Indicator

The Progress Indicator now supports multiple step counting modes:

- `current`, which is the default mode and marks the current page as active,
- `cumulative`, which marks the current and all previous pages as active,
- `label-only`, which does not render rectangles for the pages.

Refer to [`sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswProgressIndicator`](./sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswProgressIndicator)

### 29 November 2023

#### NSW DS: Improved LWR support

Even though LWR still has a few missing capabilities (e.g. no file upload, planed for v250 Safe Harbour), it is very well
suited for building NSW gov pages with containers and sections, applying the colour schemes etc. We improved our support
by fixing accessibility issues in `sfGpsDsAuNswThemeLayoutLwr` and fixing minor issues with the LWR Accordion and Tabs which
feature slots to drop content.

### 22 November 2023

#### NSW DS: Added breadcrumbs specialised with smarts for record pages

`sfGpsDsAuNswBreadcrumbsRecordComm` add smarts and introspects object name and record name on record list and detail pages.

Refer to [`sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswBreadcrumbs/lwc/sfGpsDsAuNswBreadcrumbsRecordComm`](./sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswBreadcrumbs/lwc/sfGpsDsAuNswBreadcrumbsRecordComm)

#### NSW DS: Addition of Markup and Markdown elements for Experience Cloud

Edit HTML Markup and Markdown content with a full page editor based on CodeMirror v5. Both offer much better CSS creep control compared to the original Experience Cloud HTML Editor which injects CSS from the Rich Text Editor.

Refer to [`sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswMarkupElement/lwc/sfGpsDsAuNswMarkupElementComm`](./sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswMarkupElement/lwc/sfGpsDsAuNswMarkupElementComm) and [`sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswMarkdownElement/lwc/sfGpsDsAuNswMarkdownElementComm`](./sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswMarkdownElement/lwc/sfGpsDsAuNswMarkdowmElementComm)

#### NSW DS: Added a full-fledge NSW Design System template

Create a straw man site styled with NSW DS in seconds with our click and configure template.

### 16 November 2023

#### UK.GOV: Added support for the Google Places Typeahead

UK.GOV now has a Google Places Typeahead for Omnistudio.

Refer to [`sfGpsDsUkGov/main/default/lwc/sfGpsDsUkGovFormPlacesTypeaheadOsN`](./sfGpsDsUkGov/main/default/lwc/sfGpsDsUkGovFormPlacesTypeaheadOsN).

### 14 November 2023

#### NSW DS: Added "disabled" look and feel to prev/next buttons for sfGpsDsAuNswPagination

We revised the prev and next button styling when they're disabled to align with recent changes in the NSW DS.

Refer to [`sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswPagination`](./sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswPagination)

### UK.GOV: adjusted top margin for disclosure, file and text area

We reduced the top margin for the OmniStudio disclosure, file and text area elements.

Refer to [`sfGpsDsUkGov/main/default/lwc/sfGpsDsUkGovFormDisclosureOsN`](./sfGpsDsUkGov/main/default/lwc/sfGpsDsUkGovFormDisclosureOsN), [`sfGpsDsUkGov/main/default/lwc/sfGpsDsUkGovFormFileOsN`](./sfGpsDsUkGov/main/default/lwc/sfGpsDsUkGovFormFileOsN) and [`sfGpsDsUkGov/main/default/lwc/sfGpsDsUkGovFormTextareaOsN`](./sfGpsDsUkGov/main/default/lwc/sfGpsDsUkGovFormTextareaOsN)

### 13 November 2023

#### All DS implementations: fixing smart lookup/manual label

Adjusted styling in all DSes so that the smart lookup or manual entry label looks like or is a link. Also adjusted reactiveness so that the label is always shown on a single line.

#### NSW DS: Fixing Card Collection so that the orientation attribute is taken into account

The Card Collection did have an orientation attribute but it wasn't propagated to individual cards within the collection.

### 7 November 2023

Release tested against Omnistudio 246.10, which required heavy template and internal behaviour changes – please review your code thoroughly if you subclassed any of the Omnistudio elements we provide.

The API had been bumped up to v59.0 throughout the library.

#### Base library sfGpsDs: removed images.unsplash.com as a trusted site

We have removed unsplash.com as a trusted site as it was only required for our demo/documentation website.

#### Base library sfGpsDs: added insulation classes for all Omnistudio overrides

We have added insulation classes that are wedged between the Omnistudio overrides in each DS and the original Omnistudio LWC classes. This enables us to add workarounds only once with a flow-on effect to all DS implementations and reduces code sprawl.

#### All DS implementations: support for configurable error message on a per element basis

You can now use the _Edit Properties as JSON_ hyperlink at the bottom of an element's configuration panel in Omnistudio, add one of the following keys and associate it with a custom error text per error type as required:

- messageWhenValueMissing,
- messageWhenTooShort,
- messageWhenTooLong,
- messageWhenBadInput,
- messageWhenRangeOverflow
- messageWhenRangeUnderflow,
- messageWhenStepMismatch,
- messageWhenTypeMismatch,
- messageWhenMaskIncomplete.

For instance:

`"messageWhenValueMissing": "You must tell us your date of birth."`

#### All DS implementations: support for Omnistudio 246.10

We handled all the issues that arose for internal changes in Omnistudio 246.x elements (in particular the date picker) and tested against 246.10.

#### All DS implementations: unified dropdown user experience

We aimed at standardising the user experience on all widgets that involve a dropdown across implementations: lookup, selected, time picker, and typeahead (incl. address typeahead).
Depending on the element, there might be a difference in behaviour compared to the prior release, especially when it comes to focus management.

#### All DS implementations: working around element validation issues with SetErrors

We aimed at putting a workaround in place when it comes to element validation, in particular when a **Set Errors** step is involved which we believe has a conceptual flaw:
the standard Omnistudio behaviour is to clear the custom error set by **Set Errors** on focus out of the element when the user has been brought back to the offending step.
This unfortunately has a side-effect that is not perceptible with the original SLDS look-and-feel but is very undesirable with most overriden DS implementations: any error text/decoration that has a larger height
would disappear on focus out, e.g. when clicking on the next button. If that is high enough, it will inn turn move the position of the next button on the page, cancelling the click event on the button as it's no longer where the user clicked as _focus out_
events have precedence over _click_ events.

Instead, we clear the custom error set by **Set Errors** as soon as any change is performed on the element. The error text is hence removed before the element loses focus, and the issue with ignored clicks on the Next button disappears.
We have tested thoroughly as it's a major behaviour change and haven't detected any issue, but please report any observed unwanted behaviour when users want to move to the next page.

#### NSW DS: upgraded to nsw-design-system 3.11.3

We have upgraded the nsw-design-system dependency from 3.8 to 3.11.3

#### NSW DS: fixed issue with accessibility in header

We have fixed an issue when HTML element IDs were not properly taken into account in accessibility attributes.

#### Service NSW DS: added support for Omnistudio address typeahead, lookup, select and typeahead

We added support for Omnistudio address typeahead, lookup, select and typeahead elements.

#### GOV.UK DS: upgraded to govuk-frontend 4.7

We have upgraded the govuk-frontend dependency from 4.6 to 4.7.

#### GOV.UK DS: added multiple new elements for Omnistudio

We have added support for the following elements: address typeahead, single checkbox, currency, date, date time, disclosure, email, file, lookup, messaging, multi-select, number, password, select, text, textarea, time, typeahead and URL.

#### GOV.UK DS: rework of top of the page error list

We are now leveraging standard Omnistudio functionality to work out which elements are in error on the current step. Please be aware of limitations: this will report only errors directly "owned" by the step, excluding addresss typeahead and
typeahead (which are nested in typeahead blocks) or any elements nested in an edit block or simple block.

#### VIC DS: upgraded to Ripple Global 1.38.3

We have upgraded the Ripple Global dependency from 1.33 to 1.38.3.

####

### 11 October 2023

Moving repo to Salesforce Labs.

### 16 June 2023

#### Fixing an issue on Date, Date Time and Time widgets for Omnistudio in all Design Systems

Fields that were marked as read-only still enabled to click, get the drop-down menu and change the value.

#### Fixing some accessibility issues

NSW DS Header and VIC DS Menu had accessibility issues due to some element IDs not being generated properly.

#### Fixing some validation issues for Address lookup in NSW DS and VIC DS

Refer to [`sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswForm/lwc/sfGpsDsAuNswFormAddressTypeaheadOsN`](./sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswForm/lwc/sfGpsDsAuNswFormAddressTypeaheadOsN) and [`sfGpsDsAuVic/main/default/lwc/sfGpsDsAuVicFormAddressTypeaheadOsN`](./sfGpsDsAuVic/main/default/lwc/sfGpsDsAuVicFormAddressTypeaheadOsN).

#### Fixing some validation issues for other widgets in NSW DS and VIC DS

Includes checkbox and most text-based and number-based input fields.

#### Added support for Omnistudio formula in NSW DS

An override now exists to display Omnistudio formula field with the NSW DS look and feel.

Refer to [`sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswForm/lwc/sfGpsDsAuNswFormFormulaOsN`](./sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswForm/lwc/sfGpsDsAuNswFormFormulaOsN).

### 4 June 2023

#### Introducing the NSW DS Table widget with client side pagination

Refer to [`sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswTable`](./sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswTable).

### 1 June 2023

#### Better Integration Procedure error handling, in particular for navs

We added better error handling for navigation widgets and general OmniStudio Integration Procedure integration. Any singular payload returned by an IP with values set for the `hasError`, `error` and `errorMessage` attributes will be taken as an indication that the IP execution did not end gracefully and the error message will be made available to the consuming LWC for display.

**Important behaviour change**: from this release, the `optionsJSON` attribute must be set for the IP to be invoked. This has a ripple effect on every widget that leverages an IP.

Refer to [`sfGpsDs/main/default/lwc/sfGpsDsIpLwc`](./sfGpsDs/main/default/lwc/sfGpsDsIpLwc) and [`sfGpsDs/main/default/lwc/sfGpsDsIpLwcOsN`](./sfGpsDs/main/default/lwc/sfGpsDsIpLwcOsN).

This also has an implication with the `sfGpsDs_CommunityNav` pre-canned IP and the supporting Apex class [`sfGpsDs/main/default/classes/SfGpsDsNavigationORA.cls`](./sfGpsDs/main/default/classes/SfGpsDsNavigationORA.cls). It has been updated in this release to issue better error information, in particular when the nav API name is incorrect.

#### Support for vertical logo stacking in NSW DS Header

The co-brand logo can now be vertically stacked under the masterbrand when rendered in mobile by setting the `mobileLogoStacking` property. This is also reflected in the Header and Main nav combination.

Refer to [`sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswHeaderMainNav/lwc/sfGpsDsAuNswHeaderComm`](./sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswHeaderMainNav/lwc/sfGpsDsAuNswHeaderComm).

### 29 May 2023

#### Support for Notifications and Profile Menu in NSW DS Header

We released a series of updates to make notifications and the profile/user menu of standard Experience Cloud templates available in the different Design Systems,
with the first cab of the rank being the NSW DS.

Refer to [`sfGpsDsAuNsw/main/default/aura/sfGpsDsAuNswHeaderAura`](./sfGpsDsAuNsw/main/default/aura/sfGpsDsAuNswHeaderAura) and [`sfGpsDsAuNsw/main/default/aura/sfGpsDsAuNswHeaderMainNavAura`](./sfGpsDsAuNsw/main/default/aura/sfGpsDsAuNswHeaderMainNavAura).

Support for the profile menu has also been added in LWC (no notifications though as there is platform support for them); refer to [`sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswHeaderMainNav/lwc/sfGpsDsAuNswHeaderProfile`](./sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswHeaderMainNav/lwc/sfGpsDsAuNswHeaderProfile), [`sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswHeaderMainNav/lwc/sfGpsDsAuNswHeader`](./sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswHeaderMainNav/lwc/sfGpsDsAuNswHeader) and [`sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswHeaderMainNav/lwc/sfGpsDsAuNswHeaderComm`](./sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswHeaderMainNav/lwc/sfGpsDsAuNswHeaderComm).

#### Permission sets for community users

Permissions sets have been added to make the process of getting authenticated and guest community users access to the right assets easier.

Refer to [`sfGpsDsAuNsw/main/default/permissionsets/sfGpsDsAuNswUser.permissionset-meta.xml`](./sfGpsDsAuNsw/main/default/permissionsets/sfGpsDsAuNswUser.permissionset-meta.xml), [`sfGpsDsAuNswS/main/default/permissionsets/sfGpsDsAuNswSUser.permissionset-meta.xml`](./sfGpsDsAuNswS/main/default/permissionsets/sfGpsDsAuNswSUser.permissionset-meta.xml), [`sfGpsDsAuNsw/main/default/permissionsets/sfGpsDsAuQldUser.permissionset-meta.xml`](./sfGpsDsAuQld/main/default/permissionsets/sfGpsDsAuQldUser.permissionset-meta.xml), [`sfGpsDsAuNsw/main/default/permissionsets/sfGpsDsAuVicUser.permissionset-meta.xml`](./sfGpsDsAuVic/main/default/permissionsets/sfGpsDsAuVicUser.permissionset-meta.xml) and [`sfGpsDsAuNsw/main/default/permissionsets/sfGpsDsUkGovUser.permissionset-meta.xml`](./sfGpsDsUkGov/main/default/permissionsets/sfGpsDsUkGovUser.permissionset-meta.xml).

### 11 May 2023

We released a version of the base `sfGpsDs` library to fix an issue occuring in Summer'23 at LWC compile time for modules importing `sfGpsDsMarkdown`.

Refer to [`sfGpsDs/main/default/lwc/sfGpsDsMarkdown`](./sfGpsDs/main/default/lwc/sfGpsDsMarkdown).

### 13 Apr 2023

We released a new version of NSW DS aligning with the official v3.5 release by digital.NSW. It adds an alpha version of a record list view, status labels, tabs, side nav, in-page navigation as well as modal dialog capabilities.

#### NSW DS Record List View

Refer to [`sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswListView/lwc/sfGpsDsAuNswListViewComm`](./sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswListView/lwc/sfGpsDsAuNswListViewComm) and [`sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswListView/lwc/sfGpsDsAuNswListViewItem`](./sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswListView/lwc/sfGpsDsAuNswListViewItem).

#### NSW DS Status Label

We introduced support for Status Label.

Refer to [`sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswStatusLabel/lwc/sfGpsDsAuNswStatusLabel`](./sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswStatusLabel).

#### NSW DS Dialog

We introduced support for Dialog.

Refer to [`sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswDialog`](./sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswDialogComm).

### 07 Mar 2023

We released VIC DS support for OmniStudio overrides and improved a few widgets.

#### VIC DS Alert Base

Refer to [`sfGpsDsAuVic/main/default/lwc/sfGpsDsAuVicAlertBaseComm`](./sfGpsDsAuVic/main/default/lwc/sfGpsDsAuVicAlertBaseComm).

Added support for separation of title and content from the same attribute by
using the double carriage return marker.

#### VIC DS Hero Banner CTA

Refer to [`sfGpsDsAuVic/main/default/lwc/sfGpsDsAuVicHeroBannerCtaComm`](./sfGpsDsAuVic/main/default/lwc/sfGpsDsAuVicHeroBannerCtaComm).

Full implementation.

### 09 Feb 2023

We progressed or implemented the following items:

#### VIC DS Site Footer

Refer to [`sfGpsDsAuVic/main/default/lwc/sfGpsDsAuVicSiteFooterComm`](./sfGpsDsAuVic/main/default/lwc/sfGpsDsAuVicSiteFooterComm), [`sfGpsDsAuVic/main/default/lwc/sfGpsDsAuVicSiteFooterInternal`](./sfGpsDsAuVic/main/default/lwc/sfGpsDsAuVicSiteFooterInternal) and [`sfGpsDsAuVic/main/default/lwc/sfGpsDsAuVicFooterSocialLinks`](./sfGpsDsAuVic/main/default/lwc/sfGpsDsAuVicFooterSocialLinks).

We added configurability of Nav for the VIC DS Site Footer, plugged the masonry logic for the Nav items, and implemented the Social Links component.

#### VIC DS Campaign Secondary

Refer to [`sfGpsDsAuVic/main/default/lwc/sfGpsDsAuVicCampaignSecondaryComm`](./sfGpsDsAuVic/main/default/lwc/sfGpsDsAuVicCampaignSecondaryComm).

Full implementation.

#### VIC DS Meta Tags

Refer to [`sfGpsDsAuVic/main/default/lwc/sfGpsDsAuVicMetaTagsComm`](./sfGpsDsAuVic/main/default/lwc/sfGpsDsAuVicMetaTagsComm).

Full implementation.

#### VIC DS Share This

Refer to [`sfGpsDsAuVic/main/default/lwc/sfGpsDsAuVicShareThisComm`](./sfGpsDsAuVic/main/default/lwc/sfGpsDsAuVicShareThisComm).

Full implementation.

### 04 Feb 2023

We introduced the following items:

#### Victoria DS

We released a major update of the Victoria DS, taking it to pilot stage after a series of improvements since mid December 2022.

### 30 Jan 2023

We made the following changes:

#### Changes in Navigation APEX

Refer to [`sfGpsDs/main/default/classes/sfGpsDsNavigationORA.cls`](./sfGpsDs/main/default/classes/sfGpsDsNavigationORA.cls).

We took into account a not well documented change in Spring'23 that makes querying NavMenuItems by a relationship query using the Navigation name fail. Replaced SOQL by the use of the ConnectApi.

This had ripple effects on the sfGpsDsIpLwc and sfGpsDsNAvigation LWCs.

### 23 Dec 2022

We introduced the following items:

#### NSW DS List View

Refer to [`sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswListView`](./sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswListView) and [`sfGpsDs/main/default/classes/SfGpsDsListViewController.cls`](./sfGpsDs/main/default/classes/SfGpsDsListViewController.cls).

We added an experimental record list back-end logic for use with the NSW DS List View displaying record details
based on object and list view names.

### 30 Nov 2022

We introduced the following items:

#### NSW DS List Item

Refer to [`sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswListItem`](./sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswListItem).

This is the base object that implements the NSW Design System List Item widget.

As such it is supposed to be used in a composite object along with a Results bar and Pagination, and not really meant to be used stand-alone in a community. We however made a Community compatible variant available for demonstration purposes.

#### NSW DS Pagination

Refer to [`sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswPagination`](./sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswPagination).

This is the base object that implements the NSW Design System Pagination widget.

As such it is supposed to be used in a composite object along with a Results bar and List Items, and not really meant to be used stand-alone in a community. We however made a Community compatible variant available for demonstration purposes.

#### NSW DS Results bar

Refer to [`sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswResultsBar`](./sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswResultsBar).

This is the base object that implements the NSW Design System Results bar widget.

As such it is supposed to be used in a composite object along with a Pagination and List Items, and not really meant to be used stand-alone in a community. We however made a Community compatible variant available for demonstration purposes.

#### NSW Card Managed Content Type

Refer to [`sfGpsDsAuNsw/main/default/managedContentTypes/sfGpsDsAuNswCard`](./sfGpsDsAuNsw/main/default/managedContentTypes/sfGpsDsAuNswCard.managedContentType-meta.xml).

While you would normally map content in whichever format you have in the CMS to the NSW DS Card using an integration procedure, we have conveniently introduced a type that aligns 1-to-1 with the attributes of the card for demo purposes.

#### NSW Content Block Managed Content Type

Refer to [`sfGpsDsAuNsw/main/default/managedContentTypes/sfGpsDsAuNswBlock`](./sfGpsDsAuNsw/main/default/managedContentTypes/sfGpsDsAuNswContentBlock.managedContentType-meta.xml).

While you would normally map content in whichever format you have in the CMS to the NSW DS Content Block using an integration procedure, we have conveniently introduced a type that aligns 1-to-1 with the attributes of the content block for demo purposes.
