# OmniScript Atomic Element (omniscriptAtomicElement)

This is the base component for LWC OmniScript input elements, for example, Text, Checkbox, etc. It derives from omniscriptBaseComponent and implements hasValidation mixin.

### Properties

| Name             | Scope   | Description                                                                        |
| ---------------- | ------- | ---------------------------------------------------------------------------------- |
| get defaultValue | private | Overwrite the one omniscriptBaseElement to support merge fields for Default Values |
| \_autocomplete   | private | Use to set autocomplete attribute                                                  |

### Methods

| Signature                    | Scope   | Return Value   | Description                                                                                                                                                  |
| ---------------------------- | ------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| prepareIMaskProperties(mask) | private | void           | Method to process mask property to be compatible with third party javascript library iMask format (we use iMask in LWC)                                      |
| findThousandsSeparator(mask) | private | String         | Helper method for mask handling                                                                                                                              |
| initCompVariables()          | private | void           | Overwrite the one in omniscriptBaseComponent                                                                                                                 |
| applyRepeatableStyles()      | private | void           | Applies class styles to support repeat / repeat clone features for all atomic inputs.                                                                        |
| validateData(data)           | private | Object         | Method to programmatically validate the data from API responses before applying it to the OmniScript (for example, Text element only accepts string or null) |
| validityHook(newShow)        | private | void           | Overwrite the one in omniscriptBaseComponent to handle client side validation of OmniScript input elements                                                   |
| getImaskCurrencyAttributes() | private | Object (iMask) | Helper method for mask handling                                                                                                                              |
| getImaskNumberAttributes()   | private | Object (iMask) | Helper method for mask handling                                                                                                                              |
| getCurrencySymbol(format)    | private | String         | Helper method for currency handling                                                                                                                          |
| setElementFormattedValue()   | private | void           | Helper method for retrieving the masked/formatted value from iMask lib                                                                                       |
| stateRefresh                 | private | void           | Overwrite the one in omniscriptBaseElement to handle repeat delete                                                                                           |

### Usage

This component derives from omniscriptBaseElement and implements hasValidation mixin. It serves as the base component for all OmniScript input LWCs.
