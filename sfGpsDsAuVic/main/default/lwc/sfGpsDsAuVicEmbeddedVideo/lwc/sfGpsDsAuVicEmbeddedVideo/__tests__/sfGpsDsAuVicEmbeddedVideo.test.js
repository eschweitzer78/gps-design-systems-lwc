import { createElement } from "lwc";
import SfGpsDsAuVicEmbeddedVideo from "c/sfGpsDsAuVicEmbeddedVideo";

describe("c-sf-gps-ds-au-vic-embedded-video", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("does show neither link nor transcript by default", () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-au-vic-embedded-video", {
      is: SfGpsDsAuVicEmbeddedVideo
    });

    // Act
    document.body.appendChild(element);

    // Assert
    const link = element.querySelector(".rpl-embed-video__link");
    expect(link).toBeNull();

    const transcript = element.querySelector(".rpl-embed-video__transcript");
    expect(transcript).toBeNull();
  });

  it("does render properly if provided with data and is accessible", async () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-au-vic-embedded-video", {
      is: SfGpsDsAuVicEmbeddedVideo
    });

    // Act
    element.title = "Video";
    element.width = 300;
    element.height = 200;
    element.src = "./here";
    element.variant = "link";
    element.mediaLink = "https://vic.gov.au";

    document.body.appendChild(element);

    // Assert
    const link = element.querySelector(".rpl-embed-video__link");
    expect(link).not.toBeNull();

    const transcript = element.querySelector(".rpl-embed-video__transcript");
    expect(transcript).toBeNull();

    await expect(element).toBeAccessible();
  });
});
