## ns/omniscriptDocusignSignatureAction

- [ns/omniscriptDocusignSignatureAction](#markdown-header-nsomniscriptdocusignsignatureaction)
  - [.\_docusignModal](#markdown-header-nsomniscriptdocusignsignatureaction_docusignmodal-boolean) : Boolean
  - [.\_headerClasses](#markdown-header-nsomniscriptdocusignsignatureaction_headerclasses-string) : String
  - [.\_footerClasses](#markdown-header-nsomniscriptdocusignsignatureaction_footerclasses-string) : String
  - [.\_modalContainerClass](#markdown-header-nsomniscriptdocusignsignatureaction_modalcontainerclass-string) : String
  - [.\_envelopeId](#markdown-header-nsomniscriptdocusignsignatureaction_envelopeid-string) : String
  - [.\_envelopeIdArray](#markdown-header-nsomniscriptdocusignsignatureaction_envelopeidarray-arrayobject) : Array.<Object>
  - [.\_pdfData](#markdown-header-nsomniscriptdocusignsignatureaction_pdfdata-string) : String
  - [.showViewPdfBtn](#markdown-header-nsomniscriptdocusignsignatureactionshowviewpdfbtn-boolean) : Boolean
  - [.disableViewPdfBtn](#markdown-header-nsomniscriptdocusignsignatureactiondisableviewpdfbtn-boolean) : Boolean
  - [.viewPDF()](#markdown-header-nsomniscriptdocusignsignatureactionviewpdf-void) ⇒ Void
  - [.closeModal()](#markdown-header-nsomniscriptdocusignsignatureactionclosemodal-void) ⇒ Void

### ns/omniscriptDocusignSignatureAction.\_docusignModal : Boolean

- Opens DocuSign Signing Ceremony in modal.

**Kind**: instance property of [ns/omniscriptDocusignSignatureAction](#markdown-header-nsomniscriptdocusignsignatureaction)  
**Scope**: private

### ns/omniscriptDocusignSignatureAction.\_headerClasses : String

- Default header css classes for modal.

**Kind**: instance property of [ns/omniscriptDocusignSignatureAction](#markdown-header-nsomniscriptdocusignsignatureaction)  
**Scope**: private

### ns/omniscriptDocusignSignatureAction.\_footerClasses : String

- Default footer css classes for modal.

**Kind**: instance property of [ns/omniscriptDocusignSignatureAction](#markdown-header-nsomniscriptdocusignsignatureaction)  
**Scope**: private

### ns/omniscriptDocusignSignatureAction.\_modalContainerClass : String

- Default css classes for modal container.

**Kind**: instance property of [ns/omniscriptDocusignSignatureAction](#markdown-header-nsomniscriptdocusignsignatureaction)  
**Scope**: private

### ns/omniscriptDocusignSignatureAction.\_envelopeId : String

- Envelope Id of DocuSign for which signature is in progress.

**Kind**: instance property of [ns/omniscriptDocusignSignatureAction](#markdown-header-nsomniscriptdocusignsignatureaction)  
**Scope**: private

### ns/omniscriptDocusignSignatureAction.\_envelopeIdArray : Array.<Object>

- Envelope Id Array of DocuSign for multiple signatures.

**Kind**: instance property of [ns/omniscriptDocusignSignatureAction](#markdown-header-nsomniscriptdocusignsignatureaction)  
**Scope**: private

### ns/omniscriptDocusignSignatureAction.\_pdfData : String

- PDF blob data which we get from DocuSign after successful signature completion.

**Kind**: instance property of [ns/omniscriptDocusignSignatureAction](#markdown-header-nsomniscriptdocusignsignatureaction)  
**Scope**: private

### ns/omniscriptDocusignSignatureAction.showViewPdfBtn : Boolean

- Display View PDF button on modal after signature is completed successfully.

**Kind**: instance property of [ns/omniscriptDocusignSignatureAction](#markdown-header-nsomniscriptdocusignsignatureaction)  
**Scope**: track (private)

### ns/omniscriptDocusignSignatureAction.disableViewPdfBtn : Boolean

- Disable View PDF button on modal after clicking on View PDF button and PDF is displayed.

**Kind**: instance property of [ns/omniscriptDocusignSignatureAction](#markdown-header-nsomniscriptdocusignsignatureaction)  
**Scope**: track (private)

### ns/omniscriptDocusignSignatureAction.viewPDF() ⇒ Void

View the pdf after successful signature completion in DocuSign Signing Ceremony.

**Kind**: instance method of [ns/omniscriptDocusignSignatureAction](#markdown-header-nsomniscriptdocusignsignatureaction)  
**Scope**: private

### ns/omniscriptDocusignSignatureAction.closeModal() ⇒ Void

Close the DocuSign Signing Ceremony modal.

**Kind**: instance method of [ns/omniscriptDocusignSignatureAction](#markdown-header-nsomniscriptdocusignsignatureaction)  
**Scope**: private
