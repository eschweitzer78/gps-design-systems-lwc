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

    let div = element.querySelector(".nsw-card");
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

    let div = element.querySelector(".nsw-card");
    expect(div).not.toBeNull();
    expect(div.className).not.toContain("--dark");
    expect(div.className).toContain("--light");
    expect(div.className).toContain("--headline");
  });

  /* TODO: find out why this is hanging -- Commented out top level // it("is accessible", async () => { */

  //   const element = createElement(tag, {
  //     is: SfGpsDsAuNswCard
  //   });

  //   element.cstyle = "light";
  //   element.headline = "Headline";
  //   element.image =
  //     "./someimage";
  //   element.imageAlt = "Alt text";

  //   document.body.appendChild(element);

  //   await expect(element).toBeAccessible();
  // });
});
