import { createElement } from "lwc";
import SfGpsDsAuVicSkipLink from "c/sfGpsDsAuVicSkipLink";

describe("c-sf-gps-ds-au-vic-skip-link", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("does not show by default", () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-au-vic-skip-link", {
      is: SfGpsDsAuVicSkipLink
    });

    // Act
    element.skipLinkId = "skip-link";
    element.contentId = "content";
    document.body.appendChild(element);

    // Assert
    const show = element.querySelector(".rpl-skip-link__link--show");
    expect(show).toBeNull();
  });

  it("is accessible", async () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-au-vic-skip-link", {
      is: SfGpsDsAuVicSkipLink
    });

    // Act
    element.skipLinkId = "skip-link";
    element.contentId = "content";
    element.title = "Skip to content";

    document.body.appendChild(element);

    // Assert
    await expect(element).toBeAccessible();
  });

  it("does show if configured so", () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-au-vic-skip-link", {
      is: SfGpsDsAuVicSkipLink
    });

    // Act
    element.skipLinkId = "skip-link";
    element.contentId = "content";
    element.show = true;

    document.body.appendChild(element);

    // Assert
    const show = element.querySelector(".rpl-skip-link__link--show");
    expect(show).not.toBeNull();
  });
});
