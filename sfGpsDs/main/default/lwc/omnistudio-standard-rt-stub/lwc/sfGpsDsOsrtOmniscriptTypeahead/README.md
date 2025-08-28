## ns/omniscriptTypeahead ⇐ OmniscriptAtomicElement

A typeahead allows a user to select an option from a list, but that list can be affected by what
the user types into the input of the Combobox. This can be useful when the list of options is very large,
as user input can start to display options that only match the text they have entered.

**Extends**: OmniscriptAtomicElement

- [ns/omniscriptTypeahead](#markdown-header-nsomniscripttypeahead-omniscriptatomicelement) ⇐ OmniscriptAtomicElement
  - [.options](#markdown-header-omniscripttypeaheadoptions-array) : Array
  - [.\_isEditMode](#markdown-header-omniscripttypeahead_iseditmode-boolean) : Boolean
  - [.\_disableFilter](#markdown-header-omniscripttypeahead_disablefilter-boolean) : Boolean
  - [.\_useRemoteSource](#markdown-header-omniscripttypeahead_useremotesource-boolean) : Boolean
  - [.\_actionDef](#markdown-header-omniscripttypeahead_actiondef-object) : object
  - [.errorMessage](#markdown-header-omniscripttypeaheaderrormessage-string) : string
  - [.typeaheadFn](#markdown-header-omniscripttypeaheadtypeaheadfn-function) : function
  - [.\_editLabel](#markdown-header-omniscripttypeahead_editlabel-string) : string
  - [.\_showLookupOptions](#markdown-header-omniscripttypeahead_showlookupoptions-boolean) : Boolean
  - [.\_lookupFocused](#markdown-header-omniscripttypeahead_lookupfocused-boolean) : Boolean
  - [.handleBlur(evt)](#markdown-header-omniscripttypeaheadhandleblurevt-void) ⇒ void
  - [.handleClear()](#markdown-header-omniscripttypeaheadhandleclear-void) ⇒ void
  - [.handleTypeahead(evt)](#markdown-header-omniscripttypeaheadhandletypeaheadevt-void) ⇒ void
  - [.handleLookupButtonClick()](#markdown-header-omniscripttypeaheadhandlelookupbuttonclick-void) ⇒ void
  - [.handleLookupButtonKeyDown(event)](#markdown-header-omniscripttypeaheadhandlelookupbuttonkeydownevent-void) ⇒ void
  - [.handleLookup()](#markdown-header-omniscripttypeaheadhandlelookup-void) ⇒ void
  - [.getOptionsDataJson()](#markdown-header-omniscripttypeaheadgetoptionsdatajson-promiseany) ⇒ Promise.<any>
  - [.getOptions(action)](#markdown-header-omniscripttypeaheadgetoptionsaction-promiseany) ⇒ Promise.<any>
  - [.hitEndPoint(action)](#markdown-header-omniscripttypeaheadhitendpointaction-promiseany) ⇒ Promise.<any>
  - [.sendDataToDebugConsole(params, resp, label)](#markdown-header-omniscripttypeaheadsenddatatodebugconsoleparams-resp-label-void) ⇒ void
  - [.handleResponse(data)](#markdown-header-omniscripttypeaheadhandleresponsedata-promiseany) ⇒ Promise.<any>
  - [.dataProcessorHook(data)](#markdown-header-omniscripttypeaheaddataprocessorhookdata-promiseany) ⇒ Promise.<any>
  - [.setOptions(data)](#markdown-header-omniscripttypeaheadsetoptionsdata-void) ⇒ void
  - [.handleError([reason])](#markdown-header-omniscripttypeaheadhandleerrorreason-void) ⇒ void
  - [.handleSelect(evt)](#markdown-header-omniscripttypeaheadhandleselectevt-void) ⇒ void
  - [.toggleEditMode([isEditMode])](#markdown-header-omniscripttypeaheadtoggleeditmodeiseditmode-void) ⇒ void

### omniscriptTypeahead.options : Array

Options passed to base element.

**Kind**: instance property of [ns/omniscriptTypeahead](#markdown-header-nsomniscripttypeahead-omniscriptatomicelement)  
**Scope**: track (private)

### omniscriptTypeahead.\_isEditMode : Boolean

Controls weather the elements following the typeahead will be visible.
Visibility is controlled by css classes found in: OmniLwcUtils.scss.

**Kind**: instance property of [ns/omniscriptTypeahead](#markdown-header-nsomniscripttypeahead-omniscriptatomicelement)  
**Scope**: private  
**See**: {@link ./sass/OmniLwcUtils.scss}

### omniscriptTypeahead.\_disableFilter : Boolean

When true the options will not be filtered by the underlying typeahead component.
`_disableFilter` is always true when lookup mode is enabled, and for places search.

**Kind**: instance property of [ns/omniscriptTypeahead](#markdown-header-nsomniscripttypeahead-omniscriptatomicelement)  
**Scope**: private

### omniscriptTypeahead.\_useRemoteSource : Boolean

When true, a progress bar will be displayed while fetching options.

**Kind**: instance property of [ns/omniscriptTypeahead](#markdown-header-nsomniscripttypeahead-omniscriptatomicelement)  
**Scope**: private

### omniscriptTypeahead.\_actionDef : object

Local store of the remote source's JSON definition.

**Kind**: instance property of [ns/omniscriptTypeahead](#markdown-header-nsomniscripttypeahead-omniscriptatomicelement)  
**Scope**: private

### omniscriptTypeahead.errorMessage : string

Set when an error message is returned from a remote response.
Displayed on the template. Not a validation error.

**Kind**: instance property of [ns/omniscriptTypeahead](#markdown-header-nsomniscripttypeahead-omniscriptatomicelement)  
**Scope**: track (private)

### omniscriptTypeahead.typeaheadFn : function

Throttled handler to update jsonData, which source action will
depend on. Bound in connected callback.

**Kind**: instance property of [ns/omniscriptTypeahead](#markdown-header-nsomniscripttypeahead-omniscriptatomicelement)  
**Scope**: private.

### omniscriptTypeahead.\_editLabel : string

Alternative text for typeahaed icon

**Kind**: instance property of [ns/omniscriptTypeahead](#markdown-header-nsomniscripttypeahead-omniscriptatomicelement)  
**Scope**: private

### omniscriptTypeahead.\_showLookupOptions : Boolean

Flag which displays lookup options when typeahead is in lookup mode. Only used for typeahead lookup
mode.

**Kind**: instance property of [ns/omniscriptTypeahead](#markdown-header-nsomniscripttypeahead-omniscriptatomicelement)

### omniscriptTypeahead.\_lookupFocused : Boolean

Flag which determines if typeahead is focused when in lookup mode. Only used for typeahead lookup mode.

**Kind**: instance property of [ns/omniscriptTypeahead](#markdown-header-nsomniscripttypeahead-omniscriptatomicelement)

### omniscriptTypeahead.handleBlur(evt) ⇒ void

When the input is blurred, Validation is run and jsonData is updated.

**Kind**: instance method of [ns/omniscriptTypeahead](#markdown-header-nsomniscripttypeahead-omniscriptatomicelement)  
**Scope**: private

| Param | Type       |
| ----- | ---------- |
| evt   | FocusEvent |

### omniscriptTypeahead.handleClear() ⇒ void

When the input is cleared, validation must be run.

**Kind**: instance method of [ns/omniscriptTypeahead](#markdown-header-nsomniscripttypeahead-omniscriptatomicelement)  
**Scope**: private

### omniscriptTypeahead.handleTypeahead(evt) ⇒ void

Creates a throttled callback if `typeaheadFn` is not defined,
otherwise calls `typeaheadFn`.
Bound to keyup event in the [this#initCompVariables](this#initCompVariables) lifecycle hook.

**Kind**: instance method of [ns/omniscriptTypeahead](#markdown-header-nsomniscripttypeahead-omniscriptatomicelement)

| Param | Type          |
| ----- | ------------- |
| evt   | KeyboardEvent |

### omniscriptTypeahead.handleLookupButtonClick() ⇒ void

Lookup dropdown arrow button click handler for lookup typehead.
Only applicable in lookup typeahead.

**Kind**: instance method of [ns/omniscriptTypeahead](#markdown-header-nsomniscripttypeahead-omniscriptatomicelement)

### omniscriptTypeahead.handleLookupButtonKeyDown(event) ⇒ void

Lookup dropdown arrow button handler for onkeydown for lookup typeahead.
Only applicable in lookup typeahead.

**Kind**: instance method of [ns/omniscriptTypeahead](#markdown-header-nsomniscripttypeahead-omniscriptatomicelement)

| Param | Type |
| ----- | ---- |
| event | \*   |

### omniscriptTypeahead.handleLookup() ⇒ void

Bound to focus event in the [this#initCompVariables](this#initCompVariables) lifecycle hook.

**Kind**: instance method of [ns/omniscriptTypeahead](#markdown-header-nsomniscripttypeahead-omniscriptatomicelement)  
**Scope**: private

### omniscriptTypeahead.getOptionsDataJson() ⇒ Promise.<any>

Defines the promise chain used to get/filter/set typeahead options
when useDataJson is true.

**Kind**: instance method of [ns/omniscriptTypeahead](#markdown-header-nsomniscripttypeahead-omniscriptatomicelement)  
**Scope**: private

### omniscriptTypeahead.getOptions(action) ⇒ Promise.<any>

Defines the promise chain used to get/filter/set typeahead options
when useDataJson is false.

**Kind**: instance method of [ns/omniscriptTypeahead](#markdown-header-nsomniscripttypeahead-omniscriptatomicelement)  
**Scope**: private

| Param  | Type | Description                               |
| ------ | ---- | ----------------------------------------- |
| action | \*   | Action definition retrieved from jsonDef. |

### omniscriptTypeahead.hitEndPoint(action) ⇒ Promise.<any>

Link in the promise chain responsible for getting data from remote source.

**Kind**: instance method of [ns/omniscriptTypeahead](#markdown-header-nsomniscripttypeahead-omniscriptatomicelement)  
**Scope**: private

| Param  | Type | Description                               |
| ------ | ---- | ----------------------------------------- |
| action | \*   | Action definition retrieved from jsonDef. |

### omniscriptTypeahead.sendDataToDebugConsole(params, resp, label) ⇒ void

Sends data to the debug console event handler.

**Kind**: instance method of [ns/omniscriptTypeahead](#markdown-header-nsomniscripttypeahead-omniscriptatomicelement)  
**Scope**: private

| Param  | Type   |
| ------ | ------ |
| params | object |
| resp   | object |
| label  | string |

### omniscriptTypeahead.handleResponse(data) ⇒ Promise.<any>

Link in the getOptions promise chain responsible for ensuring
proper format of the remote response.

**Kind**: instance method of [ns/omniscriptTypeahead](#markdown-header-nsomniscripttypeahead-omniscriptatomicelement)  
**Scope**: private

| Param | Type | Description                |
| ----- | ---- | -------------------------- |
| data  | \*   | Result from remote source. |

### omniscriptTypeahead.dataProcessorHook(data) ⇒ Promise.<any>

A hook in the getOptions promise chain to allow components that inherit from omniscriptTypeahead
to define a custom filter.

**Kind**: instance method of [ns/omniscriptTypeahead](#markdown-header-nsomniscripttypeahead-omniscriptatomicelement)  
**Scope**: private

| Param | Type        | Description                                  |
| ----- | ----------- | -------------------------------------------- |
| data  | Array.<Any> | A list of items returned from handleResponse |

**Example**

```js
dataProcessor(data) {
  // Matches items by name (case insensitive). **Default behavior**
  return data.filter(item => item.name.toLowerCase().includes(this.elementValue.toLowerCase()));
  // Matches items by name (case sensitive).
  return data.filter(item => item.name.includes(this.elementValue));
  // Items names must start with input value.
  return data.filter(item => new RegExp(`^${this.elementValue}`, 'i').test(item.name));
}
```

### omniscriptTypeahead.setOptions(data) ⇒ void

Final link in the getOptions/getOptionsDataJson promise chain.
Responsible for setting the options array, and ensuring that the options items
are in a format that is digestible by the base c-sf-gps-ds-osrt-typeahead component.

**Kind**: instance method of [ns/omniscriptTypeahead](#markdown-header-nsomniscripttypeahead-omniscriptatomicelement)  
**Scope**: private

| Param | Type | Description                                     |
| ----- | ---- | ----------------------------------------------- |
| data  | \*   | Array of items returned from dataProcessorHook. |

### omniscriptTypeahead.handleError([reason]) ⇒ void

Error handler for the getOptions/getOptionsDataJson promise chain.

**Kind**: instance method of [ns/omniscriptTypeahead](#markdown-header-nsomniscripttypeahead-omniscriptatomicelement)  
**Scope**: private

| Param    | Type            | Description                                              |
| -------- | --------------- | -------------------------------------------------------- |
| [reason] | string ⎮ Object | Message or Error object containing details of the error. |

### omniscriptTypeahead.handleSelect(evt) ⇒ void

**Kind**: instance method of [ns/omniscriptTypeahead](#markdown-header-nsomniscripttypeahead-omniscriptatomicelement)  
**Scope**: private

| Param | Type        | Description                                                                           |
| ----- | ----------- | ------------------------------------------------------------------------------------- |
| evt   | CustomEvent | Called when a selection is made from the base typeahead component. Bound in template. |

### omniscriptTypeahead.toggleEditMode([isEditMode]) ⇒ void

If a boolean is specifically sent, that value will be set. Otherwise `_editMode` will be toggled.

**Kind**: instance method of [ns/omniscriptTypeahead](#markdown-header-nsomniscripttypeahead-omniscriptatomicelement)  
**Scope**: private

| Param        | Type | Description                                      |
| ------------ | ---- | ------------------------------------------------ |
| [isEditMode] | \*   | If passed, `_editMode` will set to passed value. |
