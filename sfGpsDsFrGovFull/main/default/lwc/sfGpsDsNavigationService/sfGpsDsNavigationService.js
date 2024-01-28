import { LightningElement, api } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import cBasePath from "@salesforce/community/basePath";

export default class SfGpsDsNavigationService extends NavigationMixin(
  LightningElement
) {
  @api navigateTo(type, config, state = null) {
    this[NavigationMixin.Navigate]({
      type: type,
      attributes: config,
      state: state
    });
  }

  @api login() {
    this.navigateTo("comm__loginPage", {
      actionName: "login"
    });
  }

  @api logout() {
    this.navigateTo("comm__loginPage", {
      actionName: "logout"
    });
  }

  @api navigateHome() {
    // for some reason comm__namedPage+Home does not seem to work at all.
    this.navigateTo("standard__namedPage", {
      pageName: "home"
    });
  }

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
          case "selfService:doLogin":
            this.navigateTo("comm__loginPage", {
              actionName: "login"
            });
            break;

          case "Logout":
          case "force:logout":
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
        console.log(
          "sfGpsDsNavigationService.navtopic",
          JSON.stringify(menuEntry)
        );
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

  @api generateUrlNavMenu(menuEntry) {
    switch (menuEntry.Type) {
      case "ExternalLink":
        // TODO check menuEntry.TargetPrefs === "OpenExternalLinkInSameTab"
        return this.generateUrl("standard__webPage", {
          url: menuEntry.Target
        });

      case "GlobalAction":
        // menuEntry.Target => name of Global Action
        // TODO handle
        return "#";

      case "Event":
        switch (menuEntry.Target) {
          case "Login":
          case "selfService:doLogin":
            return this.generateUrl("comm__loginPage", {
              actionName: "login"
            });

          case "Logout":
          case "force:logout":
            return this.generateUrl("comm__loginPage", {
              actionName: "logout"
            });

          default:
            return "#";
        }

      case "InternalLink":
        return this.generateUrl("standard__webPage", {
          url: cBasePath + menuEntry.Target
        });

      case "NavigationalTopic":
        // TODO handle
        return "#";

      case "SalesforceObject":
        return this.generateUrl(
          "standard__objectPage",
          {
            objectApiName: menuEntry.Target,
            actionName: "list"
          },
          {
            filterName: menuEntry.DefaultListViewId
          }
        );

      default:
        // SystemLink -> Safe to ignore
        // MenuLabel -> Safe to ignore
        return "#";
    }
  }

  @api generateUrl(type, config, state = null) {
    return this[NavigationMixin.GenerateUrl]({
      type: type,
      attributes: config,
      state: state
    });
  }
}
