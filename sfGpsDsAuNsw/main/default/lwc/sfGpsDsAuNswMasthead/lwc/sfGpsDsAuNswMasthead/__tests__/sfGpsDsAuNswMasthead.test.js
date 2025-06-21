import { createElement } from "@lwc/engine-dom";
import SfGpsDsAuNswMasthead from "c/sfGpsDsAuNswMasthead";

const ELT_TAG = "c-sf-gps-ds-au-nsw-masthead";

describe("c-sf-gps-ds-au-nsw-hero-masthead", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("is accessible", async () => {
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuNswMasthead
    });

    element.nav = "#nav";
    element.content = "#content";

    document.body.appendChild(element);

    await expect(element).toBeAccessible();
  });
});
