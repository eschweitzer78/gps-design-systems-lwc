import { createElement } from "lwc";
import SfGpsDsAuNswSideNav from "c/sfGpsDsAuNswSideNav";

const ELT_TAG = "c-sf-gps-ds-au-nsw-side-nav";
const SIMPLE_NAV = [
  {
    text: "A",
    subNav: [
      { text: "A.1", url: "#a.1" },
      { text: "A.2", url: "#a.2" }
    ]
  },
  {
    text: "B",
    url: "#b",
    subNav: [
      { text: "B.1", url: "#b.1" },
      { text: "B.2", url: "#b.2" },
      { text: "B.3", url: "#b.3" }
    ]
  },
  { text: "C", url: "#c" }
];

describe("c-sf-gps-ds-au-nsw-side-nav", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("renders as expected", () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuNswSideNav
    });

    // Act
    element.title = "My title";
    element.url = "#here";
    element.navItems = SIMPLE_NAV;

    document.body.appendChild(element);

    const headerA = element.querySelector(".nsw-side-nav__header a");

    expect(headerA).not.toBeNull();
    expect(headerA.href).toContain(element.url);
    expect(headerA.textContent).toBe(element.title);

    const ulLis = element.querySelectorAll("ul > li");

    expect(ulLis.length).toBe(3);
    expect(ulLis[0].classList).not.toContain("active");

    const ulLiAs = element.querySelectorAll("ul > li > a");
    expect(ulLiAs.length).toBe(3);
    expect(ulLiAs[0].classList).not.toContain("current");
    expect(ulLiAs[0].href).toBe(`javascript${":"}void(0)`);
    expect(ulLiAs[1].classList).not.toContain("current");
    expect(ulLiAs[1].href).toContain(SIMPLE_NAV[1].url);
  });

  it("is accessible", async () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuNswSideNav
    });

    // Act
    element.title = "My title";
    element.url = "#here";
    element.navItems = SIMPLE_NAV;

    document.body.appendChild(element);

    await expect(element).toBeAccessible();
  });
});
