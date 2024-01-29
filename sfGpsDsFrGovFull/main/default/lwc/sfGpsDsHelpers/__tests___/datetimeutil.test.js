import { parseIso8601 } from "c/sfGpsDsHelpers";

describe("c-sf-gps-ds-helpers.datetimeutil", () => {
  afterEach(() => {});

  it("parses a hypen delimited date as UTC", () => {
    expect(parseIso8601("2022-10-09").getTime()).toEqual(
      new Date(Date.UTC(2022, 9, 9)).getTime()
    );
  });

  it("does not parse a non-delimited date", () => {
    expect(parseIso8601("20221009")).toEqual(null);
  });

  it("parses a hypen delimited date and time with ms", () => {
    expect(parseIso8601("2022-10-09T10:01:01.001").getTime()).toEqual(
      Date.UTC(2022, 9, 9, 10, 1, 1, 1)
    );
  });

  it("parses a hypen delimited date and time without ms", () => {
    expect(parseIso8601("2022-10-09T10:01:01").getTime()).toEqual(
      Date.UTC(2022, 9, 9, 10, 1, 1, 0)
    );
  });

  it("parses a hypen delimited date and time without secs", () => {
    expect(parseIso8601("2022-10-09T10:01").getTime()).toEqual(
      Date.UTC(2022, 9, 9, 10, 1, 0, 0)
    );
  });

  it("does not parse a hypen delimited date and time with mins", () => {
    expect(parseIso8601("2022-10-09T10")).toEqual(null);
  });

  it("parses a hypen delimited date and time with hour/min and Z as UTC", () => {
    expect(parseIso8601("2022-10-09T10:01Z").getTime()).toEqual(
      Date.UTC(2022, 9, 9, 10, 1, 0, 0)
    );
  });

  it("parses a hypen delimited date and time hour/min and -0100 as UTC -1hr", () => {
    expect(parseIso8601("2022-10-09T10:01-0100").getTime()).toEqual(
      Date.UTC(2022, 9, 9, 11, 1, 0, 0)
    );
  });

  it("parses a hypen delimited date and time hour/min and +01:00 as UTC +1hr", () => {
    expect(parseIso8601("2022-10-09T10:01+0100").getTime()).toEqual(
      Date.UTC(2022, 9, 9, 9, 1, 0, 0)
    );
  });
});
