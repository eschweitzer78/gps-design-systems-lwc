/* eslint-disable @lwc/lwc/no-inner-html */
import { createElement } from "lwc";
import SfGpsDsUkGovNotificationBanner from "c/sfGpsDsUkGovNotificationBanner";

const tag = "c-sf-gps-ds-uk-gov-notification-banner";

describe("c-sf-gps-ds-uk-gov-notification-banner", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("has no additional styling by default", () => {
    const element = createElement(tag, {
      is: SfGpsDsUkGovNotificationBanner
    });

    document.body.appendChild(element);

    let widget = element.querySelector(".govuk-notification-banner");
    expect(widget).not.toBeNull();
    expect(widget.className).toBe("govuk-notification-banner");
  });

  it("displays right when configured as success", () => {
    const element = createElement(tag, {
      is: SfGpsDsUkGovNotificationBanner
    });

    const title = "Title";

    element.title = title;
    element.type = "success";

    document.body.appendChild(element);

    let widget = element.querySelector(".govuk-notification-banner");
    expect(widget).not.toBeNull();
    expect(widget.className).toContain("--success");

    let tElement = element.querySelector(".govuk-notification-banner__title");
    expect(tElement).not.toBeNull();
    expect(tElement.innerHTML).toBe(title);
    expect(tElement.tagName).toBe("H2");
  });

  it("adjusts heading if required", () => {
    const element = createElement(tag, {
      is: SfGpsDsUkGovNotificationBanner
    });

    element.title = "Title";
    element.headingLevel = 3;

    document.body.appendChild(element);

    let tElement = element.querySelector(".govuk-notification-banner__title");
    expect(tElement).not.toBeNull();
    expect(tElement.tagName).toBe("H3");
  });

  it("is accessible", async () => {
    const element = createElement(tag, {
      is: SfGpsDsUkGovNotificationBanner
    });

    element.title = "Title";
    element.type = "success";

    document.body.appendChild(element);

    await expect(element).toBeAccessible();
  });
});
