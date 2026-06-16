# sfGpsDs — Core Shared Library

`sfGpsDs` is the foundational Salesforce unlocked package in the `gps-design-systems-lwc` monorepo. It provides the shared base classes, utilities, and infrastructure components that all design-system-specific packages depend on. It is design-system-agnostic: it knows nothing about NSW, VIC, GOV.UK, etc. — those live in their own sibling packages.

## Package identity

| Field                  | Value                                                                                           |
| ---------------------- | ----------------------------------------------------------------------------------------------- |
| Salesforce API version | 65.0                                                                                            |
| License                | CC0-1.0 (BSD 3-Clause for code)                                                                 |
| Runtime targets        | Experience Cloud LWR, Aura communities, Omnistudio Managed Package, Omnistudio Standard Runtime |

---

## Folder layout

```
sfGpsDs/
└── main/default/
    ├── aura/                          Aura components
    ├── classes/                       Apex classes (~45 files)
    ├── contentassets/                 CMS content assets
    ├── labels/                        Custom labels
    ├── lwc/                           Lightning Web Components (~45 folders)
    │   ├── auth/                      Authentication utilities
    │   ├── code-mirror/               Code editor integration
    │   ├── custom-property-editors/   Builder custom property editors
    │   ├── mixins-and-directives/     Shared LWC mixins
    │   ├── omnistudio-*/              Omnistudio runtime adapters
    │   ├── sfGpsDs*/                  Core components (see below)
    │   └── typings/                   TypeScript type definitions
    ├── messageChannels/               LWC message channels
    ├── omniIntegrationProcedure/      Omnistudio integration procedure definitions
    └── staticresources/               Static assets (fonts, icons, etc.)
```

---

## LWC component groups

### Base classes

These are the building blocks every other component in the monorepo inherits from.

| Component                             | Purpose                                                                                                                                                                                                                             |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sfGpsDsElement`                      | Extends `LightningElement` with a structured lifecycle hook system (`BEFORE_MOUNT`, `MOUNTED`, `UPDATED`, etc.), property normalization (Boolean, Integer, Enum, String), dirty-flag rendering optimisation, and property watchers. |
| `sfGpsDsLwc`                          | Extends `sfGpsDsElement` with Aura/Experience Cloud detection, an error management subsystem (track, add, clear, retrieve), and markdown content property helpers.                                                                  |
| `sfGpsDsElementOs`                    | Omnistudio Managed Package Runtime variant of `sfGpsDsElement`, build-time generated.                                                                                                                                               |
| `sfGpsDsHelpers` / `sfGpsDsHelpersOs` | Pure utility library: DOM helpers, date/time, CSS class utilities, event helpers, URL utilities, and type guards. No UI.                                                                                                            |

#### sfGpsDsHelpers — function reference

`sfGpsDsHelpers` is a pure JavaScript/TypeScript utility module (no LWC template, no UI). It is organised into discrete source files that are re-exported from a single barrel (`sfGpsDsHelpers.ts`). The sections below map to those source files.

---

##### CSS utilities (`cssutil.ts`)

| Function        | Signature                     | Description                                                                                                                                                                                                  |
| --------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `styleToString` | `(styleObj: object) → string` | Converts a plain JS style object with camelCase keys (e.g. `{ backgroundColor: 'red' }`) into an inline CSS string (e.g. `background-color: red`). Throws `TypeError` if the argument is not a plain object. |

---

##### Date / time utilities (`datetimeutil.ts`)

| Function          | Signature                                                | Description                                                                                                                                                                                          |
| ----------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isDate`          | `(value) → boolean`                                      | Returns `true` if the value is a `Date` instance (works across iframe boundaries).                                                                                                                   |
| `isValidDate`     | `(value) → boolean`                                      | Returns `true` if the value is a `Date` and its time value is not `NaN`.                                                                                                                             |
| `parseIso8601`    | `(date: string) → Date \| null`                          | Parses an ISO 8601 string (including timezone offsets) into a `Date`. Uses a spec-compliant regex parser rather than `Date.parse` to avoid cross-browser inconsistencies. Returns `null` on failure. |
| `formatDate`      | `(date, dateStyle?, userLocale?) → string`               | Formats a `Date` using `toLocaleDateString`. Supports `'full'`, `'long'`, `'medium'` (default), and `'short'` styles. Falls back to a hardcoded en-AU format if the runtime does not support `Intl`. |
| `formatDateRange` | `(dateStart, dateEnd, dateStyle?, userLocale?) → string` | Formats a start/end date pair as a localised range string using `Intl.DateTimeFormat.formatRange`. Degrades gracefully when one date is null.                                                        |
| `getMonthNames`   | `(userLocale?, format?) → string[]`                      | Returns an array of 12 localised month names for the given locale and format (`'long'` / `'short'` / `'narrow'`).                                                                                    |
| `getUserLocale`   | `(useFallbackLocale?, fallbackLocale?) → string \| null` | Returns the first locale from the browser's `navigator.languages` list, falling back to `'en-AU'`.                                                                                                   |
| `getUserLocales`  | `(useFallbackLocale?, fallbackLocale?) → string[]`       | Returns the full browser locale list (deduplicated and normalised to `xx-XX` casing), optionally appending a fallback locale.                                                                        |

