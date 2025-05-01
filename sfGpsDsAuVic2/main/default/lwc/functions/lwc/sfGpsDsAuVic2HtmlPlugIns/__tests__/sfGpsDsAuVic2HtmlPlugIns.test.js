/* eslint-disable @lwc/lwc/no-inner-html */
import { HtmlSanitizer } from "c/sfGpsDsHelpers";

const plugInLinks = {
  selector: "a",
  process: ($anchor, parser) => {
    if (!$anchor.getAttribute("class")) {
      $anchor.classList.add("rpl-text-link", "rpl-u-focusable-inline");
    }

    if (
      $anchor.getAttribute("target") === "_blank" &&
      $anchor.querySelector("span.rpl-u-visually-hidden") === null
    ) {
      const elt = parser.parseFromString(
        `<body><span class="rpl-u-visually-hidden"> (opens in a new window)</span></body>`,
        "text/html"
      );
      if (elt.body.tagName !== "BODY") elt.body.remove();
      $anchor.append(...elt.body.childNodes);
    }

    return $anchor;
  }
};

const plugInTables = {
  selector: "table",
  process: ($table, parser) => {
    console.log("> table", $table.outerHTML);
    const cols = $table.querySelectorAll("col[data-width]");
    [...cols].forEach((col) => {
      const colWidth = col.getAttribute("data-width");

      if (colWidth) {
        col.style.width = colWidth;
        col.removeAttribute("data-width");
      }
    });

    console.log("= table", $table.outerHTML);

    const elt = parser.parseFromString(
      `
      <body><div class="rpl-table">
        <div class="rpl-table__scroll-container rpl-u-focusable-outline--visible" tabindex="0">
        </div>
      </div></body>`,
      "text/html"
    );
    if (elt.body.tagName !== "BODY") elt.body.remove();

    elt.querySelector("[tabindex]").append($table);
    return elt.querySelector(".rpl-table");
  }
};

const plugInLists = {
  selector: "ul[type],ol[type]",
  process: ($list) => {
    const type = $list.getAttribute("type");
    const listTypes = {
      1: "decimal",
      a: "lower-latin",
      A: "upper-latin",
      i: "lower-roman",
      I: "upper-roman",
      disc: "disc",
      square: "square",
      circle: "disc" // circles selection uses disc (a11y request)
    };

    $list.removeAttribute("type");

    if (listTypes[type]) {
      $list.classList.add(
        `rpl-type-list-${$list.tagName.toLowerCase()}--${listTypes[type]}`
      );
    }

    return $list;
  }
};

const defaultPlugIns = [plugInLinks, plugInTables, plugInLists];

describe("SfGpsDsAuVic2HtmlPlugIns", () => {
  afterEach(() => {});

  it("replaces links", () => {
    const r = HtmlSanitizer.sanitize(
      `<a href="#some-url">someContent</a>`,
      defaultPlugIns
    );

    expect(r).not.toBeNull();
    expect(r).toBe(
      `<a href="#some-url" class="rpl-text-link rpl-u-focusable-inline">someContent</a>`
    );
  });

  it("replaces two links right", () => {
    const r = HtmlSanitizer.sanitize(
      `<a href="#some-url">someContent</a> or <a href="#some-other-url">someOtherContent</a>`,
      defaultPlugIns
    );

    expect(r).not.toBeNull();
    expect(r).toBe(
      `<a href="#some-url" class="rpl-text-link rpl-u-focusable-inline">someContent</a> or <a href="#some-other-url" class="rpl-text-link rpl-u-focusable-inline">someOtherContent</a>`
    );
  });

  it("adds a visually hidden bit to links opening in new windows", () => {
    const r = HtmlSanitizer.sanitize(
      `<a href="#someurl" target="_blank">someContent</a>`,
      defaultPlugIns
    );

    expect(r).not.toBeNull();
    expect(r).toContain("rpl-u-visually-hidden");
  });

  it("wraps tables", () => {
    const r = HtmlSanitizer.sanitize(
      `<table><col data-width="40px"></col></table>`,
      defaultPlugIns
    );

    expect(r).not.toBeNull();
    expect(r).toMatch(/^<div class="rpl-table">/);
  });

  it("rewrites lists", () => {
    const r = HtmlSanitizer.sanitize(
      `<ul type="i"><li>Yo</li></ul>`,
      defaultPlugIns
    );

    expect(r).not.toBeNull();
    expect(r).toContain("rpl-type-list-ul--lower-roman");
  });
});
