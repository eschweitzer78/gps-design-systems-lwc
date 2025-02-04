import { createElement } from "lwc";
import SfGpsDsAuVicShareThis from "c/sfGpsDsAuVicShareThis";

describe("c-sf-gps-ds-au-vic-share-this", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("is accessible", async () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-au-vic-share-this", {
      is: SfGpsDsAuVicShareThis
    });

    // Act

    element.url = "#url";
    element.title = "Share this";

    document.body.appendChild(element);

    // Assert
    const shareThis = element.querySelector(".rpl-share-this");
    expect(shareThis).not.toBeNull();

    await expect(element).toBeAccessible();
  });
});
