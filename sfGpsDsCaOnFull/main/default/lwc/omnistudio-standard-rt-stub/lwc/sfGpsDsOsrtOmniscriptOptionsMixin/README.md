# OmniScript Options Mixin (OmniscriptOptionMixin)

This Mixin provides options logic integration for any component that is wrapped with this mixin component.

### Properties

| Name    | Scope           | Description                             |
| ------- | --------------- | --------------------------------------- |
| refresh | track (private) | Flag used to force a refresh of the UI. |

### Methods

| Signature                               | Scope   | Return Value | Description                                                                                                            |
| --------------------------------------- | ------- | ------------ | ---------------------------------------------------------------------------------------------------------------------- |
| initCompVariables()                     | private | void         | Overwrites a Lower Order component inherited initCompVariables. This method is executed once during connectedCallback. |
| seedOption()                            | private | Boolean      | Options are seeded.                                                                                                    |
| combinedWatch()                         | private | void         | Overwrites a Lower Order component inherited combinedWatch. This method executes when the Data JSON has changed.       |
| getOptions(initialOptions)              | private | void         | Gets the options for the element.                                                                                      |
| checkOptions(options, data)             | private | Object       | Checks options to see if the Data JSON needs to be cleared.                                                            |
| prependOptions(initialOptions, options) | private | Object       | Prepends options.                                                                                                      |
| updatePropOptions()                     | private | void         | Updates options property.                                                                                              |
| validateData(data)                      | private | Boolean      | Determines if data is valid.                                                                                           |

### HTML Markup

The Omniscript Options Mixin does not have a dedicated template. It will utilize the Lower Order component that the Mixin is wrapped.

### Usage

In order to utilize this Omniscript Options Mixin, import the Mixin and wrap the extended component with this Mixin.

The following code below is an example of its usage.

```javascript
import { OmniscriptOptionsMixin } from "c/sfGpsDsOsrtOmniscriptOptionsMixin";

export default class OmniscriptRadio extends OmniscriptOptionsMixin(
  OmniscriptAtomicElement
) {
  /** additional component specific logic **/
}
```
