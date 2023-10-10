import { createElement } from "lwc";
import SfGpsDsAuVicContainer from "c/sfGpsDsAuVicContainer";

describe("c-sf-gps-ds-au-vic-container", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("has just rpl-container class by default", () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-au-vic-container", {
      is: SfGpsDsAuVicContainer
    });

    // Act
    document.body.appendChild(element);

    // Assert
    const div = element.querySelector("div");
    expect(div.classList).toContain("rpl-container");
    expect(div.classList.length).toBe(1);
  });
});
