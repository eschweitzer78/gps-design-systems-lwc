import { createElement } from "lwc";
import sfGpsDsUkGovNotificationBannerComm from "c/sfGpsDsUkGovNotificationBannerComm";

const tag = "c-sf-gps-ds-uk-gov-notification-banner-comm";

describe("c-sf-gps-ds-uk-gov-notification-banner-comm", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("is accessible", async () => {
    const element = createElement(tag, {
      is: sfGpsDsUkGovNotificationBannerComm
    });

    element.title = "Title";
    element.type = "success";

    document.body.appendChild(element);

    await expect(element).toBeAccessible();
  });
});
