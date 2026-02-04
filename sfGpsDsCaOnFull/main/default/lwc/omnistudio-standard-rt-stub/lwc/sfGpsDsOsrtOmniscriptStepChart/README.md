# Omniscript Step Chart (omniscriptStepChart)

The Omniscript Step Chart component provides functionality for the step chart. This README will provide high-level information regarding the different properties and methods utilized by the Omniscript Step Chart LWC component.

### Properties

The following are a list of properties that are declared inside of the Omniscript Step Chart.

| Name              | Scope           | Description                                                                                                                              |
| ----------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| layout            | api (public)    | Reactive public property. Determines which LWC player to use - lightning or newport.                                                     |
| stepInstruction   | track (private) | Displays the step instructions for a specific step.                                                                                      |
| stepProgressValue | track (private) | Stores the progress bar value for the horizontal lightning step chart and newport step chart.                                            |
| isVertical        | track (private) | Identifies if the horizontal or vertical step chart is to be displayed. Only applicable for Lightning.                                   |
| get/set props     | api (public)    | Reactive public property. It is used to apply specific properties to the step chart that is passed from the Omniscript Header component. |
| currentIndex      | track (private) | Stores the value of the current index.                                                                                                   |
| get/set jsonDef   | api (public)    | Reactive private property that gets and sets the omniscript json definition.                                                             |
| get/set jsonData  | api (public)    | Reactive private property that updates index when the data json is updated.                                                              |
| lastStepIndex     | track (private) | Stores the value of the last step index.                                                                                                 |

### Methods

The following are a list of methods that are declared inside of the Omniscript Step Chart.

| Signature                       | Scope   | Return Value | Description                                                                           |
| ------------------------------- | ------- | ------------ | ------------------------------------------------------------------------------------- |
| connectedCallback()             | private | Void         | Overwrites the native LWC connectedCallback.                                          |
| applyPlacement()                | private | Void         | Applies the placement (positioning) of the step chart. Only applicable for Lightning. |
| renderedCallback()              | private | Void         | Overwrite of native LWC renderedCallback.                                             |
| render()                        | private | Template     | Overwrite of the native LWC render. Returns different templates depending on layout.  |
| calculateStepData(index)        | private | Object       | Calculates the relevant step data for the step chart.                                 |
| handleJsonData(index, jsonData) | private | Void         | Handles certain properties of the step chart that are reliant on the data JSON.       |
| calculateProgressBar(index)     | private | Void         | Calculates the progress bar value and sets the styling for the progress bar.          |

### HTML Markup

The Omniscript Step Chart templates support both lightning and newport themes. Lightning has a horizontal step chart (`position = top`) in addition to left and right positioned vertical step charts.

### Usage

Recommended usage of the OmniScript Step Chart is through component extension. Extend the `omniscriptStepChart`. OmniScript Step Chart also utilizes a child component called `omniscriptStepChartItems`. The Step Chart Items component will also need to be called inside the extended omniscriptStepChart component. If additional modification are needed to the Step Chart Items, it is recommended to extend the Step Chart Items component in order to leverage pre-existing functionality.

```html
<c-omniscript-step-chart
  json-def="{jsonDef}"
  json-data="{jsonDef.response}"
  if:false="{jsonDef.propSetMap.hideStepChart}"
  data-omni-key="omniscriptStepChart"
  props="{stepChartProps}"
  layout="{layout}"
>
</c-omniscript-step-chart>
```

### Attributes

**jsonDef** --- JSON definition of the OmniScript

**dataOmniKey** --- element unique identifier

**jsonData** --- the data JSON of the OmniScript

**props** --- Reactive public property. It is used to apply specific properties to the step chart that is passed from the Omniscript Header component. Refer to **Properties** section for additional information.

```json
Example ---
{
    "layout": "",
    "position": "",
}
```

**layout** --- `newport` or `lightning`
