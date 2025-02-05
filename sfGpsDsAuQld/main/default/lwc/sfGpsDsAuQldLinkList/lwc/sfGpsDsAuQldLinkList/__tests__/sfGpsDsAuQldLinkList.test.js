import { createElement } from "lwc";
import SfGpsDsAuQldLinkList from "c/sfGpsDsAuQldLinkList";

const ELT_TAG = "c-sf-gps-ds-au-qld-link-list";

describe("c-sf-gps-ds-au-qld-link-list", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("renders as expected and is accessible", async () => {
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuQldLinkList
    });

    element.links = [
      { index: "item-1", text: "Item 1", url: "#item1" },
      { index: "item-2", text: "Item 2", url: "#item2" }
    ];

    document.body.appendChild(element);

    const lass = element.shadowRoot.querySelectorAll("li a");
    expect(lass.length).toBe(2);
    expect(lass[0].textContent).toBe(element.links[0].text);

    await expect(element).toBeAccessible();
  });
});
