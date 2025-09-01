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

import { getCardObjectFields } from "./getCardObjectFields";
import { set } from "c/sfGpsDsOsrtLodash";

function getContextTestVariables(contextVariables, card) {
  let contextVar = {};
  contextVariables.forEach((contextVariable) => {
    set(contextVar, contextVariable.name, contextVariable.val);
  });
  let Session = card.Session ? card.Session : {};
  let cardDef =
    card.Definition || card[getCardObjectFields(card).PropertySetConfig];
  cardDef = typeof cardDef === "string" ? JSON.parse(cardDef) : cardDef;
  if (cardDef && cardDef.sessionVars) {
    cardDef.sessionVars.forEach((field) => {
      Session[field.name] = field.val;
    });
  }
  contextVar.Session = Session;
  if (card.selectedCardsLabel) {
    contextVar[card.selectedCardsLabel] = card && card[card.selectedCardsLabel];
  }
  contextVar.Label = card && card.Label;
  return contextVar;
}

function extractCardMergeFields(card) {
  let datasource = card[getCardObjectFields(card).PropertySetConfig]
    ? JSON.parse(card[getCardObjectFields(card).PropertySetConfig]).dataSource
    : null;
  let cardDatasource = card.dataSource || datasource;
  cardDatasource =
    typeof cardDatasource === "string"
      ? JSON.parse(cardDatasource)
      : cardDatasource;
  if (card.Params && card.Params.isPreview) {
    if (cardDatasource && cardDatasource.contextVariables) {
      let ctxVar = getContextTestVariables(
        cardDatasource.contextVariables,
        card
      );
      if (card.Parent) {
        ctxVar.Parent = { ...(ctxVar.Parent || {}), ...card.Parent };
      }
      if (card.Flex) {
        ctxVar.Flex = { ...card.Flex };
      }
      if (card.User) {
        ctxVar.User = { ...(ctxVar.User || {}), ...card.User };
      }
      return ctxVar;
    }
    return {};
  }
  let obj = {
    Params: card.Params,
    Session: card.Session,
    User: card.User,
    recordId: card.recordId,
    objectApiName: card.objectApiName,
    Label: card.Label,
    Parent: card.Parent,
    Flex: card.Flex
  };
  if (card.selectedCardsLabel) {
    obj[card.selectedCardsLabel] = card[card.selectedCardsLabel];
  }
  return obj;
}

export { extractCardMergeFields };
