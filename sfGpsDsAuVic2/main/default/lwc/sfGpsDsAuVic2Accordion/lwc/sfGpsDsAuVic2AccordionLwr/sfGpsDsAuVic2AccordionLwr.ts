/*
 * Copyright (c) 2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import { computeClass, normaliseBoolean } from "c/sfGpsDsHelpers";
import ExpandableStateMixin from "c/sfGpsDsExpandableStateMixin";
import SfGpsDsLwc from "c/sfGpsDsLwc";

const CLOSE_ACTION = "close";
const OPEN_ACTION = "open";

const NUMBERED_DEFAULT = false;

const I18N = {
  openAll: "Open all",
  closeAll: "Close all"
};

/**
 * @slot Accordion-1
 * @slot Accordion-2
 * @slot Accordion-3
 * @slot Accordion-4
 * @slot Accordion-5
 * @slot Accordion-6
 * @slot Accordion-7
 * @slot Accordion-8
 * @slot Accordion-9
 * @slot Accordion-10
 */
export default 
class SfGpsDsAuVic2Accordion 
extends ExpandableStateMixin<SfGpsDsLwc>(
  SfGpsDsLwc
) {
  items: Array<{
    title: string,
    className?: string,
    active?: boolean;
  }>;

  constructor() {
    super();

    this.items = [
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" }
    ];
  }

  // @ts-ignore
  @api 
  set item1Title(value) {
    this._items[0].title = value;
  }
  get item1Title() {
    return this._items[0].title;
  }
  get item1ClassName() {
    return this._items[0].className;
  }
  get item1Active() {
    return this._items[0].active;
  }

  // @ts-ignore
  @api 
  set item2Title(value) {
    this._items[1].title = value;
  }
  get item2Title() {
    return this._items[1].title;
  }
  get item2ClassName() {
    return this._items[1].className;
  }
  get item2Active() {
    return this._items[1].active;
  }

  // @ts-ignore
  @api 
  set item3Title(value) {
    this._items[2].title = value;
  }
  get item3Title() {
    return this._items[2].title;
  }
  get item3ClassName() {
    return this._items[2].className;
  }
  get item3Active() {
    return this._items[2].active;
  }

  // @ts-ignore
  @api
  set 
  item4Title(value) {
    this._items[3].title = value;
  }
  get item4Title() {
    return this._items[3].title;
  }
  get item4ClassName() {
    return this._items[3].className;
  }
  get item4Active() {
    return this._items[3].active;
  }

  // @ts-ignore
  @api
  set 
  item5Title(value) {
    this._items[4].title = value;
  }
  get item5Title() {
    return this._items[4].title;
  }
  get item5ClassName() {
    return this._items[4].className;
  }
  get item5Active() {
    return this._items[4].active;
  }

  // @ts-ignore
  @api
  set 
  item6Title(value) {
    this._items[5].title = value;
  }
  get item6Title() {
    return this._items[5].title;
  }
  get item6ClassName() {
    return this._items[5].className;
  }
  get item6Active() {
    return this._items[5].active;
  }

  // @ts-ignore
  @api
  set 
  item7Title(value) {
    this._items[6].title = value;
  }
  get item7Title() {
    return this._items[6].title;
  }
  get item7ClassName() {
    return this._items[6].className;
  }
  get item7Active() {
    return this._items[6].active;
  }

  // @ts-ignore
  @api
  set 
  item8Title(value) {
    this._items[7].title = value;
  }
  get item8Title() {
    return this._items[7].title;
  }
  get item8ClassName() {
    return this._items[7].className;
  }
  get item8Active() {
    return this._items[7].active;
  }

  // @ts-ignore
  @api
  set 
  item9Title(value) {
    this._items[8].title = value;
  }
  get item9Title() {
    return this._items[8].title;
  }
  get item9ClassName() {
    return this._items[8].className;
  }
  get item9Active() {
    return this._items[8].active;
  }

  // @ts-ignore
  @api
  set item10Title(value) {
    this._items[9].title = value;
  }
  get item10Title() {
    return this._items[9].title;
  }
  get item10ClassName() {
    return this._items[9].className;
  }
  get item10Active() {
    return this._items[9].active;
  }

  // @ts-ignore
  @api 
  numbered?: boolean;
  _numbered = this.defineBooleanProperty("numbered", {
    defaultValue: NUMBERED_DEFAULT
  });

  // @ts-ignore
  @api 
  className?: string;

  /* items */

  mapItem(
    item: any, 
    index: number, 
    _length: number, 
    active: boolean
  ): any {
    let indexP1 = index + 1;

    return {
      ...item,
      index: indexP1,
      toggleId: `sfgpsds-au-vic2-accordion-item-${indexP1}-toggle`,
      contentId: `sfgpsds-au-vic2-accordion-item-${indexP1}-content`,
      className: computeClass({
        "rpl-accordion__item": true,
        "rpl-accordion__item--active": active
      }),
      inactive: !active,
      active: active
    };
  }

  /* api readonly: allExpanded */

  // @ts-ignore
  @api
  get allExpanded() {
    return super.isAllExpanded();
  }

  /* api readonly: allCollapsed */

  // @ts-ignore
  @api
  get allCollapsed() {
    return super.isAllCollapsed();
  }

  /* computed: computedClassName */

  get computedClassName(): any {
    return computeClass({
      "rpl-accordion": true,
      [this.className || ""]: !!this.className
    });
  }

  /* computed: computedToggleAllLabel */

  get computedToggleAllLabel(): string {
    return this.allExpanded ? I18N.closeAll : I18N.openAll;
  }

  /* computed: computedShowButton */

  get computedShowButton(): boolean {
    return this._items.length > 0;
  }

  /* event management */

  handleToggleAll() {
    this.toggleAll();
  }

  handleToggleItem(event: CustomEvent) {
    this.toggleItemByIndex(event.detail.index);
  }

  /* methods */

  // @ts-ignore
  @api
  toggleAll() {
    const isAllExpanded = super.toggleAll();

    this.dispatchEvent(
      new CustomEvent("toggleall", {
        detail: isAllExpanded ? OPEN_ACTION : CLOSE_ACTION
      })
    );

    return isAllExpanded;
  }

  // @ts-ignore
  @api
  toggleItemByIndex(index: number) {
    const isActive = super.toggleItemByIndex(index);

    if (isActive == null) return;

    this.dispatchEvent(
      new CustomEvent("toggleitem", {
        detail: {
          index: index,
          action: isActive ? OPEN_ACTION : CLOSE_ACTION
        }
      })
    );

    return isActive
  }
}
