import { createElement } from "lwc";
import SfGpsDsAuVicTextIcon from "c/sfGpsDsAuVicTextIcon";

const ELT_TAG = "c-sf-gps-ds-au-vic-text-icon";

describe("c-sf-gps-ds-au-vic-text-icon", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("trims trailing spaces from anchor text correctly", () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuVicTextIcon
    });

    // Act
    element.symbol = "search";
    element.color = "primary";
    element.placement = "after";
    element.size = "m";
    element.text = "I have trailing spaces ";

    document.body.appendChild(element);

    // Assert
    const iconGroup = element.querySelector(".rpl-text-icon__group");
    expect(iconGroup.textContent).toBe(" spaces");
  });

  it("has the right word count", () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuVicTextIcon
    });

    // Act
    element.symbol = "search";
    element.color = "primary";
    element.placement = "after";
    element.size = "m";
    element.text = "I have trailing spaces ";

    document.body.appendChild(element);

    // Assert
    const spanSpan = element.querySelector("span span");
    expect(spanSpan.textContent).toBe("I have trailing");
    expect(spanSpan.classList.length).toBe(0);
  });

  it("sets icon props correctly and is accessible", async () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuVicTextIcon
    });

    // Act
    element.symbol = "search";
    element.color = "secondary";
    element.placement = "before";
    element.size = "m";
    element.text = "Lorem ipsum dolor sit amet";

    document.body.appendChild(element);

    // Assert
    const icon = element.querySelector(
      ".rpl-text-icon__group c-sf-gps-ds-au-vic-icon"
    );
    expect(icon.symbol).toBe(element.symbol);
    expect(icon.size).toBe(element.size);
    expect(icon.color).toBe(element.color);
    expect(icon.classList).toContain("rpl-text-icon--before");

    await expect(element).toBeAccessible();
  });
});
