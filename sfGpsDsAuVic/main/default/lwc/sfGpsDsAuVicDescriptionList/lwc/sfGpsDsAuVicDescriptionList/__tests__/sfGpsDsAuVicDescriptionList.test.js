import { createElement } from "lwc";
import SfGpsDsAuVicDescriptionList from "c/sfGpsDsAuVicDescriptionList";

const ELT_TAG = "c-sf-gps-ds-au-vic-description-list";

describe("c-sf-gps-ds-au-vic-description-list", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("does not show by default", () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuVicDescriptionList
    });

    // Act
    document.body.appendChild(element);

    // Assert
    const dl = element.querySelector("dl");
    expect(dl).toBeNull();
  });

  it("shows when provided with data and is accessible", async () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuVicDescriptionList
    });

    element.list = [
      { term: "a", description: "desc a" },
      { term: "b", description: "desc b" }
    ];

    // Act
    document.body.appendChild(element);

    // Assert
    const dl = element.querySelector("dl");
    expect(dl).not.toBeNull();

    const rows = element.querySelectorAll(".rpl-description-list__row");
    expect(rows.length).toBe(2);

    await expect(element).toBeAccessible();
  });
});
