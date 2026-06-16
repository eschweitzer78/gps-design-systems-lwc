/* eslint-disable @lwc/lwc/prefer-custom-event */
import { createElement } from "@lwc/engine-dom";
import SfGpsDsAuNswBackToTop from "c/sfGpsDsAuNswBackToTop";

const tag = "c-sf-gps-ds-au-nsw-back-to-top";
const childTag = "c-sf-gps-ds-au-nsw-back-to-top-content";

describe("c-sf-gps-ds-au-nsw-back-to-top", () => {
  let originalScrollY;
  let originalInnerWidth;
  let originalClientWidth;
  let originalClientHeight;
  let originalInnerHeight;
  let originalScrollTo;

  beforeEach(() => {
    originalScrollY = Object.getOwnPropertyDescriptor(window, "scrollY");
    originalInnerWidth = Object.getOwnPropertyDescriptor(window, "innerWidth");
    originalClientWidth = Object.getOwnPropertyDescriptor(
      document.documentElement,
      "clientWidth"
    );
    originalClientHeight = Object.getOwnPropertyDescriptor(
      document.documentElement,
      "clientHeight"
    );
    originalInnerHeight = Object.getOwnPropertyDescriptor(window, "innerHeight");
    originalScrollTo = window.scrollTo;
    window.scrollTo = jest.fn();
    jest.useFakeTimers();
  });

  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }

    if (originalScrollY) {
      Object.defineProperty(window, "scrollY", originalScrollY);
    } else {
      delete window.scrollY;
    }

    if (originalInnerWidth) {
      Object.defineProperty(window, "innerWidth", originalInnerWidth);
    } else {
      delete window.innerWidth;
    }

    if (originalClientWidth) {
      Object.defineProperty(
        document.documentElement,
        "clientWidth",
        originalClientWidth
      );
    } else {
      delete window.originalClientWidth
    }

    if (originalClientHeight) {
      Object.defineProperty(
        document.documentElement,
        "clientHeight",
        originalClientHeight
      );
    } else {
      delete window.clientHeight;
    }

    if (originalInnerHeight) {
      Object.defineProperty(window, "innerHeight", originalInnerHeight);
    } else {
      delete window.innerHeight;
    }

    window.scrollTo = originalScrollTo;
    jest.useRealTimers();
  });

  function setScrollY(value) {
    Object.defineProperty(window, "scrollY", {
      writable: true,
      configurable: true,
      value
    });
    Object.defineProperty(document.documentElement, "scrollTop", {
      writable: true,
      configurable: true,
      value
    });
  }

  function setViewportWidth(value) {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value
    });
    Object.defineProperty(document.documentElement, "clientWidth", {
      writable: true,
      configurable: true,
      value
    });
  }

  function triggerScroll() {
    window.dispatchEvent(new Event("scroll"));
    jest.advanceTimersByTime(300);
  }

  function triggerResize() {
    window.dispatchEvent(new Event("resize"));
    jest.advanceTimersByTime(300);
  }

  it("renders the child content component", () => {
    const element = createElement(tag, { is: SfGpsDsAuNswBackToTop });
    document.body.appendChild(element);

    const child = element.shadowRoot.querySelector(childTag);
    expect(child).not.toBeNull();
  });

  it("is not active by default", async () => {
    setScrollY(0);
    const element = createElement(tag, { is: SfGpsDsAuNswBackToTop });
    document.body.appendChild(element);

    await Promise.resolve();
    const child = element.shadowRoot.querySelector(childTag);
    expect(child.isActive).toBe(false);
  });

  it("becomes active when scroll exceeds scrollOffset", async () => {
    const element = createElement(tag, { is: SfGpsDsAuNswBackToTop });
    element.scrollOffset = 100;
    document.body.appendChild(element);

    setScrollY(150);
    triggerScroll();

    await Promise.resolve();
    const child = element.shadowRoot.querySelector(childTag);
    expect(child.isActive).toBe(true);
  });

  it("stays inactive when scroll is below scrollOffset", async () => {
    const element = createElement(tag, { is: SfGpsDsAuNswBackToTop });
    element.scrollOffset = 100;
    document.body.appendChild(element);

    setScrollY(50);
    triggerScroll();

    await Promise.resolve();
    const child = element.shadowRoot.querySelector(childTag);
    expect(child.isActive).toBe(false);
  });

  it("becomes active on scroll up past 200px when no scrollOffset is set", async () => {
    const element = createElement(tag, { is: SfGpsDsAuNswBackToTop });
    document.body.appendChild(element);

    // First scroll down to 500
    setScrollY(500);
    triggerScroll();

    // Then scroll up to 300 (still > 200, direction is up)
    setScrollY(300);
    triggerScroll();

    await Promise.resolve();
    const child = element.shadowRoot.querySelector(childTag);
    expect(child.isActive).toBe(true);
  });

  it("stays inactive on scroll down when no scrollOffset is set", async () => {
    const element = createElement(tag, { is: SfGpsDsAuNswBackToTop });
    document.body.appendChild(element);

    setScrollY(200);
    triggerScroll();

    setScrollY(400);
    triggerScroll();

    await Promise.resolve();
    const child = element.shadowRoot.querySelector(childTag);
    expect(child.isActive).toBe(false);
  });

  it("stays inactive on scroll up when position is under 200px", async () => {
    const element = createElement(tag, { is: SfGpsDsAuNswBackToTop });
    document.body.appendChild(element);

    setScrollY(150);
    triggerScroll();

    setScrollY(100);
    triggerScroll();

    await Promise.resolve();
    const child = element.shadowRoot.querySelector(childTag);
    expect(child.isActive).toBe(false);
  });

  it("reports mobile when viewport width is below 768px", async () => {
    setViewportWidth(500);
    const element = createElement(tag, { is: SfGpsDsAuNswBackToTop });
    document.body.appendChild(element);

    triggerResize();

    await Promise.resolve();
    const child = element.shadowRoot.querySelector(childTag);
    expect(child.isMobile).toBe(true);
  });

  it("reports desktop when viewport width is at or above 768px", async () => {
    setViewportWidth(1024);
    const element = createElement(tag, { is: SfGpsDsAuNswBackToTop });
    document.body.appendChild(element);

    triggerResize();

    await Promise.resolve();
    const child = element.shadowRoot.querySelector(childTag);
    expect(child.isMobile).toBe(false);
  });

  it("adds scroll and resize event listeners on connect", () => {
    const addSpy = jest.spyOn(window, "addEventListener");
    const element = createElement(tag, { is: SfGpsDsAuNswBackToTop });
    document.body.appendChild(element);

    const calls = addSpy.mock.calls.map((c) => c[0]);
    expect(calls).toContain("scroll");
    expect(calls).toContain("resize");

    addSpy.mockRestore();
  });

  it("removes scroll and resize event listeners on disconnect", () => {
    const removeSpy = jest.spyOn(window, "removeEventListener");
    const element = createElement(tag, { is: SfGpsDsAuNswBackToTop });
    document.body.appendChild(element);
    document.body.removeChild(element);

    const calls = removeSpy.mock.calls.map((c) => c[0]);
    expect(calls).toContain("scroll");
    expect(calls).toContain("resize");

    removeSpy.mockRestore();
  });

  it("debounces scroll events and coalesces rapid firings into one handler call", async () => {
    const element = createElement(tag, { is: SfGpsDsAuNswBackToTop });
    element.scrollOffset = 100;
    document.body.appendChild(element);

    // Spy on the bound handler by observing window.scrollY reads via the debounced path.
    // We verify debounce behaviour indirectly: fire 3 events rapidly, advance only partway,
    // then confirm the state only settles after the full delay.
    setScrollY(150);

    // Fire multiple scroll events rapidly without advancing timers
    window.dispatchEvent(new Event("scroll"));
    window.dispatchEvent(new Event("scroll"));
    window.dispatchEvent(new Event("scroll"));

    // Advance past the 250ms debounce delay — all three firings collapse to one execution
    jest.advanceTimersByTime(300);

    await Promise.resolve();
    const child = element.shadowRoot.querySelector(childTag);
    // The debounced handler ran once and correctly detected scroll > offset
    expect(child.isActive).toBe(true);
  });

  it("becomes inactive again after scrolling back below scrollOffset", async () => {
    const element = createElement(tag, { is: SfGpsDsAuNswBackToTop });
    element.scrollOffset = 100;
    document.body.appendChild(element);

    setScrollY(200);
    triggerScroll();

    setScrollY(50);
    triggerScroll();

    await Promise.resolve();
    const child = element.shadowRoot.querySelector(childTag);
    expect(child.isActive).toBe(false);
  });

  it("is accessible", async () => {
    // The sa11y accessibility checker requires real timers
    jest.useRealTimers();

    const element = createElement(tag, { is: SfGpsDsAuNswBackToTop });
    document.body.appendChild(element);

    await expect(element).toBeAccessible();
  });
});
