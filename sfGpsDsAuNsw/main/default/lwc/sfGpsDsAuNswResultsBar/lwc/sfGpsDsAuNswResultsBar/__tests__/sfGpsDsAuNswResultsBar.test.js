import { createElement } from "lwc";
import SfGpsDsAuNswResultsBar from "c/sfGpsDsAuNswResultsBar";

const tag = "c-sf-gps-ds-au-nsw-results-bar";
const infoSelector = ".nsw-results-bar__info";
const sortingSelector = ".nsw-form__select";
const firstOptionSelector = ".nsw-form__select option[value='Value A']";

describe("c-sf-gps-ds-au-nsw-results-bar", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("has right text but no sorting when no results", () => {
    // Arrange
    const element = createElement(tag, {
      is: SfGpsDsAuNswResultsBar
    });

    // Act
    document.body.appendChild(element);

    // Assert
    const info = element.querySelector(infoSelector);
    expect(info).not.toBeNull();
    expect(info.textContent).toMatch(element.noResultText);

    const sorting = element.querySelector(sortingSelector);
    expect(sorting).toBeNull();
  });

  it("has position text and sorting dropdown when results, and dispatches event when sort option picked", () => {
    // Arrange
    const element = createElement(tag, {
      is: SfGpsDsAuNswResultsBar
    });

    // Act
    element.from = 1;
    element.to = 20;
    element.total = 42;
    element.sortOptions = [
      { label: "Label A", value: "Value A" },
      { label: "Label B", value: "Value B" }
    ];
    element.value = "Value B";

    document.body.appendChild(element);

    // Assert
    const info = element.querySelector(infoSelector);
    expect(info).not.toBeNull();
    expect(info.textContent).toMatch("Showing results 1 - 20 of 42 results");

    const sorting = element.querySelector(sortingSelector);
    expect(sorting).not.toBeNull();
    expect(sorting.selectedIndex).toBe(1);

    const handler = jest.fn();
    element.addEventListener("change", handler);

    let firstOption = element.querySelector(firstOptionSelector);
    expect(firstOption).not.toBeNull();

    sorting.value = element.sortOptions[0].value;
    sorting.dispatchEvent(new CustomEvent("change"));

    return Promise.resolve().then(() => {
      expect(handler).toHaveBeenCalled();
      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler.mock.calls[0][0].detail).toEqual(sorting.value);
    });
  });

  it("is accessible", async () => {
    // Arrange
    const element = createElement(tag, {
      is: SfGpsDsAuNswResultsBar
    });

    // Act
    element.from = 1;
    element.to = 20;
    element.total = 42;
    element.sortOptions = [
      { label: "Label A", value: "Value A" },
      { label: "Label B", value: "Value B" }
    ];
    element.value = "Value B";

    document.body.appendChild(element);

    await expect(element).toBeAccessible();
  });
});
