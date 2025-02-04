import { createElement } from "lwc";
import SfGpsDsAuNswTags from "c/sfGpsDsAuNswTags";

const ELT_TAG = "c-sf-gps-ds-au-nsw-tags";
describe("c-sf-gps-ds-au-nsw-tags", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("render as expected and is accessible", async () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuNswTags
    });

    // Act
    element.tags = [
      { text: "Label A", url: "#a" },
      { text: "Label B" },
      { text: "Label C", url: "#c" }
    ];

    document.body.appendChild(element);

    const tags = element.querySelectorAll(".nsw-tag");

    expect(tags.length).toBe(3);
    expect(tags[0].classList).not.toContain("nsw-tag--checkbox");
    expect(tags[0].tagName).toBe("A");
    expect(tags[0].textContent).toBe(element.tags[0].text);
    expect(tags[0].href).toContain(element.tags[0].url);
    expect(tags[1].tagName).toBe("SPAN");
    expect(tags[1].classList).not.toContain("nsw-tag--checkbox");
    expect(tags[1].textContent).toBe(element.tags[1].text);

    // Assert
    await expect(element).toBeAccessible();
  });

  it("render checkboxes as expected and is accessible", async () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuNswTags
    });

    // Act
    element.tags = [
      { text: "Label A", checked: true },
      { text: "Label B", checked: true },
      { text: "Label C" }
    ];

    element.asCheckboxes = "true";

    document.body.appendChild(element);

    // Assert

    const tags = element.querySelectorAll(".nsw-tag");

    expect(tags.length).toBe(3);
    expect(tags[0].classList).toContain("nsw-tag--checkbox");
    expect(tags[0].tagName).toBe("DIV");
    expect(tags[0].textContent).toBe(element.tags[0].text);

    const tagInputs = element.querySelectorAll(".nsw-tag input");
    expect(tagInputs[0].checked).toBe(true);
    expect(tagInputs[1].checked).toBe(true);
    expect(tagInputs[2].checked).toBe(false);

    await expect(element).toBeAccessible();
  });
});
