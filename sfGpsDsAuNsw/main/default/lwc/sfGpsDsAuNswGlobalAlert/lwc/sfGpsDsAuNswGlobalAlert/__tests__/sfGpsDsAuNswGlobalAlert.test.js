/* eslint-disable @lwc/lwc/no-inner-html */
import { createElement } from "@lwc/engine-dom";
import SfGpsDsAuNswGlobalAlert from "c/sfGpsDsAuNswGlobalAlert";

const tag = "c-sf-gps-ds-au-nsw-global-alert";

describe("c-sf-gps-ds-au-nsw-global-alert", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("has no additional styling by default", () => {
    const element = createElement(tag, {
      is: SfGpsDsAuNswGlobalAlert
    });

    document.body.appendChild(element);

    let widget = element.querySelector(".nsw-global-alert");
    expect(widget).not.toBeNull();
    expect(widget.className).toBe("nsw-global-alert");
  });

  it("displays right when configured as critical", () => {
    const element = createElement(tag, {
      is: SfGpsDsAuNswGlobalAlert
    });

    const title = "Title";
    const copy = "Copy";

    element.title = title;
    element.copy = copy;
    element.as = "critical";

    document.body.appendChild(element);

    let widget = element.querySelector(".nsw-global-alert");
    expect(widget).not.toBeNull();
    expect(widget.className).toContain("--critical");

    let tElement = element.querySelector(".nsw-global-alert__title");
    expect(tElement).not.toBeNull();
    expect(tElement.innerHTML).toBe(title);

    let cElement = element.querySelector(".nsw-global-alert__content > p");
    expect(cElement).not.toBeNull();
    expect(cElement.innerHTML).toContain(copy);
  });

  it("closes when clicked", () => {
    const element = createElement(tag, {
      is: SfGpsDsAuNswGlobalAlert
    });

    const title = "Title";
    const copy = "Copy";

    element.title = title;
    element.copy = copy;
    element.as = "critical";

    document.body.appendChild(element);

    let button = element.querySelector("button");
    expect(button).not.toBeNull();

    button.click();

    return Promise.resolve().then(() => {
      let tElement = element.querySelector(".nsw-global-alert");
      expect(tElement).toBeNull();
    });
  });

  // linked to bug #349 - Global Alert crashes if cta left empty
  it("does not crash if cta is left empty", () => {
    const element = createElement(tag, {
      is: SfGpsDsAuNswGlobalAlert
    });

    element.title = "title";
    element.copy = "copy";
    element.as = "critical";
    element.cta = "";

    document.body.appendChild(element);

    let widget = element.querySelector(".nsw-global-alert");
    expect(widget).not.toBeNull();
  });

  it("is accessible", async () => {
    const element = createElement(tag, {
      is: SfGpsDsAuNswGlobalAlert
    });

    element.title = "Title";
    element.copy = "Some text here";
    element.as = "light";
    element.ctaText = "Read more";
    element.ctaHref = "https://www.salesforce.com/";

    document.body.appendChild(element);

    await expect(element).toBeAccessible();
  });
});
