## ns/navigationUtils

This module exposes a collection of utilities designed to simplify navigational functions.

- [ns/navigationUtils](#markdown-header-nsnavigationutils)
  - _static_
    - [.PageReference](#markdown-header-nsnavigationutilspagereference)
      - [new exports.PageReference(type, attributes, [stateParams])](#markdown-header-new-exportspagereferencetype-attributes-stateparams)
      - [.unfreeze(pageReference, newParams)](#markdown-header-pagereferenceunfreezepagereference-newparams)
    - [.AppPageReference](#markdown-header-nsnavigationutilsapppagereference)
      - [new exports.AppPageReference(appTarget, pageReference)](#markdown-header-new-exportsapppagereferenceapptarget-pagereference)
    - [.ComponentPageReference](#markdown-header-nsnavigationutilscomponentpagereference)
      - [new exports.ComponentPageReference(name, [stateParams])](#markdown-header-new-exportscomponentpagereferencename-stateparams)
    - [.KnowledgeArticlePageReference](#markdown-header-nsnavigationutilsknowledgearticlepagereference)
      - [new exports.KnowledgeArticlePageReference(articleType, urlName)](#markdown-header-new-exportsknowledgearticlepagereferencearticletype-urlname)
    - [.LoginPageReference](#markdown-header-nsnavigationutilsloginpagereference)
      - [new exports.LoginPageReference(action, [stateParams])](#markdown-header-new-exportsloginpagereferenceaction-stateparams)
    - [.NamedPageReference](#markdown-header-nsnavigationutilsnamedpagereference)
      - [new exports.NamedPageReference(pageName, [stateParams])](#markdown-header-new-exportsnamedpagereferencepagename-stateparams)
    - [.CommNamedPageReference](#markdown-header-nsnavigationutilscommnamedpagereference)
      - [new exports.CommNamedPageReference(pageName, [stateParams])](#markdown-header-new-exportscommnamedpagereferencepagename-stateparams)
    - [.NavItemPageReference](#markdown-header-nsnavigationutilsnavitempagereference)
      - [new exports.NavItemPageReference(tabName, [stateParams])](#markdown-header-new-exportsnavitempagereferencetabname-stateparams)
    - [.ObjectPageReference](#markdown-header-nsnavigationutilsobjectpagereference)
      - [new exports.ObjectPageReference(objectName, [action], [filter])](#markdown-header-new-exportsobjectpagereferenceobjectname-action-filter)
    - [.RecordPageReference](#markdown-header-nsnavigationutilsrecordpagereference)
      - [new exports.RecordPageReference(id, [objectName], [action])](#markdown-header-new-exportsrecordpagereferenceid-objectname-action)
    - [.RelationshipPageReference](#markdown-header-nsnavigationutilsrelationshippagereference)
      - [new exports.RelationshipPageReference(recordId, [objectApiName], [relationshipApiName], [actionName])](#markdown-header-new-exportsrelationshippagereferencerecordid-objectapiname-relationshipapiname-actionname)
    - [.WebPageReference](#markdown-header-nsnavigationutilswebpagereference)
      - [new exports.WebPageReference(url, replace)](#markdown-header-new-exportswebpagereferenceurl-replace)
    - [.pageReferenceTypes](#markdown-header-nsnavigationutilspagereferencetypes-enum) : enum
    - [.parseParams(queryString)](#markdown-header-nsnavigationutilsparseparamsquerystring)
    - [.normalizeParams(namespacedParams)](#markdown-header-nsnavigationutilsnormalizeparamsnamespacedparams-object) ⇒ object
  - _inner_
    - [~APP](#markdown-header-nsnavigationutilsapp-app) : 'App'
    - [~COMPONENT](#markdown-header-nsnavigationutilscomponent-component) : 'Component'
    - [~KNOWLEDGE_ARTICLE](#markdown-header-nsnavigationutilsknowledge_article-knowledge-article) : 'Knowledge Article'
    - [~LOGIN](#markdown-header-nsnavigationutilslogin-login) : 'Login'
    - [~OBJECT](#markdown-header-nsnavigationutilsobject-object) : 'Object'
    - [~RECORD](#markdown-header-nsnavigationutilsrecord-record) : 'Record'
    - [~RELATIONSHIP](#markdown-header-nsnavigationutilsrelationship-record-relationship) : 'Record Relationship'
    - [~NAMED_PAGE](#markdown-header-nsnavigationutilsnamed_page-named-page) : 'Named Page'
    - [~COMM_NAMED_PAGE](#markdown-header-nsnavigationutilscomm_named_page-community-named-page) : 'Community Named Page'
    - [~NAVIGATION_ITEM](#markdown-header-nsnavigationutilsnavigation_item-navigation-item) : 'Navigation Item'
    - [~WEB_PAGE](#markdown-header-nsnavigationutilsweb_page-web-page) : 'Web Page'
    - [~CURRENT_PAGE](#markdown-header-nsnavigationutilscurrent_page-current-page) : 'Current Page'
    - [~parseValue(value)](#markdown-header-nsnavigationutilsparsevaluevalue-string) ⇒ string

### ns/navigationUtils.PageReference

**Kind**: static class of [ns/navigationUtils](#markdown-header-nsnavigationutils)

- [.PageReference](#markdown-header-nsnavigationutilspagereference)
  - [new exports.PageReference(type, attributes, [stateParams])](#markdown-header-new-exportspagereferencetype-attributes-stateparams)
  - [.unfreeze(pageReference, newParams)](#markdown-header-pagereferenceunfreezepagereference-newparams)

#### new exports.PageReference(type, attributes, [stateParams])

To navigate in Lightning Experience, Lightning Communities, or the Salesforce mobile app,
define a PageReference object. The PageReference type generates a unique URL format and
defines attributes that apply to all pages of that type.

| Param         | Type              | Description                                                                                           |
| ------------- | ----------------- | ----------------------------------------------------------------------------------------------------- |
| type          | PageReferenceType | Page reference type.                                                                                  |
| attributes    | Object            | Page reference attributes.                                                                            |
| [stateParams] | string ⎮ any      | State parameters passed to the target context. Can be in the form of a url query string or an object. |

#### PageReference.unfreeze(pageReference, newParams)

Utility method to unfreeze, and update PageReference object returned from @wire(CurrentPageReference) is frozen

**Kind**: static method of PageReference

| Param         | Type          | Description                                                                                                                      |
| ------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| pageReference | PageReference | A page reference object received from @wire(CurrentPageReference)                                                                |
| newParams     | string ⎮ any  | [stateParams] - State parameters to be extended on the current reference. Can be in the form of a url query string or an object. |

### ns/navigationUtils.AppPageReference

**Kind**: static class of [ns/navigationUtils](#markdown-header-nsnavigationutils)

#### new exports.AppPageReference(appTarget, pageReference)

A standard or custom app available from the App Launcher in an org. Use this type to create custom navigation
components that take users to a specific app or to a page within an app. Connected apps aren’t supported.

| Param         | Type          | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| appTarget     | string        | App that you are navigating to. Pass either the `appId` or `appDeveloperName` to the `appTarget`. - The `appId` is the DurableId field on the AppDefinition object. - To form the `appDeveloperName` value, concatenate the app’s namespace with the developer name. To find the app’s developer name, navigate to the App Manager in Setup and look in the Developer Name column. For standard apps, the namespace is `standard__`. For custom apps it’s `c__`. For managed packages, it’s the namespace registered for the package. |
| pageReference | PageReference | Identifies a specific location in the app you are navigating to. Pass in the `pageReference` and applicable attributes for that `pageReference` type.                                                                                                                                                                                                                                                                                                                                                                                 |

### ns/navigationUtils.ComponentPageReference

**Kind**: static class of [ns/navigationUtils](#markdown-header-nsnavigationutils)  
**Supports**: Lightning Experience, Salesforce Mobile App

#### new exports.ComponentPageReference(name, [stateParams])

A Lightning component. To make an addressable Lightning web component,
embed it in an Aura component that implements the `lightning:isUrlAddressable` interface.

| Param         | Type            | Description                                                                                           |
| ------------- | --------------- | ----------------------------------------------------------------------------------------------------- |
| name          | string          | The Lightning component name in the format namespace\_\_componentName                                 |
| [stateParams] | string ⎮ Object | State parameters passed to the target context. Can be in the form of a url query string or an object. |

### ns/navigationUtils.KnowledgeArticlePageReference

**Kind**: static class of [ns/navigationUtils](#markdown-header-nsnavigationutils)

#### new exports.KnowledgeArticlePageReference(articleType, urlName)

A page that interacts with a Knowledge Article record.

| Param       | Type   | Description                                                                                                    |
| ----------- | ------ | -------------------------------------------------------------------------------------------------------------- |
| articleType | string | The articleType API name of the Knowledge Article record. In Communities, articleType is ignored.              |
| urlName     | string | The value of the urlName field on the target KnowledgeArticleVersion record. The urlName is the article's URL. |

### ns/navigationUtils.LoginPageReference

**Kind**: static class of [ns/navigationUtils](#markdown-header-nsnavigationutils)

#### new exports.LoginPageReference(action, [stateParams])

A page for authentication into a community.

| Param         | Type               | Description                                                                                           |
| ------------- | ------------------ | ----------------------------------------------------------------------------------------------------- |
| action        | 'login' ⎮ 'logout' | A login-related action to be performed. Possible values are: 'login' or 'logout'.                     |
| [stateParams] | string ⎮ Object    | State parameters passed to the target context. Can be in the form of a url query string or an object. |

### ns/navigationUtils.NamedPageReference

**Kind**: static class of [ns/navigationUtils](#markdown-header-nsnavigationutils)

#### new exports.NamedPageReference(pageName, [stateParams])

A standard page with a unique name. If an error occurs, the error view loads and the URL isn’t updated.

| Param         | Type         | Description                                                                                           |
| ------------- | ------------ | ----------------------------------------------------------------------------------------------------- |
| pageName      | string       | The unique name of the page.                                                                          |
| [stateParams] | string ⎮ any | State parameters passed to the target context. Can be in the form of a url query string or an object. |

### ns/navigationUtils.CommNamedPageReference

**Kind**: static class of [ns/navigationUtils](#markdown-header-nsnavigationutils)

#### new exports.CommNamedPageReference(pageName, [stateParams])

A standard page with a unique name, for use in communities. If an error occurs, the error view loads and the URL isn’t updated.

| Param         | Type         | Description                                                                                           |
| ------------- | ------------ | ----------------------------------------------------------------------------------------------------- |
| pageName      | string       | The unique name of the page.                                                                          |
| [stateParams] | string ⎮ any | State parameters passed to the target context. Can be in the form of a url query string or an object. |

### ns/navigationUtils.NavItemPageReference

**Kind**: static class of [ns/navigationUtils](#markdown-header-nsnavigationutils)

#### new exports.NavItemPageReference(tabName, [stateParams])

A page that displays the content mapped to a CustomTab. Visualforce tabs, Web tabs, Lightning Pages, and Lightning Component tabs are supported.

| Param         | Type         | Description                                                                                           |
| ------------- | ------------ | ----------------------------------------------------------------------------------------------------- |
| tabName       | string       | The unique name of the CustomTab.                                                                     |
| [stateParams] | string ⎮ any | State parameters passed to the target context. Can be in the form of a url query string or an object. |

### ns/navigationUtils.ObjectPageReference

**Kind**: static class of [ns/navigationUtils](#markdown-header-nsnavigationutils)

#### new exports.ObjectPageReference(objectName, [action], [filter])

A page that interacts with a standard or custom object in the org and supports standard actions for that object.

| Param      | Type   | Default    | Description                                                                                                                                |
| ---------- | ------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| objectName | string |            | The API name of the standard or custom object. For custom objects that are part of a managed package, prefix the custom object with ns\_\_ |
| [action]   | string | `"home"`   | The action name to invoke. Valid values include `home`, `list`, and `new`. In Communities, `list` and `home` are the same.                 |
| [filter]   | string | `"Recent"` | Id of the object page. Default is Recent.                                                                                                  |

### ns/navigationUtils.RecordPageReference

**Kind**: static class of [ns/navigationUtils](#markdown-header-nsnavigationutils)

#### new exports.RecordPageReference(id, [objectName], [action])

A page that interacts with a relationship on a particular record in the org. Only related lists are supported.

| Param        | Type   | Default  | Description                                                                                                                            |
| ------------ | ------ | -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| id           | string |          | The 18 character record ID.                                                                                                            |
| [objectName] | string |          | The API name of the record’s object. Optional for lookups.                                                                             |
| [action]     | string | `"view"` | The action name to invoke. Valid values include `clone`, `edit`, and `view`. Communities doesn’t support the values `clone` or `edit`. |

### ns/navigationUtils.RelationshipPageReference

**Kind**: static class of [ns/navigationUtils](#markdown-header-nsnavigationutils)

#### new exports.RelationshipPageReference(recordId, [objectApiName], [relationshipApiName], [actionName])

A page that interacts with a relationship on a particular record in the org. Only related lists are supported.

| Param                 | Type   | Default  | Description                                                                     |
| --------------------- | ------ | -------- | ------------------------------------------------------------------------------- |
| recordId              | string |          | The 18 character record ID of the record that defines the relationship.         |
| [objectApiName]       | string |          | The API name of the object that defines the relationship. Optional for lookups. |
| [relationshipApiName] | string |          | The API name of the object’s relationship field.                                |
| [actionName]          | string | `"view"` | The action name to invoke. Only view is supported.                              |

### ns/navigationUtils.WebPageReference

**Kind**: static class of [ns/navigationUtils](#markdown-header-nsnavigationutils)

#### new exports.WebPageReference(url, replace)

An external URL.

| Param   | Type    | Description                                                                                                                                                                                      |
| ------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| url     | string  | The URL of the page you are navigating to.                                                                                                                                                       |
| replace | Boolean | replace the current page with this URL in your browser’s session history, set `replace` to `true`. The current page is not saved in session history, meaning the user can’t navigate back to it. |

### ns/navigationUtils.pageReferenceTypes : enum

**Kind**: static enum of [ns/navigationUtils](#markdown-header-nsnavigationutils)  
**Read only**: true

### ns/navigationUtils.parseParams(queryString)

Expands query params to an object

**Kind**: static method of [ns/navigationUtils](#markdown-header-nsnavigationutils)

| Param       | Type   | Description                    |
| ----------- | ------ | ------------------------------ |
| queryString | string | key=value pairs separated by & |

### ns/navigationUtils.normalizeParams(namespacedParams) ⇒ object

Returns a copy of a params object with the namespace values removed. Duplicate values will be overwritten.

**Kind**: static method of [ns/navigationUtils](#markdown-header-nsnavigationutils)

| Param            | Type   | Description                                              |
| ---------------- | ------ | -------------------------------------------------------- |
| namespacedParams | object | A collection of params derived from pageReference.state. |

### ns/navigationUtils~APP : 'App'

**Kind**: inner constant of [ns/navigationUtils](#markdown-header-nsnavigationutils)

### ns/navigationUtils~COMPONENT : 'Component'

**Kind**: inner constant of [ns/navigationUtils](#markdown-header-nsnavigationutils)

### ns/navigationUtils~KNOWLEDGE_ARTICLE : 'Knowledge Article'

**Kind**: inner constant of [ns/navigationUtils](#markdown-header-nsnavigationutils)

### ns/navigationUtils~LOGIN : 'Login'

**Kind**: inner constant of [ns/navigationUtils](#markdown-header-nsnavigationutils)

### ns/navigationUtils~OBJECT : 'Object'

**Kind**: inner constant of [ns/navigationUtils](#markdown-header-nsnavigationutils)

### ns/navigationUtils~RECORD : 'Record'

**Kind**: inner constant of [ns/navigationUtils](#markdown-header-nsnavigationutils)

### ns/navigationUtils~RELATIONSHIP : 'Record Relationship'

**Kind**: inner constant of [ns/navigationUtils](#markdown-header-nsnavigationutils)

### ns/navigationUtils~NAMED_PAGE : 'Named Page'

**Kind**: inner constant of [ns/navigationUtils](#markdown-header-nsnavigationutils)

### ns/navigationUtils~COMM_NAMED_PAGE : 'Community Named Page'

**Kind**: inner constant of [ns/navigationUtils](#markdown-header-nsnavigationutils)

### ns/navigationUtils~NAVIGATION_ITEM : 'Navigation Item'

**Kind**: inner constant of [ns/navigationUtils](#markdown-header-nsnavigationutils)

### ns/navigationUtils~WEB_PAGE : 'Web Page'

**Kind**: inner constant of [ns/navigationUtils](#markdown-header-nsnavigationutils)

### ns/navigationUtils~CURRENT_PAGE : 'Current Page'

**Kind**: inner constant of [ns/navigationUtils](#markdown-header-nsnavigationutils)

### ns/navigationUtils~parseValue(value) ⇒ string

Parse the value of a url parameter.

**Kind**: inner method of [ns/navigationUtils](#markdown-header-nsnavigationutils)  
**Scope**: private

| Param | Type   |
| ----- | ------ |
| value | string |
