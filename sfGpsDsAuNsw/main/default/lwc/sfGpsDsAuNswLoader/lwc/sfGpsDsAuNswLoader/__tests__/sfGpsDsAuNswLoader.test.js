import { createElement } from "@lwc/engine-dom";
import SfGpsDsAuNswLoader from "c/sfGpsDsAuNswLoader";

const tag = "c-sf-gps-ds-au-nsw-loader";
const spinnerSpanSelector = "span[aria-hidden]";

describe("c-sf-gps-ds-au-nsw-loader", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("renders as expected with default values", () => {
    // Arrange
    const element = createElement(tag, {
      is: SfGpsDsAuNswLoader
    });

    const setTitle = "Loading...";
    element.title = setTitle;

    // Act
    document.body.appendChild(element);

    // Assert
    const observedTitle = element.title;
    expect(observedTitle).toBe(setTitle);

    const observedSize = element.size;
    expect(observedSize).toBe("xl");

    const iconSpan = element.shadowRoot.querySelector(spinnerSpanSelector);
    expect(iconSpan).not.toBeNull();
    expect(iconSpan.className).toBe("nsw-loader__circle");
  });

  it("renders as expected with md size", () => {
    // Arrange
    const element = createElement(tag, {
      is: SfGpsDsAuNswLoader
    });

    const setTitle = "Fetching goodness...";
    const setSize = "md";

    element.title = setTitle;
    element.size = setSize;

    // Act
    document.body.appendChild(element);

    // Assert
    const observedTitle = element.title;
    expect(observedTitle).toBe(setTitle);

    const observedSize = element.size;
    expect(observedSize).toBe(setSize);

    const iconSpan = element.shadowRoot.querySelector(spinnerSpanSelector);
    expect(iconSpan).not.toBeNull();
    expect(iconSpan.classList).toContain("nsw-loader__circle");
    expect(iconSpan.classList).toContain("nsw-loader__circle--md");
  });

  it("is accessible", async () => {
    const element = createElement(tag, {
      is: SfGpsDsAuNswLoader
    });

    element.title = "Loading...";

    document.body.appendChild(element);

    await expect(element).toBeAccessible();
  });
});
