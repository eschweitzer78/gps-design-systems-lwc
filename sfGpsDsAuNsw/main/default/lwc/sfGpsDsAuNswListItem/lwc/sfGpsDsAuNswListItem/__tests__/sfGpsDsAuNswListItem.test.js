import { createElement } from "lwc";
import SfGpsDsAuNswListItem from "c/sfGpsDsAuNswListItem";

const tag = "c-sf-gps-ds-au-nsw-list-item";
const labelSelector = ".nsw-list-item__label";
const dateOrLinkSelector = ".nsw-list-item__content .nsw-list-item__info";
const titleSelectorAnchor = ".nsw-list-item__title a";
const tagsSelector = ".nsw-list-item__tags";
const imageSelector = ".nsw-list-item__image";

describe("c-sf-gps-ds-au-nsw-list-item", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("displays the right info when provided with only title and link", () => {
    // Arrange
    const element = createElement(tag, {
      is: SfGpsDsAuNswListItem
    });

    // Act
    element.title = "Title";
    element.link = "#link";

    document.body.appendChild(element);

    // Assert

    let label = element.querySelector(labelSelector);
    expect(label).toBeNull();

    let dateOrLink = element.querySelector(dateOrLinkSelector);
    expect(dateOrLink).toBeNull();

    let titleAnchor = element.querySelector(titleSelectorAnchor);
    expect(titleAnchor).not.toBeNull();
    expect(titleAnchor.href).toBe(`http://localhost/${element.link}`);
    expect(titleAnchor.textContent).toBe(element.title);

    let tags = element.querySelector(tagsSelector);
    expect(tags).toBeNull();

    let image = element.querySelector(imageSelector);
    expect(image).toBeNull();
  });

  it("displays both date and link when provided with them", () => {
    // Arrange
    const element = createElement(tag, {
      is: SfGpsDsAuNswListItem
    });

    // Act
    element.date = "2022-11-30";
    element.title = "Title";
    element.link = "#link";
    element.showLink = true;

    document.body.appendChild(element);

    // Assert

    let label = element.querySelector(labelSelector);
    expect(label).toBeNull();

    let dateOrLink = element.querySelectorAll(dateOrLinkSelector);
    expect(dateOrLink).not.toBeNull();
    expect(dateOrLink.length).toBe(2); // once for data, once for the link
  });

  it("displays the right info when provided with full works incl ISO string date", () => {
    // Arrange
    const element = createElement(tag, {
      is: SfGpsDsAuNswListItem
    });

    // Act
    element.label = "Label";
    element.date = "2022-11-30";
    element.title = "Title";
    element.link = "#link";
    element.tags = [{ text: "tagtext", url: "tagurl" }];
    element.image =
      "https://images.unsplash.com/photo-1669554108285-dc5c2786ed61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1915&q=80";
    element.imageAlt = "Colourful 2023";

    document.body.appendChild(element);

    // Assert

    let label = element.querySelector(labelSelector);
    expect(label).not.toBeNull();

    let dateOrLink = element.querySelectorAll(dateOrLinkSelector);
    expect(dateOrLink).not.toBeNull();
    expect(dateOrLink.length).toBe(1); // once for data, but not for link (as showLink wasn't set)

    let titleAnchor = element.querySelector(titleSelectorAnchor);
    expect(titleAnchor).not.toBeNull();
    expect(titleAnchor.href).toBe(`http://localhost/${element.link}`);
    expect(titleAnchor.textContent).toBe(element.title);

    let tags = element.querySelector(tagsSelector);
    expect(tags).not.toBeNull();

    let image = element.querySelector(imageSelector + " img");
    expect(image).not.toBeNull();
    image.src = element.image;
    image.alt = element.imageAlt;
  });
});
