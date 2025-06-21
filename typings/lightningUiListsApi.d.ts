declare module "lightning/uiListsApi" {
  import type { SoqlOperator } from "c/sfGpsDsApex";

  export interface GetListInfoByNameOptions {
    objectApiName: string,
    listViewApiName: string
  }

  interface ListColumnInlineEditAttributes {
    editable: boolean,
    required: boolean
  }

  interface ListColumn {
    fieldApiName: string,
    inlineEditAttributes: Record<string, ListColumnInlineEditAttributes>,
    label: string,
    lookupId: string,
    searchable: boolean,
    sortable: boolean
  }

  interface ListFilterByInfo {
    fieldApiName: string,
    label: string,
    operandLabels: string[],
    operator: SoqlOperator
  }

  interface ListReference {
    id: string,
    listViewApiName: string,
    objectApiName: string,
    type: string
  }

  interface ListInlineEditDetails {
    message: string,
    state: 
      "Disabled" |
      "Enabled" |
      "Off"
  }

  interface ListInfoShare {
    label: string,
    shareApiName: string
  }

  interface ListInfoShareCategory {
    shareType: 
      "ChannelProgramGroup" |
      "Regular" |
      "Role" |
      "RoleAndSubordinates" |
      "RoleAndSubordinatesInternal" |
      "Territory" |
      "TerritoryAndSubordinates";
    shares: ListInfoShare[]
  }

  interface ListOrderedByInfo {
    fieldApiName: string,
    isAscending: boolean,
    label: string
  }

  interface ListScopeEntity {
    id: string,
    label: string
  }

  interface ListScopeRelatedEntity 
  extends ListScopeEntity {
    type: string
  }

  interface ListScope {
    apiName: string,
    entity: ListScopeEntity,
    label: string,
    relatedEntity: ListScopeRelatedEntity
  }

  interface ListUserPreference {
    columnWidths: Record<string, number>,
    columnWrap: Record<string, boolean>
  }

  export interface ListViewInfo {
    cloneable: boolean,
    createable: boolean,
    deletable: boolean,
    displayColumns: ListColumn[],
    filterLogicString: string,
    filteredByInfo: ListFilterByInfo[],
    hasMassActions: boolean,
    inlineEditDetails: ListInlineEditDetails,
    label: string,
    listReference: ListReference,
    listShares: ListInfoShareCategory,
    listViewApiName: string,
    objectApiNames: string[],
    orderedByInfo: ListOrderedByInfo[],
    scope: ListScope,
    seachable: boolean,
    updateable: boolean,
    userPreferences: ListUserPreference,
    visibility: "Private" | "Public" | "Shared",
    visibilityEditable: boolean
  }

  export function getListInfoByName(
    options: GetListInfoByNameOptions
  ): Promise<ListViewInfo>;
}