/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
// @ts-ignore - LWC module import
import { LABELS } from "c/sfGpsDsCaOnLabels";

// eslint-disable-next-line no-unused-vars
const DEBUG = false;
// eslint-disable-next-line no-unused-vars
const CLASS_NAME = "SfGpsDsCaOnTaskList";

export type TaskStatus = "not-started" | "in-progress" | "complete" | "cannot-start-yet" | "optional" | "error";

export interface TaskItem {
  label: string;
  hint?: string;
  status: TaskStatus;
  statusLabel?: string;
  url?: string;
}

/**
 * Gets translated status labels from Custom Labels.
 * Labels are automatically translated based on user's language.
 */
function getStatusLabels(): Record<TaskStatus, string> {
  return {
    "not-started": LABELS.Task.NotStarted,
    "in-progress": LABELS.Task.InProgress,
    "complete": LABELS.Task.Completed,
    "cannot-start-yet": LABELS.Task.CannotStart,
    "optional": LABELS.Common.Optional,
    "error": LABELS.Task.Error
  };
}

export default class SfGpsDsCaOnTaskList extends SfGpsDsLwc {
  static renderMode = "light";

  // @ts-ignore
  @api
  items?: TaskItem[] | string;

  // @ts-ignore
  @api
  className?: string;

  /* getters */

  get computedItems(): Array<TaskItem & { 
    id: string; 
    labelId: string;
    hintId: string;
    taskClassName: string; 
    hasUrl: boolean;
    hasHint: boolean;
    computedStatusLabel: string;
    ariaDescribedBy: string | null;
  }> {
    if (!this.items) return [];

    let parsedItems: TaskItem[];
    if (typeof this.items === "string") {
      try {
        parsedItems = JSON.parse(this.items);
      } catch {
        return [];
      }
    } else {
      parsedItems = this.items;
    }

    return parsedItems.map((item, index) => {
      const hasHint = Boolean(item.hint);
      const hintId = `task-hint-${index}`;
      return {
        ...item,
        id: `task-${index}`,
        labelId: `task-label-${index}`,
        hintId,
        taskClassName: this.getTaskClassName(item),
        hasUrl: Boolean(item.url) && item.status !== "complete" && item.status !== "cannot-start-yet",
        hasHint,
        computedStatusLabel: item.statusLabel || getStatusLabels()[item.status] || item.status,
        ariaDescribedBy: hasHint ? hintId : null
      };
    });
  }

  get computedClassName(): string {
    const classes = ["ontario-task-list__container"];
    if (this.className) {
      classes.push(this.className);
    }
    return classes.join(" ");
  }

  private getTaskClassName(item: TaskItem): string {
    const classes = ["ontario-task", `ontario-task-status--${item.status}`];
    return classes.join(" ");
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
