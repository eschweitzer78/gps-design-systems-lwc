import { createElement } from "@lwc/engine-dom";
import SfGpsDsAuNswSLowerFooter from "c/sfGpsDsAuNswSLowerFooter";

describe("c-sf-gps-ds-au-nsw-s-lower-footer", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("TODO: test case generated by CLI command, please fill in test logic", () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-au-nsw-s-lower-footer", {
      is: SfGpsDsAuNswSLowerFooter
    });

    element.navItems = [
      {
        Id: "0Mi5i000000gCEnCAM",
        AccessRestriction: "LoginRequired",
        Label: "My Service Catalog Requests",
        Position: 2,
        Status: "Draft",
        Target: "SvcCatalogRequest",
        TargetPrefs: "None",
        Type: "SalesforceObject",
        NavigationLinkSetId: "0Lm5i000000XbnYCAS"
      },
      {
        Id: "0Mi5i000000gCEoCAM",
        AccessRestriction: "LoginRequired",
        Label: "Service Catalog",
        Position: 1,
        Status: "Draft",
        Target: "/service-catalog-categories",
        TargetPrefs: "None",
        Type: "InternalLink",
        NavigationLinkSetId: "0Lm5i000000XbnYCAS"
      },
      {
        Id: "0Mi5i000000gCEpCAM",
        AccessRestriction: "LoginRequired",
        Label: "My Tickets",
        Position: 3,
        Status: "Draft",
        Target: "Case",
        TargetPrefs: "None",
        Type: "SalesforceObject",
        NavigationLinkSetId: "0Lm5i000000XbnYCAS"
      },
      {
        Id: "0Mi5i000000gCEqCAM",
        AccessRestriction: "LoginRequired",
        Label: "Service Catalog",
        Position: 1,
        Status: "Live",
        Target: "/service-catalog-categories",
        TargetPrefs: "None",
        Type: "InternalLink",
        NavigationLinkSetId: "0Lm5i000000XbnYCAS"
      },
      {
        Id: "0Mi5i000000gCErCAM",
        AccessRestriction: "LoginRequired",
        Label: "My Service Catalog Requests",
        Position: 2,
        Status: "Live",
        Target: "SvcCatalogRequest",
        TargetPrefs: "None",
        Type: "SalesforceObject",
        NavigationLinkSetId: "0Lm5i000000XbnYCAS"
      },
      {
        Id: "0Mi5i000000gCEsCAM",
        AccessRestriction: "LoginRequired",
        Label: "My Tickets",
        Position: 3,
        Status: "Live",
        Target: "Case",
        TargetPrefs: "None",
        Type: "SalesforceObject",
        NavigationLinkSetId: "0Lm5i000000XbnYCAS"
      }
    ];

    // Act
    document.body.appendChild(element);

    // Assert
    // const div = element.shadowRoot.querySelector('div');
    expect(1).toBe(1);
  });
});
