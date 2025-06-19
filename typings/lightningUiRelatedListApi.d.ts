declare module 'lightning/uiRelatedListApi' {
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
     *  Gets the metadata for a specific Related List
     * @param parentObjectApiName The API name of the parent object for the related list (must be specified with relatedListId)
     * @param parentRecordId The record ID of the parent record for the related list (must be specified with relatedListId)
     * @param relatedListId The ID of the related list (can be specified with either parentObjectApiName or parentRecordId)
     */
    export function getRelatedListInfo(parentObjectApiName?: string | ObjectId, parentRecordId?: string, relatedListId?: string): void;

    /**
     *  Gets the metadata for a batch of related lists
     * @param parentObjectApiName The API name of the parent object for the related lists
     * @param relatedListIds Comma separated IDs of supported related lists for the specified parent object
     */
    export function getRelatedListInfoBatch(parentObjectApiName: string | ObjectId, relatedListIds: Array<string>): void;

    /** Gets a collection of metadata for all the related lists for a specific entity
     *
     * @param parentObjectApiName The API name of the parent object
     */
    export function getRelatedListsInfo(parentObjectApiName?: string | ObjectId): void;

    /**
     * Gets a colllection of records for a given record and related list
     * @param parentRecordId The record ID of the parent record for the related list
     * @param relatedListId The ID of the related list
     */
    export function getRelatedListRecords(parentRecordId: string, relatedListId: string): void;

    /**
     *  Gets record data for a batch of related lists
     * @param parentRecordId The ID of the parent record you want to get related lists for
     * @param relatedListIds Comma separated IDs of supported related lists for the specified parent record
     */
    export function getRelatedListRecordsBatch(parentRecordId: string, relatedListIds: Array<string>): void;

    /**
     * Gets the count of records for a related list on a specific given record
     * @param parentRecordId The record ID of the parent record for the related list
     * @param relatedListId The ID of the related list
     */
    export function getRelatedListCount(parentRecordId: string, relatedListId: string): void;
}
