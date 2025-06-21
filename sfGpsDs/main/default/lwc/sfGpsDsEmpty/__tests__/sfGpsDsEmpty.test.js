import { createElement } from "@lwc/engine-dom";
import SfGpsDsEmpty from "c/sfGpsDsEmpty";

describe("c-sf-gps-ds-empty", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("displays a default friendly message", () => {
    const MESSAGE = "There is no data";

    // Create initial element
    const element = createElement("c-sf-gps-ds-empty", {
      is: SfGpsDsEmpty
    });
    document.body.appendChild(element);

    const messageEl = element.shadowRoot.querySelector("h1");
    expect(messageEl.textContent).toBe(MESSAGE);
  });

  it("displays a custom friendly message", () => {
    const MESSAGE = "Data would be better";

    // Create initial element
    const element = createElement("c-sf-gps-ds-empty", {
      is: SfGpsDsEmpty
    });
    element.title = MESSAGE;
    document.body.appendChild(element);

    const messageEl = element.shadowRoot.querySelector("h1");
    expect(messageEl.textContent).toBe(MESSAGE);
  });

  it("displays no details when no content is passed", () => {
    // Create initial element
    const element = createElement("c-sf-gps-ds-empty", {
      is: SfGpsDsEmpty
    });
    document.body.appendChild(element);

    const contentEl = element.shadowRoot.querySelector("p");
    expect(contentEl).toBeNull();
  });

  it("displays details when content is passed", () => {
    const CONTENT = "Data would be better";

    // Create initial element
    const element = createElement("c-sf-gps-ds-empty", {
      is: SfGpsDsEmpty
    });
    element.content = CONTENT;
    document.body.appendChild(element);

    const contentEl = element.shadowRoot.querySelector("p");
    expect(contentEl.textContent).toBe(CONTENT);
  });

  it("is accessible when title is passed", async () => {
    const MESSAGE = "Data would be better";
    const CONTENT = "Accessible panel";

    // Create initial element
    const element = createElement("c-sf-gps-ds-empty", {
      is: SfGpsDsEmpty
    });
    element.title = MESSAGE;
    element.content = CONTENT;
    document.body.appendChild(element);

    await expect(element).toBeAccessible();
  });
});
