/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api 
} from "lwc";
import { 
  isArray, 
  uniqueId 
} from "c/sfGpsDsHelpers";
import SfGpsDsElement from "c/sfGpsDsElement";

import type { 
  TagLink,
  DisplayTagLink
} from "c/sfGpsDsAuNswTags";

const TAG_PREFIX = "sf-gps-ds-au-nsw-tag";
const DEFAULT_TAGS: TagLink[] = [];

const ASCHECKBOXES_DEFAULT = false;

export default 
class SfGpsDsAuNswTags
extends SfGpsDsElement {
  static renderMode: "light" | "shadow" = "light";

  // @ts-ignore
  @api 
  className?: string;

  // @ts-ignore
  @api 
  asCheckboxes?: boolean;
  _asCheckboxes = this.defineBooleanProperty("asCheckboxes", {
    defaultValue: ASCHECKBOXES_DEFAULT,
    watcher: () => this.updateTags()
  });

  /* api: tags */

  _tags: TagLink[] = DEFAULT_TAGS;
  _tagsOriginal: TagLink[] = DEFAULT_TAGS;

  // @ts-ignore
  @api
  get tags(): TagLink[] {
    return this._tagsOriginal;
  }

  set tags(value: TagLink[]) {
    this._tagsOriginal = value;
    this.updateTags();
  }

  /* computed */

  get computedClassName(): any {
    return {
      "nsw-list": true,
      "nsw-list--8": true,
      [this.className || ""]: !!this.className
    };
  }

  _idBase?: string;

  get idBase(): string {
    if (this._idBase == null) {
      this._idBase = uniqueId(TAG_PREFIX);
    }

    return this._idBase;
  }

  /* methods */

  updateTags(): void {
    this._tags = isArray(this._tagsOriginal)
      ? this._tagsOriginal.map((tag, index) => ({
          ...tag,
          key: `${this.idBase}-${index}`,
          checked: tag.checked || false,
          className: {
            "nsw-tag": true,
            "nsw-tag--checkbox": this._asCheckboxes.value,
            [tag.className || ""]: !!tag.className
          }
        }))
      : DEFAULT_TAGS;
  }

  /* event management */

  handleCheckboxClick(
    event: MouseEvent
  ): void {
    event.preventDefault();
    event.stopPropagation();

    const element = event.target as HTMLElement;

    if (element == null || this._tags == null) {
      return;
    }

    if (element.dataset.idx == undefined) 
      return;

    const targetIndex = parseInt(element.dataset.idx, 10);
    const tag = this._tags[targetIndex];

    if (
      typeof targetIndex === "undefined" ||
      Number.isNaN(targetIndex) ||
      targetIndex < 0 ||
      targetIndex >= this._tags.length
    ) {
      return;
    }

    this.dispatchEvent(
      new CustomEvent("change", {
        detail: {
          index: targetIndex,
          checked: !tag.checked
        }
      })
    );
  }
}
