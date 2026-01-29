/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * Centralized labels module for Ontario Design System components.
 *
 * This module imports all Custom Labels and exports them for use in components.
 * Labels are automatically translated based on the user's language setting.
 *
 * ## Usage
 *
 * ```javascript
 * import { LABELS } from 'c/sfGpsDsCaOnLabels';
 *
 * // In component
 * get searchButtonLabel() {
 *   return LABELS.Common.Search;
 * }
 * ```
 *
 * ## Adding New Labels
 *
 * 1. Add the label to CustomLabels.labels-meta.xml
 * 2. Add the French translation to fr_CA.translation-meta.xml
 * 3. Import the label in this file
 * 4. Add to the appropriate LABELS category
 *
 * @module sfGpsDsCaOnLabels
 */

// ========================================
// COMMON UI LABELS
// ========================================
import Common_Search from "@salesforce/label/c.sfGpsDsCaOn_Common_Search";
import Common_Select from "@salesforce/label/c.sfGpsDsCaOn_Common_Select";
import Common_Loading from "@salesforce/label/c.sfGpsDsCaOn_Common_Loading";
import Common_Save from "@salesforce/label/c.sfGpsDsCaOn_Common_Save";
import Common_Cancel from "@salesforce/label/c.sfGpsDsCaOn_Common_Cancel";
import Common_Close from "@salesforce/label/c.sfGpsDsCaOn_Common_Close";
import Common_Continue from "@salesforce/label/c.sfGpsDsCaOn_Common_Continue";
import Common_Back from "@salesforce/label/c.sfGpsDsCaOn_Common_Back";
import Common_Next from "@salesforce/label/c.sfGpsDsCaOn_Common_Next";
import Common_Previous from "@salesforce/label/c.sfGpsDsCaOn_Common_Previous";
import Common_Required from "@salesforce/label/c.sfGpsDsCaOn_Common_Required";
import Common_Optional from "@salesforce/label/c.sfGpsDsCaOn_Common_Optional";
import Common_Clear from "@salesforce/label/c.sfGpsDsCaOn_Common_Clear";
import Common_Edit from "@salesforce/label/c.sfGpsDsCaOn_Common_Edit";
import Common_Delete from "@salesforce/label/c.sfGpsDsCaOn_Common_Delete";
import Common_Add from "@salesforce/label/c.sfGpsDsCaOn_Common_Add";
import Common_Remove from "@salesforce/label/c.sfGpsDsCaOn_Common_Remove";
import Common_ShowDetails from "@salesforce/label/c.sfGpsDsCaOn_Common_ShowDetails";
import Common_HideDetails from "@salesforce/label/c.sfGpsDsCaOn_Common_HideDetails";
import Common_ExpandAll from "@salesforce/label/c.sfGpsDsCaOn_Common_ExpandAll";
import Common_CollapseAll from "@salesforce/label/c.sfGpsDsCaOn_Common_CollapseAll";
import Common_BackToTop from "@salesforce/label/c.sfGpsDsCaOn_Common_BackToTop";
import Common_SkipToContent from "@salesforce/label/c.sfGpsDsCaOn_Common_SkipToContent";
import Common_SkipOptions from "@salesforce/label/c.sfGpsDsCaOn_Common_SkipOptions";

