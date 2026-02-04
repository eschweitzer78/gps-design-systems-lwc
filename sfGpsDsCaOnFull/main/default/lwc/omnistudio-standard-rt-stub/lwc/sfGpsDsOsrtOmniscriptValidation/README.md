# OmniScript Validation (omniscriptValidation)

This library component consists of two mixin classes that can be used to integrate
any component into the omniscript step validation framework. The first and most important
is the `HasValidation` mixin class, the second is the `AggregatesValidation` mixin class
which can be used on any container element to manipulate the results of the child inputs.

## HasValidation

The HasValidation mixin class integrates an input element via an override to the extended elements `applyCallResp` method. It's here that the child input's validation status is read via checkValidity, and reportValidity methods of the constraints API.

### Properties

| Name              | Scope           | Description                                                                                                                                                                    |
| ----------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| childInput        | api (public)    | Returns the queried element targeted by `_inputSelector`. After the query is returned the first time, the value is cached.                                                     |
| label             | api (public)    | getter that returns the value of the child input's label.                                                                                                                      |
| validationMessage | api (public)    | getter that returns the value of the child input's validationMessage                                                                                                           |
| validity          | api (public)    | returns the [ValidityState](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState) object belonging to the child input.                                               |
| tabIndex          | track (private) | Set via setReadOnly to `-1` when `_readOnly` is true preventing child inputs from receiving focus.                                                                             |
| isValid           | private         | getter/setter to track the state of validation. When the input becomes invalid, the VALIDATION_EVENTS.INVALID event is fired, and VALIDATION_EVENTS.VALID when becoming valid. |

### Methods

