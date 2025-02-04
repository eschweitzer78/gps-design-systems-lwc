import { createElement } from "lwc";
import SfGpsDsAuVicAnchorLinks from "c/sfGpsDsAuVicAnchorLinks";

describe("c-sf-gps-ds-au-vic-anchor-links", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("skips rendering title if none is provided", () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-au-vic-anchor-links", {
      is: SfGpsDsAuVicAnchorLinks
    });

    // Act
    document.body.appendChild(element);

    // Assert
    const title = element.querySelector(".rpl-anchor-links__title");
    expect(title).toBeNull();
  });

  it("renders title if one is provided", () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-au-vic-anchor-links", {
      is: SfGpsDsAuVicAnchorLinks
    });

    element.title = "Title";

    // Act
    document.body.appendChild(element);

    // Assert
    const title = element.querySelector(".rpl-anchor-links__title");
    expect(title).not.toBeNull();
  });

  it("renders links as expected", () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-au-vic-anchor-links", {
      is: SfGpsDsAuVicAnchorLinks
    });

    element.title = "Title";
    element.links = [
      { text: "link", url: "https://target.info", type: "h2" },
      { text: "sublink", url: "https://target.info/sub", type: "h3" }
    ];

    // Act
    document.body.appendChild(element);

    // Assert
    const title = element.querySelector(".rpl-anchor-links__title");
    expect(title).not.toBeNull();

    const items = element.querySelectorAll(".rpl-anchor-links__item");
    const h3items = element.querySelectorAll(".rpl-anchor-links__item--indent");

    expect(items.length).toBe(2);
    expect(h3items.length).toBe(1);
  });
});