// ========================================
// SITE SELECTOR LABELS
// ========================================
import SiteSelector_Title from "@salesforce/label/c.sfGpsDsCaOn_SiteSelector_Title";
import SiteSelector_ButtonLabel from "@salesforce/label/c.sfGpsDsCaOn_SiteSelector_ButtonLabel";
import SiteSelector_SearchByParameters from "@salesforce/label/c.sfGpsDsCaOn_SiteSelector_SearchByParameters";
import SiteSelector_SearchPlaceholder from "@salesforce/label/c.sfGpsDsCaOn_SiteSelector_SearchPlaceholder";
import SiteSelector_ClearSearch from "@salesforce/label/c.sfGpsDsCaOn_SiteSelector_ClearSearch";
import SiteSelector_SubmittedLocation from "@salesforce/label/c.sfGpsDsCaOn_SiteSelector_SubmittedLocation";
import SiteSelector_SubmittedHint from "@salesforce/label/c.sfGpsDsCaOn_SiteSelector_SubmittedHint";
import SiteSelector_LocationDetails from "@salesforce/label/c.sfGpsDsCaOn_SiteSelector_LocationDetails";
import SiteSelector_SaveInstructions from "@salesforce/label/c.sfGpsDsCaOn_SiteSelector_SaveInstructions";
import SiteSelector_SaveSiteAddress from "@salesforce/label/c.sfGpsDsCaOn_SiteSelector_SaveSiteAddress";
import SiteSelector_TabSearch from "@salesforce/label/c.sfGpsDsCaOn_SiteSelector_TabSearch";
import SiteSelector_TabSitePoint from "@salesforce/label/c.sfGpsDsCaOn_SiteSelector_TabSitePoint";
import SiteSelector_TabLayers from "@salesforce/label/c.sfGpsDsCaOn_SiteSelector_TabLayers";
import SiteSelector_Address from "@salesforce/label/c.sfGpsDsCaOn_SiteSelector_Address";
import SiteSelector_Coordinates from "@salesforce/label/c.sfGpsDsCaOn_SiteSelector_Coordinates";
import SiteSelector_LotConcession from "@salesforce/label/c.sfGpsDsCaOn_SiteSelector_LotConcession";

// ========================================
// DISCHARGE POINT LABELS
// ========================================
import DischargePoint_Title from "@salesforce/label/c.sfGpsDsCaOn_DischargePoint_Title";
import DischargePoint_ButtonLabel from "@salesforce/label/c.sfGpsDsCaOn_DischargePoint_ButtonLabel";
import DischargePoint_SearchMethod from "@salesforce/label/c.sfGpsDsCaOn_DischargePoint_SearchMethod";
import DischargePoint_LatLong from "@salesforce/label/c.sfGpsDsCaOn_DischargePoint_LatLong";
import DischargePoint_UTM from "@salesforce/label/c.sfGpsDsCaOn_DischargePoint_UTM";
import DischargePoint_DecimalDegrees from "@salesforce/label/c.sfGpsDsCaOn_DischargePoint_DecimalDegrees";
import DischargePoint_DMS from "@salesforce/label/c.sfGpsDsCaOn_DischargePoint_DMS";
import DischargePoint_UTMConversionError from "@salesforce/label/c.sfGpsDsCaOn_DischargePoint_UTMConversionError";
import DischargePoint_TabPinDrop from "@salesforce/label/c.sfGpsDsCaOn_DischargePoint_TabPinDrop";

// ========================================
// TASK LIST LABELS
// ========================================
import Task_NotStarted from "@salesforce/label/c.sfGpsDsCaOn_Task_NotStarted";
import Task_InProgress from "@salesforce/label/c.sfGpsDsCaOn_Task_InProgress";
import Task_Completed from "@salesforce/label/c.sfGpsDsCaOn_Task_Completed";
import Task_CannotStart from "@salesforce/label/c.sfGpsDsCaOn_Task_CannotStart";
import Task_Error from "@salesforce/label/c.sfGpsDsCaOn_Task_Error";

// ========================================
// ERROR MESSAGES - NETWORK
// ========================================
import Error_NetworkTitle from "@salesforce/label/c.sfGpsDsCaOn_Error_NetworkTitle";
import Error_NetworkMessage from "@salesforce/label/c.sfGpsDsCaOn_Error_NetworkMessage";
import Error_TimeoutTitle from "@salesforce/label/c.sfGpsDsCaOn_Error_TimeoutTitle";
import Error_TimeoutMessage from "@salesforce/label/c.sfGpsDsCaOn_Error_TimeoutMessage";

// ========================================
// ERROR MESSAGES - LOCATION
// ========================================
import Error_LocationNotFoundTitle from "@salesforce/label/c.sfGpsDsCaOn_Error_LocationNotFoundTitle";
import Error_LocationNotFoundMessage from "@salesforce/label/c.sfGpsDsCaOn_Error_LocationNotFoundMessage";
import Error_LocationOutsideOntarioTitle from "@salesforce/label/c.sfGpsDsCaOn_Error_LocationOutsideOntarioTitle";
import Error_LocationOutsideOntarioMessage from "@salesforce/label/c.sfGpsDsCaOn_Error_LocationOutsideOntarioMessage";
import Error_SearchNoResultsTitle from "@salesforce/label/c.sfGpsDsCaOn_Error_SearchNoResultsTitle";
import Error_SearchNoResultsMessage from "@salesforce/label/c.sfGpsDsCaOn_Error_SearchNoResultsMessage";

