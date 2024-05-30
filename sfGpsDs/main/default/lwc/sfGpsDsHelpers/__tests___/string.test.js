import {
  formatTemplate,
  safeEqualsIgnoreCase,
  truncateText,
  capitalize
} from "c/sfGpsDsHelpers";

describe("c-sf-gps-ds-helpers.string", () => {
  afterEach(() => {});

  it("formats simple template", () => {
    expect(formatTemplate("Hello {0}!", { 0: "world" })).toEqual(
      "Hello world!"
    );
  });

  it("formats template with single char sepPair", () => {
    expect(formatTemplate("Hello %0%!", { 0: "world" }, { sep: "%" })).toEqual(
      "Hello world!"
    );
  });

  it("formats template with single char sepPair and named merge field", () => {
    expect(
      formatTemplate(
        "Hello %min%, hope you are well!",
        { min: "world" },
        { sep: "%" }
      )
    ).toEqual("Hello world, hope you are well!");
  });

  it("formats template with double char sepPair", () => {
    expect(formatTemplate("Hello [0]!", { 0: "world" }, { sep: "[]" })).toEqual(
      "Hello world!"
    );
  });

  it("formats template with multiple fields", () => {
    expect(
      formatTemplate("Hello {name}, {question}?", {
        name: "world",
        question: "howsit"
      })
    ).toEqual("Hello world, howsit?");
  });

  it("does not equal ignore case null string", () => {
    expect(safeEqualsIgnoreCase(null, "A")).toEqual(false);
  });

  it("equals ignore case a and A", () => {
    expect(safeEqualsIgnoreCase("a", "A")).toEqual(true);
  });

  it("does not ignore case string and number", () => {
    expect(safeEqualsIgnoreCase("0", 0)).toEqual(false);
  });

  it("does not truncate smaller string", () => {
    expect(truncateText("1234567890", 10)).toEqual("1234567890");
  });

  it("truncates longer string", () => {
    expect(truncateText("12345678901", 10)).toEqual("1234567890...");
  });

  it("truncates longer string with custom clamp", () => {
    expect(truncateText("12345678901", 10, ";")).toEqual("1234567890;");
  });

  it("capitalises all lowercase string", () => {
    expect(capitalize("random")).toEqual("Random");
  });

  it("capitalises all uppercase string", () => {
    expect(capitalize("RANDOM")).toEqual("RANDOM");
  });

  it("capitalises pre-capitalised string", () => {
    expect(capitalize("Random")).toEqual("Random");
  });

  it("does not capitalise non strings but returns an empty string", () => {
    expect(capitalize(122)).toEqual("");
  });
});
