## ns/omniscriptEditBlock

- [ns/omniscriptEditBlock](#markdown-header-nsomniscripteditblock)
  - [.mode](#markdown-header-nsomniscripteditblockmode-string) : String
  - [.\_isEditing](#markdown-header-nsomniscripteditblock_isediting-boolean) : Boolean
  - [.\_bShowActionMenu](#markdown-header-nsomniscripteditblock_bshowactionmenu-boolean) : Boolean
  - [.\_showCheckbox](#markdown-header-nsomniscripteditblock_showcheckbox-boolean) : Boolean
  - [.\_maxDisplayCount](#markdown-header-nsomniscripteditblock_maxdisplaycount-number) : Number
  - [.canRemove](#markdown-header-nsomniscripteditblockcanremove-boolean) ⇒ Boolean
  - [.isEditing](#markdown-header-nsomniscripteditblockisediting-boolean) ⇒ Boolean
  - [.isEditing](#markdown-header-nsomniscripteditblockisediting-void) ⇒ void
  - [.sumElement](#markdown-header-nsomniscripteditblocksumelement-string) ⇒ String
  - [.canRepeat](#markdown-header-nsomniscripteditblockcanrepeat-boolean) ⇒ Boolean
  - [.showAdd](#markdown-header-nsomniscripteditblockshowadd-boolean) ⇒ Boolean
  - [.isInvalid](#markdown-header-nsomniscripteditblockisinvalid-boolean) ⇒ Boolean
  - [.svgMapIcon](#markdown-header-nsomniscripteditblocksvgmapicon-string) ⇒ String
  - [.visualClass](#markdown-header-nsomniscripteditblockvisualclass-string) ⇒ String
  - [.editClass](#markdown-header-nsomniscripteditblockeditclass-string) ⇒ String
  - [.handleAdd(evt, seed)](#markdown-header-nsomniscripteditblockhandleaddevt-seed-void) ⇒ void
  - [.handleRemoveDom()](#markdown-header-nsomniscripteditblockhandleremovedom-void) ⇒ void
  - [.handleRemove()](#markdown-header-nsomniscripteditblockhandleremove-void) ⇒ void
  - [.handleKeyboardAdd(evt, seed)](#markdown-header-nsomniscripteditblockhandlekeyboardaddevt-seed-void) ⇒ void
  - [.handleKeyboardRemove(evt)](#markdown-header-nsomniscripteditblockhandlekeyboardremoveevt-void) ⇒ void
  - [.handleKeyboardEdit(evt)](#markdown-header-nsomniscripteditblockhandlekeyboardeditevt-void) ⇒ void
  - [.handleKeyboardSave(evt)](#markdown-header-nsomniscripteditblockhandlekeyboardsaveevt-void) ⇒ void
  - [.handleKeyboardCancel(evt)](#markdown-header-nsomniscripteditblockhandlekeyboardcancelevt-void) ⇒ void
  - [.handleKeyboardCheckbox(evt)](#markdown-header-nsomniscripteditblockhandlekeyboardcheckboxevt-void) ⇒ void
  - [.handleKeyboardActionMenu(evt)](#markdown-header-nsomniscripteditblockhandlekeyboardactionmenuevt-void) ⇒ void
  - [.remove(evt)](#markdown-header-nsomniscripteditblockremoveevt-void) ⇒ void
  - [.cancel()](#markdown-header-nsomniscripteditblockcancel-void) ⇒ void
  - [.handleCheckbox(evt)](#markdown-header-nsomniscripteditblockhandlecheckboxevt-void) ⇒ void
  - [.updateSiblings(data)](#markdown-header-nsomniscripteditblockupdatesiblingsdata-void) ⇒ void
  - [.updateCheckbox(sending)](#markdown-header-nsomniscripteditblockupdatecheckboxsending-void) ⇒ void
  - [.edit()](#markdown-header-nsomniscripteditblockedit-void) ⇒ void
  - [.save()](#markdown-header-nsomniscripteditblocksave-void) ⇒ void
  - [.editModeNotify()](#markdown-header-nsomniscripteditblockeditmodenotify-void) ⇒ void
  - [.toggleActionMenu(evt)](#markdown-header-nsomniscripteditblocktoggleactionmenuevt-void) ⇒ void
  - [.hideActionMenu(evt)](#markdown-header-nsomniscripteditblockhideactionmenuevt-void) ⇒ void
  - [.createActionMenu()](#markdown-header-nsomniscripteditblockcreateactionmenu-void) ⇒ void
  - [.propToMultiLang(properties)](#markdown-header-nsomniscripteditblockproptomultilangproperties-void) ⇒ void
  - [.stateRefresh()](#markdown-header-nsomniscripteditblockstaterefresh-void) ⇒ void
  - [.createDisplayColumns()](#markdown-header-nsomniscripteditblockcreatedisplaycolumns-void) ⇒ void
  - [.updateDisplayColumns()](#markdown-header-nsomniscripteditblockupdatedisplaycolumns-void) ⇒ void
  - [.createTableLabelColumns()](#markdown-header-nsomniscripteditblockcreatetablelabelcolumns-void) ⇒ void
  - [.createNullifiedJsonData()](#markdown-header-nsomniscripteditblockcreatenullifiedjsondata)
  - [.isEmpty()](#markdown-header-nsomniscripteditblockisempty-boolean) ⇒ Boolean

### ns/omniscriptEditBlock.mode : String

- Controls which template to load (Table, FS, Inline, Cards, LongCards). Empty string results in Table

**Kind**: instance property of [ns/omniscriptEditBlock](#markdown-header-nsomniscripteditblock)  
**Scope**: api (public)

### ns/omniscriptEditBlock.\_isEditing : Boolean

- Indicates if Edit Block is in edit mode (input fields are editable)

**Kind**: instance property of [ns/omniscriptEditBlock](#markdown-header-nsomniscripteditblock)  
**Scope**: track (private)

### ns/omniscriptEditBlock.\_bShowActionMenu : Boolean

- Indicates if the action menu is visible (Available in Table, Cards, LongCards)

**Kind**: instance property of [ns/omniscriptEditBlock](#markdown-header-nsomniscripteditblock)  
**Scope**: track (private)

### ns/omniscriptEditBlock.\_showCheckbox : Boolean

- Indicates if the checkbox on the top-right corner is visible

**Kind**: instance property of [ns/omniscriptEditBlock](#markdown-header-nsomniscripteditblock)  
**Scope**: track (private)

### ns/omniscriptEditBlock.\_maxDisplayCount : Number

- Controls the maximum number of element values to display

**Kind**: instance property of [ns/omniscriptEditBlock](#markdown-header-nsomniscripteditblock)  
**Scope**: private

### ns/omniscriptEditBlock.canRemove ⇒ Boolean

Indicates if deleting an Edit Block is allowed

**Kind**: instance property of [ns/omniscriptEditBlock](#markdown-header-nsomniscripteditblock)  
**Scope**: private

### ns/omniscriptEditBlock.isEditing ⇒ Boolean

Indicates if edit mode is enabled

**Kind**: instance property of [ns/omniscriptEditBlock](#markdown-header-nsomniscripteditblock)  
**Scope**: private

### ns/omniscriptEditBlock.isEditing ⇒ void

Sets the value for edit mode

**Kind**: instance property of [ns/omniscriptEditBlock](#markdown-header-nsomniscripteditblock)  
**Scope**: private

| Param | Type    | Description                                      |
| ----- | ------- | ------------------------------------------------ |
| value | Boolean | new Boolean value to enable or disable edit mode |

### ns/omniscriptEditBlock.sumElement ⇒ String

Returns the value for the sumElement

**Kind**: instance property of [ns/omniscriptEditBlock](#markdown-header-nsomniscripteditblock)  
**Scope**: private

### ns/omniscriptEditBlock.canRepeat ⇒ Boolean

Indicates if adding new Edit Blocks is enabled

**Kind**: instance property of [ns/omniscriptEditBlock](#markdown-header-nsomniscripteditblock)  
**Scope**: private

### ns/omniscriptEditBlock.showAdd ⇒ Boolean

Indicates if the add button is visible

**Kind**: instance property of [ns/omniscriptEditBlock](#markdown-header-nsomniscripteditblock)  
**Scope**: private

### ns/omniscriptEditBlock.isInvalid ⇒ Boolean

Indicates if there are any invalid elements in the Edit Block

**Kind**: instance property of [ns/omniscriptEditBlock](#markdown-header-nsomniscripteditblock)  
**Scope**: private

### ns/omniscriptEditBlock.svgMapIcon ⇒ String

Returns a string containing the sprite and icon for an svg icon

**Kind**: instance property of [ns/omniscriptEditBlock](#markdown-header-nsomniscripteditblock)  
**Scope**: private

### ns/omniscriptEditBlock.visualClass ⇒ String

Returns the class string for elements displaying non-editable text.

**Kind**: instance property of [ns/omniscriptEditBlock](#markdown-header-nsomniscripteditblock)  
**Scope**: private

### ns/omniscriptEditBlock.editClass ⇒ String

Returns the class string for elements displaying the input fields

**Kind**: instance property of [ns/omniscriptEditBlock](#markdown-header-nsomniscripteditblock)  
**Scope**: private

### ns/omniscriptEditBlock.handleAdd(evt, seed) ⇒ void

Creates a new Edit Block.

**Kind**: instance method of [ns/omniscriptEditBlock](#markdown-header-nsomniscripteditblock)  
**Scope**: public

| Param | Type   | Description                                                                           |
| ----- | ------ | ------------------------------------------------------------------------------------- |
| evt   | Object | Event object when attached to an event listener, String when executed programatically |
| seed  | Object |                                                                                       |

### ns/omniscriptEditBlock.handleRemoveDom() ⇒ void

Deletes current Edit Block.

**Kind**: instance method of [ns/omniscriptEditBlock](#markdown-header-nsomniscripteditblock)  
**Scope**: private

### ns/omniscriptEditBlock.handleRemove() ⇒ void

Call any action overriding delete; otherwise handleRemoveDom will be called.

**Kind**: instance method of [ns/omniscriptEditBlock](#markdown-header-nsomniscripteditblock)  
**Scope**: private

### ns/omniscriptEditBlock.handleKeyboardAdd(evt, seed) ⇒ void

Handle keyboard "Enter" or "Space" for add

**Kind**: instance method of [ns/omniscriptEditBlock](#markdown-header-nsomniscripteditblock)  
**Scope**: private

| Param | Type   | Description                                                                           |
| ----- | ------ | ------------------------------------------------------------------------------------- |
| evt   | Object | Event object when attached to an event listener, String when executed programatically |
| seed  | Object |                                                                                       |

### ns/omniscriptEditBlock.handleKeyboardRemove(evt) ⇒ void

Handle keyboard "Enter" or "Space" for remove

**Kind**: instance method of [ns/omniscriptEditBlock](#markdown-header-nsomniscripteditblock)  
**Scope**: private

| Param | Type   | Description                                                                           |
| ----- | ------ | ------------------------------------------------------------------------------------- |
| evt   | Object | Event object when attached to an event listener, String when executed programatically |

### ns/omniscriptEditBlock.handleKeyboardEdit(evt) ⇒ void

Handle keyboard "Enter" or "Space" for edit

**Kind**: instance method of [ns/omniscriptEditBlock](#markdown-header-nsomniscripteditblock)  
**Scope**: private

| Param | Type   | Description                                                                           |
| ----- | ------ | ------------------------------------------------------------------------------------- |
| evt   | Object | Event object when attached to an event listener, String when executed programatically |

### ns/omniscriptEditBlock.handleKeyboardSave(evt) ⇒ void

Handle keyboard "Enter" or "Space" for save

**Kind**: instance method of [ns/omniscriptEditBlock](#markdown-header-nsomniscripteditblock)  
**Scope**: private

| Param | Type   | Description                                                                           |
| ----- | ------ | ------------------------------------------------------------------------------------- |
| evt   | Object | Event object when attached to an event listener, String when executed programatically |

### ns/omniscriptEditBlock.handleKeyboardCancel(evt) ⇒ void

Handle keyboard "Enter" or "Space" for cancel

**Kind**: instance method of [ns/omniscriptEditBlock](#markdown-header-nsomniscripteditblock)  
**Scope**: private

| Param | Type   | Description                                                                           |
| ----- | ------ | ------------------------------------------------------------------------------------- |
| evt   | Object | Event object when attached to an event listener, String when executed programatically |

### ns/omniscriptEditBlock.handleKeyboardCheckbox(evt) ⇒ void

Handle keyboard "Enter" or "Space" for checkbox

**Kind**: instance method of [ns/omniscriptEditBlock](#markdown-header-nsomniscripteditblock)  
**Scope**: private

| Param | Type   | Description                                                                           |
| ----- | ------ | ------------------------------------------------------------------------------------- |
| evt   | Object | Event object when attached to an event listener, String when executed programatically |

### ns/omniscriptEditBlock.handleKeyboardActionMenu(evt) ⇒ void

Handle keyboard "Enter" or "Space" for action menu
"Esc" to close the action menu

**Kind**: instance method of [ns/omniscriptEditBlock](#markdown-header-nsomniscripteditblock)  
**Scope**: private

| Param | Type   | Description                                                                           |
| ----- | ------ | ------------------------------------------------------------------------------------- |
| evt   | Object | Event object when attached to an event listener, String when executed programatically |

### ns/omniscriptEditBlock.remove(evt) ⇒ void

Displays remove confirmation modal and then calls handleRemove.

**Kind**: instance method of [ns/omniscriptEditBlock](#markdown-header-nsomniscripteditblock)  
**Scope**: private

| Param | Type   | Description  |
| ----- | ------ | ------------ |
| evt   | Object | Event Object |

### ns/omniscriptEditBlock.cancel() ⇒ void

Disables edit mode, ignores new data, and restores the previous data.

**Kind**: instance method of [ns/omniscriptEditBlock](#markdown-header-nsomniscripteditblock)  
**Scope**: private

### ns/omniscriptEditBlock.handleCheckbox(evt) ⇒ void

Updates all Edit Blocks' checkbox if select mode is enabled

**Kind**: instance method of [ns/omniscriptEditBlock](#markdown-header-nsomniscripteditblock)  
**Scope**: private

| Param | Type   | Description  |
| ----- | ------ | ------------ |
| evt   | Object | Event Object |

### ns/omniscriptEditBlock.updateSiblings(data) ⇒ void

Notifies other siblings in current Edit Block that something has been updated

**Kind**: instance method of [ns/omniscriptEditBlock](#markdown-header-nsomniscripteditblock)  
**Scope**: private

| Param | Type   |
| ----- | ------ |
| data  | Object |

### ns/omniscriptEditBlock.updateCheckbox(sending) ⇒ void

Controls the selection of the Edit Block given a checkbox element specified
inside of the Edit Block
The selection controls either :

1. affects the background color (table)
2. toggles the visibility of the checkbox (cards, longcards)

**Kind**: instance method of [ns/omniscriptEditBlock](#markdown-header-nsomniscripteditblock)  
**Scope**: private

| Param   | Type    | Default | Description                                                                    |
| ------- | ------- | ------- | ------------------------------------------------------------------------------ |
| sending | Boolean | `false` | Indicates if current Edit Block child is the sender or receiver of the update. |

### ns/omniscriptEditBlock.edit() ⇒ void

Sets the editing mode to true

**Kind**: instance method of [ns/omniscriptEditBlock](#markdown-header-nsomniscripteditblock)  
**Scope**: private

### ns/omniscriptEditBlock.save() ⇒ void

Saves any changes to Edit Block, calls overridden actions for (new, edit and delete)

**Kind**: instance method of [ns/omniscriptEditBlock](#markdown-header-nsomniscripteditblock)  
**Scope**: private

### ns/omniscriptEditBlock.editModeNotify() ⇒ void

Sends an event to the header to prevent omniscript from navigating to prev/next steps

**Kind**: instance method of [ns/omniscriptEditBlock](#markdown-header-nsomniscripteditblock)  
**Scope**: private

### ns/omniscriptEditBlock.toggleActionMenu(evt) ⇒ void

Toggles the visibility the action menu

**Kind**: instance method of [ns/omniscriptEditBlock](#markdown-header-nsomniscripteditblock)  
**Scope**: private

| Param | Type   | Description  |
| ----- | ------ | ------------ |
| evt   | Object | Event Object |

### ns/omniscriptEditBlock.hideActionMenu(evt) ⇒ void

Hides the action menu

**Kind**: instance method of [ns/omniscriptEditBlock](#markdown-header-nsomniscripteditblock)  
**Scope**: private

| Param | Type   | Description  |
| ----- | ------ | ------------ |
| evt   | Object | Event Object |

### ns/omniscriptEditBlock.createActionMenu() ⇒ void

Creates and configures the data for the action menu

**Kind**: instance method of [ns/omniscriptEditBlock](#markdown-header-nsomniscripteditblock)  
**Scope**: private

### ns/omniscriptEditBlock.propToMultiLang(properties) ⇒ void

Overriding omniscriptBaseElement's propToMultiLang to include translations of custom labels inside of global actions, and actions for edit block's new, edit and delete

**Kind**: instance method of [ns/omniscriptEditBlock](#markdown-header-nsomniscripteditblock)

| Param      | Type   |
| ---------- | ------ |
| properties | Object |

### ns/omniscriptEditBlock.stateRefresh() ⇒ void

Indicates if data json has been updated

**Kind**: instance method of [ns/omniscriptEditBlock](#markdown-header-nsomniscripteditblock)  
**Scope**: private

### ns/omniscriptEditBlock.createDisplayColumns() ⇒ void

Creates and configures the data to be displayed for every template

**Kind**: instance method of [ns/omniscriptEditBlock](#markdown-header-nsomniscripteditblock)  
**Scope**: private

### ns/omniscriptEditBlock.updateDisplayColumns() ⇒ void

Updates the display values for all of the elements

**Kind**: instance method of [ns/omniscriptEditBlock](#markdown-header-nsomniscripteditblock)  
**Scope**: private

### ns/omniscriptEditBlock.createTableLabelColumns() ⇒ void

Creates and configures the labels for the columns in FS and Table

**Kind**: instance method of [ns/omniscriptEditBlock](#markdown-header-nsomniscripteditblock)  
**Scope**: private

### ns/omniscriptEditBlock.createNullifiedJsonData()

Creates an object that contains all of the elements for an edit block with all values set to null

**Kind**: instance method of [ns/omniscriptEditBlock](#markdown-header-nsomniscripteditblock)

### ns/omniscriptEditBlock.isEmpty() ⇒ Boolean

Indicates if there any Edit Blocks created

**Kind**: instance method of [ns/omniscriptEditBlock](#markdown-header-nsomniscripteditblock)  
**Scope**: public
