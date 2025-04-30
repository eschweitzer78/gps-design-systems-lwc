import { createElement } from "lwc";
import SfGpsDsAuNswContentBlock from "c/sfGpsDsAuNswContentBlock";

const tag = "c-sf-gps-ds-au-nsw-content-block";

describe("c-sf-gps-ds-au-nsw-content-block", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("has no image or title by default", () => {
    const element = createElement(tag, {
      is: SfGpsDsAuNswContentBlock
    });

    document.body.appendChild(element);

    let div = element.querySelector(".nsw-content-block");
    expect(div).not.toBeNull();

    let img = element.querySelector(".nsw-content-block__image");
    expect(img).toBeNull();

    let title = element.querySelector(".nsw-content-block__title");
    expect(title).toBeNull();
  });

  it("displays with headline and image if set", () => {
    const element = createElement(tag, {
      is: SfGpsDsAuNswContentBlock
    });

    element.headline = "Headline";
    element.image =
      "https://images.unsplash.com/photo-1581813589367-a150bfc03cd0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80";
    element.imageAlt = "Newcastle Beach";
    element.links = [];

    document.body.appendChild(element);

    let div = element.querySelector(".nsw-content-block");
    expect(div).not.toBeNull();

    let img = element.querySelector(".nsw-content-block__image");
    expect(img).not.toBeNull();

    let title = element.querySelector(".nsw-content-block__title");
    expect(title).not.toBeNull();
  });

  it("is accessible", async () => {
    const element = createElement(tag, {
      is: SfGpsDsAuNswContentBlock
    });

    element.headline = "Headline";
    element.image =
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80";
    element.imageAlt = "Alt text";
    element.links = [
      {
        index: 1,
        text: "text",
        url: "https://www.salesforce.com/"
      }
    ];

    document.body.appendChild(element);

    await expect(element).toBeAccessible();
  });
});
