# OmniScript Base Mixin (omniscriptBaseMixin)

This is the base mixin for LWC OmniScript.

### Properties

| Name                | Scope           | Description                                                                                                                                 |
| ------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| omniJsonDef         | api (public )   | Reactive public property. Set it with JSON definition of an OmniScript or an OmniScript element (one OmniScript forms is a component tree). |
| omniSeedJson        | api (public )   | Reactive public property. It is a collection of URL prefill, seed data set up in the designer and cached JSON from API calls.               |
| omniResume          | api (public )   | Reactive public property. Whether the OmniScript is run in new-launch or resume mode.                                                       |
| omniScriptHeaderDef | api (public )   | Reactive public property. It is used to pass down the script header property to the OmniScript child components.                            |
| omniJsonData        | api (public )   | Reactive public property. It is used to pass down data JSON of the OmniScript to all OmniScript child components.                           |
| omniJsonDataStr     | api (public )   | Reactive public property. It is used to pass down a stringified data JSON of the OmniScript to all OmniScript child components.             |
| omniCustomState     | api (public )   | Reactive public property. It is used to save data from the custom component. It is separate from the data JSON.                             |
| dataLayout          | public          | Determines which LWC player to use - lightning or newport.                                                                                  |
| showValidation      | track (private) | Flag that determines whether the component passes validation.                                                                               |

### Methods

| Signature                                            | Scope        | Return Value | Description                                                                                                                                                                                                                                                                                   |
| ---------------------------------------------------- | ------------ | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| omniUpdateDataJson(input, aggregateOverride = false) | private      | void         | Updates Custom LWC's node inside of Data JSON with the passed in object                                                                                                                                                                                                                       |
| omniApplyCallResp(response, usePubsub = false)       | private      | void         | Updates OmniScript's Data JSON with the passed in object.                                                                                                                                                                                                                                     |
| omniSaveState(input, key, usePubsub = false)         | private      | void         | Saves data in OmniScript mapped to a specified key or defaults to the id of the custom lwc.                                                                                                                                                                                                   |
| omniSaveForLater(auto = false)                       | private      | void         | Notifies the OmniscriptHeader that the current instance needs to be saved.                                                                                                                                                                                                                    |
| omniGetSaveState(key)                                | private      | Object       | Retrieves data in OmniScript for a specific custom LWC.                                                                                                                                                                                                                                       |
| omniGetMergeField(mergeFieldString)                  | private      | Any          | Replaces all valid merge field strings with values from OmniScript's Data JSON                                                                                                                                                                                                                |
| omniNextStep()                                       | private      | void         | Navigates OmniScript to the next step                                                                                                                                                                                                                                                         |
| omniPrevStep()                                       | private      | void         | Navigates OmniScript to the previous step                                                                                                                                                                                                                                                     |
| omniNavigateTo(element)                              | private      | void         | Given the step name or step index, navigate the OmniScript to any step before the current step or to the immediate next step                                                                                                                                                                  |
| omniValidate(showMessage = true)                     | private      | void         | Triggers validation for component. Calls parent's reportValidity and calls omniscriptBaseMixin's reportValidity. By default, showValidation will be set causing error messages to be displayed. Setting to false will prevent error messages from getting displayed when calling omniValidate |
| omniRemoteCall(params, enableSpinner = false)        | private      | Promise      | Triggers a remote call. Invokes apex classes that extend from Vlocity Open Interface. Remote calls are called using Generic Invoke.                                                                                                                                                           |
| checkValidity()                                      | api (public) | Boolean      | Default is true. Returning false prevents navigating to the next step. Overriding this function allows control over navigating to the next step.                                                                                                                                              |
| reportValidity()                                     | api (public) | Boolean      | Sets showValidation to true when checkValidity returns false                                                                                                                                                                                                                                  |

### Usage

Below is an example showing how to include omniscriptBaseMixin in a customLWC

```
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin'; // outside Vlocity package, if you are developing an OOTB Vlocity LWC, change it to 'c/omniscriptBaseMixin'

export default class MyCustomLwc extends OmniscriptBaseMixin(LightningElement) {}
```

### Validation

#### Define your logic in checkValidity, and assign the result to this.isValid.

To integrate with the OmniScript Validation Framework, define an override method for `checkValidity()` on your component.

```JS
    ...
    @api checkValidity() {
				return (this.selection.length < 3);
    }

    selectItem(item) {
        this.selection = [...this.selection, item];
        // When properties change that affect validity, update the
        // validity state by calling
        this.omniValidate();
    }
    ...
```

The definition for `checkValidity` should return `true` if the component is valid, and `false` if invalid. Validation will be performed when your component first renders, otherwise call `omniValidate` when properties change that affect your components validity.

```
    selectItem(item) {
        this.selection = [...this.selection, item];
        // error messages will be hidden until next button is pressed or other omniValidate() is called
        this.omniValidate(false);
    }
```

#### Displaying validation messages:

It's best practice to display a detailed validation message so the user knows how to correct mistakes. Validation messages should:

1. Appear when the user tries to progress to the next step.
2. Appear when the user enters invalid data and the element loses focus. (May not be applicable for all components.)
3. Be removed as soon as validation requirements are met.

As a general rule of thumb, try not to display validation messages before the user is finished entering data.

The value of `showValidation` will update whenever `omniValidate` is called.

```HTML
    <p class="validation-message"
       if:true={showValidation}>Please select at least 3 items.</p>
```
