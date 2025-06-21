import { createElement } from "@lwc/engine-dom";
import SfGpsDsAuNswTabBarLwr from "c/sfGpsDsAuNswTabBarLwr";

const ELT_TAG = "c-sf-gps-ds-au-nsw-tab-bar-lwr";

describe("c-sf-gps-ds-au-nsw-tab-bar-lwr", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("has no li element by default", () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuNswTabBarLwr
    });

    // Act
    document.body.appendChild(element);

    // Assert
    const li = element.querySelector("li");
    expect(li).toBeNull();
  });

  it("has li elements when provided with tab headers", () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuNswTabBarLwr
    });

    element.tabHeaders = [
      { label: "Tab A", domId: "tab-a", value: "a" },
      { label: "Tab B", domId: "tab-b", value: "b" }
    ];

    // Act
    document.body.appendChild(element);

    // Assert
    const lis = element.querySelectorAll("li");
    expect(lis.length).toBe(2);
    expect(lis[0].title).toBe("Tab A");
    expect(lis[0].dataset.label).toBe("Tab A");
    expect(lis[0].dataset.tabValue).toBe("a");
    expect(lis[0].classList.length).toBe(0);
    expect(lis[1].title).toBe("Tab B");

    const liAs = element.querySelectorAll("li a");
    expect(liAs.length).toBe(2);
    expect(liAs[0].ariaSelected).toBe("true");
    expect(liAs[0].classList).toContain("active");
    expect(liAs[1].ariaSelected).toBe("false");
    expect(liAs[1].classList).not.toContain("active");
  });

  it("can be operated using the keyboard", async () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuNswTabBarLwr
    });

    element.tabHeaders = [
      { label: "Tab A", domId: "tab-a", value: "a" },
      { label: "Tab B", domId: "tab-b", value: "b" }
    ];

    // Act
    document.body.appendChild(element);

    const tabsList = element.querySelector(".nsw-tabs__list");
    expect(tabsList).not.toBeNull();

    // send arrow right
    tabsList.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));

    // Assert

    await Promise.resolve();

    const liAs = element.querySelectorAll("li a");
    expect(liAs.length).toBe(2);
    expect(liAs[0].ariaSelected).toBe("false");
    expect(liAs[0].classList).not.toContain("active");
    expect(liAs[1].ariaSelected).toBe("true");
    expect(liAs[1].classList).toContain("active");
  });
});
