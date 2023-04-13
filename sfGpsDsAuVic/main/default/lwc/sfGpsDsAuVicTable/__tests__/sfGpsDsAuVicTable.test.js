import { createElement } from "lwc";
import SfGpsDsAuVicTable from "c/sfGpsDsAuVicTable";

const ELT_TAG = "c-sf-gps-ds-au-vic-table";

describe("c-sf-gps-ds-au-vic-table", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("is not visible by default", () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuVicTable
    });

    // Act
    document.body.appendChild(element);

    // Assert
    const table = element.querySelector("table");
    expect(table).toBeNull();
  });

  it("is visible when there is a header", () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuVicTable
    });

    element.headers = [{ content: "header1" }, { content: "header2" }];
    // Act
    document.body.appendChild(element);

    // Assert
    const table = element.querySelector("table");
    expect(table).not.toBeNull();
    const thead = element.querySelector("thead");
    expect(thead).not.toBeNull();
    const tbody = element.querySelector("tbody");
    expect(tbody).toBeNull();
  });

  it("is visible when there are rows", () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuVicTable
    });

    element.rows = [
      [{ content: "cell c1,r1" }, { content: "cell c2,r1" }],
      [{ content: "cell c1,r2" }, { content: "cell c2,r2" }]
    ];

    // Act
    document.body.appendChild(element);

    // Assert
    const table = element.querySelector("table");
    expect(table).not.toBeNull();
    const thead = element.querySelector("thead");
    expect(thead).toBeNull();
    const tbody = element.querySelector("tbody");
    expect(tbody).not.toBeNull();
    const trs = element.querySelectorAll("tr");
    expect(trs.length).toBe(2);
  });
});
