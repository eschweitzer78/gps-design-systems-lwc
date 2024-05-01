import { createElement } from "lwc";
import SfGpsDsAuVic2TabBar from "c/sfGpsDsAuVic2TabBar";

const ELT_TAG = "c-sf-gps-ds-au-vic2-tab-bar";

describe("c-sf-gps-ds-au-vic2-tab-bar", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("has no button element by default", () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuVic2TabBar
    });

    // Act
    document.body.appendChild(element);

    // Assert
    const li = element.querySelector("c-sf-gps-ds-au-vic2-button");
    expect(li).toBeNull();
  });

  it("has button elements when provided with tab headers", () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuVic2TabBar
    });

    element.tabHeaders = [
      { label: "Tab A", domId: "tab-a", value: "a" },
      { label: "Tab B", domId: "tab-b", value: "b" }
    ];

    // Act
    document.body.appendChild(element);

    // Assert
    const lis = element.querySelectorAll("c-sf-gps-ds-au-vic2-button");
    expect(lis.length).toBe(2);
    expect(lis[0].dataset.label).toBe("Tab A");
    expect(lis[0].dataset.tabValue).toBe("a");
    expect(lis[0].classList.length).toBe(0);
  });

  it("can be operated using the keyboard", () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuVic2TabBar
    });

    element.tabHeaders = [
      { label: "Tab A", domId: "tab-a", value: "a" },
      { label: "Tab B", domId: "tab-b", value: "b" }
    ];

    // Act
    document.body.appendChild(element);

    const tabsList = element.querySelector("[role='tablist'");
    expect(tabsList).not.toBeNull();

    // send arrow right
    tabsList.dispatchEvent(new KeyboardEvent("keydown", { keyCode: 39 }));

    // Assert

    return Promise.resolve().then(() => {
      const liAs = element.querySelectorAll("c-sf-gps-ds-au-vic2-button");
      expect(liAs.length).toBe(2);
      expect(liAs[0].ariaSelected).toBe("false");
      expect(liAs[1].ariaSelected).toBe("true");
    });
  });
});
