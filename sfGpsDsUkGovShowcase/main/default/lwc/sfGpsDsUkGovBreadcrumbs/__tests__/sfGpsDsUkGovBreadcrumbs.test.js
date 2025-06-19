import { createElement } from "@lwc/engine-dom";
import SfGpsDsUkGovBreadcrumbs from "c/sfGpsDsUkGovBreadcrumbs";

const tag = "c-sf-gps-ds-uk-gov-breadcrumbs";
const childSelector = "ol";

describe("c-sf-gps-ds-k-gov-breadcrumb", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("has an empty rendering default", () => {
    const element = createElement(tag, {
      is: SfGpsDsUkGovBreadcrumbs
    });

    document.body.appendChild(element);

    let widget = element.querySelector(childSelector);
    expect(widget).not.toBeNull();

    let list = element.querySelector("li");
    expect(list).toBeNull();
  });

  it("displays elements as list items with anchor link component", () => {
    const element = createElement(tag, {
      is: SfGpsDsUkGovBreadcrumbs
    });

    const target = "https://www.salesforce.com/";

    element.items = [
      {
        index: 1,
        url: target,
        text: "Salesforce.com"
      }
    ];

    document.body.appendChild(element);

    let widget = element.querySelector(childSelector);
    expect(widget).not.toBeNull();

    let list = element.querySelector("li");
    expect(list).not.toBeNull();
    let a = list.querySelector("a");
    expect(a).not.toBeNull();
    expect(a.href).toBe(target);
  });

  it("is accessible", async () => {
    const element = createElement(tag, {
      is: SfGpsDsUkGovBreadcrumbs
    });

    element.items = [
      {
        index: 1,
        url: "https://www.salesforce.com/",
        text: "Salesforce.com"
      }
    ];
    document.body.appendChild(element);

    await expect(element).toBeAccessible();
  });
});
