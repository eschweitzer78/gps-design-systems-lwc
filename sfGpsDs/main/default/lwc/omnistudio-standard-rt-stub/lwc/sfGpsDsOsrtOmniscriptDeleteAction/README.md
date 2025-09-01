## ns/omniscriptDeleteAction

This component is used to perform Delete Action in omniscript.

- [ns/omniscriptDeleteAction](#markdown-header-nsomniscriptdeleteaction)
  - [module.exports](#markdown-header-moduleexports-omniscriptbaseaction) ⇐ OmniscriptBaseAction ⏏
    - [.connectedCallback()](#markdown-header-omniscriptdeleteactionconnectedcallback-void) ⇒ Void
    - [.execute()](#markdown-header-omniscriptdeleteactionexecute)

### module.exports ⇐ OmniscriptBaseAction ⏏

Default exported class OmniscriptDeleteAction.

**Kind**: Exported class  
**Extends**: OmniscriptBaseAction

#### omniscriptDeleteAction.connectedCallback() ⇒ Void

Overwrites inherited connectedCallback. Instantiates specific action utility class from action
framework.

**Kind**: instance method of module.exports  
**Scope**: private

#### omniscriptDeleteAction.execute()

Processes the logic for executing an action. This method is called from onclick attribute in
component's HTML markup and in Header component.

**Kind**: instance method of module.exports  
**Scope**: public
