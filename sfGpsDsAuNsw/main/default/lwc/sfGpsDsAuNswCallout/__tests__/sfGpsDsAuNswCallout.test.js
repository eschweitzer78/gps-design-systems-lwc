/* eslint-disable @lwc/lwc/no-inner-html */
import { createElement } from "lwc";
import SfGpsDsAuNswCallout from "c/sfGpsDsAuNswCallout";

const tag = "c-sf-gps-ds-au-nsw-callout";

describe("c-sf-gps-ds-au-nsw-callout", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("has a h4 rendering by default", () => {
    const element = createElement(tag, {
      is: SfGpsDsAuNswCallout
    });

    element.title = "Hello";

    document.body.appendChild(element);

    let h4 = element.shadowRoot.querySelector("h4");
    expect(h4).not.toBeNull();
    expect(h4.innerHTML).toBe(element.title);
  });

  it("displays as h1 if level is set to 1", () => {
    const element = createElement(tag, {
      is: SfGpsDsAuNswCallout
    });

    element.level = 1;
    element.title = "Go";

    document.body.appendChild(element);

    let h4 = element.shadowRoot.querySelector("h4");
    expect(h4).toBeNull();

    let h1 = element.shadowRoot.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1.innerHTML).toBe(element.title);
  });

  it("is accessible", async () => {
    const element = createElement(tag, {
      is: SfGpsDsAuNswCallout
    });

    element.title = "Go";

    document.body.appendChild(element);

    await expect(element).toBeAccessible();
  });
});
