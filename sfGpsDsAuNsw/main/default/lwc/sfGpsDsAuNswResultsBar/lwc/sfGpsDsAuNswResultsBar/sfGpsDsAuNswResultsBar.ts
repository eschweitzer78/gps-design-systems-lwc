/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {
  api
} from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
import {
  uniqueId,
  isArray,
  formatTemplate
} from "c/sfGpsDsHelpers";

import type {
  SortOption
} from "c/sfGpsDsAuNswResultBar";

const FROM_DEFAULT = 0;
const TO_DEFAULT = 0;
const TOTAL_DEFAULT = 0;
const VALUE_DEFAULT = null;

export default 
class SfGpsDsAuNswResultsBar
extends SfGpsDsElement {
  static renderMode: "light" | "shadow" = "light";

  // @ts-ignore
  @api 
  name?: string;

  // @ts-ignore
  @api 
  className?: string;

  // @ts-ignore
  @api 
  from?: number;
  _from = this.defineIntegerProperty("from", {
    minValue: 0,
    defaultValue: FROM_DEFAULT
  });

  // @ts-ignore
  @api 
  to?: number;
  _to = this.defineIntegerProperty("to", {
    minValue: 0,
    defaultValue: TO_DEFAULT
  });

  // @ts-ignore
  @api 
  total?: number;
  _total = this.defineIntegerProperty("total", {
    minValue: 0,
    defaultValue: TOTAL_DEFAULT
  });

  // @ts-ignore
  @api 
  noResultText: string = "Sorry, no results found for your search";

  // @ts-ignore
  @api 
  resultsText: string = "Showing results {from} - {to} of {total} results";

  // @ts-ignore
  @api 
  value?: string;
  _value = this.defineStringProperty("value", {
    defaultValue: VALUE_DEFAULT,
    watcher: () => this.reconcileValueOptions()
  });

  /* api: sortOptions */

  _sortOptions?: SortOption[];
  _sortOptionsOriginal?: SortOption[] | SortOption;
  _visibleSortOptions?: SortOption[];

  // @ts-ignore
  @api
  get sortOptions(): SortOption[] | SortOption | undefined {
    return this._sortOptionsOriginal;
  }

  set sortOptions(value: SortOption[] | SortOption) {
    this._sortOptionsOriginal = value;

    if (value == null) {
      this._sortOptions = undefined;
      // eslint-disable-next-line @lwc/lwc/no-api-reassignments
      this.value = undefined;
    } else if (isArray(value)) {
      this._sortOptions = (value as SortOption[]).map((option) => ({
        ...option
      }));
    } else {
      this._sortOptions = [value as SortOption];
    }

    this.reconcileValueOptions();
  }

  /* computed */

  get computedClassName(): any {
    return {
      "nsw-results-bar": true,
      [this.className || ""]: !!this.className
    };
  }

  _selectId?: string;

  get computedSelectId(): string {
    if (!this._selectId) {
      this._selectId = uniqueId("sf-gps-ds-au-nsw-results-bar-select");
    }

    return this._selectId;
  }

  get computedResultsText(): string | null {
    return this.resultsText
      ? formatTemplate(this.resultsText, {
          from: this._from.value?.toString(),
          to: this._to.value?.toString(),
          total: this._total.value?.toString()
        })
      : null;
  }

  /* methods */

  reconcileValueOptions(): void {
    if (this._sortOptions == undefined) {
      this._visibleSortOptions = undefined;
      return;
    }

    if (this._value.value == null && this._sortOptions[0]) {
      // eslint-disable-next-line @lwc/lwc/no-api-reassignments
      this.value = this._sortOptions[0].value;
    }

    this._visibleSortOptions = this._sortOptions.map((option) => ({
      ...option,
      selected: option.value === this._value.value
    }));
  }

  /* event management */

  handleSelectChange(
    event: InputEvent
  ): void {
    event.preventDefault();
    event.stopPropagation();

    const target = event.target as HTMLSelectElement;
    // eslint-disable-next-line @lwc/lwc/no-api-reassignments
    this.value = target.value;

    this.dispatchEvent(
      new CustomEvent("change", { detail: target.value })
    );
  }
}
