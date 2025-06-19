/* eslint-disable @lwc/lwc/no-inner-html */
import { createElement } from "@lwc/engine-dom";
import SfGpsDsUkGovPanel from "c/sfGpsDsUkGovPanel";

const ELT_TAG = "c-sf-gps-ds-uk-gov-panel";

describe("c-sf-gps-ds-uk-gov-panel", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("has no additional styling by default", () => {
    const element = createElement(ELT_TAG, {
      is: SfGpsDsUkGovPanel
    });

    document.body.appendChild(element);

    let widget = element.shadowRoot.querySelector(".govuk-panel");
    expect(widget).not.toBeNull();
    expect(widget.classList).toContain("govuk-panel--confirmation");
  });

  it("displays right when configured as success", () => {
    const element = createElement(ELT_TAG, {
      is: SfGpsDsUkGovPanel
    });

    const title = "Title";

    element.title = title;

    document.body.appendChild(element);

    let widget = element.shadowRoot.querySelector(".govuk-panel");
    expect(widget).not.toBeNull();
    expect(widget.classList).toContain("govuk-panel--confirmation");

    let tElement = element.shadowRoot.querySelector(".govuk-panel__title");
    expect(tElement).not.toBeNull();
    expect(tElement.innerHTML).toBe(title);
    expect(tElement.tagName).toBe("H1");
  });

  it("adjusts heading if required", () => {
    const element = createElement(ELT_TAG, {
      is: SfGpsDsUkGovPanel
    });

    element.title = "Title";
    element.headingLevel = 3;

    document.body.appendChild(element);

    let tElement = element.shadowRoot.querySelector(".govuk-panel__title");
    expect(tElement).not.toBeNull();
    expect(tElement.tagName).toBe("H3");
  });

  it("is accessible", async () => {
    const element = createElement(ELT_TAG, {
      is: SfGpsDsUkGovPanel
    });

    element.title = "Title";
    element.headingLevel = 3;

    document.body.appendChild(element);

    await expect(element).toBeAccessible();
  });
});
