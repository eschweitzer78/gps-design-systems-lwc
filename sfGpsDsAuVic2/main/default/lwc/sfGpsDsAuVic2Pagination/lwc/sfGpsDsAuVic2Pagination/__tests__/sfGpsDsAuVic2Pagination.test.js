import { createElement } from "@lwc/engine-dom";
import SfGpsDsAuVic2Pagination from "c/sfGpsDsAuVic2Pagination";

const TAG_NAME = "c-sf-gps-ds-au-vic2-pagination";

const baseProps = {
  totalPages: 3,
  currentPage: 1,
  contentType: "page"
};

const currentSel = '[aria-current="true"]';
const nextSel = `[aria-label="Go to next ${baseProps.contentType}"]`;
const prevSel = `[aria-label="Go to previous ${baseProps.contentType}"]`;

describe("c-sf-gps-ds-au-vic2-pagination", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("navigates to the next page", () => {
    // Arrange
    const element = createElement(TAG_NAME, {
      is: SfGpsDsAuVic2Pagination
    });

    // Act
    Object.assign(element, baseProps);
    document.body.appendChild(element);

    // Assert
    let current = element.shadowRoot.querySelector(currentSel);
    expect(current.textContent).toContain("1");

    const next = element.shadowRoot.querySelector(nextSel);
    expect(next).not.toBeNull();
    next.click();

    return Promise.resolve(() => {
      current = element.shadowRoot.querySelector(currentSel);
      expect(current.textContent).toContain("2");
    });
  });

  it("navigates to the previous page", () => {
    // Arrange
    const element = createElement(TAG_NAME, {
      is: SfGpsDsAuVic2Pagination
    });

    // Act
    Object.assign(element, { ...baseProps, currentPage: 3 });
    document.body.appendChild(element);

    // Assert
    let current = element.shadowRoot.querySelector(currentSel);
    expect(current.textContent).toContain("3");

    const prev = element.shadowRoot.querySelector(prevSel);
    expect(prev).not.toBeNull();
    prev.click();

    return Promise.resolve(() => {
      current = element.shadowRoot.querySelector(currentSel);
      expect(current.textContent).toContain("2");
    });
  });

  it("hides and shows next/prev", () => {
    // Arrange
    const element = createElement(TAG_NAME, {
      is: SfGpsDsAuVic2Pagination
    });

    // Act
    Object.assign(element, { ...baseProps, totalPages: 2 });
    document.body.appendChild(element);

    // Assert

    let prev = element.shadowRoot.querySelector(prevSel);
    expect(prev).toBeNull();

    let next = element.shadowRoot.querySelector(nextSel);
    expect(next).not.toBeNull();

    next.click();

    return Promise.resolve(() => {
      prev = element.shadowRoot.querySelector(prevSel);
      next = element.shadowRoot.querySelector(nextSel);

      expect(next).toBeNull();
      expect(prev).not.toBeNull();
    });
  });

  it("is accessible", async () => {
    // Arrange
    const element = createElement(TAG_NAME, {
      is: SfGpsDsAuVic2Pagination
    });

    // Act
    Object.assign(element, baseProps);
    document.body.appendChild(element);

    // Assert
    expect(element).toBeAccessible();
  });
});
