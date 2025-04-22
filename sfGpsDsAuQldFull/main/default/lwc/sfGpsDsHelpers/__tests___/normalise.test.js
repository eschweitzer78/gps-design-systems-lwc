import {
  normaliseBoolean,
  normaliseInteger,
  normaliseString
} from "c/sfGpsDsHelpers";

describe("c-sf-gps-ds-helpers.normaliseBoolean", () => {
  afterEach(() => {});

  it("normalises boolean false to false", () => {
    expect(normaliseBoolean(false)).toEqual(false);
  });

  it("normalises boolean true to true", () => {
    expect(normaliseBoolean(true)).toEqual(true);
  });

  it("normalises null to fallback value", () => {
    expect(normaliseBoolean(null, { fallbackValue: true })).toEqual(true);
  });

  it("normalises empty string to false", () => {
    expect(normaliseBoolean("")).toEqual(false);
  });

  it("normalises string false to true", () => {
    expect(normaliseBoolean("false")).toEqual(true);
  });

  it("normalises string false to false with accept string", () => {
    expect(normaliseBoolean("false", { acceptString: true })).toEqual(false);
  });

  it("normalises string true to true with accept string", () => {
    expect(normaliseBoolean("true", { acceptString: true })).toEqual(true);
  });

  it("normalises empty string to default fallback value with accept string", () => {
    expect(normaliseBoolean("", { acceptString: true })).toEqual(false);
  });

  it("normalises empty string to fallback value with accept string", () => {
    expect(
      normaliseBoolean("", { acceptString: true, fallbackValue: true })
    ).toEqual(true);
  });

  it("normalises random string to fallback value with accept string", () => {
    expect(
      normaliseBoolean("random", { acceptString: true, fallbackValue: false })
    ).toEqual(false);
  });

  it("normalises non-empty array to true", () => {
    expect(normaliseBoolean(["hello"])).toEqual(true);
  });

  it("normalises empty array to true", () => {
    expect(normaliseBoolean([])).toEqual(true);
  });

  it("normalises null to false", () => {
    expect(normaliseBoolean(null)).toEqual(false);
  });
});

describe("c-sf-gps-ds-helpers.normaliseInteger", () => {
  afterEach(() => {});

  it("normalises an integer without changing it", () => {
    expect(normaliseInteger(4)).toEqual(4);
  });

  it("normalises an integer checking min", () => {
    expect(normaliseInteger(4, { min: 5 })).toEqual(5);
  });

  it("normalises an integer checking max", () => {
    expect(normaliseInteger(4, { max: 3 })).toEqual(3);
  });

  it("normalises a float by truncating", () => {
    expect(normaliseInteger(4.22)).toEqual(4);
    expect(normaliseInteger(4.82)).toEqual(4);
    expect(normaliseInteger(-4.22)).toEqual(-4);
    expect(normaliseInteger(-4.82)).toEqual(-4);
  });

  it("normalises a string as the fallback", () => {
    expect(normaliseInteger("4")).toEqual(4);
    expect(normaliseInteger("4", { acceptString: false })).toEqual(0);
    expect(
      normaliseInteger("4", { acceptString: false, fallbackValue: 1 })
    ).toEqual(1);
  });

  it("normalises a string by converting it when acceptString is set", () => {
    expect(normaliseInteger("4", { acceptString: true })).toEqual(4);
    expect(normaliseInteger("-8", { acceptString: true })).toEqual(-8);
    expect(normaliseInteger("4.22", { acceptString: true })).toEqual(4);
    expect(normaliseInteger("-4.22", { acceptString: true })).toEqual(-4);
    expect(normaliseInteger("4.78", { acceptString: true })).toEqual(4);
    expect(normaliseInteger("-4.78", { acceptString: true })).toEqual(-4);
  });

  it("normalises a non-string as the fallback", () => {
    expect(normaliseInteger(null)).toEqual(0);
    expect(normaliseInteger(undefined)).toEqual(0);
    expect(normaliseInteger(NaN)).toEqual(0);
    expect(normaliseInteger(["yo"])).toEqual(0);
    expect(normaliseInteger({ hey: "yo" }, { fallbackValue: 3 })).toEqual(3);
  });
});

describe("c-sf-gps-ds-helpers.normaliseString", () => {
  afterEach(() => {});

  it("normalises a to a when in array", () => {
    expect(normaliseString("a", { validValues: ["a", "b"] })).toEqual("a");
  });

  it("normalises A to empty string when a in array", () => {
    expect(
      normaliseString("A", { validValues: ["a", "b"], toLowerCase: false })
    ).toEqual("");
  });

  it("normalises a to empty string when not in array", () => {
    expect(normaliseString("a", { validValues: ["c", "b"] })).toEqual("");
  });

  it("normalises a to fallback string when not in array", () => {
    expect(
      normaliseString("a", { validValues: ["c", "b"], fallbackValue: "d" })
    ).toEqual("d");
  });

  it("normalises a to a when in object", () => {
    expect(normaliseString("a", { validValues: { a: "vA", b: "vB" } })).toEqual(
      "a"
    );
  });

  it("normalises a to vA when in object and returnObjectValue set", () => {
    expect(
      normaliseString("a", {
        validValues: { a: "vA", b: "vB" },
        returnObjectValue: true
      })
    ).toEqual("vA");
  });

  it("normalises a to c when not in object, fallback set to c and returnObjectValue not set", () => {
    expect(
      normaliseString("a", {
        validValues: { c: "vC", b: "vB" },
        fallbackValue: "c"
      })
    ).toEqual("c");
  });

  it("normalises a to vC when not in object, fallback set to c and returnObjectValue set", () => {
    expect(
      normaliseString("a", {
        validValues: { c: "vC", b: "vB" },
        fallbackValue: "c",
        returnObjectValue: true
      })
    ).toEqual("vC");
  });

  it("normalises a to undefined when not in object, fallback set to d, d not object and returnObjectValue set", () => {
    expect(
      normaliseString("a", {
        validValues: { c: "vC", b: "vB" },
        fallbackValue: "d",
        returnObjectValue: true
      })
    ).toBeUndefined();
  });
});
