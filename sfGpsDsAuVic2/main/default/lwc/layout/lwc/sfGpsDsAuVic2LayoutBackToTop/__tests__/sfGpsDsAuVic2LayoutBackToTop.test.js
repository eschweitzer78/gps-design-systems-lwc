import { createElement } from "@lwc/engine-dom";
import SfGpsDsAuVic2LayoutBackToTop from "c/sfGpsDsAuVic2LayoutBackToTop";

describe("c-sf-gps-ds-au-vic2-layout-back-to-top", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("TODO: test case generated by CLI command, please fill in test logic", () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-au-vic2-layout-back-to-top", {
      is: SfGpsDsAuVic2LayoutBackToTop
    });

    // Act
    document.body.appendChild(element);

    // Assert
    // const div = element.shadowRoot.querySelector('div');
    expect(1).toBe(1);
  });
});
