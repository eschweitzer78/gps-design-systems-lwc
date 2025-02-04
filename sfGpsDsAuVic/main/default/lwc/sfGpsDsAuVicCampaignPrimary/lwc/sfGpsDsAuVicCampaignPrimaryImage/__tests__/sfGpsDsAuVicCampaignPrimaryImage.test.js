import { createElement } from "lwc";
import SfGpsDsAuVicCampaignPrimaryImage from "c/sfGpsDsAuVicCampaignPrimaryImage";
import { setup } from "@sa11y/jest";

describe("c-sf-gps-ds-au-vic-campaign-primary-image", () => {
  beforeAll(() => {
    setup();
  });

  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("does not display title if alt is not provided", () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-au-vic-campaign-primary-image", {
      is: SfGpsDsAuVicCampaignPrimaryImage
    });

    element.image = {
      src: "blah"
    };

    // Act
    document.body.appendChild(element);

    // Assert
    const title = element.querySelector("title");
    expect(title).toBeNull();
  });

  it("displays title if alt is provided", () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-au-vic-campaign-primary-image", {
      is: SfGpsDsAuVicCampaignPrimaryImage
    });

    element.image = {
      image: "blah",
      alt: "blah"
    };
    element.hasAlt = true;

    // Act
    document.body.appendChild(element);

    // Assert
    const title = element.querySelector("title");
    expect(title).not.toBeNull();
    expect(title.textContent).toBe(element.image.alt);
  });

  it("does not display svg if image is not provided", () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-au-vic-campaign-primary-image", {
      is: SfGpsDsAuVicCampaignPrimaryImage
    });

    // Act
    document.body.appendChild(element);

    // Assert
    const title = element.querySelector("svg");
    expect(title).toBeNull();
  });
});
