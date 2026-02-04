## ns/omniscriptBlock ⇐ OmniscriptGroupElement

**Extends**: OmniscriptGroupElement

- [ns/omniscriptBlock](#markdown-header-nsomniscriptblock-omniscriptgroupelement) ⇐ OmniscriptGroupElement
  - [.expandContent](#markdown-header-omniscriptblockexpandcontent-boolean) : Boolean
  - [.blockClasses](#markdown-header-omniscriptblockblockclasses-string) : String
  - [.activeSections](#markdown-header-omniscriptblockactivesections-string) : String
  - [.sldsBlockClasses](#markdown-header-omniscriptblocksldsblockclasses-string) : String
  - [.showErrorMessage](#markdown-header-omniscriptblockshowerrormessage-boolean) : Boolean
  - [.blockLabel](#markdown-header-omniscriptblockblocklabel-string) : String
  - [.toggleContent()](#markdown-header-omniscriptblocktogglecontent-void) ⇒ Void
  - [.initCompVariables()](#markdown-header-omniscriptblockinitcompvariables-void) ⇒ Void
  - [.updateBlockClasses()](#markdown-header-omniscriptblockupdateblockclasses-void) ⇒ Void
  - [.render()](#markdown-header-omniscriptblockrender-template) ⇒ Template

### omniscriptBlock.expandContent : Boolean

Flag that identifies if the block is expanded.

**Kind**: instance property of [ns/omniscriptBlock](#markdown-header-nsomniscriptblock-omniscriptgroupelement)  
**Scope**: private (track)

### omniscriptBlock.blockClasses : String

Classes applied to the block.

**Kind**: instance property of [ns/omniscriptBlock](#markdown-header-nsomniscriptblock-omniscriptgroupelement)  
**Scope**: private (track)

### omniscriptBlock.activeSections : String

Indicates active block.

**Kind**: instance property of [ns/omniscriptBlock](#markdown-header-nsomniscriptblock-omniscriptgroupelement)  
**Scope**: private (track)

### omniscriptBlock.sldsBlockClasses : String

Lightning classes applied to the block.

**Kind**: instance property of [ns/omniscriptBlock](#markdown-header-nsomniscriptblock-omniscriptgroupelement)  
**Scope**: private (track)

### omniscriptBlock.showErrorMessage : Boolean

Flag to show error message.

**Kind**: instance property of [ns/omniscriptBlock](#markdown-header-nsomniscriptblock-omniscriptgroupelement)  
**Scope**: private

### omniscriptBlock.blockLabel : String

Gets block label.

**Kind**: instance property of [ns/omniscriptBlock](#markdown-header-nsomniscriptblock-omniscriptgroupelement)  
**Scope**: private

### omniscriptBlock.toggleContent() ⇒ Void

Handles when block is toggled.

**Kind**: instance method of [ns/omniscriptBlock](#markdown-header-nsomniscriptblock-omniscriptgroupelement)  
**Scope**: private

### omniscriptBlock.initCompVariables() ⇒ Void

Overwrites inherited initCompVariables.

**Kind**: instance method of [ns/omniscriptBlock](#markdown-header-nsomniscriptblock-omniscriptgroupelement)  
**Scope**: private

### omniscriptBlock.updateBlockClasses() ⇒ Void

Updates block classes.

**Kind**: instance method of [ns/omniscriptBlock](#markdown-header-nsomniscriptblock-omniscriptgroupelement)  
**Scope**: private

### omniscriptBlock.render() ⇒ Template

Overwrites native render.

**Kind**: instance method of [ns/omniscriptBlock](#markdown-header-nsomniscriptblock-omniscriptgroupelement)  
**Scope**: private
