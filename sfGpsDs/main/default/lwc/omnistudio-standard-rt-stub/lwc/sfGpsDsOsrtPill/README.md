# Pill Lightning Web Component

The _Pill Lightning Web Component_ is an input element that displays read-only labels that can contain links and can be removed from view on demand. For example, a user can create a list of email addresses or keywords by adding options using the input field or by selecting from a list of options, which then display as read-only labels with delete buttons. The _Pill LWC_ supports custom labels.

## Available _c-pill_ Attributes

| Attribute   | Value                                                            | Type         | Required | Description                                                                                                                                                                                                                                |
| ----------- | ---------------------------------------------------------------- | ------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| freetext    | true, false (Default: false)                                     | string       |          | If set, enables free text. To enable users to create their own pill values apart from the values provided in options, set this to true. To create a free text pill, user enters the text in the input element, then presses the enter key. |
| name        |                                                                  | string       |          | Sets the name of the element. Used by the **Form Lightning Web Component**.                                                                                                                                                                |
| theme       | slds, nds (Default: slds)                                        | string       |          | Sets the theme for the pill component.                                                                                                                                                                                                     |
| viewonly    | To enable, add _viewonly_ without value to the `c-pill` element. |              |          | If set, hides input field and prevents users from adding new pills.                                                                                                                                                                        |
| placeholder |                                                                  | string       |          | Adds text to the input element to prompt user to select from the dropdown (list of _options_ to render labels). For example, "Select an option".                                                                                           |
| label       |                                                                  | string       |          | Adds a title for the rendered pill element.                                                                                                                                                                                                |
| disabled    | true, false (Default: false)                                     | boolean      |          | To disable the input field, set to true.                                                                                                                                                                                                   |
| options     |                                                                  | array string |          | Adds the initial list of label options. You can use this attribute to restrict options for users.                                                                                                                                          |
| value       |                                                                  | string       |          | To add visible labels by default, set this attribute. To add more than one label, enter a comma sepatated list, such as 'One, Two, Three'.                                                                                                 |

### Example _c-pill_ Component

```html
<c-pill
  options='["Morin", "Banks", "Olivia"]'
  label="Users"
  value='"Adeola" "Mariam"'
  freetext="true"
  placeholder="Please enter you interest"
></c-pill>
```

## Available Custom labels

| Label                               | ApiName   | Description                                    |
| ----------------------------------- | --------- | ---------------------------------------------- |
| Press delete or backspace to remove | cmpRemove | Text visible on mouse over of the delete icon. |

## Available Custom Events

**onremove**

Triggers on deleting a value.

**onselect**

Triggers on selecting an option.

## Available Methods

**getValue()**

Returns comma-separated pill values.
