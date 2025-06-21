import { createElement } from "@lwc/engine-dom";
import SfGpsDsUkGovDetails from "c/sfGpsDsUkGovDetails";

const ELT_TAG = "c-sf-gps-ds-uk-gov-detailst";

describe("c-sf-gps-ds-uk-gov-details", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("is closed by default", () => {
    const element = createElement(ELT_TAG, {
      is: SfGpsDsUkGovDetails
    });

    element.summary = "Go";

    document.body.appendChild(element);

    let details = element.querySelector(".govuk-details");
    expect(details).not.toBeNull();

    let details_open = element.querySelector(".govuk-details [open]");
    expect(details_open).toBeNull();
  });

  it("is accessible", async () => {
    const element = createElement(ELT_TAG, {
      is: SfGpsDsUkGovDetails
    });

    element.summary = "Go";

    document.body.appendChild(element);

    await expect(element).toBeAccessible();
  });
});