---

##### DOM utilities (`domutil.ts`)

| Function / Class          | Signature                                                  | Description                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `replaceInnerHtml`        | `(element, markup) → void`                                 | Sets an element's `innerHTML`, suppressing and logging errors instead of throwing. Used where LWC's `@lwc/lwc/no-inner-html` lint rule is explicitly bypassed.                                                                                                                                                                                                                                                                      |
| `htmlDecode`              | `(markup: string) → string \| null`                        | Decodes HTML-escaped text (e.g. Salesforce CMS Rich Text fields that store `&lt;p&gt;`) back into plain markup using a `DOMParser`.                                                                                                                                                                                                                                                                                                 |
| `getFirstChild`           | `(markup: string) → Element \| null`                       | Parses an HTML string and returns its first element child. Useful for extracting the outermost tag from a rendered markdown or CMS fragment.                                                                                                                                                                                                                                                                                        |
| `computeClass`            | `(config: object \| string[], joinChar?) → string \| null` | Builds a CSS class string. When passed a plain object, includes only keys whose value is truthy (conditional-class pattern). When passed an array, joins all entries. Returns `null` for other inputs.                                                                                                                                                                                                                              |
| `uniqueClassesFromString` | `(classNames: string) → string`                            | Deduplicates a space-separated class string, preserving order of first occurrence.                                                                                                                                                                                                                                                                                                                                                  |
| `isRTL`                   | `() → boolean`                                             | Returns `true` if `document.dir === 'rtl'`.                                                                                                                                                                                                                                                                                                                                                                                         |
| `getCssPropertyValue`     | `(propertyName: string) → string \| null`                  | Reads a CSS custom property value from `document.body` via `getComputedStyle`.                                                                                                                                                                                                                                                                                                                                                      |
| `HtmlSanitizer`           | class instance                                             | A configurable HTML sanitiser (based on jitbit/HtmlSanitizer v2.0.2, MIT licence, modified). Keeps a whitelist of safe tags, attributes, CSS properties, and URL schemes. Strips `javascript:` hrefs, DOM-clobbering attempts, and empty inline elements. Supports optional plug-ins (selector + process callback) for additional per-element transformation. Call `HtmlSanitizer.sanitize(html, plugIns?)` to get clean HTML back. |

---

##### General JS utilities (`jsutil.ts`)

| Function         | Signature                      | Description                                                                                                                                 |
| ---------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `deepCopy`       | `(obj) → any`                  | Recursively clones an object, array, `Set`, `Date`, `Error`, or function. Primitives are returned as-is.                                    |
| `arraysEqual`    | `(array1, array2) → boolean`   | Shallow-compares two arrays element by element (recursive for nested arrays). Returns `false` if either argument is null.                   |
| `debounce`       | `(func, delay, options?) → fn` | Returns a debounced version of `func`. Supports an optional `leading` flag to invoke on the leading edge of the wait period as well.        |
| `once`           | `(func) → fn`                  | Returns a wrapper that calls `func` at most once; subsequent invocations are no-ops.                                                        |
| `invokeArrayFns` | `(fns, ...args) → void`        | Calls each function in an array with the provided arguments. Used for lifecycle hook arrays.                                                |
| `hasChanged`     | `(value, oldValue) → boolean`  | Returns `true` if `value` and `oldValue` are not the same reference/value (`Object.is` semantics). Used to guard reactive property setters. |

---

##### Next-tick scheduling (`nextTick.ts`)

| Function   | Signature               | Description                                                                                                                                                                                      |
| ---------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `nextTick` | `(fn?) → Promise<void>` | Schedules `fn` to run after the current microtask queue drains (via `Promise.resolve().then(fn)`). Equivalent to Vue's `nextTick` — used to defer DOM-dependent work until after LWC re-renders. |

