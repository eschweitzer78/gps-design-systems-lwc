import { createElement } from "@lwc/engine-dom";
import sfGpsDsUkGovPanelComm from "c/sfGpsDsUkGovPanelComm";

const tag = "c-sf-gps-ds-uk-gov-panel-comm";

describe("c-sf-gps-ds-uk-gov-panel-comm", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("is accessible", async () => {
    const element = createElement(tag, {
      is: sfGpsDsUkGovPanelComm
    });

    element.title = "Title";
    element.headingLevel = 3;

    document.body.appendChild(element);

    await expect(element).toBeAccessible();
  });
});
