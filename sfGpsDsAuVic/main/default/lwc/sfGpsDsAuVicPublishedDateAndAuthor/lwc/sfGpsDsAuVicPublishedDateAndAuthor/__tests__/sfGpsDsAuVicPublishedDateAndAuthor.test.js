import { createElement } from "lwc";
import SfGpsDsAuVicPublishedDateAndAuthor from "c/sfGpsDsAuVicPublishedDateAndAuthor";

describe("c-sf-gps-ds-au-vic-published-date-and-author", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("has neither date nor author by default", () => {
    // Arrange
    const element = createElement(
      "c-sf-gps-ds-au-vic-published-date-and-author",
      {
        is: SfGpsDsAuVicPublishedDateAndAuthor
      }
    );

    // Act
    document.body.appendChild(element);

    // Assert
    const date = element.querySelector(
      ".rpl-publish-date-and-author__date-location"
    );
    expect(date).toBeNull();

    const author = element.querySelector(
      ".rpl-publish-date-and-author__author"
    );
    expect(author).toBeNull();
  });

  it("has a date when configured with ISO date", () => {
    // Arrange
    const element = createElement(
      "c-sf-gps-ds-au-vic-published-date-and-author",
      {
        is: SfGpsDsAuVicPublishedDateAndAuthor
      }
    );

    element.date = "2023-01-01";

    // Act
    document.body.appendChild(element);

    // Assert
    const date = element.querySelector(
      ".rpl-publish-date-and-author__date-location"
    );
    expect(date).not.toBeNull();
  });

  it("has a date when configured with JS date", () => {
    // Arrange
    const element = createElement(
      "c-sf-gps-ds-au-vic-published-date-and-author",
      {
        is: SfGpsDsAuVicPublishedDateAndAuthor
      }
    );

    element.date = Date.now();

    // Act
    document.body.appendChild(element);

    // Assert
    const date = element.querySelector(
      ".rpl-publish-date-and-author__date-location"
    );
    expect(date).not.toBeNull();
  });

  it("has a location when configured so", () => {
    // Arrange
    const element = createElement(
      "c-sf-gps-ds-au-vic-published-date-and-author",
      {
        is: SfGpsDsAuVicPublishedDateAndAuthor
      }
    );

    element.date = "2023-01-01";
    element.location = "Melbourne";

    // Act
    document.body.appendChild(element);

    // Assert
    const location = element.querySelector(
      ".rpl-publish-date-and-author__date-location span"
    );
    expect(location).not.toBeNull();
  });

  it("has an author when configured so", () => {
    // Arrange
    const element = createElement(
      "c-sf-gps-ds-au-vic-published-date-and-author",
      {
        is: SfGpsDsAuVicPublishedDateAndAuthor
      }
    );

    element.author = "George R. R. Martin";

    // Act
    document.body.appendChild(element);

    // Assert
    const author = element.querySelector(
      ".rpl-publish-date-and-author__author"
    );
    expect(author).not.toBeNull();
  });
});
