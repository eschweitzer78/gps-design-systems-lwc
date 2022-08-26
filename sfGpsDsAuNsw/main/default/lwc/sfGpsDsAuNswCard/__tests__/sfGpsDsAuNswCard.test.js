/* eslint-disable @lwc/lwc/no-inner-html */
import { createElement } from "lwc";
import SfGpsDsAuNswCard from "c/sfGpsDsAuNswCard";

const tag = "c-sf-gps-ds-au-nsw-card";

describe("c-sf-gps-ds-au-nsw-card", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("has white, no headline rendering by default", () => {
    const element = createElement(tag, {
      is: SfGpsDsAuNswCard
    });

    document.body.appendChild(element);

    let div = element.shadowRoot.querySelector(".nsw-card");
    expect(div).not.toBeNull();
    expect(div.className).toContain("--white");
    expect(div.className).not.toContain("--headline");
  });

  it("displays with headline style if set", () => {
    const element = createElement(tag, {
      is: SfGpsDsAuNswCard
    });

    element.cstyle = "light";
    element.headline = "Headline";

    document.body.appendChild(element);

    let div = element.shadowRoot.querySelector(".nsw-card");
    expect(div).not.toBeNull();
    expect(div.className).not.toContain("--dark");
    expect(div.className).toContain("--light");
    expect(div.className).toContain("--headline");
  });

  it("is accessible", async () => {
    const element = createElement(tag, {
      is: SfGpsDsAuNswCard
    });

    element.headline = "Headline";
    element.image =
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80";
    element.imageAlt = "Alt text";

    document.body.appendChild(element);

    await expect(element).toBeAccessible();
  });
});
