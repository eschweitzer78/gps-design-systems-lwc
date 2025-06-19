import { createElement } from "@lwc/engine-dom";
import SfGpsDsElement from "c/sfGpsDsElement";

const CLASS_NAME = "c-sf-gps-ds-element";

describe("c-sf-gps-ds-element", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("handles onBeforeMount well", () => {
    const element = createElement(CLASS_NAME, {
      is: SfGpsDsElement
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
    const element = createElement(CLASS_NAME, {
      is: SfGpsDsElement
    });

    const fn = jest.fn().mockName("handleMountedCb");

    element.handleMounted(fn);
    document.body.appendChild(element);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(element.__serialiseInner()).toBe("<p>SfGpsDsElement</p>");
  });

  // @salesforce/lwc issue 1102 (disconnectedCallback not called) prevents testing the following
  /*
  it("handles onBeforeUnmount well", async () => {
    const element = createElement(CLASS_NAME, {
      is: SfGpsDsElement
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
    const element = createElement(CLASS_NAME, {
        is: SfGpsDsElement
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
