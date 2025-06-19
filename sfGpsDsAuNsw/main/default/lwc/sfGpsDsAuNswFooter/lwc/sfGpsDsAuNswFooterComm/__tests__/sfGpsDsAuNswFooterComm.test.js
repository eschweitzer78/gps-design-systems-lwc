import { createElement } from "@lwc/engine-dom";
import SfGpsDsAuNswFooterComm from "c/sfGpsDsAuNswFooterComm";

const tag = "c-sf-gps-ds-au-nsw-footer-comm";

describe("c-sf-gps-ds-au-nsw-footer-comm", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("has no image or title by default", () => {
    const element = createElement(tag, {
      is: SfGpsDsAuNswFooterComm
    });

    document.body.appendChild(element);

    let p = element.shadowRoot.querySelector("div.nsw-container > p");
    expect(p).toBeNull();
  });

  it("is accessible", async () => {
    const element = createElement(tag, {
      is: SfGpsDsAuNswFooterComm
    });

    document.body.appendChild(element);

    await expect(element).toBeAccessible();
  });
});
