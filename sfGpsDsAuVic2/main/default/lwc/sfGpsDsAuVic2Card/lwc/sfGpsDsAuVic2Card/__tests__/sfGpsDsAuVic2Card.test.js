import { createElement } from "lwc";
import SfGpsDsAuVic2Card from "c/sfGpsDsAuVic2Card";

describe("c-sf-gps-ds-au-vic2-card", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("TODO: test case generated by CLI command, please fill in test logic", () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-au-vic2-card", {
      is: SfGpsDsAuVic2Card
    });

    // Act
    document.body.appendChild(element);

    // Assert
    // const div = element.shadowRoot.querySelector('div');
    expect(1).toBe(1);
  });
});