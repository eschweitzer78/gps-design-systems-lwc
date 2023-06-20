import { createElement } from "lwc";
import SfGpsDsAuNswProgressIndicator from "c/sfGpsDsAuNswProgressIndicator";

const ELT_TAG = "c-sf-gps-ds-au-nsw-progress-indicator";

describe("c-sf-gps-ds-au-nsw-hero-progress-indicator", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("is accessible", async () => {
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuNswProgressIndicator
    });

    element.step = 2;
    element.of = 3;

    document.body.appendChild(element);

    await expect(element).toBeAccessible();
  });
});
