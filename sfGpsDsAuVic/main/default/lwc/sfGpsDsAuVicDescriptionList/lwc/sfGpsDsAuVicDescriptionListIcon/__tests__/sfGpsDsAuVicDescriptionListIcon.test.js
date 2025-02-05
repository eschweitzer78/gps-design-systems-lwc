import { createElement } from "lwc";
import SfGpsDsAuVicDescriptionListIcon from "c/sfGpsDsAuVicDescriptionListIcon";

describe("c-sf-gps-ds-au-vic-description-list-icon", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("is accessible", async () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-au-vic-description-list-icon", {
      is: SfGpsDsAuVicDescriptionListIcon
    });

    // Act
    element.list = [
      { icon: "star", heading: "item 1", content: "content 1" },
      { icon: "star", heading: "item 2", content: "content 2" }
    ];

    document.body.appendChild(element);

    // Assert
    const items = element.querySelectorAll(".rpl-description-list-icon__item");
    expect(items.length).toBe(2);

    await expect(element).toBeAccessible();
  });
});
