import { createElement } from "lwc";
import SfGpsDsAuVicList from "c/sfGpsDsAuVicList";

describe("c-sf-gps-ds-au-vic-list", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("does not render title or list by default", () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-au-vic-list", {
      is: SfGpsDsAuVicList
    });

    // Act
    document.body.appendChild(element);

    // Assert
    const list = element.querySelector(".rpl-list");
    expect(list).not.toBeNull();
    expect(list.classList).toContain("rpl-list--normal");

    const title = element.querySelector(".rpl-list__title");
    expect(title).toBeNull();

    const listList = element.querySelector(".rpl-list__list");
    expect(listList).toBeNull();
  });

  it("does render title and list when configured properly and is accessible", async () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-au-vic-list", {
      is: SfGpsDsAuVicList
    });

    // Act
    element.title = "List";
    element.size = "large";
    element.list = [
      {
        text: "item1",
        link: "#link1",
        symbol: "star",
        color: "black",
        iconSize: "normal"
      },
      { text: "item2", symbol: "star", color: "black", iconSize: 1.1 }
    ];

    document.body.appendChild(element);

    // Assert
    const list = element.querySelector(".rpl-list");
    expect(list).not.toBeNull();
    expect(list.classList).toContain("rpl-list--large");

    const title = element.querySelector(".rpl-list__title");
    expect(title).not.toBeNull();

    const listList = element.querySelector(".rpl-list__list");
    expect(listList).not.toBeNull();

    const listItem = element.querySelectorAll(".rpl-list__list-item");
    expect(listItem.length).toBe(2);

    await expect(element).toBeAccessible();
  });
});
