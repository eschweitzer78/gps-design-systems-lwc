import { createElement } from "lwc";
import SfGpsDsAuNswPagination from "c/sfGpsDsAuNswPagination";

const tag = "c-sf-gps-ds-au-nsw-pagination";
const buttonSelector = ".nsw-pagination ul li .nsw-icon-button";
const ellAndPageNumberSelector = ".nsw-pagination ul li";
const ellipsisSelector = ".nsw-pagination ul li > span";
const pageNumberSelector = ".nsw-pagination a:not(.nsw-icon-button)";
const activeSelector = ".nsw-pagination .active";

describe("c-sf-gps-ds-au-nsw-pagination", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("shows next and previous buttons and single page number when single page", () => {
    // This is the standard rendering with NSW DS
    // Arrange
    const element = createElement(tag, {
      is: SfGpsDsAuNswPagination
    });

    // Act
    element.lastPage = 1;
    element.activePage = 1;
    document.body.appendChild(element);

    // Assert

    let prevButton = element.querySelector(
      ".nsw-pagination ul li:first-child .nsw-icon-button"
    );
    expect(prevButton).not.toBeNull();

    let nextButton = element.querySelector(
      ".nsw-pagination ul li:last-child .nsw-icon-button"
    );
    expect(nextButton).not.toBeNull();

    let anchors = element.querySelectorAll(pageNumberSelector);
    expect(anchors.length).toBe(1);
  });

  it("shows three page numbers with 3 pages and 2 is active", () => {
    // < 1 *2* 3 >

    // Arrange
    const element = createElement(tag, {
      is: SfGpsDsAuNswPagination
    });

    // Act
    element.lastPage = 3;
    element.activePage = 2;
    document.body.appendChild(element);

    // Assert

    let buttons = element.querySelectorAll(buttonSelector);
    expect(buttons.length).toBe(2);

    let anchors = element.querySelectorAll(ellAndPageNumberSelector);
    expect(anchors.length - buttons.length).toBe(3);
  });

  it("shows five page numbers and no ellipsis with 5 pages and 3 is active", () => {
    // < 1 2 *3* 4 5 >

    // Arrange
    const element = createElement(tag, {
      is: SfGpsDsAuNswPagination
    });

    // Act
    element.lastPage = 5;
    element.activePage = 3;
    document.body.appendChild(element);

    // Assert

    let buttons = element.querySelectorAll(buttonSelector);
    expect(buttons.length).toBe(2);

    let ellipses = element.querySelectorAll(ellipsisSelector);
    expect(ellipses.length).toBe(0);

    let anchors = element.querySelectorAll(ellAndPageNumberSelector);
    expect(anchors.length - buttons.length - ellipses.length).toBe(5);

    let active = element.querySelector(activeSelector);
    expect(active).not.toBeNull();
    expect(active.textContent).toBe(
      `${element.srOnlyPre}${element.activePage}`
    );
  });

  it("shows five page numbers and two ellipses with 7 pages and 4 is active", () => {
    // < 1 ... 3 *4* 5 ... 7 >

    // Arrange
    const element = createElement(tag, {
      is: SfGpsDsAuNswPagination
    });

    // Act
    element.lastPage = 7;
    element.activePage = 4;
    document.body.appendChild(element);

    // Assert

    let buttons = element.querySelectorAll(buttonSelector);
    expect(buttons.length).toBe(2);

    let ellipses = element.querySelectorAll(ellipsisSelector);
    expect(ellipses.length).toBe(2);

    let anchors = element.querySelectorAll(ellAndPageNumberSelector);
    expect(anchors.length - buttons.length - ellipses.length).toBe(5);

    let active = element.querySelector(activeSelector);
    expect(active).not.toBeNull();
    expect(active.textContent).toBe(
      `${element.srOnlyPre}${element.activePage}`
    );
  });

  it("generate an event on prev with 3 pages and 2nd active", () => {
    // Arrange
    const element = createElement(tag, {
      is: SfGpsDsAuNswPagination
    });

    // Act
    element.lastPage = 3;
    element.activePage = 2;
    document.body.appendChild(element);

    // Assert

    const handler = jest.fn();
    element.addEventListener("pagechange", handler);

    let prevButton = element.querySelector(
      ".nsw-pagination ul li:first-child .nsw-icon-button"
    );
    expect(prevButton).not.toBeNull();

    prevButton.click();

    return Promise.resolve().then(() => {
      expect(handler).toHaveBeenCalled();
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  it("generate an event on next with 3 pages and 2nd active", () => {
    // Arrange
    const element = createElement(tag, {
      is: SfGpsDsAuNswPagination
    });

    // Act
    element.lastPage = 3;
    element.activePage = 2;
    document.body.appendChild(element);

    // Assert

    const handler = jest.fn();
    element.addEventListener("pagechange", handler);

    let nextButton = element.querySelector(
      ".nsw-pagination ul li:last-child .nsw-icon-button"
    );
    expect(nextButton).not.toBeNull();

    nextButton.click();

    return Promise.resolve().then(() => {
      expect(handler).toHaveBeenCalled();
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  it("does not generate an event on next with 3 pages and 3rd active", () => {
    // Arrange
    const element = createElement(tag, {
      is: SfGpsDsAuNswPagination
    });

    // Act
    element.lastPage = 3;
    element.activePage = 3;
    document.body.appendChild(element);

    // Assert

    const handler = jest.fn();
    element.addEventListener("pagechange", handler);

    let nextButton = element.querySelector(
      ".nsw-pagination ul li:last-child .nsw-icon-button"
    );
    expect(nextButton).not.toBeNull();

    nextButton.click();

    return Promise.resolve().then(() => {
      expect(handler).not.toHaveBeenCalled();
    });
  });

  it("is accessible", async () => {
    // Arrange
    const element = createElement(tag, {
      is: SfGpsDsAuNswPagination
    });

    // Act
    element.lastPage = 7;
    element.activePage = 4;
    document.body.appendChild(element);

    await expect(element).toBeAccessible();
  });
});
