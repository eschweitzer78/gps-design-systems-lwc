import { createElement } from "lwc";
import SfGpsDsAuNswStepsItem from "c/sfGpsDsAuNswStepsItem";

describe("c-sf-gps-ds-au-nsw-steps-item", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("TODO: test case generated by CLI command, please fill in test logic", () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-au-nsw-steps-item", {
      is: SfGpsDsAuNswStepsItem
    });

    // Act
    document.body.appendChild(element);

    // Assert
    // const div = element.shadowRoot.querySelector('div');
    expect(1).toBe(1);
  });
});
