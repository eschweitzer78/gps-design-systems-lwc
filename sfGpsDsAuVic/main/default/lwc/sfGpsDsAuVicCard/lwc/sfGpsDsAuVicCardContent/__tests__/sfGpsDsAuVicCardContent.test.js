import { createElement } from "lwc";
import SfGpsDsAuVicCardContent from "c/sfGpsDsAuVicCardContent";

const ELT_TAG = "c-sf-gps-ds-au-vic-card-content";

describe("c-sf-gps-ds-au-vic-card-content", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("is accessible", () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuVicCardContent
    });

    // Act
    element.link = {
      text: "Read more",
      url: "#here"
    };
    element.image = "./someImage";
    element.imageAlt = "someAltText";

    document.body.appendChild(element);

    // Assert
    expect(element).toBeAccessible();
  });
});
