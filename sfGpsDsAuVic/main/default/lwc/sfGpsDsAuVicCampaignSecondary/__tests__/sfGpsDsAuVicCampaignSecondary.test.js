import { createElement } from "lwc";
import SfGpsDsAuVicCampaignSecondary from "c/sfGpsDsAuVicCampaignSecondary";

describe("c-sf-gps-ds-au-vic-campaign-secondary", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("is accessible", async () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-au-vic-campaign-secondary", {
      is: SfGpsDsAuVicCampaignSecondary
    });

    // Act
    element.title = "Title";
    element.image = {
      src: "./someurl",
      alt: "someAltText"
    };
    element.link = {
      text: "Read more",
      url: "#here"
    };

    document.body.appendChild(element);

    // Assert
    await expect(element).toBeAccessible();
  });
});
