import { LightningElement, api } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import cBasePath from "@salesforce/community/basePath";

export default class SfGpsDsNavigationService extends NavigationMixin(
  LightningElement
) {
  @api navigateNavMenu(menuEntry) {
    switch (menuEntry.Type) {
      case "ExternalLink":
        if (menuEntry.TargetPrefs === "OpenExternalLinkInSameTab") {
          window.open(menuEntry.Target, "_self");
        } else {
          this.navigateTo("standard__webPage", {
            url: menuEntry.Target
          });
        }
        break;

      case "GlobalAction":
        // menuEntry.Target => name of Global Action
        // TODO handle
        break;

      case "Event":
        switch (menuEntry.Target) {
          case "Login":
            this.navigateTo("comm__loginPage", {
              actionName: "login"
            });
            break;

          case "Logout":
            this.navigateTo("comm__loginPage", {
              actionName: "logout"
            });
            break;

          default:
        }

        break;

      case "InternalLink":
        this.navigateTo("standard__webPage", {
          url: cBasePath + menuEntry.Target
        });
        break;

      case "NavigationalTopic":
        console.log("navtopic", JSON.stringify(menuEntry));
        // TODO handle
        break;

      case "SalesforceObject":
        this.navigateTo(
          "standard__objectPage",
          {
            objectApiName: menuEntry.Target,
            actionName: "list"
          },
          {
            filterName: menuEntry.DefaultListViewId
          }
        );
        break;

      default:
        // SystemLink -> Safe to ignore
        // MenuLabel -> Safe to ignore
        break;
    }
  }

  @api navigateTo(type, config, state = null) {
    this[NavigationMixin.Navigate]({
      type: type,
      attributes: config,
      state: state
    });
  }
}
