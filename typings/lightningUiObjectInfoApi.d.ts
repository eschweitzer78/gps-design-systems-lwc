declare module 'lightning/uiObjectInfoApi' {
    /**
     * Identifier for an object.
     */
    export interface ObjectId {
        /** The object's API name. */
        objectApiName: string;
    }

    /**
     * Identifier for an object's field.
     */
    export interface FieldId {
        /** The field's API name. */
        fieldApiName: string;
        /** The object's API name. */
        objectApiName: string;
    }

    /**
     * Gets the metadata for a specific object.
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.reference_wire_adapters_object_info
     *
     * @param objectApiName The API name of the object to retrieve.
     */
    export function getObjectInfo(objectApiName: string | ObjectId): void;

    /**
     * Wire adapter for multiple object metadatas.
     *
     * @param objectApiNames The API names of the objects to retrieve.
     */
    export function getObjectInfos(objectApiNames: Array<string | ObjectId>): void;

    /**
     * Wire adapter for values for a picklist field.
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.reference_wire_adapters_picklist_values
     *
     * @param fieldApiName The picklist field's object-qualified API name.
     * @param recordTypeId The record type ID. Pass '012000000000000AAA' for the master record type.
     */
    export function getPicklistValues(fieldApiName: string | FieldId, recordTypeId: string): void;

    /**
     * Wire adapter for values for all picklist fields of a record type.
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.reference_wire_adapters_picklist_values_record
     *
     * @param objectApiName API name of the object.
     * @param recordTypeId Record type ID. Pass '012000000000000AAA' for the master record type.
     */
    export function getPicklistValuesByRecordType(objectApiName: string, recordTypeId: string): void;
}