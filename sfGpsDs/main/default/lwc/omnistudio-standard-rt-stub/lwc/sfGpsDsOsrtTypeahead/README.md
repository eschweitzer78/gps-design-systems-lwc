# Typeahead Lightning Web Component

The _Typeahead Lightning Web Component_ supplies hints or a list of possible choices based on the text the user enters while filling out a form or performing a search.

## Available _c-sf-gps-ds-osrt-typeahead_ Attributes

| Attribute                 | Value                                                                 | Type    | Required                                                                                                          | Description                                                                                |
| ------------------------- | --------------------------------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| options                   |                                                                       | array   | yes                                                                                                               | Contains all available search options.                                                     |
| theme                     | slds, nds (Default: slds)                                             |         |                                                                                                                   | Sets the theme for the typeahed component.                                                 |
| value                     |                                                                       | string  |                                                                                                                   | Adds a pre-populated the value to typeahead input.                                         |
| label                     | string                                                                | string  |                                                                                                                   | Sets label of the typeahead element.                                                       |
| placeholder               | string                                                                | string  |                                                                                                                   | Sets the placeholder of the typeahead element.                                             |
| name                      | string                                                                | string  |                                                                                                                   | This attribute is for internal use only. The form element uses this attribute for syncing. |
| icon-name-left            |                                                                       | string  |                                                                                                                   | Sets the left icon for the typeahead component.                                            |
| icon-name-right           |                                                                       | string  |                                                                                                                   | Sets the right icon for the typeahead component.                                           |
| icon-size                 | xx-small, x-small, small, medium, large                               | string  |                                                                                                                   | Sets the size of icon for the typeahead component.                                         |
| disable-filter            | true, false (Default: false)                                          |         | If set to true, filtering is not applied to the options array on keyup. For use when backend system is filtering. |                                                                                            |
| reset-dropdownwidth       | true, false (Default: false)                                          | boolean |                                                                                                                   | If set to true, dropdown of the typeahead aligns with the input width.                     |
| remote-source             | true, false (Default: false)                                          | boolean |                                                                                                                   | is applied a progress bar will be displayedwhile options are retrieved.                    |
| is-lookup-visible         | true, false (Default: ???)                                            | boolean |                                                                                                                   | Displays the typeahead's combo box.                                                        |
| input                     |                                                                       |         | string                                                                                                            | A reference to the embedded html input. Set in renderedCallback.                           |
| first-render              | true, false (Default: ???)                                            | boolean |                                                                                                                   | Controls the flow of renderedCallback.                                                     |
| is-focused                | true, false (Default: ???)                                            | boolean |                                                                                                                   | Calculates the visibility of the lookup list.                                              |
| validity                  |                                                                       | string  |                                                                                                                   | References the embedded html input's validity state.                                       |
| field-level-help          |                                                                       | string  |                                                                                                                   | Adds help text.                                                                            |
| field-level-help-position | top-left, top-right, bottom-left, bottom-right (Default: bottom-left) | string  |                                                                                                                   | Specifies the direction of the arrow for the help text.                                    |
| dropdown-direction        | left, right (Default: none)                                           | string  |                                                                                                                   | Specifies the direction of the dropdown start point.                                       |

### Example _c-sf-gps-ds-osrt-typeahead_ Component

```html
<c-sf-gps-ds-osrt-typeahead label="Options"
             placeholder="Select Value"
             value="Morin"
             options='["Morin", "Banks", "Olivia", "Morina", "Banker", "Adeola"]'
             theme="nds"
             onchange={changeHandler}
             onselect={selectHandler}
             onkeyup={keyupHandler}
             icon-name-left={string}
             icon-name-right={string}
             required={boolean}
             disable-filter={boolean}
             remote-source={boolean}
</c-sf-gps-ds-osrt-typeahead>

```

## Available Methods

**showLookup(isVisible)**

Controls the visibility of the lookup.

| Param     | Type    | Description                            |
| --------- | ------- | -------------------------------------- |
| isVisible | boolean | When true lookup list will be visible. |

**selectOption(evt)**

| Param | Type       |
| ----- | ---------- |
| evt   | MouseEvent |

**lastItemChange(evt)**

Hides the last item element when no content is passed into the `lastItem` slot.

| Param | Type  |
| ----- | ----- |
| evt   | Event |

**updateValue(event)**

Keeps the `_value` up to date with the value of the input.

| Param | Type          |
| ----- | ------------- |
| event | KeyboardEvent |

**progressStart()**

Sets progress bar visibility, and starts progress.

**progressComplete()**

Sets progress bar's progress to 100%.

**typeahead.progressReset()**

Hides the progress bar and resets progress.

**resetValidations()**

Resets all validity error on typeahead.

## Available Event Listeners

**focusChange(evt)**

Event handler covering both focus and blur events.

| Param | Type  |
| ----- | ----- |
| evt   | Event |
