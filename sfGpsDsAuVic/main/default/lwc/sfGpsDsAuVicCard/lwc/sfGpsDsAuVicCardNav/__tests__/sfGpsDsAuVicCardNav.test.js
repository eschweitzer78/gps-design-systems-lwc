import { createElement } from "lwc";
import SfGpsDsAuVicCardNav from "c/sfGpsDsAuVicCardNav";

const ELT_TAG = "c-sf-gps-ds-au-vic-card-nav";
describe("c-sf-gps-ds-au-vic-card-nav", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("is accessible", async () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuVicCardNav
    });

    // Act
    element.link = {
      text: "Card Nav",
      url: "#here"
    };
    element.summary = "Lorem ipsum.";
    element.image = "./someurl";
    element.topic = "Topic";

    document.body.appendChild(element);

    // Assert
    await expect(element).toBeAccessible();
  });
});
