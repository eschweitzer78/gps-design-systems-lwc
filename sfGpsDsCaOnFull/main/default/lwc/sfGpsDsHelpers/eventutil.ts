import { hyphenate } from "./string";

const WITH_MODS = Symbol("_withMods");
const WITH_KEYS = Symbol("_withKeys");

const systemModifiers = ["ctrl", "shift", "alt", "meta"];

const modifierGuards: Record<
  string, 
  (...args: any[]) => boolean | void
> = {
  stop: (e: Event) => e.stopPropagation(),
  prevent: (e: Event) => e.preventDefault(),
  self: (e: Event) => e.target !== e.currentTarget,
  ctrl: (e: MouseEvent | KeyboardEvent) => !e.ctrlKey,
  shift: (e: MouseEvent | KeyboardEvent) => !e.shiftKey,
  alt: (e: MouseEvent | KeyboardEvent) => !e.altKey,
  meta: (e: MouseEvent | KeyboardEvent) => !e.metaKey,
  left: (e: Event) => "button" in e && e.button !== 0,
  middle: (e: Event) => "button" in e && e.button !== 1,
  right: (e: Event) => "button" in e && e.button !== 2,
  exact: (e: Event, modifiers: string[]) =>
    // @ts-ignore
    systemModifiers.some((m) => e[`${m}Key`] && !modifiers.includes(m))
};

export function withModifiers(fn: Function, modifiers: string[]): any {
    // @ts-ignore
  const cache = fn[WITH_MODS] || (fn[WITH_MODS] = {});
  const cacheKey = modifiers.join(".");

  return (
    cache[cacheKey] ||
    (cache[cacheKey] = (event: Event, ...args: any[]) => {
      for (let i = 0; i < modifiers.length; i++) {
        const guard = modifierGuards[modifiers[i]];

        if (guard && guard(event, modifiers)) return null;
      }

      return fn(event, ...args);
    })
  );
};

const keyNames: Record<string, string> = {
  esc: "escape",
  space: " ",
  up: "arrow-up",
  left: "arrow-left",
  right: "arrow-right",
  down: "arrow-down",
  delete: "backspace"
};

export function withKeys(
  fn: (event: Event) => any,
   modifiers: string[]
): any {
  // @ts-ignore
  const cache = fn[WITH_KEYS] || (fn[WITH_KEYS] = {});
  const cacheKey = modifiers.join(".");

  return (
    cache[cacheKey] ||
    (cache[cacheKey] = (event: Event) => {
      if (!("key" in event)) {
        return null;
      }

      // @ts-ignore 
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

export function patchEvent(
  el: Element, 
  rawName: string, 
  prevValue: Function | Function[] | null, 
  nextValue: Function | Function[] | unknown
): void {
  // @ts-ignore
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

function parseName(
  name: string
): [string, Record<string, any> | undefined] {
  let options: Record<string, any> | undefined;

  if (optionsModifierRE.test(name)) {
    options = {};
    let m;

    while ((m = name.match(optionsModifierRE))) {
      name = name.slice(0, name.length - m[0].length);
      options[m[0].toLowerCase()] = true;
    }
  }

  const event: string = name[2] === ":" ? name.slice(3) : hyphenate(name.slice(2));
  
  return [event, options];
}

function createInvoker(initialValue: any) {
  const invoker = (e: any) => {
    invoker.value(e);
  };

  invoker.value = initialValue;
  return invoker;
}
