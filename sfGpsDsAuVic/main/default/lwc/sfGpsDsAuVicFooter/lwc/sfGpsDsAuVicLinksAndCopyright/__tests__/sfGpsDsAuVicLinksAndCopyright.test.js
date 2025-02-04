import { createElement } from "lwc";
import SfGpsDsAuVicLinksAndCopyright from "c/sfGpsDsAuVicLinksAndCopyright";

const ELT_TAG = "c-sf-gps-ds-au-vic-links-and-copyright";

describe("c-sf-gps-ds-au-vic-links-and-copyright", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("has a data-print-url attribute and is accessible", async () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuVicLinksAndCopyright
    });

    element.links = [
      { text: "sometext", url: "https://www.salesforce.com" },
      { text: "someothertext", url: "./localurl" }
    ];

    // Act
    document.body.appendChild(element);

    // Assert
    const anchors = element.querySelectorAll("a");
    expect(anchors.length).toBe(2);

    expect(anchors[0].dataset.printUrl).toBe("https://www.salesforce.com");
    expect(anchors[1].dataset.printUrl).toBe("./localurl");

    await expect(element).toBeAccessible();
  });
});
