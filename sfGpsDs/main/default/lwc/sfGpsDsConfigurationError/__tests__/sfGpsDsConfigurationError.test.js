import { createElement } from "lwc";
import SfGpsDsConfigurationError from "c/sfGpsDsConfigurationError";

describe("c-sf-gps-ds-configuration-error", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("displays a default friendly message", () => {
    const MESSAGE = "We hit a snag!";

    // Create initial element
    const element = createElement("c-sf-gps-ds-configuration-error", {
      is: SfGpsDsConfigurationError
    });
    document.body.appendChild(element);

    const messageEl = element.shadowRoot.querySelector("strong");
    expect(messageEl.textContent).toBe(MESSAGE);
  });

  it("displays no details when no errors are passed", () => {
    // Create initial element
    const element = createElement("c-sf-gps-ds-configuration-error", {
      is: SfGpsDsConfigurationError
    });
    document.body.appendChild(element);

    const listEl = element.shadowRoot.querySelector("ul");
    expect(listEl).toBeNull();
  });

  it("displays details when errors are passed", () => {
    const CONTENT = {
      index: "x1",
      code: "CO01",
      description: "Error detail would be better"
    };

    // Create initial element
    const element = createElement("c-sf-gps-ds-configuration-error", {
      is: SfGpsDsConfigurationError
    });
    element.errors = [CONTENT];
    document.body.appendChild(element);

    const listEl = element.shadowRoot.querySelector("ul");
    expect(listEl).not.toBeNull();

    const contentEl = element.shadowRoot.querySelector("li");
    expect(contentEl.textContent).toContain(CONTENT.code);
    expect(contentEl.textContent).toContain(CONTENT.description);
  });

  it("is accessible when erros are passed", async () => {
    const CONTENT1 = {
      index: "x1",
      code: "CO01",
      description: "Error detail would be better"
    };
    const CONTENT2 = {
      index: "x2",
      code: "CO02",
      description: "Error2 details would be much better"
    };

    // Create initial element
    const element = createElement("c-sf-gps-ds-configuration-error", {
      is: SfGpsDsConfigurationError
    });
    element.errors = [CONTENT1, CONTENT2];
    document.body.appendChild(element);

    await expect(element).toBeAccessible();
  });
});
