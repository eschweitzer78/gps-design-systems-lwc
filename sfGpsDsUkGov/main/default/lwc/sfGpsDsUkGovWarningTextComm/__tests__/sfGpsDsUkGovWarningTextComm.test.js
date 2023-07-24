/* eslint-disable @lwc/lwc/no-inner-html */
import { createElement } from "lwc";
import sfGpsDsUkGovWarningTextComm from "c/sfGpsDsUkGovWarningTextComm";

const ELT_TAG = "c-sf-gps-ds-uk-gov-warning-text-comm";

describe("c-sf-gps-ds-uk-gov-warning-text-comm", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("is accessible", async () => {
    const element = createElement(ELT_TAG, {
      is: sfGpsDsUkGovWarningTextComm
    });

    document.body.appendChild(element);

    await expect(element).toBeAccessible();
  });
});
