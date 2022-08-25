/* eslint-disable @lwc/lwc/no-inner-html */
import { createElement } from "lwc";
import SfGpsDsAuNswHeader from "c/sfGpsDsAuNswHeader";

const tag = "c-sf-gps-ds-au-nsw-header";

describe("c-sf-gps-ds-au-nsw-header", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("is accessible", async () => {
    const element = createElement(tag, {
      is: SfGpsDsAuNswHeader
    });

    document.body.appendChild(element);

    await expect(element).toBeAccessible();
  });
});