// ========================================
// ERROR MESSAGES - MAP
// ========================================
import Error_MapLoadTitle from "@salesforce/label/c.sfGpsDsCaOn_Error_MapLoadTitle";
import Error_MapLoadMessage from "@salesforce/label/c.sfGpsDsCaOn_Error_MapLoadMessage";
import Error_MapLayerTitle from "@salesforce/label/c.sfGpsDsCaOn_Error_MapLayerTitle";
import Error_MapLayerMessage from "@salesforce/label/c.sfGpsDsCaOn_Error_MapLayerMessage";

// ========================================
// ERROR MESSAGES - SERVICE
// ========================================
import Error_ServiceUnavailableTitle from "@salesforce/label/c.sfGpsDsCaOn_Error_ServiceUnavailableTitle";
import Error_ServiceUnavailableMessage from "@salesforce/label/c.sfGpsDsCaOn_Error_ServiceUnavailableMessage";
import Error_EligibilityCheckTitle from "@salesforce/label/c.sfGpsDsCaOn_Error_EligibilityCheckTitle";
import Error_EligibilityCheckMessage from "@salesforce/label/c.sfGpsDsCaOn_Error_EligibilityCheckMessage";
import Error_DataLoadTitle from "@salesforce/label/c.sfGpsDsCaOn_Error_DataLoadTitle";
import Error_DataLoadMessage from "@salesforce/label/c.sfGpsDsCaOn_Error_DataLoadMessage";
import Error_SaveTitle from "@salesforce/label/c.sfGpsDsCaOn_Error_SaveTitle";
import Error_SaveMessage from "@salesforce/label/c.sfGpsDsCaOn_Error_SaveMessage";

// ========================================
// ERROR MESSAGES - VALIDATION
// ========================================
import Error_RequiredFieldTitle from "@salesforce/label/c.sfGpsDsCaOn_Error_RequiredFieldTitle";
import Error_RequiredFieldMessage from "@salesforce/label/c.sfGpsDsCaOn_Error_RequiredFieldMessage";
import Error_InvalidFormatTitle from "@salesforce/label/c.sfGpsDsCaOn_Error_InvalidFormatTitle";
import Error_InvalidFormatMessage from "@salesforce/label/c.sfGpsDsCaOn_Error_InvalidFormatMessage";
import Error_InvalidEmailMessage from "@salesforce/label/c.sfGpsDsCaOn_Error_InvalidEmailMessage";
import Error_InvalidPhoneMessage from "@salesforce/label/c.sfGpsDsCaOn_Error_InvalidPhoneMessage";
import Error_InvalidPostalCodeMessage from "@salesforce/label/c.sfGpsDsCaOn_Error_InvalidPostalCodeMessage";
import Error_InvalidDateMessage from "@salesforce/label/c.sfGpsDsCaOn_Error_InvalidDateMessage";

// ========================================
// ERROR MESSAGES - AUTH
// ========================================
import Error_SessionExpiredTitle from "@salesforce/label/c.sfGpsDsCaOn_Error_SessionExpiredTitle";
import Error_SessionExpiredMessage from "@salesforce/label/c.sfGpsDsCaOn_Error_SessionExpiredMessage";
import Error_AccessDeniedTitle from "@salesforce/label/c.sfGpsDsCaOn_Error_AccessDeniedTitle";
import Error_AccessDeniedMessage from "@salesforce/label/c.sfGpsDsCaOn_Error_AccessDeniedMessage";

// ========================================
// ERROR MESSAGES - GENERIC
// ========================================
import Error_GenericTitle from "@salesforce/label/c.sfGpsDsCaOn_Error_GenericTitle";
import Error_GenericMessage from "@salesforce/label/c.sfGpsDsCaOn_Error_GenericMessage";
import Error_ConfigurationTitle from "@salesforce/label/c.sfGpsDsCaOn_Error_ConfigurationTitle";
import Error_ConfigurationMessage from "@salesforce/label/c.sfGpsDsCaOn_Error_ConfigurationMessage";

