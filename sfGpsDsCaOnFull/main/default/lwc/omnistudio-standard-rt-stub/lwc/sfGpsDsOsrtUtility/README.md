# Utility Functions for Lightning Web Components

## isRtl

The `isRTL` function enables 'right-to-left' scripts.

### Supported languages

- Arabic
- Aramaic
- Dhivehi, Maldivian
- Hebrew
- Kurdish (Sorani)
- Persian, Farsi
- Urdu
  Steps to implement isRtl

### Implementation

1. Set `isRTL` by adding the _dir_ attribute inside a parent 'div' element.

```html
<div dir="{dir}"></div>
```

2. Assign the value (returned from `isRTL` function) to the respective property.

```js
this.dir = isRtl();
```

## createMask

The `createMask` function enables masking for input fields.

### Available masks

- dd-ddd-ddd
- yyyy-mm-dd
- dd-mm-yyyy
- yyyy/mm/dd
- dd/mm/yyyy

#### Example custom masks

To add a custom mask, use '#' keyword to represent the digits.

- value = "12345678901234" mask="+7(###)###-##-##" mask-range ="10"
  - output: +7(123)456-78-90
- value = "1234123412341234" mask="#### ####" mask-range ="16"
  - output: 1234 1234 1234 1234
- value = "1234123412341234" mask="$###,###"
  - output: $1234,1234,1234,1234
- value = "123456789" mask="$##.##"
  - output: $1234567.89
- value = "123456789" mask="##.##%"
  - output: $1234567.89%

### Implementation

Call createMask function on 'keyup' event of input.

```js
this.value = creatMask(event);
```

## fetchCustomLabels

The `fetchCustomLabels` function gets custom labels, and accepts one required parameter and two optional parameters.

### Implementation

1. Pass an array of labels
2. (Optional) Specify a language.
   - The function returns the translations for the labels array based on the language. If language is not passed the function will use the language from the userprofile.
3. (Optional) Specify default values for labels.
   - If there are no translations available for a label, a default value is returned. However, if an array of labels are passed, and any one or more labels do not have translations and no default values are defined, then an error is thrown. The error displays in the console, points to the faulty label, and returns the label key as the translation.

**Note**
The labels array and the default values must be of the same length so that they are mapped correctly. If labels and values are incorrectly mapped, the default values are not considered.

#### Example _fetchCustomLabels_ function

```js
fetchCustomLabels(["DeleteLayout", "Preview", "DRMapperFilter"], "en-US", [
  /** Default  values array **/
]).then((data) => {
  console.log(data);
});
```

#### Example _fetchCustomLabels_ output

The output is an object with a key-value pair. The key is the label and the value is the translation in the provided language.

```js
{
  DRMapperFilter: "Filter";
  DeleteLayout: "Delete Layout?";
  Preview: "Preview";
}
```

## getCustomNewportUrl

The `getCustomNewportUrl` function gets url of the custom newport static resource.

### Implementation

Import the function directly from utility. The function is exported as a default function.

#### Example _getCustomNewportUrl_ output

```js
import { getCustomNewportUrl } from "c/sfGpsDsOsrtUtility";
getCustomNewportUrl().then(url){

}
```

## staticResourceLoader

The `loadStaticResource` function takes static resource name and folder path and then it loads the static resource.

### Usecase

To load the static resources outside the managed package it will always throw an error due to cross-namespace issues. So in order to overcome this, we are providing this new method that can load any static resource ( JS / CSS )

### Implementation

Import the function directly from utility. The function is exported as a default function.
Parameters: Context, static resource name, folder path.

#### Example _loadJsFromStaticResource_ output

```js
import { loadJsFromStaticResource } from "c/sfGpsDsOsrtUtility";
loadJsFromStaticResource(
  this,
  "vlocitydcsdk",
  "/latest/digitalcommerce/digitalcommerce.sdk.js"
).then((resource) => {});
```

#### Example _loadCssFromStaticResource_ output

```js
import { loadCssFromStaticResource } from "c/sfGpsDsOsrtUtility";
loadCssFromStaticResource(
  this,
  "newport",
  "/assets/styles/vlocity-newport-design-system.min.css"
).then((resource) => {});
```

## handlePriorityCalls

The `handlePriorityCalls` function let's to make call as per the priority and without boxcarring. Maximum calls without boxcarring is 6. calls with lower priority are boxcarred.

### Implementation

Import the function directly from utility. The function is exported as a default function.

#### Example _handlePriorityCalls_ output

```js
import { handlePriorityCalls } from "c/sfGpsDsOsrtUtility";
handlePriorityCalls(
  (priority = 1),
  apexMethodName,
  paramters,
  successCallback,
  errorHandler
);
```
