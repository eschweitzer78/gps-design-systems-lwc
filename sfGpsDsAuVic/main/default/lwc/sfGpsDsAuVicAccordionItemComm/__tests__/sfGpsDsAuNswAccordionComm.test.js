import { createElement } from "lwc";
import SfGpsDsAuNswAccordionComm from "c/sfGpsDsAuNswAccordionComm";

const tag = "c-sf-gps-ds-au-nsw-accordion-comm";
const childTag = "c-sf-gps-ds-au-nsw-accordion";
const defaultHeader = "Accordion";

describe("c-sf-gps-ds-au-nsw-accordion-comm", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("is closed to start with", () => {
    const element = createElement(tag, {
      is: SfGpsDsAuNswAccordionComm
    });

    element.header = defaultHeader;
    document.body.appendChild(element);

    expect(element.closed).toBe(true);

    const childAccordion = element.shadowRoot.querySelector(childTag);
    expect(childAccordion).not.toBeNull();
    expect(childAccordion.closed).toBe(true);
  });

  it("is open when someone clicks on the title", () => {
    const element = createElement(tag, {
      is: SfGpsDsAuNswAccordionComm
    });

    element.header = defaultHeader;
    document.body.appendChild(element);

    const handler = jest.fn();
    element.addEventListener("expand", handler);

    const childAccordion = element.shadowRoot.querySelector(childTag);
    expect(childAccordion).not.toBeNull();

    let button = childAccordion.shadowRoot.querySelector("button");
    button.click();

    return Promise.resolve().then(() => {
      expect(childAccordion.closed).toBe(false);
      expect(element.closed).toBe(false);
      expect(handler).toHaveBeenCalled();
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  it("is closed when someone clicks on the title twice", () => {
    const element = createElement(tag, {
      is: SfGpsDsAuNswAccordionComm
    });

    element.header = defaultHeader;
    document.body.appendChild(element);

    const handler = jest.fn();
    element.addEventListener("collapse", handler);

    const childAccordion = element.shadowRoot.querySelector(childTag);
    expect(childAccordion).not.toBeNull();

    let button = childAccordion.shadowRoot.querySelector("button");
    button.click();
    button.click();

    return Promise.resolve().then(() => {
      expect(element.closed).toBe(true);
      expect(handler).toHaveBeenCalled();
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  it("is accessible", async () => {
    const element = createElement(tag, {
      is: SfGpsDsAuNswAccordionComm
    });

    element.header = defaultHeader;
    document.body.appendChild(element);

    await expect(element).toBeAccessible();
  });
});
