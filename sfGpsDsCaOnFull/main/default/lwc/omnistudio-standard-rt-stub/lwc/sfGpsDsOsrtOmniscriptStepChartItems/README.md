## ns/omniscriptStepChartItems ⇐ LightningElement

**Extends**: LightningElement

- [ns/omniscriptStepChartItems](#markdown-header-nsomniscriptstepchartitems-lightningelement) ⇐ LightningElement
  - [.jsonDef](#markdown-header-omniscriptstepchartitemsjsondef-object) : Object
  - [.jsonData](#markdown-header-omniscriptstepchartitemsjsondata-object) : Object
  - [.scriptHeaderDef](#markdown-header-omniscriptstepchartitemsscriptheaderdef-object) : Object
  - [.isVertical](#markdown-header-omniscriptstepchartitemsisvertical-boolean) : Boolean
  - [.currentIndex](#markdown-header-omniscriptstepchartitemscurrentindex-integer) : Integer
  - [.theme](#markdown-header-omniscriptstepchartitemstheme-string) : String
  - [.lastExecutedStepIndex](#markdown-header-omniscriptstepchartitemslastexecutedstepindex-integer) : Integer
  - [.stepChartIconUrl](#markdown-header-omniscriptstepchartitemsstepcharticonurl-string) : String
  - [.lastStepIndex](#markdown-header-omniscriptstepchartitemslaststepindex-integer) : Integer
  - [.completed](#markdown-header-omniscriptstepchartitemscompleted-boolean) : Boolean
  - [.inProgress](#markdown-header-omniscriptstepchartitemsinprogress-boolean) : Boolean
  - [.pristine](#markdown-header-omniscriptstepchartitemspristine-boolean) : Boolean
  - [.nonpristine](#markdown-header-omniscriptstepchartitemsnonpristine-boolean) : Boolean
  - [.stepLabel](#markdown-header-omniscriptstepchartitemssteplabel-string) : String
  - [.render()](#markdown-header-omniscriptstepchartitemsrender-void) ⇒ Void
  - [.handleStepClick(event)](#markdown-header-omniscriptstepchartitemshandlestepclickevent-void) ⇒ Void
  - [.applyLightningStyles()](#markdown-header-omniscriptstepchartitemsapplylightningstyles-void) ⇒ Void
  - [.renderedCallback()](#markdown-header-omniscriptstepchartitemsrenderedcallback-void) ⇒ Void

### omniscriptStepChartItems.jsonDef : Object

Gets and sets Omniscript JSON definition.

**Kind**: instance property of [ns/omniscriptStepChartItems](#markdown-header-nsomniscriptstepchartitems-lightningelement)  
**Scope**: public (api)

### omniscriptStepChartItems.jsonData : Object

Gets and sets Omniscript data JSON.

**Kind**: instance property of [ns/omniscriptStepChartItems](#markdown-header-nsomniscriptstepchartitems-lightningelement)  
**Scope**: public (api)

### omniscriptStepChartItems.scriptHeaderDef : Object

Script header definitions and globally shared variables.

**Kind**: instance property of [ns/omniscriptStepChartItems](#markdown-header-nsomniscriptstepchartitems-lightningelement)  
**Scope**: public (api)

### omniscriptStepChartItems.isVertical : Boolean

Identifies step chart is horizontal or vertical.

**Kind**: instance property of [ns/omniscriptStepChartItems](#markdown-header-nsomniscriptstepchartitems-lightningelement)  
**Scope**: public (api)

### omniscriptStepChartItems.currentIndex : Integer

Stores current index

**Kind**: instance property of [ns/omniscriptStepChartItems](#markdown-header-nsomniscriptstepchartitems-lightningelement)  
**Scope**: public (api)

### omniscriptStepChartItems.theme : String

Stores theme layout. Default = 'slds'.

**Kind**: instance property of [ns/omniscriptStepChartItems](#markdown-header-nsomniscriptstepchartitems-lightningelement)  
**Scope**: public (api)

### omniscriptStepChartItems.lastExecutedStepIndex : Integer

Stores last executed step index.

**Kind**: instance property of [ns/omniscriptStepChartItems](#markdown-header-nsomniscriptstepchartitems-lightningelement)  
**Scope**: public (api)

### omniscriptStepChartItems.stepChartIconUrl : String

The URL for the icon used on the stepchart items

**Kind**: instance property of [ns/omniscriptStepChartItems](#markdown-header-nsomniscriptstepchartitems-lightningelement)  
**Scope**: private

### omniscriptStepChartItems.lastStepIndex : Integer

Stores last step index.

**Kind**: instance property of [ns/omniscriptStepChartItems](#markdown-header-nsomniscriptstepchartitems-lightningelement)  
**Scope**: public (api)

### omniscriptStepChartItems.completed : Boolean

Flag for Completed indicator.

**Kind**: instance property of [ns/omniscriptStepChartItems](#markdown-header-nsomniscriptstepchartitems-lightningelement)  
**Scope**: private

### omniscriptStepChartItems.inProgress : Boolean

Flag for In Progress indicator.

**Kind**: instance property of [ns/omniscriptStepChartItems](#markdown-header-nsomniscriptstepchartitems-lightningelement)  
**Scope**: private

### omniscriptStepChartItems.pristine : Boolean

Flag for Pristine indicator.

**Kind**: instance property of [ns/omniscriptStepChartItems](#markdown-header-nsomniscriptstepchartitems-lightningelement)  
**Scope**: private

### omniscriptStepChartItems.nonpristine : Boolean

Flag for Nonpristine indicator.

**Kind**: instance property of [ns/omniscriptStepChartItems](#markdown-header-nsomniscriptstepchartitems-lightningelement)  
**Scope**: private

### omniscriptStepChartItems.stepLabel : String

Step label.

**Kind**: instance property of [ns/omniscriptStepChartItems](#markdown-header-nsomniscriptstepchartitems-lightningelement)  
**Scope**: private

### omniscriptStepChartItems.render() ⇒ Void

Overwrites native render.

**Kind**: instance method of [ns/omniscriptStepChartItems](#markdown-header-nsomniscriptstepchartitems-lightningelement)  
**Scope**: private

### omniscriptStepChartItems.handleStepClick(event) ⇒ Void

Event handler when steps are selected on the step chart.

**Kind**: instance method of [ns/omniscriptStepChartItems](#markdown-header-nsomniscriptstepchartitems-lightningelement)  
**Scope**: private

| Param | Type  |
| ----- | ----- |
| event | Event |

### omniscriptStepChartItems.applyLightningStyles() ⇒ Void

Applies progress indicator styles to the parent template for lightning when stepchart is in Vertical
mode.

**Kind**: instance method of [ns/omniscriptStepChartItems](#markdown-header-nsomniscriptstepchartitems-lightningelement)  
**Scope**: private

### omniscriptStepChartItems.renderedCallback() ⇒ Void

Overwrites native renderedCallback.

**Kind**: instance method of [ns/omniscriptStepChartItems](#markdown-header-nsomniscriptstepchartitems-lightningelement)  
**Scope**: private
