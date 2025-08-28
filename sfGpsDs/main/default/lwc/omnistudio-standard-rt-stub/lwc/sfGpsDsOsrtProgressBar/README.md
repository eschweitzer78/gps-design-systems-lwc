# ProgressBar Lightning Web Component

The _ProgressBar Lightning Web Component_ displays the progress of activity on a page. The _ProgressBar LWC_ supports custom labels.

## Available _c-sf-gps-ds-osrt-progress-bar_ Attributes

| Attribute  | Value                                                    | Type    | Required | Description                                                                                                    |
| ---------- | -------------------------------------------------------- | ------- | -------- | -------------------------------------------------------------------------------------------------------------- |
| progress   | 0-100 (Default: 0)                                       | number  |          | Value representing the progress bar's completeness.                                                            |
| name       |                                                          | string  |          | Value representing the progress bar's accessible name.                                                         |
| size       | xx-small, x-small, small, medium, large (Default: small) | string  |          | Corresponds to slds/nds styles determining size. {theme}-progress-bar_xx-small, x-small, small, medium, large. |
| transition |                                                          | number  |          | Number in seconds. Represents the css property transition-duration.                                            |
| theme      | slds, nds (Default: slds)                                | string  |          | Specifies the theme to use.                                                                                    |
| success    | true, false (Default: false)                             | boolean |          | Flag when true will render the component with success styling.                                                 |

## Example _c-sf-gps-ds-osrt-progress-bar_ Component

```html
<c-sf-gps-ds-osrt-progress-bar
  progress="0"
  size="x-small"
  theme="nds"
  transition="0.5"
  success
></c-sf-gps-ds-osrt-progress-bar>
```

## Available Custom Labels

| Label    | ApiName     | Description                                                               |
| -------- | ----------- | ------------------------------------------------------------------------- |
| Progress | cmpProgress | Assistive text for the icon that displays where a user is in the process. |

## Available Methods

**setProgress(value)**
Sets the % of completeness of the progress bar value without setting the api value directly.

| Param | Type   | Description                                                                  |
| ----- | ------ | ---------------------------------------------------------------------------- |
| value | number | Value representing the progress bar's completeness. Valid values from 0-100. |

**progressBar.setSuccess()**
Sets the value of ProgressBar.success without setting the api value directly.

| Name    | Type    | Description                                                                  |
| ------- | ------- | ---------------------------------------------------------------------------- |
| success | boolean | If success is true, the progress indicator will change to the success color. |

**ProgressBar.ProgressBar**
Custom element that will render a slds-progress-bar or nds-progress bar css component. Extends the LightningElement.
