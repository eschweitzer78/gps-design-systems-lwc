import { createElement } from "lwc";
import SfGpsDsAuNswButton from "c/sfGpsDsAuNswButton";

const tag = "c-sf-gps-ds-au-nsw-button";

describe("c-sf-gps-ds-au-nsw-button", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("has a button rendering default", () => {
    const element = createElement(tag, {
      is: SfGpsDsAuNswButton
    });

    document.body.appendChild(element);

    let widget = element.querySelector("button");
    expect(widget).not.toBeNull();
  });

  it("displays as an anchor if link property is defined", () => {
    const element = createElement(tag, {
      is: SfGpsDsAuNswButton
    });

    element.link = "https://www.salesforce.com/";
    element.label = "Go";

    document.body.appendChild(element);

    let button = element.querySelector("button");
    expect(button).toBeNull();

    let a = element.querySelector("a");
    expect(a).not.toBeNull();
    expect(a.href).toBe("https://www.salesforce.com/");
  });

  it("has the right styling", () => {
    const element = createElement(tag, {
      is: SfGpsDsAuNswButton
    });

    element.link = "https://www.salesforce.com/";
    element.cstyle = "light";
    element.label = "Go";

    document.body.appendChild(element);

    let a = element.querySelector("a");
    expect(a).not.toBeNull();
    expect(a.className).toContain("light");
  });

  it("is accessible", async () => {
    const element = createElement(tag, {
      is: SfGpsDsAuNswButton
    });

    element.block = true;
    element.style = "light";
    element.label = "Go";

    document.body.appendChild(element);

    await expect(element).toBeAccessible();
  });
});
