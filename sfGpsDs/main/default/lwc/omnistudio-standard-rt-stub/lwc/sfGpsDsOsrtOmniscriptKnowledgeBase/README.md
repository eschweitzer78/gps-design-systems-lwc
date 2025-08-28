## ns/omniscriptKnowledgeBase

- [ns/omniscriptKnowledgeBase](#markdown-header-nsomniscriptknowledgebase)
  - [.layout](#markdown-header-nsomniscriptknowledgebaselayout-string) : String
  - [.runMode](#markdown-header-nsomniscriptknowledgebaserunmode-string) : String
  - [.knowledgeOptions](#markdown-header-nsomniscriptknowledgebaseknowledgeoptions-object) : Object
  - [.inputSearchKeyword](#markdown-header-nsomniscriptknowledgebaseinputsearchkeyword-string) : String
  - [.kbLabel](#markdown-header-nsomniscriptknowledgebasekblabel-string) : String
  - [.articlesResults](#markdown-header-nsomniscriptknowledgebasearticlesresults-arrayobject) : Array.<Object>
  - [.articleBodyResults](#markdown-header-nsomniscriptknowledgebasearticlebodyresults-object) : Object
  - [.canShowKbOnStep](#markdown-header-nsomniscriptknowledgebasecanshowkbonstep-boolean) : Boolean
  - [.isToggled](#markdown-header-nsomniscriptknowledgebaseistoggled-boolean) : Boolean
  - [.\_kbModal](#markdown-header-nsomniscriptknowledgebase_kbmodal-boolean) : Boolean
  - [.\_article](#markdown-header-nsomniscriptknowledgebase_article-object) : Object
  - [.\_modalContainerClass](#markdown-header-nsomniscriptknowledgebase_modalcontainerclass-string) : String
  - [.\_footerClasses](#markdown-header-nsomniscriptknowledgebase_footerclasses-string) : String
  - [.\_isOpenOmniScript](#markdown-header-nsomniscriptknowledgebase_isopenomniscript-boolean) : Boolean
  - [.\_isConfiguredOnOmniScript](#markdown-header-nsomniscriptknowledgebase_isconfiguredonomniscript-boolean) : Boolean
  - [.displayLabel](#markdown-header-nsomniscriptknowledgebasedisplaylabel-string) : String
  - [.\_omniNewportClass](#markdown-header-nsomniscriptknowledgebase_omninewportclass-string) : String
  - [.\_isStepChartTop](#markdown-header-nsomniscriptknowledgebase_isstepcharttop-boolean) : Boolean
  - [.\_themeKB](#markdown-header-nsomniscriptknowledgebase_themekb-string) : String
  - [.omniKey](#markdown-header-nsomniscriptknowledgebaseomnikey-string) : String
  - [.omniscriptKey](#markdown-header-nsomniscriptknowledgebaseomniscriptkey-string) : String
  - [.renderTemplate](#markdown-header-nsomniscriptknowledgebaserendertemplate-boolean) : Boolean
  - [.\_actionUtilClass](#markdown-header-nsomniscriptknowledgebase_actionutilclass-omniscriptactioncommonutil) : OmniscriptActionCommonUtil
  - [.\_debugLabel](#markdown-header-nsomniscriptknowledgebase_debuglabel-string) : String
  - [.\_articleParams](#markdown-header-nsomniscriptknowledgebase_articleparams-object) : Object
  - [.\_knowledgeBaseOptions](#markdown-header-nsomniscriptknowledgebase_knowledgebaseoptions-object) : Object
  - [.\_openInOmniEnable](#markdown-header-nsomniscriptknowledgebase_openinomnienable-boolean) : Boolean
  - [.\_customLabelsUtil](#markdown-header-nsomniscriptknowledgebase_customlabelsutil-object) : Object
  - [.classToggleWidth](#markdown-header-nsomniscriptknowledgebaseclasstogglewidth-string) ⇒ String
  - [.connectedCallback()](#markdown-header-nsomniscriptknowledgebaseconnectedcallback-void) ⇒ Void
  - [.handleKnowledgeOptions(data)](#markdown-header-nsomniscriptknowledgebasehandleknowledgeoptionsdata-void) ⇒ Void
  - [.searchKnowledgeArticle(event)](#markdown-header-nsomniscriptknowledgebasesearchknowledgearticleevent-void) ⇒ Void
  - [.kbInvokeAction(params)](#markdown-header-nsomniscriptknowledgebasekbinvokeactionparams-promise) ⇒ Promise
  - [.render()](#markdown-header-nsomniscriptknowledgebaserender-template) ⇒ Template
  - [.toggleKb(evt, isToggled)](#markdown-header-nsomniscriptknowledgebasetogglekbevt-istoggled-void) ⇒ Void
  - [.openModal(evt)](#markdown-header-nsomniscriptknowledgebaseopenmodalevt-void) ⇒ Void
  - [.closeModal()](#markdown-header-nsomniscriptknowledgebaseclosemodal-void) ⇒ Void
  - [.openInOmniscript(evt)](#markdown-header-nsomniscriptknowledgebaseopeninomniscriptevt-void) ⇒ Void
  - [.getArticleBody()](#markdown-header-nsomniscriptknowledgebasegetarticlebody-void) ⇒ Void
  - [.handleKbArticleOptions(data)](#markdown-header-nsomniscriptknowledgebasehandlekbarticleoptionsdata-void) ⇒ Void
  - [.kbArticleInvokeAction(params)](#markdown-header-nsomniscriptknowledgebasekbarticleinvokeactionparams-promise) ⇒ Promise
  - [.redirectToArticleUrl(evt)](#markdown-header-nsomniscriptknowledgebaseredirecttoarticleurlevt-void) ⇒ Void
  - [.sendDataToDebugConsole(params, resp, label)](#markdown-header-nsomniscriptknowledgebasesenddatatodebugconsoleparams-resp-label-void) ⇒ Void

### ns/omniscriptKnowledgeBase.layout : String

Stores theme layout.

**Kind**: instance property of [ns/omniscriptKnowledgeBase](#markdown-header-nsomniscriptknowledgebase)  
**Scope**: public (api)

### ns/omniscriptKnowledgeBase.runMode : String

Flag to determine where component is run.

**Kind**: instance property of [ns/omniscriptKnowledgeBase](#markdown-header-nsomniscriptknowledgebase)  
**Scope**: public (api)

### ns/omniscriptKnowledgeBase.knowledgeOptions : Object

Contains detailed options which used to make remote call and setting up label of KB.

**Kind**: instance property of [ns/omniscriptKnowledgeBase](#markdown-header-nsomniscriptknowledgebase)  
**Scope**: public (api)

### ns/omniscriptKnowledgeBase.inputSearchKeyword : String

Set user input value for getting related articles of KB.

**Kind**: instance property of [ns/omniscriptKnowledgeBase](#markdown-header-nsomniscriptknowledgebase)  
**Scope**: private (track)

### ns/omniscriptKnowledgeBase.kbLabel : String

Set KB Label of KB.

**Kind**: instance property of [ns/omniscriptKnowledgeBase](#markdown-header-nsomniscriptknowledgebase)  
**Scope**: public

### ns/omniscriptKnowledgeBase.articlesResults : Array.<Object>

Holding set of articles based on specific user keyword.

**Kind**: instance property of [ns/omniscriptKnowledgeBase](#markdown-header-nsomniscriptknowledgebase)  
**Scope**: private (track)

### ns/omniscriptKnowledgeBase.articleBodyResults : Object

Contains details of an article ie: article body, title and link.

**Kind**: instance property of [ns/omniscriptKnowledgeBase](#markdown-header-nsomniscriptknowledgebase)  
**Scope**: private (track)

### ns/omniscriptKnowledgeBase.canShowKbOnStep : Boolean

Setting up true/false: whether can show on step or not.

**Kind**: instance property of [ns/omniscriptKnowledgeBase](#markdown-header-nsomniscriptknowledgebase)  
**Scope**: private (track)

### ns/omniscriptKnowledgeBase.isToggled : Boolean

Toggled KB container for Newport(hide/show container based on user convenience), Default is always
false.

**Kind**: instance property of [ns/omniscriptKnowledgeBase](#markdown-header-nsomniscriptknowledgebase)  
**Scope**: private (track)

### ns/omniscriptKnowledgeBase.\_kbModal : Boolean

Open Modal of an article via template(hide/show modal using this property), Default is always false.

**Kind**: instance property of [ns/omniscriptKnowledgeBase](#markdown-header-nsomniscriptknowledgebase)  
**Scope**: private (track)

### ns/omniscriptKnowledgeBase.\_article : Object

Contains an article details.

**Kind**: instance property of [ns/omniscriptKnowledgeBase](#markdown-header-nsomniscriptknowledgebase)  
**Scope**: private (track)

### ns/omniscriptKnowledgeBase.\_modalContainerClass : String

- Setting up class for modal container.

**Kind**: instance property of [ns/omniscriptKnowledgeBase](#markdown-header-nsomniscriptknowledgebase)  
**Scope**: private

### ns/omniscriptKnowledgeBase.\_footerClasses : String

- Setting up class for footer of modal.

**Kind**: instance property of [ns/omniscriptKnowledgeBase](#markdown-header-nsomniscriptknowledgebase)  
**Scope**: private

### ns/omniscriptKnowledgeBase.\_isOpenOmniScript : Boolean

- setting up true if article detailed view should open inside Omniscript.

**Kind**: instance property of [ns/omniscriptKnowledgeBase](#markdown-header-nsomniscriptknowledgebase)  
**Scope**: private

### ns/omniscriptKnowledgeBase.\_isConfiguredOnOmniScript : Boolean

- setting up true if article detailed view should open inside Omniscript.

**Kind**: instance property of [ns/omniscriptKnowledgeBase](#markdown-header-nsomniscriptknowledgebase)  
**Scope**: private

### ns/omniscriptKnowledgeBase.displayLabel : String

Setting KB Label from options of KB if doesn't exist.

**Kind**: instance property of [ns/omniscriptKnowledgeBase](#markdown-header-nsomniscriptknowledgebase)  
**Scope**: private (track)

### ns/omniscriptKnowledgeBase.\_omniNewportClass : String

Setting newport root block class: 'via-nds' if configured on omniscript.

**Kind**: instance property of [ns/omniscriptKnowledgeBase](#markdown-header-nsomniscriptknowledgebase)  
**Scope**: private (track)

### ns/omniscriptKnowledgeBase.\_isStepChartTop : Boolean

- setting up true if stepchart placement is on top.

**Kind**: instance property of [ns/omniscriptKnowledgeBase](#markdown-header-nsomniscriptknowledgebase)  
**Scope**: private

### ns/omniscriptKnowledgeBase.\_themeKB : String

- Setting up theme.

**Kind**: instance property of [ns/omniscriptKnowledgeBase](#markdown-header-nsomniscriptknowledgebase)  
**Scope**: private

### ns/omniscriptKnowledgeBase.omniKey : String

- Setting up omniscript key.

**Kind**: instance property of [ns/omniscriptKnowledgeBase](#markdown-header-nsomniscriptknowledgebase)  
**Scope**: private

### ns/omniscriptKnowledgeBase.omniscriptKey : String

Setting up OmniScript key.

**Kind**: instance property of [ns/omniscriptKnowledgeBase](#markdown-header-nsomniscriptknowledgebase)  
**Scope**: public (api)

### ns/omniscriptKnowledgeBase.renderTemplate : Boolean

Checks whether template needs to render or not.

**Kind**: instance property of [ns/omniscriptKnowledgeBase](#markdown-header-nsomniscriptknowledgebase)  
**Scope**: private (track)

### ns/omniscriptKnowledgeBase.\_actionUtilClass : OmniscriptActionCommonUtil

- stores instance of the OmniscriptActionCommonUtil class.

**Kind**: instance property of [ns/omniscriptKnowledgeBase](#markdown-header-nsomniscriptknowledgebase)  
**Scope**: private

### ns/omniscriptKnowledgeBase.\_debugLabel : String

- Stores debug label.

**Kind**: instance property of [ns/omniscriptKnowledgeBase](#markdown-header-nsomniscriptknowledgebase)  
**Scope**: private

### ns/omniscriptKnowledgeBase.\_articleParams : Object

- contains an article params.

**Kind**: instance property of [ns/omniscriptKnowledgeBase](#markdown-header-nsomniscriptknowledgebase)  
**Scope**: private

### ns/omniscriptKnowledgeBase.\_knowledgeBaseOptions : Object

- contains an knowledgeBase options.

**Kind**: instance property of [ns/omniscriptKnowledgeBase](#markdown-header-nsomniscriptknowledgebase)  
**Scope**: private

### ns/omniscriptKnowledgeBase.\_openInOmniEnable : Boolean

- checking whether its enabled inside omniscript or not.

**Kind**: instance property of [ns/omniscriptKnowledgeBase](#markdown-header-nsomniscriptknowledgebase)  
**Scope**: private

### ns/omniscriptKnowledgeBase.\_customLabelsUtil : Object

- Custom labels for Knowledge base.

**Kind**: instance property of [ns/omniscriptKnowledgeBase](#markdown-header-nsomniscriptknowledgebase)  
**Scope**: private

### ns/omniscriptKnowledgeBase.classToggleWidth ⇒ String

Toggles class for newport

**Kind**: instance property of [ns/omniscriptKnowledgeBase](#markdown-header-nsomniscriptknowledgebase)  
**Returns**: String - - Will return classes  
**Scope**: private

| Param  | Type   | Description                                     |
| ------ | ------ | ----------------------------------------------- |
| params | Object | an object having options to make a remote call. |

### ns/omniscriptKnowledgeBase.connectedCallback() ⇒ Void

Overwrites native connectedCallback.

**Kind**: instance method of [ns/omniscriptKnowledgeBase](#markdown-header-nsomniscriptknowledgebase)  
**Scope**: private

### ns/omniscriptKnowledgeBase.handleKnowledgeOptions(data) ⇒ Void

handleKnowledgeOptions - for setting up KB Label, kbOptions, inputsearchkeyword, articles and making remote call based on options

**Kind**: instance method of [ns/omniscriptKnowledgeBase](#markdown-header-nsomniscriptknowledgebase)  
**Scope**: private

| Param | Type   | Description                                     |
| ----- | ------ | ----------------------------------------------- |
| data  | Object | an object having options to make a remote call. |

### ns/omniscriptKnowledgeBase.searchKnowledgeArticle(event) ⇒ Void

Gets updated articles based on input keyword via template.

**Kind**: instance method of [ns/omniscriptKnowledgeBase](#markdown-header-nsomniscriptknowledgebase)  
**Scope**: private

| Param              | Type   | Description                              |
| ------------------ | ------ | ---------------------------------------- |
| event              | Event  |                                          |
| event.target.value | Object | getting user input value                 |
| event.keyCode      | Object | getting input value when user hits enter |

### ns/omniscriptKnowledgeBase.kbInvokeAction(params) ⇒ Promise

Makes remote call based on options

**Kind**: instance method of [ns/omniscriptKnowledgeBase](#markdown-header-nsomniscriptknowledgebase)  
**Scope**: private

| Param  | Type   | Description                                     |
| ------ | ------ | ----------------------------------------------- |
| params | Object | an object having options to make a remote call. |

### ns/omniscriptKnowledgeBase.render() ⇒ Template

Overwrites native render.

**Kind**: instance method of [ns/omniscriptKnowledgeBase](#markdown-header-nsomniscriptknowledgebase)  
**Scope**: private

### ns/omniscriptKnowledgeBase.toggleKb(evt, isToggled) ⇒ Void

Toggles kb container for newport via template.

**Kind**: instance method of [ns/omniscriptKnowledgeBase](#markdown-header-nsomniscriptknowledgebase)  
**Scope**: private

| Param     | Type    | Description                     |
| --------- | ------- | ------------------------------- |
| evt       | Event   |                                 |
| isToggled | Boolean | true/false open/close container |

### ns/omniscriptKnowledgeBase.openModal(evt) ⇒ Void

Opens modal for an article detail view via template

**Kind**: instance method of [ns/omniscriptKnowledgeBase](#markdown-header-nsomniscriptknowledgebase)  
**Scope**: private

| Param | Type  |
| ----- | ----- |
| evt   | Event |

### ns/omniscriptKnowledgeBase.closeModal() ⇒ Void

Closes the modal of an opened article detail view via template.

**Kind**: instance method of [ns/omniscriptKnowledgeBase](#markdown-header-nsomniscriptknowledgebase)  
**Scope**: private

### ns/omniscriptKnowledgeBase.openInOmniscript(evt) ⇒ Void

Opens an article detail view inside omniscript via template

**Kind**: instance method of [ns/omniscriptKnowledgeBase](#markdown-header-nsomniscriptknowledgebase)  
**Scope**: private

| Param | Type  |
| ----- | ----- |
| evt   | Event |

### ns/omniscriptKnowledgeBase.getArticleBody() ⇒ Void

Gets detailed info object of an article.

**Kind**: instance method of [ns/omniscriptKnowledgeBase](#markdown-header-nsomniscriptknowledgebase)  
**Scope**: private

### ns/omniscriptKnowledgeBase.handleKbArticleOptions(data) ⇒ Void

Callback function of pubsub event for getting article body options

**Kind**: instance method of [ns/omniscriptKnowledgeBase](#markdown-header-nsomniscriptknowledgebase)  
**Scope**: private

| Param | Type   | Description                                                    |
| ----- | ------ | -------------------------------------------------------------- |
| data  | Object | an object having options to make a remote call for an article. |

### ns/omniscriptKnowledgeBase.kbArticleInvokeAction(params) ⇒ Promise

Makes remote call based on article options

**Kind**: instance method of [ns/omniscriptKnowledgeBase](#markdown-header-nsomniscriptknowledgebase)  
**Scope**: private

| Param  | Type   | Description                                     |
| ------ | ------ | ----------------------------------------------- |
| params | Object | an object having options to make a remote call. |

### ns/omniscriptKnowledgeBase.redirectToArticleUrl(evt) ⇒ Void

For redirecting article on new tab with detailed view via template

**Kind**: instance method of [ns/omniscriptKnowledgeBase](#markdown-header-nsomniscriptknowledgebase)  
**Scope**: private

| Param | Type  |
| ----- | ----- |
| evt   | Event |

### ns/omniscriptKnowledgeBase.sendDataToDebugConsole(params, resp, label) ⇒ Void

Overwrites inherited sendDataToDebugConsole. Sends data to the Debug Console event handler.

**Kind**: instance method of [ns/omniscriptKnowledgeBase](#markdown-header-nsomniscriptknowledgebase)  
**Scope**: private

| Param  | Type   |
| ------ | ------ |
| params | Object |
| resp   | Object |
| label  | String |
