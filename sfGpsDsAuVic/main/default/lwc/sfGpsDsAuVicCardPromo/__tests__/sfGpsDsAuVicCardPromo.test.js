import { createElement } from "lwc";
import SfGpsDsAuVicCardPromo from "c/sfGpsDsAuVicCardPromo";
import { parseIso8601 } from "c/sfGpsDsHelpers";

function setElement(element) {
  element.contentType = "event";
  element.topic = "Event";
  element.title = "Promo card";
  element.link = {
    text: "Read more",
    url: "#"
  };
  element.summary =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor " +
    "incididunt  labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation " +
    "ullamco laboris nisi ut aliquip ex ea commodo consequat.";
  element.author = "John Doe";
  element.displayStyle = "profile";
  element.image = {
    src: "https://via.placeholder.com/304x199",
    focalPoint: {
      x: "152",
      y: "100"
    },
    width: 304,
    height: 199
  };
}

describe("c-sf-gps-ds-au-vic-card-promo", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("formats dates correctly", () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-au-vic-card-promo", {
      is: SfGpsDsAuVicCardPromo
    });

    // Act
    element.title = "Promo card";
    element.dateStart = parseIso8601("2020-11-10");
    element.dateEnd = parseIso8601("2020-11-11");
    element.link = { text: "Read more", url: "#" };
    element.showMeta = true;

    document.body.appendChild(element);

    // Assert
    const date = element.querySelector(".rpl-card-promo__date");
    expect(date).not.toBeNull();
    expect(date.textContent).toBe("November 10 – 11, 2020"); // jest has a en-US locale

    element.dateEnd = null;

    return Promise.resolve().then(() => {
      const date2 = element.querySelector(".rpl-card-promo__date");
      expect(date2).not.toBeNull();
      expect(date2.textContent).toBe("November 10, 2020"); // jest has a en-US locale
    });
  });

  it("generates css modifiers based on display style props value", () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-au-vic-card-promo", {
      is: SfGpsDsAuVicCardPromo
    });

    // Act
    setElement(element);
    document.body.appendChild(element);

    // Assert
    const card = element.querySelector(".rpl-card-promo");
    expect(card).not.toBeNull();
    expect(card.classList).toContain("rpl-card-promo--profile");
    expect(card.classList).not.toContain("rpl-card-promo--noimage");

    element.image = null;

    return Promise.resolve().then(() => {
      const card2 = element.querySelector(".rpl-card-promo");
      expect(card2).not.toBeNull();
      expect(card2.classList).toContain("rpl-card-promo--noimage");
    });
  });

  it("uses content type label when it is valid and showMeta is set", () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-au-vic-card-promo", {
      is: SfGpsDsAuVicCardPromo
    });

    // Act
    setElement(element);
    element.contentType = "Profile: Women's Honour Roll";
    element.showMeta = true;

    document.body.appendChild(element);

    // Assert
    const contentType = element.querySelector(".rpl-card-promo__content-type");
    expect(contentType).not.toBeNull();
    expect(contentType.textContent).toBe("Profile");

    element.contentType = "";

    return Promise.resolve().then(() => {
      const contentType2 = element.querySelector(
        ".rpl-card-promo__content-type"
      );
      expect(contentType2).toBeNull();
    });
  });

  it("is accessible", async () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-au-vic-card-promo", {
      is: SfGpsDsAuVicCardPromo
    });

    // Act
    element.contentType = "news";
    element.title = "Promo card";
    element.link = {
      text: "Read more",
      url: "#"
    };

    document.body.appendChild(element);

    // Assert
    await expect(element).toBeAccessible();
  });
});
