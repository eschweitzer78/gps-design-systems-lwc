import { createElement } from "lwc";
import SfGpsDsAuVicTextLabel from "c/sfGpsDsAuVicTextLabel";

const ELT_TAG = "c-sf-gps-ds-au-vic-text-label";

describe("c-sf-gps-ds-au-vic-text-label", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("has no style by default", () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuVicTextLabel
    });

    // Act
    document.body.appendChild(element);

    // Assert
    const span = element.querySelector("span");
    expect(span.classList).toContain("rpl-text-label");
    expect(span.classList.length).toBe(1);
  });

  it("adds dark and underline styles if configured so", () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuVicTextLabel
    });

    element.theme = "dark";
    element.underline = true;

    // Act
    document.body.appendChild(element);

    // Assert
    const span = element.querySelector("span");
    expect(span.classList).toContain("rpl-text-label");
    expect(span.classList).toContain("rpl-text-label--dark");
    expect(span.classList).toContain("rpl-text-label--dark--underline");
    expect(span.classList.length).toBe(3);
  });

  it("adds small and underline styles if configured so", () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuVicTextLabel
    });

    element.size = "small";
    element.underline = true;

    // Act
    document.body.appendChild(element);

    // Assert
    const span = element.querySelector("span");
    expect(span.classList).toContain("rpl-text-label");
    expect(span.classList).toContain("rpl-text-label--small");
    expect(span.classList).toContain("rpl-text-label--small--underline");
    expect(span.classList.length).toBe(3);
  });

  it("adds large but not underline styles if configured so and is accessible", async () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuVicTextLabel
    });

    element.size = "large";
    element.emphasis = true;

    // Act
    document.body.appendChild(element);

    // Assert
    const span = element.querySelector("span");
    expect(span.classList).toContain("rpl-text-label");
    expect(span.classList).toContain("rpl-text-label--large");
    expect(span.classList).toContain("rpl-text-label--emphasis");
    expect(span.classList.length).toBe(3);

    await expect(element).toBeAccessible();
  });
});
