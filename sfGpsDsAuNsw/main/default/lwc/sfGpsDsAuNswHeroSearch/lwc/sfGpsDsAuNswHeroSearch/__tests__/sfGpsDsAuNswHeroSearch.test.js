import { createElement } from "@lwc/engine-dom";
import SfGpsDsAuNswHeroSearch from "c/sfGpsDsAuNswHeroSearch";

const ELT_TAG = "c-sf-gps-ds-au-nsw-hero-search";

describe("c-sf-gps-ds-au-nsw-hero-search", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("renders as expected with minimal info", async () => {
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuNswHeroSearch
    });

    element.title = "Hero Search";
    element.intro = "Find information, access services and have your say.";

    document.body.appendChild(element);

    let title = element.querySelector("h1");
    expect(title).not.toBeNull();

    let intro = element.querySelector(".nsw-intro");
    expect(intro).not.toBeNull();

    let suggested = element.querySelector(".hero-search__suggested");
    expect(suggested).toBeNull();
  });

  it("renders as expected with full info", async () => {
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuNswHeroSearch
    });

    element.title = "Hero Search";
    element.intro = "Find information, access services and have your say.";
    element.links = [
      { index: 0, text: "A", url: "#a" },
      { index: 1, text: "B", url: "#b" },
      { index: 2, text: "C", url: "#c" }
    ];

    document.body.appendChild(element);

    let title = element.querySelector("h1");
    expect(title).not.toBeNull();

    let intro = element.querySelector(".nsw-intro");
    expect(intro).not.toBeNull();

    let suggestedLis = element.querySelectorAll(".hero-search__suggested li");
    expect(suggestedLis.length).toBe(3);
  });

  it("renders with a visible label and a text button when configured to do so", async () => {
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuNswHeroSearch
    });

    element.title = "Hero Search";
    element.intro = "Find information, access services and have your say.";
    element.links = [
      { index: 0, text: "A", url: "#a" },
      { index: 1, text: "B", url: "#b" },
      { index: 2, text: "C", url: "#c" }
    ];
    element.label = true;
    element.button = "text";
    document.body.appendChild(element);

    let labelElt = element.querySelector("label");
    expect(labelElt).not.toBeNull();
    expect(labelElt.classList).not.toContain("sr-only");

    let buttonElt = element.querySelector("button > span");
    expect(buttonElt).not.toBeNull();
    expect(buttonElt.classList).not.toContain("nsw-material-icons");
  });

  it("is accessible", async () => {
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuNswHeroSearch
    });

    element.title = "Hero Search";
    element.intro = "Find information, access services and have your say.";
    element.links = [
      { index: 0, text: "A", url: "#a" },
      { index: 1, text: "B", url: "#b" },
      { index: 2, text: "C", url: "#c" }
    ];

    document.body.appendChild(element);

    await expect(element).toBeAccessible();
  });
});
