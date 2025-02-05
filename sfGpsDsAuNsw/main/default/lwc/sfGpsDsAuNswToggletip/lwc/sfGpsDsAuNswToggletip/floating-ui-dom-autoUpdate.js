import { floor, max, min } from "./floating-ui-utils";
import {
  getDocumentElement,
  getOverflowAncestors
} from "./floating-ui-utils-dom";

import { getBoundingClientRect } from "./floating-ui-dom-utils-getBoundingClientRect";
import { unwrapElement } from "./floating-ui-dom-utils-unwrapElement";

// https://samthor.au/2021/observing-dom/
function observeMove(element, onMove) {
  let io = null;
  let timeoutId;

  const root = getDocumentElement(element);

  function cleanup() {
    clearTimeout(timeoutId);
    io?.disconnect();
    io = null;
  }

  function refresh(skip = false, threshold = 1) {
    cleanup();

    const { left, top, width, height } = element.getBoundingClientRect();

    if (!skip) {
      onMove();
    }

    if (!width || !height) {
      return;
    }

    const insetTop = floor(top);
    const insetRight = floor(root.clientWidth - (left + width));
    const insetBottom = floor(root.clientHeight - (top + height));
    const insetLeft = floor(left);
    const rootMargin = `${-insetTop}px ${-insetRight}px ${-insetBottom}px ${-insetLeft}px`;

    const options = {
      rootMargin,
      threshold: max(0, min(1, threshold)) || 1
    };

    let isFirstUpdate = true;

    // eslint-disable-next-line consistent-return
    function handleObserve(entries) {
      const ratio = entries[0].intersectionRatio;

      if (ratio !== threshold) {
        if (!isFirstUpdate) {
          return refresh();
        }

        if (!ratio) {
          // If the reference is clipped, the ratio is 0. Throttle the refresh
          // to prevent an infinite loop of updates.
          // eslint-disable-next-line @lwc/lwc/no-async-operation
          timeoutId = setTimeout(() => {
            refresh(false, 1e-7);
          }, 1000);
        } else {
          refresh(false, ratio);
        }
      }

      isFirstUpdate = false;
    }

    // Older browsers don"t support a `document` as the root and will throw an
    // error.
    try {
      io = new IntersectionObserver(handleObserve, {
        ...options,
        // Handle <iframe>s
        root: root.ownerDocument
      });
    } catch (e) {
      io = new IntersectionObserver(handleObserve, options);
    }

    io.observe(element);
  }

  refresh(true);

  return cleanup;
}

/**
 * Automatically updates the position of the floating element when necessary.
 * Should only be called when the floating element is mounted on the DOM or
 * visible on the screen.
 * @returns cleanup function that should be invoked when the floating element is
 * removed from the DOM or hidden from the screen.
 * @see https://floating-ui.com/docs/autoUpdate
 */
export function autoUpdate(reference, floating, update, options = {}) {
  const {
    ancestorScroll = true,
    ancestorResize = true,
    elementResize = typeof ResizeObserver === "function",
    layoutShift = typeof IntersectionObserver === "function",
    animationFrame = false
  } = options;

  const referenceEl = unwrapElement(reference);

  const ancestors =
    ancestorScroll || ancestorResize
      ? [
          ...(referenceEl ? getOverflowAncestors(referenceEl) : []),
          ...getOverflowAncestors(floating)
        ]
      : [];

  ancestors.forEach((ancestor) => {
    // eslint-disable-next-line no-unused-expressions
    ancestorScroll &&
      ancestor.addEventListener("scroll", update, { passive: true });
    // eslint-disable-next-line no-unused-expressions
    ancestorResize && ancestor.addEventListener("resize", update);
  });

  const cleanupIo =
    referenceEl && layoutShift ? observeMove(referenceEl, update) : null;

  let reobserveFrame = -1;
  let resizeObserver = null;

  if (elementResize) {
    resizeObserver = new ResizeObserver(([firstEntry]) => {
      if (firstEntry && firstEntry.target === referenceEl && resizeObserver) {
        // Prevent update loops when using the `size` middleware.
        // https://github.com/floating-ui/floating-ui/issues/1740
        resizeObserver.unobserve(floating);
        cancelAnimationFrame(reobserveFrame);
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        reobserveFrame = requestAnimationFrame(() => {
          resizeObserver?.observe(floating);
        });
      }
      update();
    });

    if (referenceEl && !animationFrame) {
      resizeObserver.observe(referenceEl);
    }
    resizeObserver.observe(floating);
  }

  let frameId;
  let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;

  if (animationFrame) {
    frameLoop();
  }

  function frameLoop() {
    const nextRefRect = getBoundingClientRect(reference);

    if (
      prevRefRect &&
      (nextRefRect.x !== prevRefRect.x ||
        nextRefRect.y !== prevRefRect.y ||
        nextRefRect.width !== prevRefRect.width ||
        nextRefRect.height !== prevRefRect.height)
    ) {
      update();
    }

    prevRefRect = nextRefRect;
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    frameId = requestAnimationFrame(frameLoop);
  }

  update();

  return () => {
    ancestors.forEach((ancestor) => {
      // eslint-disable-next-line no-unused-expressions
      ancestorScroll && ancestor.removeEventListener("scroll", update);
      // eslint-disable-next-line no-unused-expressions
      ancestorResize && ancestor.removeEventListener("resize", update);
    });

    cleanupIo?.();
    resizeObserver?.disconnect();
    resizeObserver = null;

    if (animationFrame) {
      cancelAnimationFrame(frameId);
    }
  };
}
