import { createElement } from "lwc";
import SfGpsDsUkGovUpperFooter from "c/sfGpsDsUkGovUpperFooter";

const ELT_TAG = "c-sf-gps-ds-uk-gov-upper-footer";
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

describe("c-sf-gps-ds-uk-gov-upper-footer", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("renders as expected", () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsUkGovUpperFooter
    });

    // Act
    element.items = SIMPLE_NAV;
    document.body.appendChild(element);

    // Assert
    const headings = element.querySelectorAll(".govuk-footer__heading");
    const headingAs = element.querySelectorAll(".govuk-footer__heading > a");

    expect(headings.length).toBe(3);
    expect(headings[0].textContent).toBe(SIMPLE_NAV[0].text);
    expect(headings[1].textContent).toBe(SIMPLE_NAV[1].text);
    expect(headings[2].textContent).toBe(SIMPLE_NAV[2].text);

    expect(headingAs.length).toBe(2);
    expect(headingAs[0].textContent).toBe(SIMPLE_NAV[1].text);
  });

  it("is accessible", async () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsUkGovUpperFooter
    });

    // Act
    element.items = SIMPLE_NAV;
    document.body.appendChild(element);

    // Assert
    await expect(element).toBeAccessible();
  });
});
