## ns/omniscriptFile ⇐ OmniscriptAtomicElement

**Extends**: OmniscriptAtomicElement

- [ns/omniscriptFile](#markdown-header-nsomniscriptfile-omniscriptatomicelement) ⇐ OmniscriptAtomicElement
  - [.\_value](#markdown-header-omniscriptfile_value-array) : Array
  - [.isPageLoading](#markdown-header-omniscriptfileispageloading-boolean) : Boolean
  - [.\_showValidation](#markdown-header-omniscriptfile_showvalidation-boolean) : Boolean
  - [.\_containerClasses](#markdown-header-omniscriptfile_containerclasses-string) : String
  - [.\_theme](#markdown-header-omniscriptfile_theme-string) : String
  - [.connectedCallback()](#markdown-header-omniscriptfileconnectedcallback-void) ⇒ void
  - [.initCompVariables()](#markdown-header-omniscriptfileinitcompvariables-void) ⇒ void
  - [.handleUploadFinished(event)](#markdown-header-omniscriptfilehandleuploadfinishedevent-void) ⇒ void
  - [.deleteFile(evt)](#markdown-header-omniscriptfiledeletefileevt-void) ⇒ void
  - [.notifyUploadChange([removedId])](#markdown-header-omniscriptfilenotifyuploadchangeremovedid-void) ⇒ void
  - [.setContainerClasses()](#markdown-header-omniscriptfilesetcontainerclasses-void) ⇒ void
  - [.notifyError(error)](#markdown-header-omniscriptfilenotifyerrorerror-void) ⇒ void
  - [.checkValidity()](#markdown-header-omniscriptfilecheckvalidity-boolean) ⇒ Boolean
  - [.reportValidity()](#markdown-header-omniscriptfilereportvalidity-boolean) ⇒ Boolean
  - [.render()](#markdown-header-omniscriptfilerender-void) ⇒ Template

### omniscriptFile.\_value : Array

- A list of current uploaded files

**Kind**: instance property of [ns/omniscriptFile](#markdown-header-nsomniscriptfile-omniscriptatomicelement)  
**Scope**: track (private)

### omniscriptFile.isPageLoading : Boolean

- Keeps track if the spinner is shown

**Kind**: instance property of [ns/omniscriptFile](#markdown-header-nsomniscriptfile-omniscriptatomicelement)  
**Scope**: track (private)

### omniscriptFile.\_showValidation : Boolean

- Keeps track if the validation message is shown

**Kind**: instance property of [ns/omniscriptFile](#markdown-header-nsomniscriptfile-omniscriptatomicelement)  
**Scope**: track (private)

### omniscriptFile.\_containerClasses : String

- The CSS classes to be applied to the component

**Kind**: instance property of [ns/omniscriptFile](#markdown-header-nsomniscriptfile-omniscriptatomicelement)  
**Scope**: private

### omniscriptFile.\_theme : String

- The current styling theme

**Kind**: instance property of [ns/omniscriptFile](#markdown-header-nsomniscriptfile-omniscriptatomicelement)  
**Scope**: private

### omniscriptFile.connectedCallback() ⇒ void

Overwrites inherited connectedCallback.

**Kind**: instance method of [ns/omniscriptFile](#markdown-header-nsomniscriptfile-omniscriptatomicelement)  
**Scope**: private

### omniscriptFile.initCompVariables() ⇒ void

Overwrites inherited initCompVariables. This method is executed once during connectedCallback.

**Kind**: instance method of [ns/omniscriptFile](#markdown-header-nsomniscriptfile-omniscriptatomicelement)  
**Scope**: private

### omniscriptFile.handleUploadFinished(event) ⇒ void

An event listener that is triggered after file have been uploaded.

**Kind**: instance method of [ns/omniscriptFile](#markdown-header-nsomniscriptfile-omniscriptatomicelement)  
**Scope**: private

| Param | Type  |
| ----- | ----- |
| event | Event |

### omniscriptFile.deleteFile(evt) ⇒ void

Deletes a file from the values and notify the change.
Also, tries to delete to remove the file from content document

**Kind**: instance method of [ns/omniscriptFile](#markdown-header-nsomniscriptfile-omniscriptatomicelement)  
**Scope**: private

| Param | Type  |
| ----- | ----- |
| evt   | Event |

### omniscriptFile.notifyUploadChange([removedId]) ⇒ void

Notifies the component that a file was uploaded or removed

**Kind**: instance method of [ns/omniscriptFile](#markdown-header-nsomniscriptfile-omniscriptatomicelement)  
**Scope**: private

| Param       | Type   | Description                                    |
| ----------- | ------ | ---------------------------------------------- |
| [removedId] | string | Optional. If a file is removed, the documentId |

### omniscriptFile.setContainerClasses() ⇒ void

Sets the container CSS styling

**Kind**: instance method of [ns/omniscriptFile](#markdown-header-nsomniscriptfile-omniscriptatomicelement)  
**Scope**: private

### omniscriptFile.notifyError(error) ⇒ void

Dispatches an error modal.

**Kind**: instance method of [ns/omniscriptFile](#markdown-header-nsomniscriptfile-omniscriptatomicelement)  
**Scope**: private

| Param | Type   |
| ----- | ------ |
| error | string |

### omniscriptFile.checkValidity() ⇒ Boolean

Interface for native DOM checkValidity().
Performs custom validation as well as native Constraint Validation API calls.
Returns a boolean, but doesn't trigger display of validation messages.

**Kind**: instance method of [ns/omniscriptFile](#markdown-header-nsomniscriptfile-omniscriptatomicelement)  
**Scope**: private

### omniscriptFile.reportValidity() ⇒ Boolean

Interface for native DOM reportValidity().
Performs custom validation as well as native Constraint Validation API calls.
Returns a boolean, and triggers the display of validation messages.

**Kind**: instance method of [ns/omniscriptFile](#markdown-header-nsomniscriptfile-omniscriptatomicelement)  
**Scope**: private

### omniscriptFile.render() ⇒ Template

Overwrites native LWC render

**Kind**: instance method of [ns/omniscriptFile](#markdown-header-nsomniscriptfile-omniscriptatomicelement)  
**Scope**: private
