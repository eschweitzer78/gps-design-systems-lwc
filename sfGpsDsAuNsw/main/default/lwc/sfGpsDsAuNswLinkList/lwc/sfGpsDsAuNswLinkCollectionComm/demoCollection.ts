import type { ConnectApiNavigationMenuItem } from "@salesforce/apex/SfGpsDsNavigationORA.getNavigationItemsV2";

const collection: ConnectApiNavigationMenuItem[] = [
  {
    actionType: "ExternalLink",
    actionValue: "https://www.nsw.gov.au/accessibility-statement",
    imageUrl: null,
    label: "Accessibility statement",
    subMenu: [],
    target: "CurrentWindow"
  },
  {
    actionType: "ExternalLink",
    actionValue: "https://www.nsw.gov.au/nsw-government/copyright",
    imageUrl: null,
    label: "Copyright",
    subMenu: [],
    target: "CurrentWindow"
  },
  {
    actionType: "ExternalLink",
    actionValue: "https://www.nsw.gov.au/nsw-government/disclaimer",
    imageUrl: null,
    label: "Disclaimer",
    subMenu: [],
    target: "CurrentWindow"
  }
];

export default collection;
