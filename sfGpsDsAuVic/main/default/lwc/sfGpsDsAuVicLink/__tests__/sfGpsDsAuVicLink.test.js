import { createElement } from "lwc";
import SfGpsDsAuVicRplLink from "c/sfGpsDsAuVicLink";

const ELT_TAG = "c-sf-gps-ds-au-vic-link";

describe("c-sf-gps-ds-au-vic-link", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("has a data-print-url attribute and self target for external url by default", () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuVicRplLink
    });

    element.text = "Salesforce";
    element.href = "https://www.salesforce.com";

    // Act
    document.body.appendChild(element);

    // Assert
    const anchor = element.querySelector("a");
    expect(anchor.dataset.printUrl).toBe("https://www.salesforce.com/");
    expect(anchor.target).not.toBe("_blank");
  });

  it("has the right target for internal url", () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuVicRplLink
    });

    element.text = "some page";
    element.href = "./somepage";

    // Act
    document.body.appendChild(element);

    // Assert
    const anchor = element.querySelector("a");
    expect(anchor.target).not.toBe("_blank");
  });

  it("is accessible", async () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuVicRplLink
    });

    element.text = "some page";
    element.href = "./somepage";

    // Act
    document.body.appendChild(element);

    // Assert
    await expect(element).toBeAccessible();
  });
});
