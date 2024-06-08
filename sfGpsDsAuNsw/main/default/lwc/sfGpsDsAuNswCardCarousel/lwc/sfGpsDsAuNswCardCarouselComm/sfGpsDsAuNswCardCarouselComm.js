import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default class extends SfGpsDsLwc {
  @api accessibilityLabel;
  @api drag;
  @api justifyContent;
  @api navigation;
  @api navigationItemClassName;
  @api navigationClassName;
  @api paginationClassName;
  @api className;

  /* api: items */

  _itemsOriginal;

  @api get items() {
    return this._itemsOriginal;
  }

  set items(value) {
    this._itemsOriginal = value;

    if (typeof value === "string") {
      try {
        if (value) {
          value = JSON.parse(value);
        } else {
          this._items = null;
          return;
        }
      } catch (e) {
        value = [];
        this.addError(
          "CC-IP",
          "The items attribute must be in JSON array format { cstyle, headline, orientation, tag, date, dateStyle, image, imageAlt, title, copy }."
        );
      }
    }

    if (Array.isArray(value)) {
      this._items = value;
    } else if (value) {
      this._items = [value];
    } else {
      this._items = null;
      this.addError(
        "CC-IT",
        "We had an issue parsing JSON for the items property."
      );
    }
  }

  _items = [
    {
      cstyle: "highlight",
      headline: true,
      orientation: "vertical",
      tag: null,
      date: null,
      dateStyle: null,
      image:
        "https://images.unsplash.com/photo-1502085671122-2d218cd434e6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      imageAlt: "Globe Awards 2019",
      title: "[Nominations open for Green Globe Awards 2019](#)",
      copy: "The annual awards will recognise individuals and organisations for their leadership , commitment and innovation in sustainability across NSW."
    },
    {
      cstyle: "highlight",
      headline: true,
      orientation: "vertical",
      tag: null,
      date: null,
      dateStyle: null,
      image:
        "https://images.unsplash.com/photo-1587752799766-8eb9791261d4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      imageAlt: "Green spaces",
      title: "[Quality green spaces and a million more trees for NSW](#)",
      copy: "The NSW Government will create more quality green spaces and increase ther tree canopy in Sydney bt 2022."
    },
    {
      cstyle: "highlight",
      headline: true,
      orientation: "vertical",
      tag: null,
      date: null,
      dateStyle: null,
      image:
        "https://images.unsplash.com/photo-1642636497287-1183da9dd103?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      imageAlt: "Premier's priotity",
      title:
        "[New Premier's Priority to lift literacy and numeracy standards](#)",
      copy: "The NSW Government will redouble its efforts to lift literacy and numeracy standards across NSW public schools to ensure students are given every opportunity to be their best."
    },
    {
      cstyle: "highlight",
      headline: true,
      orientation: "vertical",
      tag: null,
      date: null,
      dateStyle: null,
      image:
        "https://images.unsplash.com/photo-1589913864122-ada28c04fdd1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      imageAlt: "Incredible nature",
      title: "[Some big large title for Card Number 4](#)",
      copy: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur a lacinia nisi. Duis rutrum at quam eget euismod. Morbi est lectus, aliquet vel neque id, elementum pellentesque enim."
    }
  ];

  get hasItems() {
    return this._items?.length;
  }

  get navigationNavigation() {
    return this.navigation === "navigation" || this.navigation === "pagination";
  }

  get navigationPagination() {
    return this.navigation === "pagination";
  }

  get loop() {
    return this.navigation === "loop";
  }
}
