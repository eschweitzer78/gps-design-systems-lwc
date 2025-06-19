import { createElement } from "@lwc/engine-dom";
import SfGpsDsUkGovLowerFooterComm from "c/sfGpsDsUkGovLowerFooter";

const tag = "c-sf-gps-ds-uk-gov-lower-footer";

describe("c-sf-gps-ds-uk-gov-lower-footer", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("has no links by default", () => {
    const element = createElement(tag, {
      is: SfGpsDsUkGovLowerFooterComm
    });

    document.body.appendChild(element);

    let p = element.querySelector(
      ".govuk-footer__meta-item .govuk-footer__inline-list"
    );
    expect(p).toBeNull();
  });

  it("is accessible", async () => {
    const element = createElement(tag, {
      is: SfGpsDsUkGovLowerFooterComm
    });

    document.body.appendChild(element);

    await expect(element).toBeAccessible();
  });
});
