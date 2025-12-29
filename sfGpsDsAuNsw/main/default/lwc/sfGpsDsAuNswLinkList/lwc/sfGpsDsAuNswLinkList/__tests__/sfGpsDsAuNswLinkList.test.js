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

  it("hhightlights external links", async () => {
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuNswLinkList
    });

    element.highlightExternal = true;
    element.links = [
      { index: "item-1", text: "Item 1", url: "#item1" },
      { index: "item-2", text: "Item 2", url: "https://www.salesforce.com" }
    ];

    document.body.appendChild(element);

    const la = element.querySelectorAll("li a");
    expect(la.length).toBe(2);
    expect(la[1].getAttribute("aria-describedby")).not.toBeNull();

    // check that there's the external icon
    const lass = element.querySelectorAll("li a span span.nsw-material-icons");
    expect(lass.length).toBe(1);

    // check that there's the sr-only label
    const lsronly = element.querySelectorAll("li .sr-only");
    expect(lsronly.length).toBe(1);
  });
});
