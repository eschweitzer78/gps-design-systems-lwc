import { createElement } from "@lwc/engine-dom";
import SfGpsDsAuNswAccordion from "c/sfGpsDsAuNswAccordion";

const tag = "c-sf-gps-ds-au-nsw-accordion";
const contentClassSelector = ".nsw-accordion__content";

describe("c-sf-gps-ds-au-nsw-accordion", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("is closed to start with", () => {
    const element = createElement(tag, {
      is: SfGpsDsAuNswAccordion
    });

    element.header = "Accordion";
    document.body.appendChild(element);

    let button = element.querySelector("button");

    expect(button).not.toBeNull();
    expect(button.className).not.toContain("active");
    expect(button.ariaExpanded).toBe("false");

    let content = element.querySelector(contentClassSelector);

    expect(content).not.toBeNull();
    expect(content.hidden).toBeTruthy();
  });

  it("is open when someone clicks on the title", () => {
    const element = createElement(tag, {
      is: SfGpsDsAuNswAccordion
    });

    element.header = "Accordion";
    document.body.appendChild(element);

    let button = element.querySelector("button");
    expect(button).not.toBeNull();
    button.click();

    return Promise.resolve().then(() => {
      expect(button.className).toContain("active");
      expect(button.ariaExpanded).toBe("true");

      let content = element.querySelector(contentClassSelector);

      expect(content).not.toBe(null);
      expect(content.hidden).toBeFalsy();
    });
  });

  it("is accessible", async () => {
    const element = createElement(tag, {
      is: SfGpsDsAuNswAccordion
    });

    element.header = "Accordion";
    document.body.appendChild(element);

    await expect(element).toBeAccessible();
  });
});
