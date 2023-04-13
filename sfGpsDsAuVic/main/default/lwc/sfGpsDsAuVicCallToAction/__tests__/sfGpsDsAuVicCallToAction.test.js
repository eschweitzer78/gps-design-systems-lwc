import { createElement } from "lwc";
import SfGpsDsAuVicCallToAction from "c/sfGpsDsAuVicCallToAction";

const ELT_TAG = "c-sf-gps-ds-au-vic-call-to-action";

describe("c-sf-gps-ds-au-vic-call-to-action", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("does not have a header if no title is provided", () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuVicCallToAction
    });

    // Act
    document.body.appendChild(element);

    // Assert
    const header = element.querySelector("h2");
    expect(header).toBeNull();
  });

  it("does have a header if a title is provided", () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuVicCallToAction
    });

    element.title = "Hello";

    // Act
    document.body.appendChild(element);

    // Assert
    const header = element.querySelector("h2");
    expect(header).not.toBeNull();
  });

  it("is wide and accessible", () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuVicCallToAction
    });

    // Act
    element.title = "Hello";
    element.link = { text: "Read more", url: "#" };
    element.image = { src: "./here", alt: "alt text" };
    element.cstyle = "wide";

    document.body.appendChild(element);

    // Assert
    const wider = element.querySelector(".rpl-call-to-action--without-sidebar");
    expect(wider).not.toBeNull();
  });

  it("is accessible", async () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuVicCallToAction
    });

    // Act
    element.title = "Hello";
    element.link = { text: "Read more", url: "#" };
    element.image = { src: "./here", alt: "alt text" };
    element.cstyle = "wide";

    document.body.appendChild(element);

    await expect(element).toBeAccessible();
  });
});
