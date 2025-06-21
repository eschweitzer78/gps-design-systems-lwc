import { createElement } from "@lwc/engine-dom";
import SfGpsDsUkGovAccordionSection from "c/sfGpsDsUkGovAccordionSection";

const ELT_TAG = "c-sf-gps-ds-uk-gov-accordion-section";

describe("c-sf-gps-ds-uk-gov-accordion-section", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("is accessible", async () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsUkGovAccordionSection
    });

    // Act

    element.index = 0;
    element.title = "Title";
    element.type = "default";
    element.content = "blahblah";
    element.closed = false;

    document.body.appendChild(element);

    // Assert
    const item = element.querySelector(".govuk-accordion__section");
    expect(item).not.toBeNull();
    expect(item.classList).toContain("govuk-accordion__section--expanded");

    await expect(element).toBeAccessible();
  });

  it("closes as expected", () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsUkGovAccordionSection
    });

    // Act

    element.index = 0;
    element.title = "Title";
    element.type = "default";
    element.content = "blahblah";
    element.closed = false;

    document.body.appendChild(element);

    const handler = jest.fn();
    element.addEventListener("collapse", handler);

    const button = element.querySelector("button");
    button.click();

    // Assert

    return Promise.resolve().then(() => {
      expect(handler).toHaveBeenCalled();

      element.closed = true;

      return Promise.resolve().then(() => {
        const item = element.querySelector(".govuk-accordion__section");
        expect(item).not.toBeNull();
        expect(item.classList).not.toContain(
          "govuk-accordion__section--expanded"
        );
      });
    });
  });
});
