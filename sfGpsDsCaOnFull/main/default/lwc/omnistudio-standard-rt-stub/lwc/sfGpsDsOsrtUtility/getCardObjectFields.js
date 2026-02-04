/*************************************************************************
 *
 * VLOCITY, INC. CONFIDENTIAL
 * __________________
 *
 *  [2023] Vlocity, Inc.
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Vlocity, Inc. and its suppliers,
 * if any. The intellectual and technical concepts contained
 * herein are proprietary to Vlocity, Inc. and its suppliers and may be
 * covered by U.S. and Foreign Patents, patents in process, and are
 * protected by trade secret or copyright law. Dissemination of this
 * information and reproduction, modification or reverse-engineering
 * of this material, is prohibited unless prior written permission
 * is obtained from Vlocity, Inc.
 *
 * Build: v244.0.0
 */
import { namespace } from "c/sfGpsDsOsrtNamespaceUtils";

let OmniUiCard__c = {
  AuthorName: namespace + "AuthorName__c",
  ClonedFromOmniUiCardKey: namespace + "ClonedFromOmniUiCardKey__c",
  DataSourceConfig: namespace + "DataSourceConfig__c",
  Description: namespace + "Description__c",
  IsActive: namespace + "IsActive__c",
  IsTrackingEnabled: namespace + "IsTrackingEnabled__c",
  OmniUiCardKey: namespace + "OmniUiCardKey__c",
  PropertySetConfig: namespace + "PropertySetConfig__c",
  SampleDataSourceResponse: namespace + "SampleDataSourceResponse__c",
  StylingConfiguration: namespace + "StylingConfiguration__c",
  Type: namespace + "Type__c",
  VersionNumber: namespace + "VersionNumber__c",
  ObjectName: namespace + "OmniUiCard__c"
};

let VlocityCard__c = {
  AuthorName: namespace + "Author__c",
  ClonedFromOmniUiCardKey: namespace + "ParentID__c",
  DataSourceConfig: namespace + "Datasource__c",
  Description: namespace + "Description__c",
  IsActive: namespace + "Active__c",
  OmniUiCardKey: namespace + "GlobalKey__c",
  PropertySetConfig: namespace + "Definition__c",
  SampleDataSourceResponse: namespace + "SampleData__c",
  StylingConfiguration: namespace + "Styles__c",
  Type: namespace + "Type__c",
  VersionNumber: namespace + "Version__c",
  ObjectName: namespace + "VlocityCard__c",
  IsChildCard: namespace + "IsChildCard__c",
  CardType: namespace + "CardType__c"
};

let OmniUiCard = {
  AuthorName: "AuthorName",
  ClonedFromOmniUiCardKey: "ClonedFromOmniUiCardKey",
  DataSourceConfig: "DataSourceConfig",
  Description: "Description",
  IsActive: "IsActive",
  IsTrackingEnabled: "IsTrackingEnabled",
  OmniUiCardKey: "OmniUiCardKey",
  PropertySetConfig: "PropertySetConfig",
  SampleDataSourceResponse: "SampleDataSourceResponse",
  StylingConfiguration: "StylingConfiguration",
  Type: "OmniUiCardType",
  VersionNumber: "VersionNumber",
  ObjectName: "OmniUiCard",
  IsFileBased: "IsFileBased"
};

let cardObjName = {
  OmniUiCard__c: OmniUiCard__c,
  OmniUiCard: OmniUiCard,
  VlocityCard__c: VlocityCard__c
};

function getCardObjectFields(obj) {
  if (obj && ("IsActive" in obj || "OmniUiCardKey" in obj)) {
    return OmniUiCard;
  } else if (
    obj &&
    (namespace + "Active__c" in obj || namespace + "GlobalKey__c" in obj)
  ) {
    return VlocityCard__c;
  }
  return OmniUiCard__c;
}

function getCardObject(name) {
  return cardObjName[name];
}

export { getCardObjectFields, getCardObject };
