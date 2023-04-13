import { createElement } from "lwc";
import SfGpsDsAuVicMarkup from "c/sfGpsDsAuVicMarkup";

const ELT_TAG = "c-sf-gps-ds-au-vic-markup";

describe("c-sf-gps-ds-au-vic-markup", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("does not render by default", () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuVicMarkup
    });

    // Act
    document.body.appendChild(element);

    // Assert
    const div = element.querySelector("div");
    expect(div).toBeNull();
  });

  it("sanitises scripts", () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuVicMarkup
    });

    element.html = "<script>console.log('booh')</script>";

    // Act
    document.body.appendChild(element);

    // Assert
    const div = element.querySelector("div");
    expect(div).not.toBeNull();

    const script = element.querySelector("script");
    expect(script).toBeNull();
  });
});