---

##### Property normalisation (`normalise.ts`)

These functions are used in component property setters to coerce raw prop values (which arrive as strings from HTML attributes or as any type from parent components) into the expected primitive type.

| Function                 | Signature                     | Description                                                                                                                                                                                                                                                          |
| ------------------------ | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `normaliseBoolean`       | `(value, options?) → boolean` | Coerces a value to `boolean`. When `acceptString` is enabled, understands `"true"` / `"false"` string literals. A configurable `fallbackValue` is returned for `null`/`undefined`.                                                                                   |
| `normaliseArray`         | `(value, options?) → any[]`   | Returns the value unchanged if already an array. When `arraySingleton` is enabled, wraps a non-array value in a single-element array; otherwise returns `[]`.                                                                                                        |
| `normaliseAriaAttribute` | `(value) → string \| null`    | Normalises a value (or array of values) into a single space-separated ARIA attribute string, trimming excess whitespace. Returns `null` for empty results.                                                                                                           |
| `normaliseString`        | `(value, options?) → string`  | Coerces a value to a lower-cased, trimmed string. Supports `validValues` (array or map) to restrict to an allowed set, with a `fallbackValue` for unrecognised input. When given a map and `returnObjectValue` is set, returns the mapped value rather than the key. |
| `normaliseInteger`       | `(value, options?) → number`  | Coerces a value to a bounded integer. Accepts numeric strings when `acceptString` is enabled. Clamps the result to optional `min`/`max` bounds.                                                                                                                      |

---

##### String utilities (`string.ts`)

| Function               | Signature                                        | Description                                                                                                                                                              |
| ---------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `formatTemplate`       | `(template, values?, options?) → string \| null` | Replaces `{key}` placeholders in a template string with values from a plain object. Separator delimiters are configurable. Unmatched placeholders are left as-is.        |
| `safeEqualsIgnoreCase` | `(a, b) → boolean`                               | Case-insensitive string comparison that returns `false` (rather than throwing) when either argument is `null`/`undefined`.                                               |
| `truncateText`         | `(text, stop?, clamp?) → string`                 | Truncates a string to `stop` characters (default 150), appending `clamp` (default `"..."`) when the text was shortened.                                                  |
| `camelize`             | `(str) → string`                                 | Converts a hyphenated string to camelCase (e.g. `my-prop` → `myProp`). Result is memoised.                                                                               |
| `hyphenate`            | `(str) → string`                                 | Converts a camelCase string to hyphenated lowercase (e.g. `myProp` → `my-prop`). Result is memoised. Used for CSS property name conversion and event name normalisation. |
| `capitalize`           | `(str) → string`                                 | Uppercases the first character of a string. Result is memoised.                                                                                                          |
| `toHandlerKey`         | `(str) → string`                                 | Prepends `"on"` and capitalises, turning an event name into a handler key (e.g. `click` → `onClick`).                                                                    |

---

##### URL utilities (`urlutil.ts`)

| Function                  | Signature                 | Description                                                                                                                                                          |
| ------------------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isRelativeUrl`           | `(url) → boolean`         | Returns `true` if the URL has no scheme/host prefix (and is not a `tel:`, `mailto:`, or `sms:` link).                                                                |
| `isExternalUrl`           | `(url) → boolean`         | Returns `true` if the URL resolves to a different host than `document.URL`. Uses a temporary `<a>` element for parsing.                                              |
| `isAnchorLink`            | `(url) → boolean`         | Returns `true` if the URL is a fragment-only link (starts with `#`).                                                                                                 |
| `getAnchorLinkName`       | `(str) → string`          | Converts an arbitrary string (e.g. a heading) into a URL-safe anchor slug: lowercased, HTML entities stripped, special characters removed, spaces replaced with `-`. |
| `decodeSpecialCharacters` | `(html) → string \| null` | Replaces common HTML entities (`&amp;`, `&lt;`, `&gt;`, `&quot;`, `&apos;`, `&nbsp;`, `&#039;`) with their literal characters.                                       |

---

##### Type guards and primitives (`typeutil.ts`)

Lightweight, zero-dependency type predicates and constants used throughout the codebase.

