import { normaliseBoolean } from "c/sfGpsDsHelpers";

describe("c-sf-gps-ds-helpers.normalise", () => {
  afterEach(() => {});

  it("normalises boolean false to false", () => {
    expect(normaliseBoolean(false)).toEqual(false);
  });

  it("normalises boolean true to true", () => {
    expect(normaliseBoolean(true)).toEqual(true);
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
