import { createElement } from "lwc";
import SfGpsDsAuVicButtonComm from "c/sfGpsDsAuVicButtonComm";

describe("c-sf-gps-ds-au-vic-button-comm", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("is accessible", async () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-au-vic-button-comm", {
      is: SfGpsDsAuVicButtonComm
    });

    // Act
    element.theme = "primary";
    element.disabled = false;
    element.label = "Click me";

    document.body.appendChild(element);

    // Assert
    const button = element.shadowRoot.querySelector("button");
    expect(button).not.toBeNull();

    await expect(element).toBeAccessible();
  });
});
