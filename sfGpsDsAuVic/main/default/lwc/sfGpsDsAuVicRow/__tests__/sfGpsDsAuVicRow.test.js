import { createElement } from "lwc";
import SfGpsDsAuVicRow from "c/sfGpsDsAuVicRow";

const ROW_GUTTER_SELECTOR = ".rpl-row--gutter";

describe("c-sf-gps-ds-au-vic-row", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("has no gutter by default", () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-au-vic-row", {
      is: SfGpsDsAuVicRow
    });

    // Act
    document.body.appendChild(element);

    // Assert
    const gutter = element.querySelector(ROW_GUTTER_SELECTOR);
    expect(gutter).toBeNull();
  });

  it("has a gutter when so configured", () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-au-vic-row", {
      is: SfGpsDsAuVicRow
    });

    element.rowGutter = true;

    // Act
    document.body.appendChild(element);

    // Assert
    const gutter = element.querySelector(ROW_GUTTER_SELECTOR);
    expect(gutter).not.toBeNull();
  });
});
