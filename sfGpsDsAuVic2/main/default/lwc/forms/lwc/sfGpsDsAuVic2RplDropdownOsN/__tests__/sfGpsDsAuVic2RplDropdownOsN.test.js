import { createElement } from "lwc";
import Element from "c/sfGpsDsAuVic2RplDropdownOsN";
import userEvent from "@testing-library/user-event";

const tag = "c-sf-gps-ds-au-vic2-rpl-dropdown-os-n";
const options = [
  { label: "Option 1", value: "1" },
  { label: "Option 2", value: "2" },
  { label: "Option 3", value: "3" },
  { label: "Option 4", value: "4" },
  { label: "Option 5", value: "5" },
  { label: "Option 6", value: "6" }
];

window.HTMLElement.prototype.scrollIntoView = () => {};

describe("c-sf-gps-ds-au-vic2-rpl-dropdown-os-n", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("is closed to start with, and opens as required when set up as a lookup", () => {
    const value = "5";
    const element = createElement(tag, {
      is: Element
    });

    element.label = "My label";
    element.name = "mydropdown";
    element.setOptions(options);
    element.value = value;
    document.body.appendChild(element);

    const combobox = element.shadowRoot.querySelector("[role=combobox]");
    const input = element.shadowRoot.querySelector(
      ".rpl-form-dropdown-search__input"
    );
    let dropdown = element.shadowRoot.querySelector("[role=listbox]");

    expect(element.value).toBe(value);
    expect(combobox).not.toBeNull();
    expect(input).toBeNull();
    expect(dropdown).toBeNull();

    combobox.click();

    return Promise.resolve().then(() => {
      dropdown = element.shadowRoot.querySelector("[role=listbox]");
      expect(dropdown).not.toBeNull();
    });
  });

  it("is has no input field when set up as a lookup", () => {
    const element = createElement(tag, {
      is: Element
    });

    element.label = "My label";
    element.name = "mydropdown";
    element.setOptions(options);
    document.body.appendChild(element);

    const combobox = element.shadowRoot.querySelector("[role=combobox]");
    let input = element.shadowRoot.querySelector(
      ".rpl-form-dropdown-search__input"
    );

    expect(combobox).not.toBeNull();
    expect(input).toBeNull();

    combobox.click();

    return Promise.resolve().then(() => {
      input = element.shadowRoot.querySelector(
        ".rpl-form-dropdown-search__input"
      );
      expect(input).toBeNull();
    });
  });

  it("is ditches wrong values when set up as a single lookup, and selects as required", () => {
    const value = "7";
    const selectedOption = options.find((option) => option.value === "5");
    const element = createElement(tag, {
      is: Element
    });

    element.label = "My label";
    element.name = "mydropdown";
    element.setOptions(options);
    element.value = value;
    document.body.appendChild(element);

    const combobox = element.shadowRoot.querySelector("[role=combobox]");
    let dropdown = element.shadowRoot.querySelector("[role=listbox]");

    expect(element.value).toBeNull();

    combobox.click();

    return Promise.resolve().then(() => {
      dropdown = element.shadowRoot.querySelector("[role=listbox]");
      expect(dropdown).not.toBeNull();

      const optionList = Array.from(
        element.shadowRoot.querySelectorAll("[role=option]")
      );
      const option = optionList.find(
        (opt) => opt.textContent.trim() === selectedOption.label
      );

      option.click();

      return Promise.resolve().then(() => {
        expect(element.value).toBe(selectedOption.value);
      });
    });
  });

  it("is ditches wrong values when set up as a multiple lookup, and selects as required", () => {
    const values = ["6", "7"];
    const expectedOption = options.find((option) => option.value === "6");
    const selectedOption = options.find((option) => option.value === "5");
    const element = createElement(tag, {
      is: Element
    });

    element.label = "My label";
    element.name = "mydropdown";
    element.setOptions(options);
    element.value = values;
    element.multiple = true; // done on purpose in that order to check resilience to async attribute setting
    document.body.appendChild(element);

    const combobox = element.shadowRoot.querySelector("[role=combobox]");
    let dropdown = element.shadowRoot.querySelector("[role=listbox]");

    expect(element.value).toStrictEqual(["6"]);

    combobox.click();

    return Promise.resolve().then(() => {
      dropdown = element.shadowRoot.querySelector("[role=listbox]");
      expect(dropdown).not.toBeNull();

      const optionList = Array.from(
        element.shadowRoot.querySelectorAll("[role=option]")
      );
      const actualOption = optionList.find(
        (opt) => opt.textContent.trim() === expectedOption.label
      );
      const targetOption = optionList.find(
        (opt) => opt.textContent.trim() === selectedOption.label
      );

      expect(actualOption.getAttribute("aria-selected")).toBe("true");
      expect(targetOption.getAttribute("aria-selected")).toBe("false");

      targetOption.click();

      return Promise.resolve().then(() => {
        expect(element.value).toIncludeSameMembers([
          expectedOption.value,
          selectedOption.value
        ]);
      });
    });
  });

  it("is deselects as required when setup as a combobox", () => {
    const values = ["5", "6"];
    const expectedOption5 = options.find((option) => option.value === "5");
    const expectedOption6 = options.find((option) => option.value === "6");
    const deselectedOption = expectedOption5;
    const element = createElement(tag, {
      is: Element
    });

    element.label = "My label";
    element.name = "mydropdown";
    element.setOptions(options);
    element.value = values;
    element.multiple = true; // done on purpose in that order to check resilience to async attribute setting
    document.body.appendChild(element);

    const combobox = element.shadowRoot.querySelector("[role=combobox]");
    let dropdown = element.shadowRoot.querySelector("[role=listbox]");

    expect(element.value).toIncludeSameMembers([
      expectedOption5.value,
      expectedOption6.value
    ]);

    combobox.click();

    return Promise.resolve().then(() => {
      dropdown = element.shadowRoot.querySelector("[role=listbox]");
      expect(dropdown).not.toBeNull();

      const optionList = Array.from(
        element.shadowRoot.querySelectorAll("[role=option]")
      );
      const actualOption5 = optionList.find(
        (opt) => opt.textContent.trim() === expectedOption5.label
      );
      const actualOption6 = optionList.find(
        (opt) => opt.textContent.trim() === expectedOption6.label
      );
      const targetOption = optionList.find(
        (opt) => opt.textContent.trim() === deselectedOption.label
      );

      expect(actualOption5.getAttribute("aria-selected")).toBe("true");
      expect(actualOption6.getAttribute("aria-selected")).toBe("true");

      targetOption.click();

      return Promise.resolve().then(() => {
        expect(element.value).toIncludeSameMembers([expectedOption6.value]);
      });
    });
  });

  it("has an input field when clicking and set up as a combobox", () => {
    const targetValue = "5";
    const expectedOption = options.find(
      (option) => option.value === targetValue
    );
    const element = createElement(tag, {
      is: Element
    });

    element.label = "My label";
    element.name = "mydropdown";
    element.mode = "combobox-all";
    element.setOptions(options);
    element.value = targetValue;
    document.body.appendChild(element);

    const combobox = element.shadowRoot.querySelector("[role=combobox]");
    let input = element.shadowRoot.querySelector(
      ".rpl-form-dropdown-search__input"
    );
    const placeholder = element.shadowRoot.querySelector(
      ".rpl-form-dropdown-input__placeholder"
    );
    let valueLabel = element.shadowRoot.querySelector(
      ".rpl-form-dropdown-input__single-value"
    );

    expect(combobox).not.toBeNull();
    expect(input).toBeNull();
    expect(placeholder).toBeNull();
    expect(valueLabel).not.toBeNull();
    expect(valueLabel.textContent.trim()).toBe(expectedOption.label);

    combobox.click();

    return Promise.resolve().then(() => {
      input = element.shadowRoot.querySelector(
        ".rpl-form-dropdown-search__input"
      );
      expect(input).not.toBeNull();
      expect(input.value).toBe(expectedOption.label);
    });
  });

  it("accepts any value when set up as a single combobox", () => {
    const targetValue = "12";
    const element = createElement(tag, {
      is: Element
    });

    element.label = "My label";
    element.name = "mydropdown";
    element.mode = "combobox-all";
    element.setOptions(options);
    element.value = targetValue;
    document.body.appendChild(element);

    const combobox = element.shadowRoot.querySelector("[role=combobox]");
    const input = element.shadowRoot.querySelector(
      ".rpl-form-dropdown-search__input"
    );
    const placeholder = element.shadowRoot.querySelector(
      ".rpl-form-dropdown-input__placeholder"
    );
    const valueLabel = element.shadowRoot.querySelector(
      ".rpl-form-dropdown-input__single-value"
    );

    expect(combobox).not.toBeNull();
    expect(input).toBeNull();
    expect(placeholder).toBeNull();
    expect(valueLabel).not.toBeNull();
    expect(valueLabel.textContent.trim()).toBe(targetValue);
    expect(element.value).toBe(targetValue);

    combobox.click();

    return Promise.resolve().then(() => {
      const dropdown = element.shadowRoot.querySelector("[role=listbox]");
      expect(dropdown).not.toBeNull();

      const optionList = Array.from(
        element.shadowRoot.querySelectorAll("[role=option]")
      );

      const selectedOption = optionList.find(
        (opt) => opt.getAttribute("aria-selected") === "true"
      );

      expect(selectedOption).toBe(undefined);
    });
  });

  it("automatically selects an option when set up as a single combobox-auto", () => {
    const targetValue = "5";
    const expectedOption = options.find(
      (option) => option.value === targetValue
    );
    const element = createElement(tag, {
      is: Element
    });

    element.label = "My label";
    element.name = "mydropdown";
    element.mode = "combobox-auto";
    element.setOptions(options);
    document.body.appendChild(element);

    const combobox = element.shadowRoot.querySelector("[role=combobox]");
    let input = element.shadowRoot.querySelector(
      ".rpl-form-dropdown-search__input"
    );
    const placeholder = element.shadowRoot.querySelector(
      ".rpl-form-dropdown-input__placeholder"
    );
    let valueLabel = element.shadowRoot.querySelector(
      ".rpl-form-dropdown-input__single-value"
    );

    expect(combobox).not.toBeNull();
    expect(input).toBeNull();
    expect(placeholder).not.toBeNull();
    expect(valueLabel).toBeNull();
    expect(element.value).toBeUndefined();

    combobox.click();

    return Promise.resolve().then(async () => {
      input = element.shadowRoot.querySelector(
        ".rpl-form-dropdown-search__input"
      );
      expect(input).not.toBeNull();

      await userEvent.type(input, expectedOption.label);

      return Promise.resolve().then(() => {
        const dropdown = element.shadowRoot.querySelector("[role=listbox]");
        expect(dropdown).not.toBeNull();

        const optionList = Array.from(
          element.shadowRoot.querySelectorAll("[role=option]")
        );

        const selectedOptions = optionList.filter(
          (opt) => opt.getAttribute("aria-selected") === "true"
        );

        expect(selectedOptions.length).toBe(1);
        expect(selectedOptions[0].textContent.trim()).toBe(
          expectedOption.label
        );

        // The dropdown stays open after autoselect
        valueLabel = element.shadowRoot.querySelector(
          ".rpl-form-dropdown-input__single-value"
        );
        expect(valueLabel).toBeNull();
      });
    });
  });

  it("is accessible", async () => {
    const element = createElement(tag, {
      is: Element
    });

    element.label = "My label";
    element.name = "mydropdown";
    element.setOptions(options);
    document.body.appendChild(element);

    const combobox = element.shadowRoot.querySelector("[role=combobox]");

    expect(combobox).not.toBeNull();
    combobox.click();

    return Promise.resolve().then(async () => {
      await expect(element).toBeAccessible();
    });
  });
});
