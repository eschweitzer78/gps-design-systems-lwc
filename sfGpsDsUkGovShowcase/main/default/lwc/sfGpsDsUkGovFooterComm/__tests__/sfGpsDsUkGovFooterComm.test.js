/* eslint-disable @lwc/lwc/no-inner-html */
import { createElement } from "lwc";
import SfGpsDsUkGovFooterComm from "c/sfGpsDsUkGovFooterComm";

const tag = "c-sf-gps-ds-uk-gov-footer-comm";

describe("c-sf-gps-ds-uk-gov-footer-comm", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("is accessible", async () => {
    const element = createElement(tag, {
      is: SfGpsDsUkGovFooterComm
    });

    document.body.appendChild(element);

    await expect(element).toBeAccessible();
  });
});
