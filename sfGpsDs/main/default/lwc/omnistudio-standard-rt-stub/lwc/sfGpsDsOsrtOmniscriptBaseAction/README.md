# OmniScript Base Action (omniscriptBaseAction)

The OmniScript Base Action component is the base component for all OmniScript Action components. The OmniScript Base Action provides common functionality that is shared amongst all actions in the OmniScript actions framework.

### Properties

The following are a list of properties that are declared inside of the OmniScript Base Action.

| Name              | Scope   | Description                           |
| ----------------- | ------- | ------------------------------------- |
| \_isBtn           | private | Identifies if the action is a button. |
| \_actionUtilClass | private | Stores action utility class instance  |

### Methods

The following are a list of methods that are declared inside of the OmniScript Base Action.

| Signature                                              | Scope        | Return Value | Description                                                               |
| ------------------------------------------------------ | ------------ | ------------ | ------------------------------------------------------------------------- |
| execute()                                              | api (public) | Promise      | API method that starts the action execution flow.                         |
| handleResponse(resp, element)                          | private      | Object       | Handles the response from the action framework and interacts with the UI. |
| initCompVariables()                                    | private      | Void         | Overwrites inherited initCompVariables.                                   |
| checkActionValidity(element)                           | private      | boolean      | Checks validity for executing an action.                                  |
| runAction(element)                                     | private      | \*           | Full action flow for action execution.                                    |
| handleToastCompletion(title, message)                  | private      | Void         | Displays toasts upon action completion. Utilized in the Action Framework. |
| applyCallResp(json, bApi = false, bValidation = false) | api (public) | void         | Overwrites inherited applyCallResp.                                       |
| skipValidation()                                       | private      | Boolean      | Defines if validation is to be skipped for a specific action.             |

### HTML Markup

Newport and Lightning HTML markups are provided for this component.

### Usage

This component derives from the `OmniscriptGroupElement`. It serves as a base component for all OmniScript Action LWCs.