| Export                                                            | Description                                                                                                                             |
| ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `EMPTY_OBJ` / `EMPTY_ARR` / `NOOP`                                | Shared frozen sentinel values for empty object, empty array, and no-op function — avoids allocating new literals on every render cycle. |
| `hasOwn`                                                          | `Object.prototype.hasOwnProperty` bound as a standalone function.                                                                       |
| `isPlainObject`                                                   | Returns `true` for plain `{}` objects (not class instances, arrays, etc.).                                                              |
| `isArray`                                                         | Alias for `Array.isArray`.                                                                                                              |
| `isMap` / `isSet` / `isRegEx`                                     | `[object Map]` / `[object Set]` / `[object RegExp]` tag checks.                                                                         |
| `isFunction` / `isString` / `isSymbol` / `isObject` / `isPromise` | Standard `typeof` or duck-type guards. `isObject` excludes `null`; `isPromise` checks `.then` and `.catch`.                             |
| `extend`                                                          | Alias for `Object.assign`.                                                                                                              |
| `def`                                                             | Defines a non-enumerable property on an object via `Object.defineProperty` (optionally writable).                                       |
| `toNumber`                                                        | Casts a value to `number` via `parseFloat`; passes through numeric values unchanged.                                                    |
| `toArray`                                                         | Wraps a non-array value in an array; passes through arrays unchanged.                                                                   |
| `toRawType`                                                       | Extracts the raw type tag from `Object.prototype.toString` (e.g. `"Array"`, `"Date"`).                                                  |

---

##### Event utilities (`eventutil.ts`)

These replicate Vue 3's event-modifier pattern for use in LWC contexts where the template compiler cannot apply modifiers natively.

| Function        | Signature                                    | Description                                                                                                                                                                                                                                                          |
| --------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `withModifiers` | `(fn, modifiers[]) → fn`                     | Wraps an event handler with one or more guards from `stop`, `prevent`, `self`, `ctrl`, `shift`, `alt`, `meta`, `left`, `middle`, `right`, `exact`. Returns a memoised wrapper that bails early when a guard fails.                                                   |
| `withKeys`      | `(fn, modifiers[]) → fn`                     | Wraps a keyboard event handler so it only fires when the event's key matches one of the specified key names (with aliases: `esc`, `space`, `up`, `left`, `right`, `down`, `delete`). Returns a memoised wrapper.                                                     |
| `patchEvent`    | `(el, rawName, prevValue, nextValue) → void` | Adds, patches, or removes a DOM event listener on an element using a stable invoker pattern (swapping `.value` rather than re-calling `addEventListener`). Parses `Once`, `Passive`, and `Capture` suffixes from the raw event name into `addEventListener` options. |

---

##### Miscellaneous utilities (`utilities.ts`)

| Function        | Signature            | Description                                                                                                                                |
| --------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `uniqueId`      | `(prefix?) → string` | Generates a random unique ID string with an optional prefix (default `"sfGpsDs"`). Used for ARIA label associations and DOM ID generation. |
| `isIPadPro`     | `() → boolean`       | Heuristic to detect an iPad Pro (reports as Mac in user agent but has touch points).                                                       |
| `isMacPlatform` | `() → boolean`       | Returns `true` when `navigator.userAgent` contains `"Mac"`.                                                                                |

---

### Markdown engine

Markdown is used pervasively across the design system components for rich-text labels and content.

