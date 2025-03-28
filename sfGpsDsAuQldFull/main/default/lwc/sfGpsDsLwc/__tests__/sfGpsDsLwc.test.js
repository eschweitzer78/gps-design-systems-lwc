import { createElement } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

describe("c-sf-gps-ds-lwc", () => {
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

  it("handles onBeforeMount well", () => {
    const element = createElement("c-sf-gps-ds-lwc", {
      is: SfGpsDsLwc
    });

    const fn = jest
      .fn()
      .mockName("handleBeforeMountCb")
      .mockImplementation(() => {
        expect(element.__serialiseInner()).toBe("");
      });

    element.handleBeforeMount(fn);
    document.body.appendChild(element);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith();
  });

  it("handles onMounted well", () => {
    const element = createElement("c-sf-gps-ds-lwc", {
      is: SfGpsDsLwc
    });

    const fn = jest.fn().mockName("handleMountedCb");

    element.handleMounted(fn);
    document.body.appendChild(element);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(element.__serialiseInner()).toBe("<p>sfGpsDsLwc</p>");
  });

  // @salesforce/lwc issue 1102 (disconnectedCallback not called) prevents testing the following
  /*
  it("handles onBeforeUnmount well", async () => {
    const element = createElement("c-sf-gps-ds-lwc", {
      is: SfGpsDsLwc
    });

    const fn = jest.fn()
        .mockName("beforeUnmountCb")
        .mockImplementation(() => { console.log("beforeUnmount cb")});

    element.handleBeforeUnmount(fn);
    document.body.appendChild(element);
    await nextTick();

    element.remove();
    await nextTick();

    expect(fn).toHaveBeenCalledTimes(1);
  });
  */

  // @salesforce/lwc issue 1102 (disconnectedCallback not called) prevents testing the following
  /*
  it("handles onUnmounted well", async () => {
    const element = createElement("c-sf-gps-ds-lwc", {
        is: SfGpsDsLwc
      });
  
    const fn = jest.fn()
        .mockName("unmountedCb")
        .mockImplementation(() => { console.log('unmounted cb')});

    element.handleUnmounted(fn);
    document.body.appendChild(element);
    await nextTick();

    element.remove();
    await nextTick();

    expect(fn).toHaveBeenCalledTimes(1);
  });
  */
});
