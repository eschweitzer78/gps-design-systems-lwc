const plugInLinks = {
  selector: "a:not[class]",
  process: ($anchor, parser) => {
    $anchor.classList.add("rpl-text-link", "rpl-u-focusable-inline");

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
    const cols = $table.querySelectorAll("col[data-width]");
    [...cols].forEach((col) => {
      const colWidth = col.getAttribute("data-width");

      if (colWidth) {
        col.style.width = colWidth;
        col.removeAttribute("data-width");
      }
    });

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

export default [plugInLinks, plugInTables, plugInLists];
