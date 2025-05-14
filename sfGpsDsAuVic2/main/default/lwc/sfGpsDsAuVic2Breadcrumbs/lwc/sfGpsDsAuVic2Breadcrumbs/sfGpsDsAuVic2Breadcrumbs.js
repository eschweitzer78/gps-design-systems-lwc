import { LightningElement, api, track } from "lwc";
import {
  normaliseBoolean,
  normaliseInteger,
  getCssPropertyValue
} from "c/sfGpsDsHelpers";

const BESIDEQUICKEXIT_DEFAULT = false;
const DISPLAYBEFORECOLLAPSE_DEFAULT = 3;
const COLLAPSE_DEFAULT = false;

const DEBUG = false;
const CLASS_NAME = "c/sfGpsDsAuVic2Breadcrumbs";

export default class extends LightningElement {
  @api className;
  @api currentClassName;
  @api currentDir;
  @api preventDefault = false;

  /* api: besideQuickExit */

  _besideQuickExit = BESIDEQUICKEXIT_DEFAULT;
  _besideQuickExitOriginal = BESIDEQUICKEXIT_DEFAULT;

  @api
  get besideQuickExit() {
    return this._besideQuickExitOriginal;
  }

  set besideQuickExit(value) {
    if (DEBUG) console.debug(CLASS_NAME, "> set besideQuickExit", value);

    this._besideQuickExitOriginal = value;
    this._besideQuickExit = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: BESIDEQUICKEXIT_DEFAULT
    });

    if (DEBUG)
      console.debug(CLASS_NAME, "< set besideQuickExit", this._besideQuickExit);
  }

  /* api: collapse */

  _collapse = COLLAPSE_DEFAULT;
  _collapseOriginal = COLLAPSE_DEFAULT;

  @api
  get collapse() {
    return this._collapseOriginal;
  }

  set collapse(value) {
    if (DEBUG) console.debug(CLASS_NAME, "> set collapse", value);

    this._collapseOriginal = value;
    this._collapse = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: COLLAPSE_DEFAULT
    });

    this.updateCollapseInnerLinks();
    if (DEBUG) console.debug(CLASS_NAME, "< set collapse", this._collapse);
  }

  /* api: displayBeforeCollapse */

  _displayBeforeCollapse = DISPLAYBEFORECOLLAPSE_DEFAULT;
  _displayBeforeCollapseOriginal = DISPLAYBEFORECOLLAPSE_DEFAULT;

  @api
  get displayBeforeCollapse() {
    return this._displayBeforeCollapseOriginal;
  }

  set displayBeforeCollapse(value) {
    if (DEBUG) console.debug(CLASS_NAME, "> set displayBeforeCollapse", value);

    this._displayBeforeCollapseOriginal = value;
    this._displayBeforeCollapse = normaliseInteger(value, {
      fallbackValue: DISPLAYBEFORECOLLAPSE_DEFAULT,
      min: 2,
      max: 10
    });
    if (DEBUG)
      console.debug(
        CLASS_NAME,
        "= set displayBeforeCollapse",
        this._displayBeforeCollapse
      );

    this.updateCollapseInnerLinks();
    if (DEBUG)
      console.debug(
        CLASS_NAME,
        "< set displayBeforeCollapse",
        this._displayBeforeCollapse
      );
  }

  /* api: items */

  _items;
  _itemsOriginal;

  @api
  get items() {
    return this._itemsOriginal;
  }

  set items(value) {
    if (DEBUG) console.debug(CLASS_NAME, "> set items", JSON.stringify(value));

    this._itemsOriginal = value;
    this._items = value;

    this.updateCollapseInnerLinks();
    if (DEBUG)
      console.debug(CLASS_NAME, "< set items", JSON.stringify(this._items));
  }

  /* tracked */

  @track _collapseInnerLinks = 0;

  /* computed */

  get computedClassName() {
    return {
      "rpl-breadcrumbs": true,
      "rpl-u-screen-only": true,
      "rpl-breadcrumbs--beside-exit": this._besideQuickExit,
      [this.className]: this.className
    };
  }

  get computedListClassName() {
    return {
      "rpl-breadcrumbs__items": true,
      "rpl-type-p-small": true,
      "rpl-breadcrumbs__items--collapsed": this._collapseInnerLinks
    };
  }

  get decoratedItems() {
    if (DEBUG)
      console.debug(
        CLASS_NAME,
        "> get decoratedItems",
        JSON.stringify(this._items)
      );

    const length = this._items?.length;
    const icil = this._initialCollapseInnerLinks;
    const rv = (this._items || []).map((item, index) => {
      const isFirst = index === 0;
      const isLast = index === length - 1;
      const isSecondLast = index === length - 2;
      const showFirstCollapsed = isFirst && !!this._collapseInnerLinks;
      return {
        ...item,
        key: `item-${index + 1}`,
        showItem: !icil || !isLast,
        className: {
          "rpl-breadcrumbs__item": true,
          "rpl-breadcrumbs__item--parent": isSecondLast,
          "rpl-breadcrumbs__item--first": showFirstCollapsed,
          "rpl-breadcrumbs__item--collapsed":
            !isFirst && !isSecondLast && this._collapseInnerLinks,
          [this.currentClassName]: isLast && this.currentClassName
        },
        itemDir: isLast ? this.currentDir : undefined,
        showFirstCollapsed,
        showLink: !isLast || this._collapseInnerLinks,
        showLast: isLast && !icil
      };
    });

    if (DEBUG)
      console.debug(CLASS_NAME, "< get decoratedItems", JSON.stringify(rv));
    return rv;
  }

  get _initialCollapseInnerLinks() {
    if (DEBUG)
      console.debug(
        CLASS_NAME,
        "> get _initialCollapseInnerLinks",
        this._collapse
      );

    const collapseInnerLinks = normaliseBoolean(
      getCssPropertyValue("--sfgpsds-au-vic2-breadcrumbs--collapse-inner-links")
    );
    const rv = this._collapse || collapseInnerLinks;

    if (DEBUG)
      console.debug(CLASS_NAME, "< get _initialCollapseInnerLinks", rv);
    return rv;
  }

  /* methods */

  updateCollapseInnerLinks() {
    const icil = this._initialCollapseInnerLinks;

    if (DEBUG) {
      console.debug(
        CLASS_NAME,
        "> updateCollapseInnerLinks",
        "_initialCollapseInnerLink",
        icil,
        "_displayBeforeCollapse",
        this._displayBeforeCollapse
      );
    }

    const length = this.items ? this.items.length : 0;

    this._collapseInnerLinks =
      icil && length - 1 > this._displayBeforeCollapse
        ? this._displayBeforeCollapse
        : 0;

    if (DEBUG)
      console.debug(
        CLASS_NAME,
        "< updateCollapseInnerLinks",
        this._collapseInnerLinks
      );
  }

  toggleCollapsed() {
    this._collapseInnerLinks = false;
  }

  /* event management */

  handleClick(event) {
    if (this.preventDefault) {
      event.preventDefault();
    }

    const index = parseInt(event.target.dataset.ndx, 10);

    if (
      this._items == null ||
      index == null ||
      index < 0 ||
      index >= this._items.length
    ) {
      return;
    }

    const item = this._items[index];

    this.dispatchEvent(
      new CustomEvent("navigate", {
        detail: {
          action: "click",
          text: item?.text,
          value: item?.url,
          index: index + 1
        }
      })
    );
  }
}
