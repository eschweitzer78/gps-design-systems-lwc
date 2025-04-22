import { createElement } from "lwc";
import sfGpsDsAuVic2Alert from "c/sfGpsDsAuVic2Alert";

const TAG_NAME = "c-sf-gps-ds-au-vic2-alert";
const baseProps = {
  variant: "information",
  iconName: "icon-fire",
  message: "This is a test alert, be alert but not alarmed",
  linkText: "Find out more",
  linkUrl: "/",
  dismissed: false,
  alertId: "1234"
};

describe("c-sf-gps-ds-au-vic2-alert", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("dismissible by default", () => {
    // Arrange
    const element = createElement(TAG_NAME, {
      is: sfGpsDsAuVic2Alert
    });

    // Act
    Object.assign(element, baseProps);
    document.body.appendChild(element);

    const closeBtn = element.shadowRoot.querySelector(".rpl-alert__btn-close");

    expect(closeBtn).not.toBeNull();
  });

  it("fires dismiss event when cleared", () => {
    // Arrange
    const element = createElement(TAG_NAME, {
      is: sfGpsDsAuVic2Alert
    });

    // Act
    const handler = jest.fn();
    Object.assign(element, baseProps);
    document.body.appendChild(element);
    element.addEventListener("dismiss", handler);

    const closeBtn = element.shadowRoot.querySelector(".rpl-alert__btn-close");

    expect(closeBtn).not.toBeNull();

    closeBtn.click();

    // Assert
    return Promise.resolve().then(() => {
      expect(handler).toHaveBeenCalled();
    });
  });

  it("is accessible", async () => {
    const element = createElement(TAG_NAME, {
      is: sfGpsDsAuVic2Alert
    });

    Object.assign(element, baseProps);
    document.body.appendChild(element);

    await expect(element).toBeAccessible();
  });
});