| Signature                                                           | Scope        | Return Value | Description                                                                                                                                                                              |
| ------------------------------------------------------------------- | ------------ | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| applyCallResp(json, bApi = false, bValidation = false)              | api (public) | void         | Override for applyCallResp, adds check for UI validity.                                                                                                                                  |
| checkValidity()                                                     | api (public) | Boolean      | Performs custom validation as well as native Constraint Validation API calls, but doesn't trigger display of validation messages.                                                        |
| reportValidity()                                                    | api (public) | Boolean      | Performs custom validation as well as native Constraint Validation API calls, and triggers the display of validation messages.                                                           |
| focus()                                                             | api (public) | void         | Calls focus on child input. [TODO] Determine if we can leverage [delegatesFocus](https://developer.salesforce.com/docs/component-library/documentation/lwc/lwc.create_components_focus). |
| setReadOnly(value)                                                  | private      | Boolean      | Sets the readonly state of the input, since omniscript inputs must still be valid when readonly, this functionality is custom.                                                           |
| connectedCallback()                                                 | private      | void         | Overwrites native LWC connectedCallback. Initializes storing labels in memory and adds event listeners.                                                                                  |
| renderedCallback()                                                  | private      | void         | Overwrites native LWC renderedCallback.                                                                                                                                                  |
| setChildInputValue(value)                                           | private      | void         | Sets child input value.                                                                                                                                                                  |
| handleValueSetApi(jsonToApply, bApi, bValidation, preVal, postValA) | private      | void         | Handles allowing the input to handle data validation, filtering, and parsing before applying it to the data json.                                                                        |

### Usage

When integrating a new input in to the OmniScript validation framework,
the first step is to extend the HasValidation mixin class.

### A straightforward example omniscriptText:

Below is an example that shows how `HasValidation` was integrated with elements
that derive from the `OmniscriptAtomicElement` class.

First import and extend the HasValidation mixin.

**omniscriptAtomicElement.js**

```diff
import OmniscriptBaseElement from 'c/sfGpsDsOsrtOmniscriptBaseElement';
// 💡 Import the HasValidation mixin.
+import { HasValidation } from 'c/sfGpsDsOsrtOmniscriptValidation';

// 💡 Extend the mixin and the base class!
-export default class OmniscriptAtomicElement extends OmniscriptBaseElement {
+export default class OmniscriptAtomicElement extends HasValidation(OmniscriptBaseElement) {
     _maskProperties = {};

     prepareIMaskProperties(mask) {

```

Then add the default selector attribute `data-omni-input` to the actual child input so that `HasValidation` can reference it.

Remove the disabled attribute to allow the validation framework to
take control of the read only state.

And pass tabIndex to the child input. This will prevent the input from gaining focus when the component is in a read only state.

**omniscriptText.html**

```diff
<template>
  <slot>
    <c-sf-gps-ds-osrt-masked-input type="text"
                    label={jsonDef.propSetMap.label}
                    onblur={handleBlur}
                    value={elementValue}
                    required={jsonDef.propSetMap.required}
-                   disabled={jsonDef.propSetMap.readOnly}
                    maxlength={jsonDef.propSetMap.maxLength}
                    minlength={jsonDef.propSetMap.minLength}
                    pattern={_patternVal}
                    imask={imaskTextAttributes}
                    theme={_theme}
+                   tab-index={tabIndex}
                    field-level-help={_handleHelpText}
                    placeholder={_placeholder}
+                   data-omni-input>
    </c-sf-gps-ds-osrt-masked-input>
  </slot>
</template>
```

And that's all that was required to integrate the `omniscriptText` component.
As you can see, the actual integration is very straightforward! Next let's
take a look at slightly more complex example.

### Another example, the multi-select.

Since the omniscriptMultiSelect already extends omniscriptAtomicElement all that had to be done was update the template.

```diff
<template>
  <slot>
    <c-sf-gps-ds-osrt-checkbox-image-group if:true={checkImageMode}
                            type="checkbox"
                            name={jsonDef.name}
                            is-image="true"
                            value={elementValue}
                            options={jsonDef.propSetMap.options}
                            label={jsonDef.propSetMap.label}
                            enabled-caption={jsonDef.propSetMap.enableCaption}
                            control-width={jsonDef.propSetMap.optionWidth}
                            control-height={jsonDef.propSetMap.optionHeight}
                            image-count-in-row={jsonDef.propSetMap.imageCountInRow}
                            onchange={handleChange}
                            required={jsonDef.propSetMap.required}
                            disabled={jsonDef.propSetMap.readOnly}
                            theme={_theme}
+                            data-omni-input>
    </c-sf-gps-ds-osrt-checkbox-image-group>
    <c-sf-gps-ds-osrt-checkbox-group if:false={checkImageMode}
                      name={jsonDef.name}
                      value={elementValue}
                      options={checkedValue}
                      label={jsonDef.propSetMap.label}
                      onchange={handleChange}
                      required={jsonDef.propSetMap.required}
                      disabled={jsonDef.propSetMap.readOnly}
                      theme={_theme}
+                     data-omni-input>
    </c-sf-gps-ds-osrt-checkbox-group>
  </slot>
</template>
```

> 💡An important part of integrating with the omniscript validation framework
> is ensuring that the underlying input component exposes the checkValidity,
> reportValidity, and setCustomValidity methods of the constraints validation API.

## AggregatesValidation

The `AggregatesValidation` mixin class adds functionality to aggregate the validation
status of all child inputs that extend the `HasValidation` mixin, by listening to the
`VALIDATION_EVENTS.VALID`, and `VALIDATION_EVENTS.INVALID` events. A list of the
current invalid children are kept track on fin `this.invalidElements`.

Currently the the `AggregatesValidation` mixin is only implemented by OmniscriptHeader,
but could be implemented by any container element. A possible use could be something
like an edit-block modal, where inputs should be valid before closing.

### Properties

| Name            | Scope   | Description                                                                                                                                                                                                |
| --------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| invalidElements | private | A map of invalid elements with the key being the element's jsonPath. Each item in the map should have access to the public members of the input. Notable entries include `label`, and `validationMessage`. |
| errorsJson      | private | Getter returning a stringified json of the invalid elements map. Not used in element, but can be used for debugging.                                                                                       |

### Methods

| Signature                | Scope        | Return Value | Description                                                                                                    |
| ------------------------ | ------------ | ------------ | -------------------------------------------------------------------------------------------------------------- |
| markInputAsInvalid(evt)  | private      | void         | Event handler attached to `VALIDATION_EVENTS.INVALID`.                                                         |
| markInputAsValid(evt)    | private      | void         | Event handler attached to `VALIDATION_EVENTS.VALID`.                                                           |
| focusInvalidInput(index) | private      | void         | Scrolls the invalid input at the specified index into view, and then set's focus on it.                        |
| handleInvalid()          | api (public) | void         | A default method to be called to handle invalid state. Default functionality simply calls focusInvalidInput(0) |
| checkValidity()          | private      | Boolean      | Returns false if `invalidElements` contains any elements.                                                      |
| reportValidity()         | private      | Boolean      | Calls `reportValidity()` on each element in the `invalidElements` map.                                         |
| connectedCallback()      | private      | void         | Overwrites native LWC connectedCallback. Adds event listeners that are required for validation.                |
