import { createElement } from "lwc";
import SfGpsDsAuNswProgressIndicator from "c/sfGpsDsAuNswProgressIndicator";

const ELT_TAG = "c-sf-gps-ds-au-nsw-progress-indicator";

describe("c-sf-gps-ds-au-nsw-progress-indicator", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("has the right divs set as active", () => {
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuNswProgressIndicator
    });

    element.step = 2;
    element.of = 3;

    document.body.appendChild(element);

    const indicatorBarDivs = element.shadowRoot.querySelectorAll(
      ".nsw-progress-indicator__bar div"
    );

    expect(indicatorBarDivs.length).toBe(3);
    expect(indicatorBarDivs[0].classList).toContain("active");
    expect(indicatorBarDivs[1].classList).toContain("active");
    expect(indicatorBarDivs[2].classList).not.toContain("active");
  });

  it("is accessible", async () => {
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuNswProgressIndicator
    });

    element.step = 2;
    element.of = 3;

    document.body.appendChild(element);

    await expect(element).toBeAccessible();
  });
});
