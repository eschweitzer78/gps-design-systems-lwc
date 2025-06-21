import { createElement } from "@lwc/engine-dom";
import SfGpsDsAuNswAlertComm from "c/sfGpsDsAuNswAlertComm";

const tag = "c-sf-gps-ds-au-nsw-alert-comm";
const childSelector = "c-sf-gps-ds-au-nsw-alert";
const defaultTitle = "Information";

describe("c-sf-gps-ds-au-nsw-alert-comm", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("has an info, non-compact rendering by default", () => {
    const element = createElement(tag, {
      is: SfGpsDsAuNswAlertComm
    });

    element.title = defaultTitle;
    document.body.appendChild(element);

    let widget = element.shadowRoot.querySelector(childSelector);

    expect(widget).not.toBeNull();
    expect(widget.as).toBe("info");
    expect(widget.compact).not.toContain("compact");
  });

  it("can have a warning rendering", () => {
    const element = createElement(tag, {
      is: SfGpsDsAuNswAlertComm
    });

    element.as = "warning";
    element.title = "Warning";
    document.body.appendChild(element);

    let widget = element.shadowRoot.querySelector(childSelector);

    expect(widget).not.toBeNull();
    expect(widget.as).toBe("warning");
    expect(widget.compact).not.toContain("info");
  });
});
