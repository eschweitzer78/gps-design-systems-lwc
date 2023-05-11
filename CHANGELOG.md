## Change log

### 11 May 2023

We released a version of the base `sfGpsDs` library to fix an issue occuring in Summer'23 at LWC compile time for modules importing `sfGpsDsMarkdown`.

## 13 Apr 2023

We released a new version of NSW DS aligning with the official v3.5 release by digital.NSW. It adds an alpha version of a record list view, status labels, tabs, side nav, in-page navigation as well as modal dialog capabilities.

### 07 Mar 2023

We released VIC DS support for OmniStudio overrides and improved a few widgets.

#### VIC DS Alert Base

Refer to `sfGpsDsAuVic/main/default/lwc/sfGpsDsAuVicAlertBaseComm`

Added support for separation of title and content from the same attribute by
using the double carriage return marker.

### VIC DS Hero Banner CTA

Refer to `sfGpsDsAuVic/main/default/lwc/sfGpsDsAuVicHeroBannerCtaComm`

Full implementation.

### 09 Feb 2023

We progressed or implemented the following items:

#### VIC DS Site Footer

Refer to `sfGpsDsAuVic/main/default/lwc/sfGpsDsAuVicSiteFooterComm`, `sfGpsDsAuVic/main/default/lwc/sfGpsDsAuVicSiteFooterInternal` and `sfGpsDsAuVic/main/default/lwc/sfGpsDsAuVicFooterSocialLinks`.

We added configurability of Nav for the VIC DS Site Footer, plugged the masonry logic for the Nav items,
and implemented the Social Links component.

#### VIC DS Campaign Secondary

Refer to `sfGpsDsAuVic/main/default/lwc/sfGpsDsAuVicCampaignSecondaryComm`.

Full implementation.

#### VIC DS Meta Tags

Refer to `sfGpsDsAuVic/main/default/lwc/sfGpsDsAuVicMetaTagsComm`.

Full implementation.

#### VIC DS Share This

Refer to `sfGpsDsAuVic/main/default/lwc/sfGpsDsAuVicShareThisComm`.

Full implementation.

### 04 Feb 2023

We introduced the following items:

#### Victoria DS

We released a major update of the Victoria DS, taking it to pilot stage after a series of improvements
since mid December 2022.

### 30 Jan 2023

We made the following changes:

#### Changes in Navigation APEX

Refer to `sfGpsDs/main/default/classes/sfGpsDsNavigationORA.cls`.

We took into account a not well documented change in Spring'23 that makes querying NavMenuItems by a
relationship query using the Navigation name fail. Replaced SOQL by the use of the ConnectApi.
This had ripple effects on the sfGpsDsIpLwc and sfGpsDsNAvigation LWCs.

### 23 Dec 2022

We introduced the following items:

#### NSW DS List View

Refer to `sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswListViewComm/sfGpsDsAuNswListViewComm` and `sfGpsDs/main/default/classes/SfGpsDsListViewController.cls`.

We added an experimental record list back-end logic for use with the NSW DS List View displaying record details
based on object and list view names.

### 30 Nov 2022

We introduced the following items:

#### NSW DS List Item

Refer to `sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswListItem`.

This is the base object that implements the NSW Design System List Item widget.

As such it is supposed to be used in a composite object along with a Results bar and Pagination, and not really meant to be used stand-alone in a community. We however made a Community compatible variant available for demonstration purposes.

#### NSW DS Pagination

Refer to `sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswPagination`.

This is the base object that implements the NSW Design System Pagination widget.

As such it is supposed to be used in a composite object along with a Results bar and List Items, and not really meant to be used stand-alone in a community. We however made a Community compatible variant available for demonstration purposes.

#### NSW DS Results bar

Refer to `sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswResultsBar`.

This is the base object that implements the NSW Design System Results bar widget.

As such it is supposed to be used in a composite object along with a Pagination and List Items, and not really meant to be used stand-alone in a community. We however made a Community compatible variant available for demonstration purposes.

#### NSW Card Managed Content Type

Refer to `sfGpsDsAuNsw/main/default/managedContentTypes/sfGpsDsAuNswCard`.

While you would normally map content in whichever format you have in the CMS to the NSW DS Card using an integration procedure, we have conveniently introduced a type that aligns 1-to-1 with the attributes of the card for demo purposes.

#### NSW Content Block Managed Content Type

Refer to `sfGpsDsAuNsw/main/default/managedContentTypes/sfGpsDsAuNswCard`.

While you would normally map content in whichever format you have in the CMS to the NSW DS Content Block using an integration procedure, we have conveniently introduced a type that aligns 1-to-1 with the attributes of the content block for demo purposes.
