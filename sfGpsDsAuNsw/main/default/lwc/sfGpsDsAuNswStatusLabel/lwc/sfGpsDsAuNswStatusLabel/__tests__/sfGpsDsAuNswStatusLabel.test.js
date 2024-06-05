import { createElement } from "lwc";
import SfGpsDsAuNswStatusLabel from "c/sfGpsDsAuNswStatusLabel";

describe("c-sf-gps-ds-au-nsw-status-label", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("is accessible", async () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-au-nsw-status-label", {
      is: SfGpsDsAuNswStatusLabel
    });

    // Act
    element.label = "Label";
    element.status = "error";
    document.body.appendChild(element);

    // Assert
    await expect(element).toBeAccessible();
  });
});
