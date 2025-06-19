import { createElement } from "@lwc/engine-dom";
import SfGpsDsLwc from "c/sfGpsDsLwc";

const CLASS_NAME = "c-sf-gps-ds-lwc";

describe("c-sf-gps-ds-lwc", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("has no error to start with", () => {
    const element = createElement(CLASS_NAME, {
      is: SfGpsDsLwc
    });
    document.body.appendChild(element);

    expect(element.getErrors()).toBe(undefined);
  });


});
