import { createElement } from "lwc";
import SfGpsDsAuVicAlertBase from "c/sfGpsDsAuVicAlertBase";

const ELT_TAG = "c-sf-gps-ds-au-vic-alert-base";

describe("c-sf-gps-ds-au-vic-alert-base", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("is visible and dark neutral to start with", () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuVicAlertBase
    });

    // Act
    document.body.appendChild(element);

    // Assert
    const alert = element.querySelector(".rpl-alert-base");
    expect(alert).not.toBeNull();

    const darkn = element.querySelector(".rpl-alert-base--color-dark_neutral");
    expect(darkn).not.toBeNull();
  });

  it("has the right colour class when set and is accessible", async () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuVicAlertBase
    });

    element.backgroundColor = "success";

    // Act
    document.body.appendChild(element);

    // Assert
    const alert = element.querySelector(".rpl-alert-base");
    expect(alert).not.toBeNull();

    const success = element.querySelector(".rpl-alert-base--color-success");
    expect(success).not.toBeNull();

    await expect(element).toBeAccessible();
  });

  it("is no longer visible when closed", () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuVicAlertBase
    });

    // Act
    document.body.appendChild(element);

    // Assert
    const close = element.querySelector(".rpl-alert-base__close");
    expect(close).not.toBeNull();
    close.click();

    return Promise.resolve().then(() => {
      const alert = element.querySelector(".rpl-alert-base");
      expect(alert).toBeNull();
    });
  });
});
