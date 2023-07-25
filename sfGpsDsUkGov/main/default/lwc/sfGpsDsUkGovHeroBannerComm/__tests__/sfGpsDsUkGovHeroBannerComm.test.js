import { createElement } from "lwc";
import sfGpsDsUkGovHeroBannerComm from "c/sfGpsDsUkGovHeroBannerComm";

describe("c-sf-gps-ds-uk-gov-hero-banner-comm", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("is accessible", () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-uk-gov-hero-banner-comm", {
      is: sfGpsDsUkGovHeroBannerComm
    });

    // Act
    document.body.appendChild(element);

    // Assert
    expect(element).toBeAccessible();
  });
});
