import { deepCopy, arraysEqual } from "c/sfGpsDsHelpers";

describe("c-sf-gps-ds-helpers.jsutil", () => {
  afterEach(() => {});

  it("performs deep copies", () => {
    let arr = ["A", "B"];
    let date = new Date();
    let set = new Set();
    set.add(1);
    set.add(5);
    let obj = {
      arr: arr,
      set: set,
      date: date
    };

    let cobj = deepCopy(obj);

    cobj.arr.push("C");
    cobj.date.setFullYear(1973);
    cobj.set.add(3);

    expect(obj.arr).not.toContain("C");
    expect(obj.date.getFullYear()).toBeGreaterThan(cobj.date.getFullYear());
    expect(obj.set.size).toBe(2);
  });

  it("compares similar arrays well", () => {
    let arr1 = ["A", "B", "D"];
    let arr2 = ["A", "B", "D"];

    expect(arraysEqual(arr1, arr2)).toBe(true);
  });

  it("catches differences in arrays", () => {
    let arr1 = ["A", "B", "C"];
    let arr2 = ["A", "B", "D"];

    expect(arraysEqual(arr1, arr2)).toBe(false);
  });
});
