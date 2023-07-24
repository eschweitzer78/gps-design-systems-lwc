import { createElement } from "lwc";
import SfGpsDsUkGovBreadcrumbsComm from "c/sfGpsDsUkGovBreadcrumbsComm";

const tag = "c-sf-gps-ds-uk-gov-breadcrumbs-comm";

describe("c-sf-gps-ds-uk-gov-breadcrumbs-comm", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });
  it("is accessible", async () => {
    // Arrange
    const element = createElement(tag, {
      is: SfGpsDsUkGovBreadcrumbsComm
    });

    // Act
    // element.items = "[Home](#)[Parent](#)[Current page]()";
    document.body.appendChild(element);

    // Assert
    await expect(element).toBeAccessible();
  });
});
