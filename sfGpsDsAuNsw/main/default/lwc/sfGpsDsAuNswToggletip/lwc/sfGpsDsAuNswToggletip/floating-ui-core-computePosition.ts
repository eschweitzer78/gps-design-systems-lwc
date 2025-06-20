import { 
  computeCoordsFromPlacement 
} from "./floating-ui-core-computeCoordsFromPlacement";

import type { 
  ComputePosition, 
  Middleware, 
  MiddlewareData 
} from "./floating-ui-core-types";

/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to a given reference element.
 *
 * This export does not have any `platform` interface logic. You will need to
 * write one for the platform you are using Floating UI with.
 */
export const computePosition: ComputePosition = async (
  reference, 
  floating, 
  config
) => {
  const {
    placement = "bottom",
    strategy = "absolute",
    middleware = [],
    platform
  } = config;

  const validMiddleware = middleware.filter(Boolean) as Middleware[];
  const rtl = await platform.isRTL?.(floating);

  let rects = await platform.getElementRects({ reference, floating, strategy });
  let { x, y } = computeCoordsFromPlacement(rects, placement, rtl || false);
  let statefulPlacement = placement;
  let middlewareData: MiddlewareData = {};
  let resetCount = 0;

  for (let i = 0; i < validMiddleware.length; i++) {
    const { name, fn } = validMiddleware[i];

    const OPTIONS = {
      x,
      y,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      middlewareData,
      rects,
      platform,
      elements: { reference, floating }
    };

    const {
      x: nextX,
      y: nextY,
      data,
      reset
      // eslint-disable-next-line no-await-in-loop
    } = await fn(OPTIONS);

    x = nextX ?? x;
    y = nextY ?? y;

    middlewareData = {
      ...middlewareData,
      [name]: {
        ...middlewareData[name],
        ...data
      }
    };

    if (reset && resetCount <= 50) {
      resetCount++;

      if (typeof reset === "object") {
        if (reset.placement) {
          statefulPlacement = reset.placement;
        }

        if (reset.rects) {
          rects =
            reset.rects === true
              ? // eslint-disable-next-line no-await-in-loop
                await platform.getElementRects({
                  reference,
                  floating,
                  strategy
                })
              : reset.rects;
        }

        ({ x, y } = computeCoordsFromPlacement(rects, statefulPlacement, rtl || false));
      }

      i = -1;
    }
  }

  return {
    x,
    y,
    placement: statefulPlacement,
    strategy,
    middlewareData
  };
};
