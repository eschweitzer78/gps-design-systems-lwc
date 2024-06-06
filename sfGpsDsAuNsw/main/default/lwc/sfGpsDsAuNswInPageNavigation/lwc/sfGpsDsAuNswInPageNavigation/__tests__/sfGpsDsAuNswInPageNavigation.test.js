import { createElement } from "lwc";
import SfGpsDsAuNswInPageNavigation from "c/sfGpsDsAuNswInPageNavigation";

describe("c-sf-gps-ds-au-nsw-in-page-navigation", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("is accessible", async () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-au-nsw-in-page-navigation", {
      is: SfGpsDsAuNswInPageNavigation
    });

    // Act

    element.title = "On this page";
    element.items = [
      { index: "item-1", text: "Item 1", url: "#item1" },
      { index: "item-2", text: "Item 2", url: "#item2" }
    ];

    document.body.appendChild(element);

    // Assert
    const lis = element.querySelectorAll("li");
    expect(lis.length).toBe(2);

    await expect(element).toBeAccessible();
  });
});
