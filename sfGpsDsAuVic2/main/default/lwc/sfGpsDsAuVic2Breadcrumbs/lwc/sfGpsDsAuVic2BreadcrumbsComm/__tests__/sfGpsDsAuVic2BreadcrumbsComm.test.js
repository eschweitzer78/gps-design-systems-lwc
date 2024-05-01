import { createElement } from "lwc";
import SfGpsDsAuVic2BreadcrumbsComm from "c/sfGpsDsAuVic2BreadcrumbsComm";

describe("c-sf-gps-ds-au-vic2-breadcrumbs-comm", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("is accessible", async () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-au-vic2-breadcrumbs-comm", {
      is: SfGpsDsAuVic2BreadcrumbsComm
    });

    // Act
    element.links = "[Home](..)[Parent](./)[This]()";
    document.body.appendChild(element);

    // Assert
    expect(element).toBeAccessible();
  });
});
