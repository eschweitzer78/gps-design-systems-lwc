import type { ConnectApiNavigationMenuItem } from "@salesforce/apex/SfGpsDsNavigationORA.getNavigationItemsV2";

const collection: ConnectApiNavigationMenuItem[] = [
  {
    actionType: "ExternalLink",
    actionValue: "https://www.nsw.gov.au/accessibility-statement",
    imageUrl: undefined,
    label: "Accessibility statement",
    subMenu: [],
    target: "CurrentWindow"
  },
  {
    actionType: "ExternalLink",
    actionValue: "https://www.nsw.gov.au/nsw-government/copyright",
    imageUrl: undefined,
    label: "Copyright",
    subMenu: [],
    target: "CurrentWindow"
  },
  {
    actionType: "ExternalLink",
    actionValue: "https://www.nsw.gov.au/nsw-government/disclaimer",
    imageUrl: undefined,
    label: "Disclaimer",
    subMenu: [],
    target: "CurrentWindow"
  }
];

export default collection;