| Component                                             | Purpose                                                                                                                                                                                  |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sfGpsDsMarkdown` / `sfGpsDsMarkdownOs`               | CommonMark-based parser and HTML renderer. Supports link extraction, H1 header/metadata extraction, HTML entity decoding, and multiple render modes (escaped, unpacked first paragraph). |
| `sfGpsDsMarkdownElement` / `sfGpsDsMarkdownElementOs` | Renders parsed markdown to the DOM safely (sanitised output).                                                                                                                            |
| `sfGpsDsMarkupComm`                                   | Markup component for direct use in Experience Cloud.                                                                                                                                     |

### UI / UX primitives

Stateless or lightly-stateful presentational components providing common patterns.

| Component                                                   | Purpose                                                                                        |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `sfGpsDsSpinner` / `sfGpsDsSpinnerOs`                       | CSS-animated loading spinner. Configurable animation duration, size, square count, and colour. |
| `sfGpsDsEmpty` / `sfGpsDsEmptyOs`                           | Empty-state slot display.                                                                      |
| `sfGpsDsConfigurationError` / `sfGpsDsConfigurationErrorOs` | Renders component configuration errors in a visible, non-crashing way.                         |
| `sfGpsDsFocusTrap` / `sfGpsDsFocusTrapOs`                   | Traps keyboard focus within a region for accessible modals and overlays.                       |
| `sfGpsDsTabs`                                               | Tabbed interface component.                                                                    |
| `sfGpsDsTransition` / `sfGpsDsTransitionOs`                 | CSS transition/animation orchestration.                                                        |
| `sfGpsDsCookieConsent`                                      | Cookie consent banner and state management.                                                    |
| `sfGpsDsSocialSharing`                                      | Social media share links.                                                                      |

### Layout

| Component        | Purpose                                         |
| ---------------- | ----------------------------------------------- |
| `sfGpsDsDivLwr`  | Generic container/division block for LWR pages. |
| `sfGpsDsFlexLwr` | Flex-layout container for LWR pages.            |

### Navigation

| Component                  | Purpose                                                                                                                                                                                                                        |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `sfGpsDsNavigation`        | Navigation menu component. Supports two modes: Integration Procedure (data from an Apex/IP controller) and Experience Cloud Navigation (via `NavigationMixin`). Handles recursive menu structures and markdown label decoding. |
| `sfGpsDsNavigationService` | Service/provider component that exposes navigation context to child components via message channels.                                                                                                                           |

### Omnistudio integration

| Component / Folder                 | Purpose                                                                              |
| ---------------------------------- | ------------------------------------------------------------------------------------ |
| `sfGpsDsIpLwc` / `sfGpsDsIpLwcOsN` | Wrapper that drives an Omnistudio Integration Procedure from a standard LWC context. |
| `sfGpsDsLwcOsN`                    | Omnistudio Standard Runtime variant of the main LWC wrapper.                         |
| `omnistudio-managed-package/`      | Adapters for the Omnistudio Managed Package runtime.                                 |
| `omnistudio-standard-runtime/`     | Adapters for the Omnistudio Standard Runtime.                                        |
| `omnistudio-standard-rt-stub/`     | Stub implementations used during Jest testing.                                       |

### Developer tooling (LWC subfolders)

| Folder                     | Purpose                                                                     |
| -------------------------- | --------------------------------------------------------------------------- |
| `auth/`                    | OAuth / session authentication utilities used in development flows.         |
| `code-mirror/`             | CodeMirror editor integration for Experience Builder property editors.      |
| `custom-property-editors/` | Salesforce Experience Builder custom property editor components.            |
| `mixins-and-directives/`   | Shared LWC mixins (e.g. navigation, wire adapters) and template directives. |
| `typings/`                 | Shared TypeScript type definitions shared across the entire monorepo.       |

---

## Apex classes

~45 Apex classes live in `sfGpsDs/main/default/classes/`. The main concerns are:

| Class area                         | Description                                                                    |
| ---------------------------------- | ------------------------------------------------------------------------------ |
| `SfGpsDsIntegrationProcController` | Invokes Omnistudio Integration Procedures from LWC wire adapters.              |
| Communities utilities / controller | Helpers for Experience Cloud navigation, page data, and user context.          |
| ORA (OmniStudio Remote Action)     | Base pattern for Apex classes that return anonymous/public JSON data for LWCs. |
| Managed content collection         | Retrieves CMS content items for rendering.                                     |
| Encoding utilities                 | Data transformation helpers (e.g. Base64, URL encoding).                       |

---

## Multi-runtime architecture

Every UI component that needs to work in more than one Salesforce runtime ships in paired variants:

| Suffix       | Runtime                                                       |
| ------------ | ------------------------------------------------------------- |
| _(none)_     | OmniStudio Standard Runtime                                   |
| `Os` / `OsN` | Omnistudio Managed Runtime, either generated or purpose-built |

The `sfGpsDs` package is itself a dependency of all design-system-specific packages. It contains no design system CSS or assets — those are injected by the consuming package.

---

## Key design decisions

- **Lifecycle hooks over decorators** — `sfGpsDsElement` wraps `LightningElement` with a named hook system so subclasses can call `super` safely without relying on overriding decorated connector callbacks.
- **Markdown-first content** — Rich-text labels throughout the design systems are authored in CommonMark markdown and rendered to sanitised HTML at the component level, avoiding the need for a CMS for simple formatted text.
- **Error surfacing** — `sfGpsDsLwc` accumulates configuration errors and renders them via `sfGpsDsConfigurationError` rather than throwing, preventing a broken component from crashing the whole page.
- **OmniStudio abstraction** — The `omnistudio-*/` adapter folders isolate runtime-specific imports so the same component code compiles against both Managed Package and Standard Runtime without `#if` preprocessor guards.
- **TypeScript throughout** — All components are authored in TypeScript with shared type definitions in `typings/`.
