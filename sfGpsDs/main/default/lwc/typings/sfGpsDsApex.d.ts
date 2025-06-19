declare module "c/sfGpsDsApex" {
  
  export type SoqlOperator =
    "Equals" |
    "GreaterOrEqual" |
    "GreaterThan" |
    "LessOrEqual" |
    "LessThan" |
    "NotEqual" |
    "Contains" |
    "NotContain" |
    "Excludes" |
    "Includes" |
    "StartsWith" |
    "Within";
    
  export interface sObjectColumn {
    dataType: string,
    displayValue: string,
    fieldApiName: string,
    value: any,
    relationshipObjectApiName?: string,
    relationshipId?: string,

  }

  export interface sObject {
    columns: Record<string, sObjectColumn>;
  }
}