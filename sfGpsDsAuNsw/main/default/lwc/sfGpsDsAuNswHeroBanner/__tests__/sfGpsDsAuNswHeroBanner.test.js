import { createElement } from "lwc";
import SfGpsDsAuNswBanner from "c/sfGpsDsAuNswHeroBanner";

const tag = "c-sf-gps-ds-au-nsw-hero-banner";
const ctaSelector = ".nsw-hero-banner__button";
const ctaASelector = ".nsw-hero-banner__button a";
const linksSelector = ".nsw-hero-banner__links";
const bannerBgSelector = ".nsw-hero-banner__bg";
const subtitleSelector = ".nsw-hero-banner__list .nsw-hero-banner__sub-title";
const linkListSelector = ".nsw-hero-banner__list li a";
const bannerImageSelector = ".nsw-hero-banner__image";

describe("c-sf-gps-ds-au-nsw-hero-banner", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  // TODO flesh out
  it("renders as expected with minimal info", async () => {
    const element = createElement(tag, {
      is: SfGpsDsAuNswBanner
    });

    element.title = "Hero Banner";
    document.body.appendChild(element);

    let cta = element.shadowRoot.querySelector(ctaSelector);
    expect(cta).toBeNull();

    let links = element.shadowRoot.querySelector(linksSelector);
    expect(links).toBeNull();

    let bannerImage = element.shadowRoot.querySelector(bannerImageSelector);
    expect(bannerImage).toBeNull();

    let bannerBg = element.shadowRoot.querySelector(bannerBgSelector);
    expect(bannerBg).not.toBeNull();
  });

  it("renders as expected with full info", async () => {
    const element = createElement(tag, {
      is: SfGpsDsAuNswBanner
    });

    element.title = "Hero Banner";
    element.cstyle = "light";
    element.cta = { text: "Call to action", url: "#" };
    element.subtitle = "Links";
    element.links = [
      { text: "link1", url: "#link1" },
      { text: "link2", url: "#link2" }
    ];
    element.image = {
      src: "https://images.unsplash.com/photo-1523608401-53eb5741c1a0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
      alt: "Sydney Rushcutters Bay"
    };

    document.body.appendChild(element);

    let cta = element.shadowRoot.querySelector(ctaSelector);
    expect(cta).not.toBeNull();

    let ctaA = element.shadowRoot.querySelector(ctaASelector);
    expect(ctaA).not.toBeNull();
    expect(ctaA.href).toBe(`http://localhost/${element.cta.url}`);
    expect(ctaA.className).toBe("nsw-button nsw-button--dark");

    let links = element.shadowRoot.querySelector(linksSelector);
    expect(links).not.toBeNull();

    let subtitle = element.shadowRoot.querySelectorAll(subtitleSelector);
    expect(subtitle).not.toBeNull();

    let linkList = element.shadowRoot.querySelectorAll(linkListSelector);
    expect(linkList).not.toBeNull();
    expect(linkList.length).toEqual(2);
    expect(linkList[0].textContent).toBe(element.links[0].text);

    let bannerImage = element.shadowRoot.querySelector(bannerImageSelector);
    expect(bannerImage).not.toBeNull();

    let bannerBg = element.shadowRoot.querySelector(bannerBgSelector);
    expect(bannerBg).toBeNull();
  });

  it("is accessible", async () => {
    const element = createElement(tag, {
      is: SfGpsDsAuNswBanner
    });

    element.title = "Hero Banner";
    element.cstyle = "light";
    element.cta = { text: "Call to action", url: "#" };
    element.subtitle = "Links";
    element.links = [
      { text: "link1", url: "#link1" },
      { text: "link2", url: "#link2" }
    ];
    element.image = {
      src: "https://images.unsplash.com/photo-1523608401-53eb5741c1a0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
      alt: "Sydney Rushcutters Bay"
    };

    document.body.appendChild(element);

    await expect(element).toBeAccessible();
  });
});
