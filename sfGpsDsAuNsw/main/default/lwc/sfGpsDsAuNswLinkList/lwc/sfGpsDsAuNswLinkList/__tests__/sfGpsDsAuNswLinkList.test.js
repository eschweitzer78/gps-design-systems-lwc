import { createElement } from "@lwc/engine-dom";
import SfGpsDsAuNswLinkList from "c/sfGpsDsAuNswLinkList";

const ELT_TAG = "c-sf-gps-ds-au-nsw-link-list";

describe("c-sf-gps-ds-au-nsw-link-list", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("renders as expected and is accessible", async () => {
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuNswLinkList
    });

    element.links = [
      { index: "item-1", text: "Item 1", url: "#item1" },
      { index: "item-2", text: "Item 2", url: "#item2" }
    ];

    document.body.appendChild(element);

    const lass = element.querySelectorAll("li a span:first-child");
    expect(lass.length).toBe(2);
    expect(lass[0].textContent).toBe(element.links[0].text);

    await expect(element).toBeAccessible();
  });
});
