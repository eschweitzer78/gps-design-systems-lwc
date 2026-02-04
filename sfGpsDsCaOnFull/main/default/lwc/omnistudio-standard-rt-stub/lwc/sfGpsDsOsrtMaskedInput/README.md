# MaskedInput Lightning Web Component

The _MaskedInput Lightning Web Component_ controls what you can enter in form input fields. The _MaskedInput Lightning Web Component_ extends the _Input Lightning Web Component_.

## Available _c-sf-gps-ds-osrt-masked-input_ Attributes

| Attribute | Value  | Type   | Required | Description                                                                   |
| --------- | ------ | ------ | -------- | ----------------------------------------------------------------------------- |
| imask     | JSON   | object | yes      | Contains the valid imask attribute JSON.                                      |
| locale    | String | String | No       | Allows user to set locale for the currency type                               |
| currency  | String | String | No       | Allows user to set currency code                                              |
| inputmode | String | String | No       | Allows user to set inputmode which corresponds to different keypads on mobile |

## Public Variables to Access Value

| Name          | Description                            |
| ------------- | -------------------------------------- |
| typedValue    | Returns the valid value based on type. |
| unmaskedValue | Returns value without masking.         |
| maskedValue   | Returns value with masking.            |

For possible use cases for the masked-input component, see [imask documentation](https://unmanner.github.io/imaskjs/guide.html).

### To Note

- For the 'currency' and 'number' masks, the value of the _mask_ parameter must be `new Number()`, not `Number`. See **Example _masked-input_ Component** on this page.
- For date, use `c-sf-gps-ds-osrt-input` element where _type_ is set to 'date'.

### Example _c-sf-gps-ds-osrt-masked-input_ Component

```html
<c-sf-gps-ds-osrt-masked-input
  imask="{maskAttrib}"
  class="slds-p-top_small"
  theme="{theme}"
  label="InputMask"
  value="123456"
  type="text"
>
</c-sf-gps-ds-osrt-masked-input>
```

```js
maskAttrib = {
  mask: new Number(),
  thousandsSeparator: ",",
  radix: "."
};
```

### Label Slot Usage

A named slot (name = label) is available in the event a user would like to dynamically insert markup next to the input's label. This feature is not available for formula input.

Example ---

```html
<c-sf-gps-ds-osrt-masked-input
  imask="{maskAttrib}"
  class="slds-p-top_small"
  theme="{theme}"
  label="InputMask"
  value="123456"
  type="text"
>
  <span slot="label">Additional markup is inserted here</span>
</c-sf-gps-ds-osrt-masked-input>
```
