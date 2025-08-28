# Action Lightning Web Component

The _Action Lightning Web Component_ is the base component for all action components.

## Available _c-sf-gps-ds-osrt-action_ Attributes

To navigate the page after fetching data from a datasource, use the following attributes.

| Attribute    | Value                        | Type    | Required | Description                                                                                          |
| ------------ | ---------------------------- | ------- | -------- | ---------------------------------------------------------------------------------------------------- |
| debug        | true, false (Default: false) | boolean |          | To enable debug mode, set to true. Prints fetched data inside template and updates JSON for testing. |
| definition   | JSON                         | object  | yes      | Contains required object. See **Available _definition_ Attributes**                                  |
| url          | URL                          | string  |          | Reads the interpolated url.                                                                          |
| disableCache | true, false (Default: false) | boolean |          | To turn off caching, set to true.                                                                    |

### Example _c-sf-gps-ds-osrt-action_ Component

```html
<c-sf-gps-ds-osrt-action
  onclick="{fetchData}"
  ondata="{onsuccesscallback}"
  onerror="{onerrorcallback}"
>
  <c-sf-gps-ds-osrt-button
    label="Fetch Contact"
    type="button"
    variant="neutral"
  ></c-sf-gps-ds-osrt-button>
  <c-sf-gps-ds-osrt-navigate-action
    target-type="{_targetType}"
    target-id="{_targetId}"
    target-name="{_targetName}"
    target-params="{_targetParams}"
    target-action="{_targetAction}"
    replace
  >
    <p>URL: {url}</p>
  </c-sf-gps-ds-osrt-navigate-action>
</c-sf-gps-ds-osrt-action>
```

```js

@track
  query = JSON.stringify({
    datasource: {
      type: "query",
      value: {
        query: "SELECT Id, name FROM Contact LIMIT 1"
      }
    },
    url: "/${data[0].Id}",
    target: "_blank",
    parameters: {},
    navigate: false
  });

fetchData(ev) {
    let action = ev.currentTarget;
    let def = JSON.parse(this.query);
    action.definition = this.query;
    action.triggerAction();
  }
// I'm passing these properties down to the navigate-action via
  // attributes.
  onsuccesscallback(ev) {
    let result = ev.detail.result;
    this._targetType = "Record";
    this._targetId = result[0].Id;

    // Because we're setting the attribute values via attributes,
    // we need to give the ui a chance to re-render.
    Promise.resolve().then(() => {
      let navigateAction = this.template.querySelector("c-sf-gps-ds-osrt-navigate-action");
      navigateAction.navigate();

      this.url = ev.target.url;
      this.onResult(
        result.map(obj => {
          var rObj = obj;
          rObj.isEdit = false;
          return rObj;
        })
      );
    });
  }

  onerrorcallback(error) {
    console.log(error);
  }

```

## Available _definition_ Attributes

