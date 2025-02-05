import { createElement } from "lwc";
import SfGpsDsAuVicCampaignPrimary from "c/sfGpsDsAuVicCampaignPrimary";

const ELT_TAG = "c-sf-gps-ds-au-vic-campaign-primary";

describe("c-sf-gps-ds-au-vic-campaign-primary", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("has no image, no title and no caption by default", () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuVicCampaignPrimary
    });

    // Act
    document.body.appendChild(element);

    // Assert
    const image = element.querySelector(".rpl-campaign-primary__image-outer");
    expect(image).toBeNull();

    const title = element.querySelector(".rpl-campaign-primary__title");
    expect(title).toBeNull();

    const caption = element.querySelector(
      ".rpl-campaign-primary--with-caption"
    );
    expect(caption).toBeNull();
  });

  it("has two image blocks (responsive) if provided with image", () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuVicCampaignPrimary
    });

    element.image = {
      src: "./someurl",
      alt: "some alt text"
    };

    // Act
    document.body.appendChild(element);

    // Assert
    const images = element.querySelectorAll(
      ".rpl-campaign-primary__image-outer"
    );
    expect(images.length).toBe(2);
  });

  it("has a caption and title if configured so and is accessible", async () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuVicCampaignPrimary
    });

    element.image = {
      src: "./someurl",
      alt: "some alt text"
    };

    element.caption = "caption";
    element.title = "title";
    element.link = {
      text: "Read more",
      url: "#here"
    };

    // Act
    document.body.appendChild(element);

    // Assert
    const caption = element.querySelector(
      ".rpl-campaign-primary--with-caption"
    );
    expect(caption).not.toBeNull();

    const figure = element.querySelector(".rpl-campaign-primary__figure");
    expect(figure).not.toBeNull();

    const title = element.querySelector(".rpl-campaign-primary__title");
    expect(title).not.toBeNull();

    await expect(element).toBeAccessible();
  });
});
