import { createElement } from "lwc";
import SfGpsDsAuVicMetaTag from "c/sfGpsDsAuVicMetaTag";

const ELT_TAG = "c-sf-gps-ds-au-vic-meta-tag";

describe("c-sf-gps-ds-au-vic-meta-tag", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("does not render by default", () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuVicMetaTag
    });

    // Act
    document.body.appendChild(element);

    // Assert
    const metatag = element.querySelector(".rpl-meta-tag");
    expect(metatag).toBeNull();
  });

  it("does render when configured and is accessible", async () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuVicMetaTag
    });

    // Act
    element.linkText = "Text";
    element.linkUrl = "#here";

    document.body.appendChild(element);

    // Assert
    const metatag = element.querySelector(".rpl-meta-tag");
    expect(metatag).not.toBeNull();
    expect(metatag.classList).toContain("rpl-meta-tag--light");

    const link = element.querySelector("c-sf-gps-ds-au-vic-link");
    expect(link).not.toBeNull();

    await expect(element).toBeAccessible();
  });
});
