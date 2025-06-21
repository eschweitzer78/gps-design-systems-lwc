import { createElement } from "@lwc/engine-dom";
import SfGpsDsAuNswAlert from "c/sfGpsDsAuNswAlert";

const tag = "c-sf-gps-ds-au-nsw-alert";
const childSelector = ".nsw-in-page-alert";
const defaultTitle = "Information";

describe("c-sf-gps-ds-au-nsw-alert", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("has an info, non-compact rendering by default", () => {
    const element = createElement(tag, {
      is: SfGpsDsAuNswAlert
    });

    element.title = defaultTitle;
    document.body.appendChild(element);

    let widget = element.querySelector(childSelector);

    expect(widget).not.toBeNull();
    expect(widget.className).toContain("info");
    expect(widget.className).not.toContain("compact");
  });

  it("can have a warning rendering", () => {
    const element = createElement(tag, {
      is: SfGpsDsAuNswAlert
    });

    element.as = "warning";
    element.title = "Warning";
    document.body.appendChild(element);

    let widget = element.querySelector(childSelector);

    expect(widget).not.toBeNull();
    expect(widget.className).toContain("warning");
    expect(widget.className).not.toContain("info");
  });

  it("can be made compact", () => {
    const element = createElement(tag, {
      is: SfGpsDsAuNswAlert
    });

    element.compact = true;
    element.title = defaultTitle;
    document.body.appendChild(element);

    let widget = element.querySelector(childSelector);

    expect(widget).not.toBeNull();
    expect(widget.className).toContain("compact");
  });

  it("is accessible", async () => {
    const element = createElement(tag, {
      is: SfGpsDsAuNswAlert
    });

    element.title = defaultTitle;
    document.body.appendChild(element);

    await expect(element).toBeAccessible();
  });

  it("is accessible in compact form", async () => {
    const element = createElement(tag, {
      is: SfGpsDsAuNswAlert
    });

    element.title = defaultTitle;
    element.compact = true;
    document.body.appendChild(element);

    await expect(element).toBeAccessible();
  });
});
