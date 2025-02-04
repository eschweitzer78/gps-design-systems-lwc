import { createElement } from "lwc";
import SfGpsDsAuVicButton from "c/sfGpsDsAuVicButton";

describe("c-sf-gps-ds-au-vic-button", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("does not render any custom class without a theme", () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-au-vic-button", {
      is: SfGpsDsAuVicButton
    });

    // Act
    document.body.appendChild(element);

    const button = element.querySelector("button");

    const classL = button.classList;
    expect(classL).not.toContain("rpl-button--primary");
    expect(classL).not.toContain("rpl-button--secondary");
    expect(classL).not.toContain("rpl-button--disabled");
  });

  it("renders the correct class for the primary theme", () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-au-vic-button", {
      is: SfGpsDsAuVicButton
    });

    element.theme = "primary";

    // Act
    document.body.appendChild(element);

    const button = element.querySelector("button");

    const classL = button.classList;
    expect(classL).toContain("rpl-button--primary");
    expect(classL).not.toContain("rpl-button--secondary");
  });

  it("renders the correct class for the secondary theme", async () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-au-vic-button", {
      is: SfGpsDsAuVicButton
    });

    element.theme = "secondary";

    // Act
    document.body.appendChild(element);

    const button = element.querySelector("button");

    const classL = button.classList;
    expect(classL).not.toContain("rpl-button--primary");
    expect(classL).toContain("rpl-button--secondary");
  });

  it("renders the button disabled when disabled flag is set", () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-au-vic-button", {
      is: SfGpsDsAuVicButton
    });

    element.disabled = true;

    // Act
    document.body.appendChild(element);

    const button = element.querySelector("button");

    const classL = button.classList;
    expect(classL).toContain("rpl-button--disabled");
    expect(classL).not.toContain("rpl-button--primary");
    expect(classL).not.toContain("rpl-button--secondary");
  });
});
