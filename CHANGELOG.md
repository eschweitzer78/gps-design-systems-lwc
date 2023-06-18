## Change log

### 16 June 2023

#### Fixing an issue on Date, Date Time and Time widgets for Omnistudio in all Design Systems

Fields that were marked as read-only still enabled to click, get the drop-down menu and change the value.

#### Fixing some accessibility issues

NSW DS Header and VIC DS Menu had accessibility issues due to some element IDs not being generated properly.

#### Fixing some validation issues for Address lookup in NSW DS and VIC DS

Refer to [`sfGpsDsAuNsw/main/default/sfGpsDsAuNswFormAddressTypeaheadOsN`](./sfGpsDsAuNsw/main/default/sfGpsDsAuNswFormAddressTypeaheadOsN) and [`sfGpsDsAuVic/main/default/sfGpsDsAuVicFormAddressTypeaheadOsN`](./sfGpsDsAuVic/main/default/sfGpsDsAuVicFormAddressTypeaheadOsN).

#### Fixing some validation issues for other widgets in NSW DS and VIC DS

Includes checkbox and most text-based and number-based input fields.

#### Added support for Omnistudio formula in NSW DS

An override now exists to display Omnistudio formula field with the NSW DS look and feel.

Refer to [`sfGpsDsAuNsw/main/default/sfGpsDsAuNswFormFormulaOsN`](./sfGpsDsAuNsw/main/default/sfGpsDsAuNswFormFormulaOsN).

### 4 June 2023

#### Introducing the NSW DS Table widget with client side pagination

Refer to [`sfGpsDsAuNsw/main/default/sfGpsDsAuNswTable`](./sfGpsDsAuNsw/main/default/sfGpsDsAuNswTable) and [`sfGpsDsAuNsw/main/default/sfGpsDsAuNswTableComm`](./sfGpsDsAuNsw/main/default/sfGpsDsAuNswTableComm).

### 1 June 2023

#### Better Integration Procedure error handling, in particular for navs

We added better error handling for navigation widgets and general OmniStudio Integration Procedure integration. Any singular payload returned by an IP with values set for the `hasError`, `error` and `errorMessage` attributes will be taken as an indication that the IP execution did not end gracefully and the error message will be made available to the consuming LWC for display.

**Important behaviour change**: from this release, the `optionsJSON` attribute must be set for the IP to be invoked. This has a ripple effect on every widget that leverages an IP.

Refer to [`sfGpsDs/main/default/lwc/sfGpsDsIpLwc`](./sfGpsDs/main/default/lwc/sfGpsDsIpLwc) and [`sfGpsDs/main/default/lwc/sfGpsDsIpLwcOsN`](./sfGpsDs/main/default/lwc/sfGpsDsIpLwcOsN).

This also has an implication with the `sfGpsDs_CommunityNav` pre-canned IP and the supporting Apex class [`sfGpsDs/main/default/classes/SfGpsDsNavigationORA.cls`](./sfGpsDs/main/default/classes/SfGpsDsNavigationORA.cls). It has been updated in this release to issue better error information, in particular when the nav API name is incorrect.

#### Support for vertical logo stacking in NSW DS Header

The co-brand logo can now be vertically stacked under the masterbrand when rendered in mobile by setting the `mobileLogoStacking` property. This is also reflected in the Header and Main nav combination.

Refer to [`sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswHeaderComm`](./sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswHeaderComm).

### 29 May 2023

#### Support for Notifications and Profile Menu in NSW DS Header

We released a series of updates to make notifications and the profile/user menu of standard Experience Cloud templates available in the different Design Systems,
with the first cab of the rank being the NSW DS.

Refer to [`sfGpsDsAuNsw/main/default/aura/sfGpsDsAuNswHeaderAura`](./sfGpsDsAuNsw/main/default/aura/sfGpsDsAuNswHeaderAura) and [`sfGpsDsAuNsw/main/default/aura/sfGpsDsAuNswHeaderMainNavAura`](./sfGpsDsAuNsw/main/default/aura/sfGpsDsAuNswHeaderMainNavAura).

Support for the profile menu has also been added in LWC (no notifications though as there is platform support for them); refer to [`sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswHeaderProfile`](./sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswHeaderProfile), [`sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswHeader`](./sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswHeader) and [`sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswHeaderComm`](./sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswHeaderComm).

#### Permission sets for community users

Permissions sets have been added to make the process of getting authenticated and guest community users access to the right assets easier.

Refer to [`sfGpsDsAuNsw/main/default/permissionsets/sfGpsDsAuNswUser.permissionset-meta.xml`](./sfGpsDsAuNsw/main/default/permissionsets/sfGpsDsAuNswUser.permissionset-meta.xml), [`sfGpsDsAuNswS/main/default/permissionsets/sfGpsDsAuNswSUser.permissionset-meta.xml`](./sfGpsDsAuNswS/main/default/permissionsets/sfGpsDsAuNswSUser.permissionset-meta.xml), [`sfGpsDsAuNsw/main/default/permissionsets/sfGpsDsAuQldUser.permissionset-meta.xml`](./sfGpsDsAuQld/main/default/permissionsets/sfGpsDsAuQldUser.permissionset-meta.xml), [`sfGpsDsAuNsw/main/default/permissionsets/sfGpsDsAuVicUser.permissionset-meta.xml`](./sfGpsDsAuVic/main/default/permissionsets/sfGpsDsAuVicUser.permissionset-meta.xml) and [`sfGpsDsAuNsw/main/default/permissionsets/sfGpsDsUkGovUser.permissionset-meta.xml`](./sfGpsDsUkGov/main/default/permissionsets/sfGpsDsUkGovUser.permissionset-meta.xml).

### 11 May 2023

We released a version of the base `sfGpsDs` library to fix an issue occuring in Summer'23 at LWC compile time for modules importing `sfGpsDsMarkdown`.

Refer to [`sfGpsDs/main/default/lwc/sfGpsDsMarkdown`](./sfGpsDs/main/default/lwc/sfGpsDsMarkdown).

### 13 Apr 2023

We released a new version of NSW DS aligning with the official v3.5 release by digital.NSW. It adds an alpha version of a record list view, status labels, tabs, side nav, in-page navigation as well as modal dialog capabilities.

#### NSW DS Record List View

Refer to [`sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswListViewComm`](./sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswListViewComm) and [`sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswListViewItem`](./sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswListViewItem).

#### NSW DS Status Label

Refer to [`sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswStatusLabelComm`](./sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswStatusLabelComm).

#### NSW DS Dialog

Refer to [`sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswDialogComm`](./sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswDialogComm).

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

Refer to [`sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswListViewComm`](./sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswListViewComm) and [`sfGpsDs/main/default/classes/SfGpsDsListViewController.cls`](./sfGpsDs/main/default/classes/SfGpsDsListViewController.cls).

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
