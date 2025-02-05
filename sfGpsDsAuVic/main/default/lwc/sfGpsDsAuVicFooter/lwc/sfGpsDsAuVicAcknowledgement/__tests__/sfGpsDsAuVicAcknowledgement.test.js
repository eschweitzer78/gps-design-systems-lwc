import { createElement } from "lwc";
import SfGpsDsAuVicAcknowledgement from "c/sfGpsDsAuVicAcknowledgement";

describe("c-sf-gps-ds-au-vic-acknowledgement", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("has no div if no text is provided", () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-au-vic-acknowledgement", {
      is: SfGpsDsAuVicAcknowledgement
    });

    // Act
    document.body.appendChild(element);

    // Assert
    const div = element.querySelector("div");
    expect(div).toBeNull();
  });

  it("has the right CSS classes set if configured as standard", () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-au-vic-acknowledgement", {
      is: SfGpsDsAuVicAcknowledgement
    });

    element.text = "text";

    // Act
    document.body.appendChild(element);

    // Assert
    const div = element.querySelector("div");
    expect(div).not.toBeNull();
    expect(div.classList).toContain("rpl-acknowledgement");
    expect(div.classList).not.toContain("rpl-acknowledgement--standalone");
    expect(div.classList).not.toContain("rpl-site-constrain--on-all");
  });

  it("has the right CSS classes set if configured as standalone and is accessible", async () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-au-vic-acknowledgement", {
      is: SfGpsDsAuVicAcknowledgement
    });

    element.text = "text";
    element.theme = "standalone";

    // Act
    document.body.appendChild(element);

    // Assert
    const div = element.querySelector("div");
    expect(div).not.toBeNull();
    expect(div.classList).toContain("rpl-acknowledgement--standalone");
    expect(div.classList).toContain("rpl-site-constrain--on-all");

    await expect(element).toBeAccessible();
  });
});
