# OmniScript GroupElement (omniscriptGroupElement)

The group element is an abstract component containing common functionality for the group elements. Step, Block, Edit Block, and Typeahead Block.

### Properties

| Name                    | Scope           | Description                                                   |
| ----------------------- | --------------- | ------------------------------------------------------------- |
| updateJsonDefUtil       | private         | Local reference to imported updateJsonDef.                    |
| updateJsonUtil          | private         | Local reference to imported updateJson                        |
| sendErrorModalUtil      | private         | Local reference to imported sendErrorModal.                   |
| sendOmniPubsubEventUtil | private         | Local reference to imported sendOmniPubsubEvent.              |
| handleMessagingUtil     | private         | Utility method that handles messaging events for wpm and ssm. |
| evaluateMessagingUtil   | private         | Utility method that evaluates if messaging is permitted.      |
| isPageLoading           | private         | Global spinner flag.                                          |
| isBtnLoading            | track (private) | Button spinner flag.                                          |
| spinnerActionMessage    | track (private) | Message to be displayed accompanying the loading spinner.     |

### Methods

| Signature                                  | Scope   | Return Value | Description                                                                                                                                              |
| ------------------------------------------ | ------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| applyCallResp(data, [bApi], [bValidation]) | void    | api (public) | Sets the element value and triggers aggregation. Overridable.                                                                                            |
| runServerCheck()                           | boolean | private      | This function will determine if we need to run server check for this OmniScript being active. This can be overriden by any component to skip validation. |
| handleArray(array)                         | private | Array.<any>  |                                                                                                                                                          |
| handleOmniAggregate(evt)                   | private | void         | Aggregate event handler at the parent component level, to be modified.                                                                                   |
| handleOmniSeedDataRefresh(evt)             | private | void         | Update header seedDataJSON to only keep the nodes that are not applied yet.                                                                              |
| handleOmniUpdateJsonDef(evt)               | private | void         | Update full jsonDef of the script.                                                                                                                       |
| handleOmniSetShow(evt)                     | private | void         | Event listener that updates bShow for all elements.                                                                                                      |
| createAggregateNode(bFixProxy, operation)  | private | Object       | Override OmniscriptBaseElement.createAggregateNode to handle Proxies that have ReadOnlyHandler.                                                          |
| evaluateSpinner(value, element)            | private | void         | Evaluates spinner according to conditions.                                                                                                               |
| validityHook(newShow)                      | private | void         | Called when a group element has it's visibility toggled 'conditional render'.                                                                            |
| markInputAsValid(evt)                      | private | void         | Event listener fired when an input element becomes valid. Fired from hasValidation mixin.                                                                |
| markInputAsInvalid(evt)                    | private | void         | Event listener fired when an input element becomes invalid. Fired from hasValidation mixin.                                                              |
