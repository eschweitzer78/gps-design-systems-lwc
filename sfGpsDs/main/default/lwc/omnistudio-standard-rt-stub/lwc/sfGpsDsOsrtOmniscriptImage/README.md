## ns/omniscriptImage ⇐ OmniscriptFile

**Extends**: OmniscriptFile

- [ns/omniscriptImage](#markdown-header-nsomniscriptimage-omniscriptfile) ⇐ OmniscriptFile
  - [.multiple](#markdown-header-omniscriptimagemultiple-boolean) : Boolean
  - [.accepts](#markdown-header-omniscriptimageaccepts-string) : String
  - [.\_parentContainerClasses](#markdown-header-omniscriptimage_parentcontainerclasses-string) : String
  - [.\_baseUrl](#markdown-header-omniscriptimage_baseurl-string) : String
  - [.disabled](#markdown-header-omniscriptimagedisabled-boolean) : Boolean
  - [.images](#markdown-header-omniscriptimageimages-array) : Array
  - [.initCompVariables()](#markdown-header-omniscriptimageinitcompvariables-void) ⇒ void
  - [.render()](#markdown-header-omniscriptimagerender-template) ⇒ Template

### omniscriptImage.multiple : Boolean

Flag used to track if multiple files can be uploaded

**Kind**: instance property of [ns/omniscriptImage](#markdown-header-nsomniscriptimage-omniscriptfile)  
**Scope**: track (private)

### omniscriptImage.accepts : String

A list of file extensions that can be uploaded

**Kind**: instance property of [ns/omniscriptImage](#markdown-header-nsomniscriptimage-omniscriptfile)  
**Scope**: track (private)

### omniscriptImage.\_parentContainerClasses : String

The class of the parent container

**Kind**: instance property of [ns/omniscriptImage](#markdown-header-nsomniscriptimage-omniscriptfile)  
**Scope**: track (private)

### omniscriptImage.\_baseUrl : String

The base URL used to load image preview

**Kind**: instance property of [ns/omniscriptImage](#markdown-header-nsomniscriptimage-omniscriptfile)  
**Scope**: track (private)

### omniscriptImage.disabled : Boolean

Property that keeps track if the component is disabled

**Kind**: instance property of [ns/omniscriptImage](#markdown-header-nsomniscriptimage-omniscriptfile)

### omniscriptImage.images : Array

A list of uploaded images

**Kind**: instance property of [ns/omniscriptImage](#markdown-header-nsomniscriptimage-omniscriptfile)

### omniscriptImage.initCompVariables() ⇒ void

Overwrites inherited initCompVariables. This method is executed once during connectedCallback.

**Kind**: instance method of [ns/omniscriptImage](#markdown-header-nsomniscriptimage-omniscriptfile)  
**Scope**: private

### omniscriptImage.render() ⇒ Template

Overwrites native LWC renderedCallback

**Kind**: instance method of [ns/omniscriptImage](#markdown-header-nsomniscriptimage-omniscriptfile)  
**Scope**: private
