/*
 * Copyright (c) 2023-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  uniqueId, 
  isFunction, 
  isObject 
} from "c/sfGpsDsHelpers";
import type { 
  HandlerFunction, 
  HandlerObject, 
  Handler, 
  HandlerEntries 
} from "c/sfGpsDsOnClickOutside";

const _sfGpsDsOnClickOutside = Symbol("_sfGpsDsOnClickOutside");

function processArguments(value: Handler): HandlerObject {
  const isFn = isFunction(value);

  if (!isFn && !isObject(value)) {
    throw new Error(
      "sfGpsDsOnClickOutside: args must be a function or an object"
    );
  }

  if (isFn) {
    return {
      handler: value as HandlerFunction,
      middleware: (item: Event) => item,
      events: ["touchstart", "click"],
      active: true
    };
  }

  return {
    handler: (value as HandlerObject).handler,
    middleware: (value as HandlerObject).middleware || ((item) => item),
    events: (value as HandlerObject).events || ["touchstart", "click"],
    active: !((value as HandlerObject).active === false)
  };
}

/**
 * The general principle is that we circumvent event rewriting when an event reaches the
 * shadow DOM boundary. This is when the target is obfuscated to the outside observer by Locker
 * or LWS. It assigns the LWC host as a target and we thus loose track of where the
 * event actually originated -- very much by design.
 *
 * While there is no way for the LWC or internal element to know they are contained by the
 * host, the retargeting process does not alter the original event much...
 *
 * By adding a custom attribute to the event in a listener (the tagger) attached directly on the
 * element we want to monitor (and hence within the LWC scope), we then check whether the event
 * received on a second listener attached on the document (outside the LWC scope) has that
 * attribute or not.
 *
 * If it does, the event happened inside, otherwise it happened outside!
 * We use uuids and a set to make sure we can combine over multiple composed LWCs.
 */

export default class SfGpsDsOnClickOutside {
  _sfGpsDsOnClickOutside: HandlerEntries = {};

  /* bind must be called only once in the renderedCallback method
     pass "this" as the first argument, 
     the name of an lwc:ref in your template as the second argument (string)
     your callback as the third argument, function or object
      if it's a function it will be called when a click occurs outside (event in param)
      if it's an object, have the following attributes
        - handler is the function that will be called back
        - middleware (optional) is the function that will transform the event
        - events (optional) is the array of event types that are to be monitored
        - active (optional) indicates whether the handler is active
  */

  bind(pel: any, ref: string, value: Handler): void {
    // @ts-ignore
    const uuid = window.crypto?.randomUUID
      ? crypto.randomUUID()
      : uniqueId("sfGpsDsOnClickOutside");
    const el = pel.refs[ref];
    const { events, handler, middleware, active } = processArguments(value);

    if (active) {
      this._sfGpsDsOnClickOutside[ref] = (events || []).map((event) => {
        const rv = {
          event,
          tagger: (e: Event) => {
            const isClickOutside = e.target !== el && !el.contains(e.target);

            if (!isClickOutside) {
              /* Create a set only if it isn't there yet */
              // @ts-ignore
              if (!e[_sfGpsDsOnClickOutside]) e[_sfGpsDsOnClickOutside] = new Set();
              // @ts-ignore
              e[_sfGpsDsOnClickOutside].add(uuid);
            }
          },
          handler: (e: Event) => {
            /* it is outside if the property does not exist or the uuid is not there */
            // @ts-ignore
            const isClickOutside = !(e[_sfGpsDsOnClickOutside] && e[_sfGpsDsOnClickOutside].has(uuid));

            if (isClickOutside && middleware?.(e)) {
              handler(e);
            }
          },
          forceTag: (e: Event) => {
            /* must be used by component to force the tagging when the target element is prematurely removed from the DOM */
              // @ts-ignore
            if (!e[_sfGpsDsOnClickOutside]) e[_sfGpsDsOnClickOutside] = new Set();
              // @ts-ignore
            e[_sfGpsDsOnClickOutside].add(uuid);
          }
        };

        el.addEventListener(event, rv.tagger, false);
        document.addEventListener(event, rv.handler, false);

        return rv;
      });
    }
  }

  /* unbind must be called only once in the disconnectedCallback method */
  /* or whenever the referenced object disappears from the DOM */
  unbind(pel: any, ref: string): void {
    const el = pel.refs[ref];

    if (this._sfGpsDsOnClickOutside[ref]) {
      this._sfGpsDsOnClickOutside[ref].forEach(({ event, tagger, handler }) => {
        document.removeEventListener(event, handler, false);
        if (el) el.removeEventListener(event, tagger, false);
      });

      delete this._sfGpsDsOnClickOutside[ref];
    }
  }

  /* must be used by component to force the tagging in the event handle when the target element is prematurely removed from the DOM */
  forceTag(ref: string, event: Event): void {
    const refItem = this._sfGpsDsOnClickOutside[ref];

    if (refItem) {
      const rv = refItem.find((eventItem) => eventItem.event === event.type);
      rv?.forceTag(event);
    }
  }
}