// ========================================
// ERROR ACTIONS
// ========================================
import Error_ActionTryAgain from "@salesforce/label/c.sfGpsDsCaOn_Error_ActionTryAgain";
import Error_ActionRefreshPage from "@salesforce/label/c.sfGpsDsCaOn_Error_ActionRefreshPage";
import Error_ActionContactSupport from "@salesforce/label/c.sfGpsDsCaOn_Error_ActionContactSupport";
import Error_ActionSignIn from "@salesforce/label/c.sfGpsDsCaOn_Error_ActionSignIn";

// ========================================
// ACCESSIBILITY
// ========================================
import A11y_AddressSelected from "@salesforce/label/c.sfGpsDsCaOn_A11y_AddressSelected";
import A11y_LocationUpdated from "@salesforce/label/c.sfGpsDsCaOn_A11y_LocationUpdated";
import A11y_SearchResults from "@salesforce/label/c.sfGpsDsCaOn_A11y_SearchResults";
import A11y_NoResults from "@salesforce/label/c.sfGpsDsCaOn_A11y_NoResults";
import A11y_LoadingComplete from "@salesforce/label/c.sfGpsDsCaOn_A11y_LoadingComplete";
import A11y_FormError from "@salesforce/label/c.sfGpsDsCaOn_A11y_FormError";
import A11y_StepOf from "@salesforce/label/c.sfGpsDsCaOn_A11y_StepOf";

/**
 * All labels organized by category.
 * Labels are automatically translated based on user's language setting.
 */
