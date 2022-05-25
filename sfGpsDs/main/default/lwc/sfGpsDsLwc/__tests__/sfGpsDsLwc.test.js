import { createElement } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

describe("c-sf-gps-ds-ip-lwc", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("has no error to start with", () => {
    const element = createElement("c-sf-gps-ds-lwc", {
      is: SfGpsDsLwc
    });
    document.body.appendChild(element);

    expect(element.getErrors()).toBe(undefined);
  });
});
