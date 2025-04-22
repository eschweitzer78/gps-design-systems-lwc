import { createElement } from "lwc";
import SfGpsDsAuVic2Breadcrumbs from "c/sfGpsDsAuVic2Breadcrumbs";

const TAG_NAME = "c-sf-gps-ds-au-vic2-breadcrumbs";
const items = [
  { text: "Home", url: "/" },
  { text: "About the VIC Government", url: "#" },
  { text: "The state government", url: "#" },
  { text: "Victoria is the state", url: "#" },
  { text: "VIC government data", url: "#" }
];
const props = {
  items
};

describe("c-sf-gps-ds-au-vic2-breadcrumbs", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("displays all breadcrumbs on a wide screen", () => {
    // Arrange
    const element = createElement(TAG_NAME, {
      is: SfGpsDsAuVic2Breadcrumbs
    });

    // Act
    Object.assign(element, props);
    document.body.appendChild(element);

    // Assert
    const crumbs = element.shadowRoot.querySelectorAll(
      ".rpl-breadcrumbs__item:not(.rpl-breadcrumbs__item--collapsed)"
    );
    expect(crumbs).toHaveLength(5);
  });

  it("allows to toggle collapsed breadcrumbs", () => {
    // Arrange
    const element = createElement(TAG_NAME, {
      is: SfGpsDsAuVic2Breadcrumbs
    });

    // Act
    Object.assign(element, { ...props, collapse: true });
    document.body.appendChild(element);

    // Assert
    let crumbs = element.shadowRoot.querySelectorAll(
      ".rpl-breadcrumbs__item:not(.rpl-breadcrumbs__item--collapsed)"
    );
    expect(crumbs).toHaveLength(2);

    const collapseButton = element.shadowRoot.querySelector(
      ".rpl-breadcrumbs__collapse-link-trigger"
    );
    expect(collapseButton).not.toBeNull();

    collapseButton.click();

    return Promise.resolve().then(() => {
      crumbs = element.shadowRoot.querySelectorAll(
        ".rpl-breadcrumbs__item:not(.rpl-breadcrumbs__item--collapsed)"
      );
      expect(crumbs).toHaveLength(4);
    });
  });

  it("will not collapse with a number of items lower than displayBeforeCollapse", () => {
    // Arrange
    const element = createElement(TAG_NAME, {
      is: SfGpsDsAuVic2Breadcrumbs
    });

    // Act
    Object.assign(element, {
      ...props,
      collapse: true,
      displayBeforeCollapse: 4
    });
    document.body.appendChild(element);

    // Assert
    let crumbs = element.shadowRoot.querySelectorAll(
      ".rpl-breadcrumbs__item:not(.rpl-breadcrumbs__item--collapsed)"
    );
    expect(crumbs).toHaveLength(4);

    const collapseButton = element.shadowRoot.querySelector(
      ".rpl-breadcrumbs__collapse-link-trigger"
    );
    expect(collapseButton).toBeNull();
  });

  it("will collapse with a number of items greater or equal to displayBeforeCollapse", () => {
    // Arrange
    const element = createElement(TAG_NAME, {
      is: SfGpsDsAuVic2Breadcrumbs
    });

    // Act
    Object.assign(element, {
      items: [...items, { text: "Another item", url: "#" }],
      collapse: true,
      displayBeforeCollapse: 4
    });
    document.body.appendChild(element);

    // Assert
    let crumbs = element.shadowRoot.querySelectorAll(
      ".rpl-breadcrumbs__item:not(.rpl-breadcrumbs__item--collapsed)"
    );
    expect(crumbs).toHaveLength(2);

    const collapseButton = element.shadowRoot.querySelector(
      ".rpl-breadcrumbs__collapse-link-trigger"
    );
    expect(collapseButton).not.toBeNull();

    collapseButton.click();

    return Promise.resolve().then(() => {
      crumbs = element.shadowRoot.querySelectorAll(
        ".rpl-breadcrumbs__item:not(.rpl-breadcrumbs__item--collapsed)"
      );
      expect(crumbs).toHaveLength(5);
    });
  });
});
