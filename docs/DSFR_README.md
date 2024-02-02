## Introduction

This document gives guidance on how to install, configure and leverage of the OmniStudio GOUV.FR Design System for your Experience Cloud portal within your Salesforce org.

## How to

### Install Salesforce GOUV.FR Design System for OmniStudio

You'll find all the details in the top-level [README.md](https://github.com/eschweitzer78/gps-design-systems-lwc/README.md) file.

### Prepare your Experience Cloud site

Some CSS will need to be loaded on your site. Do so in `Settings > Advanced` and change the `HEAD` section:

```
<link rel="stylesheet" href="/sfsites/c/resource/sfGpsDsFrGov/dsfr.min.css">
<link rel="stylesheet" href="/sfsites/c/resource/sfGpsDsFrGov/dsfr-supplement.min.css">
<link rel="stylesheet" href="/sfsites/c/resource/sfGpsDsFrGov/omnistudio.css">

<style>
   html {
  		-webkit-font-smoothing: antialiased;
 		 -moz-osx-font-smoothing: grayscale;
	}
</style>
```

### Configure each OmniScript for use of the GOUV.FR Frontend

You can apply overrides on your choice of elements for the whole script, or do a targeted override on a single element; we suggest to systematically apply all overrides for full compliance.

Here are the settings to use:

| Element type   | Key to use in mapping   | Target LWC                         |
| -------------- | ----------------------- | ---------------------------------- |
| Checkbox       | Checkbox                | sfGpsDsFrGovFormCheckboxOsN        |
| Currency       | Currency                | sfGpsDsFrGovFormCurrencyOsN        |
| Date           | Date                    | sfGpsDsFrGovFormDateOsN            |
| Date Time      | Date/Time (Local)       | sfGpsDsFrGovFormDateTimeOsN        |
| Disclosure     | Disclosure              | sfGpsDsFrGovFormDisclosureOsN      |
| Email          | Email                   | sfGpsDsFrGovFormEmailOsN           |
| File           | File                    | sfGpsDsFrGovFormFileOsN            |
| Multi-select   | Multi-select            | sfGpsDsFrGovFormMultiselect        |
| Number         | Number                  | sfGpsDsFrGovFormNumberOsN          |
| Password       | Password                | sfGpsDsFrGovFormPasswordOsN        |
| Radio          | Radio                   | sfGpsDsFrGovFormRadioOsN           |
| Select         | Select                  | sfGpsDsFrGovFormSelectOssN         |
| Step           | Step                    | sfGpsDsFrGovFormStepOsN            |
| Step chart     | StepChart               | sfGpsDsFrGovFormStepChartOsN       |
| Telephone      | Telephone               | sfGpsDsFrGovFormTextOsN            |
| Text           | Text                    | sfGpsDsFrGovFormTextOsN            |
| Textarea       | Text Area               | sfGpsDsFrGovFormTextareaOsN        |
| Time           | Time                    | sfGpsDsFrGovFormTimeOsN            |
| Typeahead      | Type Ahead              | sfGpsDsFrGovFormTypeahead          |
| URL            | URL                     | sfGpsDsFrGovFormUrlOsN             |
| Lookup         | Lookup                  | sfGpsDsFrGovFormLookupOsN          |
| Messaging      | Validation              | sfGpsDsFrGovFormMessagingOsN       |
| Save for later | SaveForLaterAcknowledge | sfGpsDsFrGovFormSaveForLaterAckOsN |

Kindly note that the Google Maps Typeahead requires mapping that's different from Typeahead; it is not supported yet.

#### Script-wide overrides

1. Open your target OmniScript.
2. From the `Setup` tab, go to the `Element Type to LWC Component Mapping` section to configure your overrides as illustrated below.

![Override mapping illustration](https://github.com/eschweitzer78/gps-design-systems-lwc/assets/20468027/ba9a6c5c-2928-435f-9e65-7617c6289991)

#### Individual overrides

1. Open your target OmniScript
2. Locate the individual component to be overriden
3. Configure the override by using the LWC Component Override section as illustrated below:

![Single component mapping](https://github.com/eschweitzer78/gps-design-systems-lwc/assets/20468027/8c102f6b-4236-4a07-8300-7ed3e6ee8b6e)

#### Mask the original OmniScript bottom buttons in OmniStudio Preview (optional)

1. Configure the styling options section as shown below to mask original buttons.

![Additional css](https://github.com/eschweitzer78/gps-design-systems-lwc/assets/20468027/e4559116-aba7-4977-9893-d130f302d541)

#### Activate your OmniScript

Activate your Omniscript to preview and run your OmniScript.
Make sure you do this with OmniStudio Managed Package support switched on in setup. If you activated when Managed Package support was switched off, switch it on, de-activate and re-activate and shortly enter Preview. This will re-generated the LWC for your script.
Once active, you will find the Omniscript component under the Custom Components section in Experience Builder.

_Do not use the generic OmniStudio Component_ in Experience Builder as it is not on par with generated LWCs from a capability level when it comes to overrides.

## Limitations

- You may need to manually tune the bottom button widths on the first and final steps as discussed below.
- The file upload element does not work on LWR sites just like any upload supported by the Lightning file upload widget - this is an LWR limitation,
- Save for Later functionnality is not available on LWR sites, just as for plain OmniScripts.
- Generic OmniStudio Component in Experience builder isn't supported as discussed above.

## Important notes

There is currently no way to override the bottom buttons of OmniScripts (Previous, Next, Save for Later, etc).

In order to achieve the required styling, we have worked around this limitation by placing additional styled buttons at the bottom of the Step.
However, a further limitation is that a Step does not have a lot of data available regarding surrounding steps but for its index in the script, e.g. is does not know whether it is the first or last element in the script or not. There is not programmatic way we can used to assess whether there is a previous or next step, i.e. whether the previous and next buttons should be displayed or not.

Please make sure to change the configuration of the `next` button on last step of your omniscript, by setting its width to 0.
Do the same with the previous button on the firsst step if it's not the first element in the script.

Also be mindful that the number of steps should not exceed 8 as per guidance for the Step Indicator in the GOUV.FR Design System:
[https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/indicateur-d-etapes](https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/indicateur-d-etapes).

## Developer guide

These steps are only meaningful if you intend to build your own set of artefacts for manual source deployment with `sfdx`
instead of installing your design system with a Salesforce package.

### npm and node

Check the current version suggested in the `package.json` file, and pin node and npm as required with volta or similar.

### Install dependencies

Import dependencies by using the following command at the root of the directory: `npm i`

### Install saas

Dart Sass - version 1.0.0 or higher is required to complete the transpiling of scss files.

## Build artefacts and deploy as source

```
npm run cssgen
npm run osfilegen
npm run frgov-copy
```

Your source code artefacts are now ready for deployment with `sfdx` from the `sfGpsDsFrGovFull` directory.
