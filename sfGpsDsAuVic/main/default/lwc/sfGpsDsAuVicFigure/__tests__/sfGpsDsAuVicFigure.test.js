import { createElement } from "lwc";
import SfGpsDsAuVicFigure from "c/sfGpsDsAuVicFigure";

const ELT_TAG = "c-sf-gps-ds-au-vic-figure";

describe("c-sf-gps-ds-au-vic-figure", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("has no image and no caption by default", () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuVicFigure
    });

    // Act
    document.body.appendChild(element);

    // Assert
    const img = element.querySelector("img");
    expect(img).toBeNull();

    const figcaption = element.querySelector("figcaption");
    expect(figcaption).toBeNull();
  });

  it("has an image when configured so", () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuVicFigure
    });

    element.image = {
      src: "./someurl",
      alt: "Some alternative text"
    };

    // Act
    document.body.appendChild(element);

    // Assert
    const img = element.querySelector("img");
    expect(img).not.toBeNull();

    const figcaption = element.querySelector("figcaption");
    expect(figcaption).toBeNull();
  });

  it("has a caption when configured so", () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuVicFigure
    });

    element.caption = "a caption text";
    element.source = "the source";

    // Act
    document.body.appendChild(element);

    // Assert
    const img = element.querySelector("img");
    expect(img).toBeNull();

    const figcaption = element.querySelector("figcaption");
    expect(figcaption).not.toBeNull();
  });
});