| Attribute          | Value                          | Type    | Required | Description                                                                                                                                                                                                                                                                                       |
| ------------------ | ------------------------------ | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| datasource         | JSON                           | object  | yes      | Defines the source from which to fetch the data. See _Datasource Lightning Web Component_ for more information.                                                                                                                                                                                   |
| data               | JSON                           | object  |          | To use the data fetched from the datasource dierctly inside the definition, add data here.                                                                                                                                                                                                        |
| url                |                                | string  |          | Defines the navigation url, which is interpolated if type and value are passed. The _url_ is given higher preference over the _navigateTo_ object.                                                                                                                                                |
| navigateTo         | JSON                           | object  |          | Defines the navigation service object. If url is not present, this object is considered for navigation and is interpolated if type and value are passed. See [Salesforce documentation on navigation](https://developer.salesforce.com/docs/component-library/documentation/lwc/lwc.use_navigate) |
| navigate           | true or false (Default: false) | boolean |          | Specifies whether the url navigates or not.                                                                                                                                                                                                                                                       |
| parameters         | JSON                           | object  |          | Adds all fields as url parameters only if _url_ is set.                                                                                                                                                                                                                                           |
| target             | current window or new window   | string  |          | Specifies which window the url opens. Works only if the url is relative and is not salesforce object data.                                                                                                                                                                                        |
| isTrackingDisabled | true, false (Default: true)    | string  |          | To disable tracking, set to false                                                                                                                                                                                                                                                                 |
| trackingObj        |                                | string  |          | Specifies the tracking object of the container FlexCard.                                                                                                                                                                                                                                          |

### Example _definition_ JSON

#### Navigate to View Page by Navigation Object

```json
{
  "datasource": {
    "type": "query",
    "value": {
      "query": "SELECT Id, name FROM Contact LIMIT 1"
    }
  },
  "navigateTo": {
    "type": "standard__objectPage",
    "attributes": {
      "objectApiName": "${data[0].Id}",
      "actionName": "view"
    }
  },
  "navigate": true
}
```

#### Navigate to View Page by URL

```json
{
  "datasource": {
    "type": "query",
    "value": {
      "query": "SELECT Id, name FROM Contact LIMIT 1"
    }
  },
  "url": "/${data[0].Id}",
  "navigate": true
}
```

#### Navigation to Object with Direct Data

```json
{
  "data": {
    "Id": "001B000000qBQXDIA4"
  },
  "url": "/${data.Id}",
  "navigate": true
}
```

#### Navigate to Object Home Page

```json
{
  "navigateTo": {
    "type": "standard__objectPage",
    "attributes": {
      "objectApiName": "Account",
      "actionName": "home"
    }
  },
  "navigate": true
}
```

#### Navigate to Account Create New Screen

```json
{
  "navigateTo": {
    "type": "standard__objectPage",
    "attributes": {
      "objectApiName": "Account",
      "actionName": "new"
    }
  },
  "navigate": true
}
```

## Available _c-sf-gps-ds-osrt-action_ Attributes for Links

To perform an action by clicking on the link, use the following attributes.

| Attribute           | Value                                   | Type   | Required | Description                                                                                                                                  |
| ------------------- | --------------------------------------- | ------ | -------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| state-obj           | JSON                                    | object |          | Contains the layout/card records.                                                                                                            |
| state-action        | JSON                                    | object | yes      | Sets the action Info.                                                                                                                        |
| context-id          |                                         | string |          | Sets action context Id.                                                                                                                      |
| s-object-type       | sObject                                 | string |          | Sets action sObject type.                                                                                                                    |
| action-wrapperclass |                                         | string |          | Adds an extra class to the action wrapper element. To add multiple classes, use a space to separate each class, such as 'classone classtwo'. |
| action-labelclass   |                                         | string |          | Adds an extra class to the action label element.To add multiple classes, use a space to separate each class, such as 'classone classtwo'.    |
| icon-wrapperclass   |                                         | string |          | Adds an extra class to the icon wrapper element. To add multiple classes, use a space to separate each class, such as 'classone classtwo'.   |
| icon-extraclass     |                                         | string |          | Adds an extra class to the icon element. To add multiple classes, use a space to separate each class, such as 'classone classtwo'.           |
| icon-size           | xx-small, small, medium, large, x-large | string |          | Sets the size of the icon.                                                                                                                   |
| icon-color          |                                         | string |          | Sets the color of the icon.                                                                                                                  |
| styles              |                                         | string |          | To set inline styles of label and text-align property. it should be in this formt `style = { "label": "", "textAlign" : ""}`                 |
| theme               | slds, nds (Default: slds)               | string |          | Specifies which theme to use.                                                                                                                |
| icon-url            | URL                                     | string |          | Sets the icon URL. Use with Newport Design System (NDS) theme only.                                                                          |
| menu-item-data      | JSON                                    | object |          | Contains all the parameters that are passed from flexMenuItem to action.                                                                     |

### Example _c-sf-gps-ds-osrt-action_ Component (inside Vlocity Card state template)

```html
<c-sf-gps-ds-osrt-action
  icon-extraclass="slds-m-right_small"
  state-obj="{obj}"
  context-id="{contextId}"
  s-object-type="{sObjectType}"
  state-action="{item}"
  action-wrapperclass="slds-size--1-of-1"
  action-labelclass="slds-size--7-of-8"
  icon-wrapperclass="slds-size--1-of-8"
></c-sf-gps-ds-osrt-action>
```
