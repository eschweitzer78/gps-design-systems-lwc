declare module 'lightning/uiListApi' {
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
     * Gets the records and metadata for a list view.
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.reference_get_list_ui
     *
     * @param objectApiName API name of the list view's object (must be specified along with listViewApiName).
     * @param listViewApiName API name of the list view (must be specified with objectApiName).
     * @param listViewId ID of the list view (may be specified without objectApiName or listViewApiName).
     * @param pageToken A token that represents the page offset. To indicate where the page starts, use this value with the pageSize parameter.
     *                The maximum offset is 2000 and the default is 0.
     * @param pageSize The number of list records viewed at one time. The default value is 50. Value can be 1–2000.
     * @param sortBy The API name of the field the list view is sorted by. If the name is preceded with `-`, the sort order is descending.
     *                For example, Name sorts by name in ascending order. `-CreatedDate` sorts by created date in descending order.
     *                Accepts only one value per request.
     * @param fields Additional fields queried for the records returned. These fields don’t create visible columns.
     *                If the field is not available to the user, an error occurs.
     * @param optionalFields Additional fields queried for the records returned. These fields don’t create visible columns.
     *                       If the field is not available to the user, no error occurs and the field isn’t included in the records.
     * @returns {Observable} See description.
     */
    export function getListUi(
        objectApiName?: string | ObjectId,
        listViewApiName?: string | symbol,
        listViewId?: string,
        pageToken?: string,
        pageSize?: number,
        sortBy?: string | FieldId,
        fields?: Array<string | FieldId>,
        optionalFields?: Array<string | FieldId>,
    ): void;
}
