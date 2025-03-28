import { hyphenate } from "./string_v6";

const WITH_MODS = Symbol("_withMods");
const WITH_KEYS = Symbol("_withKeys");

const systemModifiers = ["ctrl", "shift", "alt", "meta"];

const modifierGuards = {
  stop: (e) => e.stopPropagation(),
  prevent: (e) => e.preventDefault(),
  self: (e) => e.target !== e.currentTarget,
  ctrl: (e) => !e.ctrlKey,
  shift: (e) => !e.shiftKey,
  alt: (e) => !e.altKey,
  meta: (e) => !e.metaKey,
  left: (e) => "button" in e && e.button !== 0,
  middle: (e) => "button" in e && e.button !== 1,
  right: (e) => "button" in e && e.button !== 2,
  exact: (e, modifiers) =>
    systemModifiers.some((m) => e[`${m}Key`] && !modifiers.includes(m))
};

export const withModifiers = (fn, modifiers) => {
  const cache = fn[WITH_MODS] || (fn[WITH_MODS] = {});
  const cacheKey = modifiers.join(".");

  return (
    cache[cacheKey] ||
    (cache[cacheKey] = (event, ...args) => {
      for (let i = 0; i < modifiers.length; i++) {
        const guard = modifierGuards[modifiers[i]];

        if (guard && guard(event, modifiers)) return null;
      }

      return fn(event, ...args);
    })
  );
};

const keyNames = {
  esc: "escape",
  space: " ",
  up: "arrow-up",
  left: "arrow-left",
  right: "arrow-right",
  down: "arrow-down",
  delete: "backspace"
};

export const withKeys = (fn, modifiers) => {
  const cache = fn[WITH_KEYS] || (fn[WITH_KEYS] = {});
  const cacheKey = modifiers.join(".");

  return (
    cache[cacheKey] ||
    (cache[cacheKey] = (event) => {
      if (!("key" in event)) {
        return null;
      }

      const eventKey = hyphenate(event.key);

      if (modifiers.some((k) => k === eventKey || keyNames[k] === eventKey)) {
        return fn(event);
      }

      return null;
    })
  );
};

// ei = event invokers
const EI_KEY = Symbol("_sfGpsDsEi");

export function patchEvent(el, rawName, prevValue, nextValue) {
  const invokers = el[EI_KEY] || (el[EI_KEY] = {});
  const existingInvoker = invokers[rawName];

  if (nextValue && existingInvoker) {
    // patch
    existingInvoker.value = nextValue;
  } else {
    const [name, options] = parseName(rawName);

    if (nextValue) {
      // add
      const invoker = (invokers[rawName] = createInvoker(nextValue));
      el.addEventListener(name, invoker, options);
    } else if (existingInvoker) {
      // remove
      el.removeEventListener(name, existingInvoker, options);
      invokers[rawName] = undefined;
    }
  }
}

const optionsModifierRE = /(?:Once|Passive|Capture)$/;

function parseName(name) {
  let options;

  if (optionsModifierRE.test(name)) {
    options = {};
    let m;

    while ((m = name.match(optionsModifierRE))) {
      name = name.slice(0, name.length - m[0].length);
      options[m[0].toLowerCase()] = true;
    }
  }

  const event = name[2] === ":" ? name.slice(3) : hyphenate(name.slice(2));
  return [event, options];
}

function createInvoker(initialValue) {
  const invoker = (e) => {
    invoker.value(e);
  };

  invoker.value = initialValue;
  return invoker;
}
