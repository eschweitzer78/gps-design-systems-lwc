/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, wire } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

// @ts-ignore - Salesforce Apex import
import getCurrentUserTasks from "@salesforce/apex/SfGpsDsCaOnTaskController.getCurrentUserTasks";
// @ts-ignore - Salesforce Apex import
import getRelatedTasks from "@salesforce/apex/SfGpsDsCaOnTaskController.getRelatedTasks";
// @ts-ignore - Salesforce Apex import
import { refreshApex } from "@salesforce/apex";
// @ts-ignore - LWC module import
import { formatUserError, getMessage } from "c/sfGpsDsCaOnUserMessages";

// eslint-disable-next-line no-unused-vars
const DEBUG = false;
// eslint-disable-next-line no-unused-vars
const CLASS_NAME = "SfGpsDsCaOnTaskListSalesforce";

interface TaskItem {
  id: string;
  label: string;
  hint?: string;
  hintText?: string; // From Apex (hint is reserved in Apex)
  status: string;
  statusLabel?: string;
  url?: string;
}

interface WireResult {
  error?: Error;
  data?: TaskItem[];
}

export default class SfGpsDsCaOnTaskListSalesforce extends SfGpsDsLwc {
  static renderMode = "light";

  // @ts-ignore
  @api
  recordId?: string;

  // @ts-ignore
  @api
  showCompleted?: boolean;
  _showCompleted = this.defineBooleanProperty("showCompleted", {
    defaultValue: false
  });

  // @ts-ignore
  @api
  maxRecords?: number;
  _maxRecords = this.defineIntegerProperty("maxRecords", {
    defaultValue: 50
  });

  // @ts-ignore
  @api
  emptyMessage?: string;

  // @ts-ignore
  @api
  className?: string;

  _tasks: TaskItem[] = [];
  _error: string | null = null;
  _isLoading = true;
  _wiredResult: WireResult | null = null;

  /* Wire for current user's tasks (when no recordId) */
  // @ts-ignore - LWC wire decorator
  @wire(getCurrentUserTasks, { 
    showCompleted: "$_showCompleted.value", 
    maxRecords: "$_maxRecords.value" 
  })
  wiredCurrentUserTasks(result: WireResult) {
    if (this.recordId) return; // Skip if we're using related tasks
    
    this._wiredResult = result;
    this._isLoading = false;
    
    if (result.data) {
      // Map hintText to hint (hint is reserved in Apex)
      this._tasks = result.data.map(item => ({
        ...item,
        hint: item.hintText || item.hint
      }));
      this._error = null;
    } else if (result.error) {
      // Use user-friendly error message
      this._error = formatUserError(result.error, getMessage("DATA_LOAD_ERROR").message);
      this._tasks = [];
    }
  }

  /* Wire for tasks related to a record */
  // @ts-ignore - LWC wire decorator
  @wire(getRelatedTasks, { 
    recordId: "$recordId",
    showCompleted: "$_showCompleted.value", 
    maxRecords: "$_maxRecords.value" 
  })
  wiredRelatedTasks(result: WireResult) {
    if (!this.recordId) return; // Skip if we're using current user tasks
    
    this._wiredResult = result;
    this._isLoading = false;
    
    if (result.data) {
      // Map hintText to hint (hint is reserved in Apex)
      this._tasks = result.data.map(item => ({
        ...item,
        hint: item.hintText || item.hint
      }));
      this._error = null;
    } else if (result.error) {
      // Use user-friendly error message
      this._error = formatUserError(result.error, getMessage("DATA_LOAD_ERROR").message);
      this._tasks = [];
    }
  }

  /* getters */

  get hasError(): boolean {
    return Boolean(this._error);
  }

  get hasTasks(): boolean {
    return this._tasks && this._tasks.length > 0;
  }

  get isEmpty(): boolean {
    return !this._isLoading && !this.hasError && !this.hasTasks;
  }

  get computedEmptyMessage(): string {
    return this.emptyMessage || "No tasks found";
  }

  /* public methods */

  // @ts-ignore
  @api
  refresh(): Promise<void> {
    if (this._wiredResult) {
      return refreshApex(this._wiredResult);
    }
    return Promise.resolve();
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
