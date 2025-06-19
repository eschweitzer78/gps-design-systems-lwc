import { createElement } from "@lwc/engine-dom";
import TargetClass from "c/sfGpsDsAuVic2SearchBar";
import { mockSuggestions } from "./fixtures/suggestions";
import userEvent from "@testing-library/user-event";

const TAG_NAME = "c-sf-gps-ds-au-vic2-search-bar";

const baseProps = {
  suggestions: mockSuggestions
};

describe("c-sf-gps-ds-au-vic2-search-bar", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("opens as expected", () => {
    // Arrange
    const element = createElement(TAG_NAME, {
      is: TargetClass
    });

    // Act
    Object.assign(element, baseProps);
    document.body.appendChild(element);

    // Assert
    let menu = element.shadowRoot.querySelector(".rpl-search-bar__menu");
    expect(menu).toBeNull();

    const input = element.shadowRoot.querySelector(
      ".rpl-search-bar [role=combobox]"
    );
    expect(input).not.toBeNull();

    input.focus();

    return Promise.resolve().then(() => {
      menu = element.shadowRoot.querySelector(".rpl-search-bar__menu");
      expect(menu).not.toBeNull();
    });
  });

  it("updates internal values and the clear button", async () => {
    // Arrange
    const element = createElement(TAG_NAME, {
      is: TargetClass
    });

    // Act
    Object.assign(element, baseProps);
    document.body.appendChild(element);

    // Assert
    let clear = element.shadowRoot.querySelector(".rpl-search-bar__clear");
    expect(clear).toBeNull();

    const input = element.shadowRoot.querySelector(
      ".rpl-search-bar [role=combobox]"
    );
    expect(input).not.toBeNull();

    await userEvent.type(input, "rip");

    return Promise.resolve().then(() => {
      clear = element.shadowRoot.querySelector(".rpl-search-bar__clear");
      expect(clear).not.toBeNull();
    });
  });

  it("submits when hitting enter", async () => {
    // Arrange
    const element = createElement(TAG_NAME, {
      is: TargetClass
    });

    // Act
    Object.assign(element, baseProps);
    document.body.appendChild(element);

    // Assert
    let clear = element.shadowRoot.querySelector(".rpl-search-bar__clear");
    expect(clear).toBeNull();

    const input = element.shadowRoot.querySelector(
      ".rpl-search-bar [role=combobox]"
    );
    expect(input).not.toBeNull();

    let argCaptor;
    const handler = jest.fn((event) => {
      argCaptor = event.detail;
    });
    element.addEventListener("submit", handler);

    await userEvent.type(input, "ripple{enter}");

    return Promise.resolve().then(() => {
      expect(handler).toHaveBeenCalledTimes(1);
      expect(argCaptor).toMatchObject({
        value: "ripple"
      });
    });
  });

  it("submits when submit button is clicked", async () => {
    // Arrange
    const element = createElement(TAG_NAME, {
      is: TargetClass
    });

    // Act
    Object.assign(element, baseProps);
    document.body.appendChild(element);

    // Assert
    let clear = element.shadowRoot.querySelector(".rpl-search-bar__clear");
    expect(clear).toBeNull();

    const input = element.shadowRoot.querySelector(
      ".rpl-search-bar [role=combobox]"
    );
    expect(input).not.toBeNull();

    let argCaptor;
    const handler = jest.fn((event) => {
      argCaptor = event.detail;
    });
    element.addEventListener("submit", handler);

    await userEvent.type(input, "ripp");

    expect(input.value).toBe("ripp");

    const submit = element.shadowRoot.querySelector(".rpl-search-bar-submit");
    expect(submit).not.toBeNull();
    submit.click();

    return Promise.resolve().then(() => {
      expect(handler).toHaveBeenCalledTimes(1);
      expect(argCaptor).toMatchObject({
        value: "ripp"
      });
    });
  });

  it("does not submit if suggestion selection is required and there are no suggestions", async () => {
    // Arrange
    const element = createElement(TAG_NAME, {
      is: TargetClass
    });

    // Act
    Object.assign(element, {
      ...baseProps,
      submitOnSuggestionOnly: true,
      suggestions: []
    });
    document.body.appendChild(element);

    // Assert
    let clear = element.shadowRoot.querySelector(".rpl-search-bar__clear");
    expect(clear).toBeNull();

    const input = element.shadowRoot.querySelector(
      ".rpl-search-bar [role=combobox]"
    );
    expect(input).not.toBeNull();

    const handler = jest.fn();
    element.addEventListener("submit", handler);

    await userEvent.type(input, "ripx{enter}");

    return Promise.resolve().then(() => {
      expect(handler).not.toHaveBeenCalled();
    });
  });

  it("auto submits with first suggestion when a suggestion selection is required", async () => {
    // Arrange
    const element = createElement(TAG_NAME, {
      is: TargetClass
    });

    // Act
    Object.assign(element, {
      ...baseProps,
      submitOnSuggestionOnly: true,
      suggestions: ["ripple", "riptide"]
    });
    document.body.appendChild(element);

    // Assert
    let clear = element.shadowRoot.querySelector(".rpl-search-bar__clear");
    expect(clear).toBeNull();

    let input = element.shadowRoot.querySelector(
      ".rpl-search-bar [role=combobox]"
    );
    expect(input).not.toBeNull();

    let argCaptor;
    const handler = jest.fn((event) => {
      argCaptor = event.detail;
    });
    element.addEventListener("submit", handler);

    await userEvent.type(input, "ripp{enter}");

    return Promise.resolve().then(() => {
      expect(handler).toHaveBeenCalledTimes(1);
      expect(argCaptor).toMatchObject({
        value: "ripple"
      });

      input = element.shadowRoot.querySelector(
        ".rpl-search-bar [role=combobox]"
      );
      expect(input).not.toBeNull();
      expect(input.value).toBe("ripple");
    });
  });
});
