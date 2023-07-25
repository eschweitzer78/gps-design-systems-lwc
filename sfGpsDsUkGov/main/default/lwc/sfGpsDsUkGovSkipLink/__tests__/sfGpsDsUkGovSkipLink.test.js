import { createElement } from "lwc";
import SfGpsDsUkGovSkipLink from "c/sfGpsDsUkGovSkipLink";

describe("c-sf-gps-ds-uk-gov-skip-link", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("does not show by default", () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-uk-gov-skip-link", {
      is: SfGpsDsUkGovSkipLink
    });

    // Act
    element.skipLinkId = "skip-link";
    element.contentId = "content";
    document.body.appendChild(element);

    // Assert
    const show = element.querySelector(".govuk-skip-link--show");
    expect(show).toBeNull();
  });

  it("is accessible", async () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-uk-gov-skip-link", {
      is: SfGpsDsUkGovSkipLink
    });

    // Act
    element.skipLinkId = "skip-link";
    element.contentId = "content";
    element.title = "Skip to content";

    document.body.appendChild(element);

    // Assert
    await expect(element).toBeAccessible();
  });

  // Removed Show test for "expect(show).not.toBeNull()" -- not required for GOV.UK
});