export const LABELS = {
  Common: {
    Search: Common_Search,
    Select: Common_Select,
    Loading: Common_Loading,
    Save: Common_Save,
    Cancel: Common_Cancel,
    Close: Common_Close,
    Continue: Common_Continue,
    Back: Common_Back,
    Next: Common_Next,
    Previous: Common_Previous,
    Required: Common_Required,
    Optional: Common_Optional,
    Clear: Common_Clear,
    Edit: Common_Edit,
    Delete: Common_Delete,
    Add: Common_Add,
    Remove: Common_Remove,
    ShowDetails: Common_ShowDetails,
    HideDetails: Common_HideDetails,
    ExpandAll: Common_ExpandAll,
    CollapseAll: Common_CollapseAll,
    BackToTop: Common_BackToTop,
    SkipToContent: Common_SkipToContent,
    SkipOptions: Common_SkipOptions
  },

  SiteSelector: {
    Title: SiteSelector_Title,
    ButtonLabel: SiteSelector_ButtonLabel,
    SearchByParameters: SiteSelector_SearchByParameters,
    SearchPlaceholder: SiteSelector_SearchPlaceholder,
    ClearSearch: SiteSelector_ClearSearch,
    SubmittedLocation: SiteSelector_SubmittedLocation,
    SubmittedHint: SiteSelector_SubmittedHint,
    LocationDetails: SiteSelector_LocationDetails,
    SaveInstructions: SiteSelector_SaveInstructions,
    SaveSiteAddress: SiteSelector_SaveSiteAddress,
    TabSearch: SiteSelector_TabSearch,
    TabSitePoint: SiteSelector_TabSitePoint,
    TabLayers: SiteSelector_TabLayers,
    Address: SiteSelector_Address,
    Coordinates: SiteSelector_Coordinates,
    LotConcession: SiteSelector_LotConcession
  },

  DischargePoint: {
    Title: DischargePoint_Title,
    ButtonLabel: DischargePoint_ButtonLabel,
    SearchMethod: DischargePoint_SearchMethod,
    LatLong: DischargePoint_LatLong,
    UTM: DischargePoint_UTM,
    DecimalDegrees: DischargePoint_DecimalDegrees,
    DMS: DischargePoint_DMS,
    UTMConversionError: DischargePoint_UTMConversionError,
    TabPinDrop: DischargePoint_TabPinDrop
  },

  Task: {
    NotStarted: Task_NotStarted,
    InProgress: Task_InProgress,
    Completed: Task_Completed,
    CannotStart: Task_CannotStart,
    Error: Task_Error
  },

  Error: {
    NetworkTitle: Error_NetworkTitle,
    NetworkMessage: Error_NetworkMessage,
    TimeoutTitle: Error_TimeoutTitle,
    TimeoutMessage: Error_TimeoutMessage,
    LocationNotFoundTitle: Error_LocationNotFoundTitle,
    LocationNotFoundMessage: Error_LocationNotFoundMessage,
    LocationOutsideOntarioTitle: Error_LocationOutsideOntarioTitle,
    LocationOutsideOntarioMessage: Error_LocationOutsideOntarioMessage,
    SearchNoResultsTitle: Error_SearchNoResultsTitle,
    SearchNoResultsMessage: Error_SearchNoResultsMessage,
    MapLoadTitle: Error_MapLoadTitle,
    MapLoadMessage: Error_MapLoadMessage,
    MapLayerTitle: Error_MapLayerTitle,
    MapLayerMessage: Error_MapLayerMessage,
    ServiceUnavailableTitle: Error_ServiceUnavailableTitle,
    ServiceUnavailableMessage: Error_ServiceUnavailableMessage,
    EligibilityCheckTitle: Error_EligibilityCheckTitle,
    EligibilityCheckMessage: Error_EligibilityCheckMessage,
    DataLoadTitle: Error_DataLoadTitle,
    DataLoadMessage: Error_DataLoadMessage,
    SaveTitle: Error_SaveTitle,
    SaveMessage: Error_SaveMessage,
    RequiredFieldTitle: Error_RequiredFieldTitle,
    RequiredFieldMessage: Error_RequiredFieldMessage,
    InvalidFormatTitle: Error_InvalidFormatTitle,
    InvalidFormatMessage: Error_InvalidFormatMessage,
    InvalidEmailMessage: Error_InvalidEmailMessage,
    InvalidPhoneMessage: Error_InvalidPhoneMessage,
    InvalidPostalCodeMessage: Error_InvalidPostalCodeMessage,
    InvalidDateMessage: Error_InvalidDateMessage,
    SessionExpiredTitle: Error_SessionExpiredTitle,
    SessionExpiredMessage: Error_SessionExpiredMessage,
    AccessDeniedTitle: Error_AccessDeniedTitle,
    AccessDeniedMessage: Error_AccessDeniedMessage,
    GenericTitle: Error_GenericTitle,
    GenericMessage: Error_GenericMessage,
    ConfigurationTitle: Error_ConfigurationTitle,
    ConfigurationMessage: Error_ConfigurationMessage,
    ActionTryAgain: Error_ActionTryAgain,
    ActionRefreshPage: Error_ActionRefreshPage,
    ActionContactSupport: Error_ActionContactSupport,
    ActionSignIn: Error_ActionSignIn
  },

  A11y: {
    AddressSelected: A11y_AddressSelected,
    LocationUpdated: A11y_LocationUpdated,
    SearchResults: A11y_SearchResults,
    NoResults: A11y_NoResults,
    LoadingComplete: A11y_LoadingComplete,
    FormError: A11y_FormError,
    StepOf: A11y_StepOf
  }
};

/**
 * Formats a label with placeholder replacements.
 * Placeholders use {0}, {1}, etc. format.
 *
 * @param {string} label - The label with placeholders
 * @param {...*} args - Values to replace placeholders
 * @returns {string} Formatted string
 *
 * @example
 * formatLabel(LABELS.A11y.StepOf, 2, 5); // "Step 2 of 5"
 */
export function formatLabel(label, ...args) {
  if (!label) return "";
  return label.replace(/\{(\d+)\}/g, (match, index) => {
    const idx = parseInt(index, 10);
    return idx < args.length ? String(args[idx]) : match;
  });
}

/**
 * Gets a task status label by status key.
 *
 * @param {string} status - Status key (e.g., "not-started", "in-progress")
 * @returns {string} Translated status label
 */
export function getTaskStatusLabel(status) {
  const statusMap = {
    "not-started": LABELS.Task.NotStarted,
    "in-progress": LABELS.Task.InProgress,
    completed: LABELS.Task.Completed,
    "cannot-start-yet": LABELS.Task.CannotStart,
    optional: LABELS.Common.Optional,
    error: LABELS.Task.Error
  };
  return statusMap[status] || status;
}

export default LABELS;
