import { createElement } from "lwc";
import SfGpsDsAuVicCardEmergencyContact from "c/sfGpsDsAuVicCardEmergencyContact";

const ELT_TAG = "c-sf-gps-ds-au-vic-card-emergency-contact";

describe("c-sf-gps-ds-au-vic-card-emergency-contact", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("has no subtitle or cta by default", () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuVicCardEmergencyContact
    });

    // Act
    document.body.appendChild(element);

    // Assert

    const title = element.querySelector(".rpl-card-emergency__title");
    expect(title).toBeNull();

    const subtitle = element.querySelector(".rpl-card-emergency__subtitle");
    expect(subtitle).toBeNull();

    const cta = element.querySelector(".rpl-card-emergency__cta");
    expect(cta).toBeNull();
  });

  it("is accessible", async () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuVicCardEmergencyContact
    });

    // Act
    element.title = "Title";
    element.subtitle = "Subtitle";
    element.link = { text: "Read more", url: "#" };

    document.body.appendChild(element);

    // Assert

    const title = element.querySelector(".rpl-card-emergency__title");
    expect(title).not.toBeNull();

    const subtitle = element.querySelector(".rpl-card-emergency__subtitle");
    expect(subtitle).not.toBeNull();

    const cta = element.querySelector(".rpl-card-emergency__cta");
    expect(cta).not.toBeNull();

    await expect(element).toBeAccessible();
  });
});
