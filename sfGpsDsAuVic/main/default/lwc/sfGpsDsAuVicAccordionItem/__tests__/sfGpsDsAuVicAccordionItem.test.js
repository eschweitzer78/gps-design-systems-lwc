import { createElement } from "lwc";
import SfGpsDsAuVicAccordionItem from "c/sfGpsDsAuVicAccordionItem";

const ELT_TAG = "c-sf-gps-ds-au-vic-accordion-item";

describe("c-sf-gps-ds-au-vic-accordion-item", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("is accessible", async () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuVicAccordionItem
    });

    // Act

    element.index = 0;
    element.title = "Title";
    element.type = "default";
    element.content = "blahblah";
    element.closed = false;

    document.body.appendChild(element);

    // Assert
    const item = element.querySelector(".rpl-accordion__list-item");
    expect(item).not.toBeNull();
    expect(item.classList).toContain("rpl-accordion__list-item--expanded");

    const title = element.querySelector(".rpl-accordion__title");
    expect(title).not.toBeNull();
    expect(title.classList).toContain("rpl-accordion__title--expanded");

    const number = element.querySelector(".rpl-accordion__title-number");
    expect(number).toBeNull();

    await expect(element).toBeAccessible();
  });

  it("closes as expected", () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuVicAccordionItem
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
        const item = element.querySelector(".rpl-accordion__list-item");
        expect(item).not.toBeNull();
        expect(item.classList).not.toContain(
          "rpl-accordion__list-item--expanded"
        );

        const title = element.querySelector(".rpl-accordion__title");
        expect(title).not.toBeNull();
        expect(title.classList).not.toContain("rpl-accordion__title--expanded");
      });
    });
  });
});
