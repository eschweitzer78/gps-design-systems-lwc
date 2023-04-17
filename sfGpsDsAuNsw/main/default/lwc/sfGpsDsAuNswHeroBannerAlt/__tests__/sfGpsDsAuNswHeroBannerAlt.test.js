import { createElement } from "lwc";
import SfGpsDsAuNswBannerAlt from "c/sfGpsDsAuNswHeroBannerAlt";

const tag = "c-sf-gps-ds-au-nsw-hero-banner";
const titleSelector = ".nsw-hero-banner-alt__link";
const bannerImageSelector = ".nsw-hero-banner-alt__image";

describe("c-sf-gps-ds-au-nsw-hero-banner-alt", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("renders as expected with full info", async () => {
    const element = createElement(tag, {
      is: SfGpsDsAuNswBannerAlt
    });

    element.titleLabel = "Hero Banner";
    element.titleUrl = "#";
    element.imageSrc =
      "https://images.unsplash.com/photo-1523608401-53eb5741c1a0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80";
    element.imageAlt = "Sydney Rushcutters Bay";

    document.body.appendChild(element);

    let title = element.querySelector(titleSelector);
    expect(title).not.toBeNull();
    expect(title.href).toBe(`http://localhost/${element.titleUrl}`);
    expect(title.textContent).toBe(element.titleLabel);

    let bannerImage = element.querySelector(bannerImageSelector);
    expect(bannerImage).not.toBeNull();
  });

  it("is accessible", async () => {
    const element = createElement(tag, {
      is: SfGpsDsAuNswBannerAlt
    });

    element.titleLabel = "Hero Banner";
    element.titleUrl = "#";
    element.imageSrc =
      "https://images.unsplash.com/photo-1523608401-53eb5741c1a0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80";
    element.imageAlt = "Sydney Rushcutters Bay";

    document.body.appendChild(element);

    await expect(element).toBeAccessible();
  });
});
