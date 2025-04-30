import { createElement } from "lwc";
import SfGpsDsUkGovDetailsComm from "c/sfGpsDsUkGovDetailsComm";

const tag = "c-sf-gps-ds-uk-gov-details-comm";

describe("c-sf-gps-ds-uk-gov-details", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("is closed by default", () => {
    const element = createElement(tag, {
      is: SfGpsDsUkGovDetailsComm
    });

    element.summary = "Go";

    document.body.appendChild(element);

    let details_open = element.querySelector(".govuk-details [open]");
    expect(details_open).toBeNull();
  });

  it("is accessible", async () => {
    const element = createElement(tag, {
      is: SfGpsDsUkGovDetailsComm
    });

    element.summary = "Go";
    document.body.appendChild(element);

    await expect(element).toBeAccessible();
  });
});
