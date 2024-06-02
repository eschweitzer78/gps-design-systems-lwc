/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/*
 * Based on open-source code:
 * - commonmark.js by John MacFarlane et al., https://github.com/commonmark/commonmark.js, under CC-BY-SA 4.0 licence.
 * - code derived from "he" (HTML Entities) by Mathias Bynens https://mths.be/he, under MIT licence.
 */

import { getFirstChild } from "c/sfGpsDsHelpers";
import Parser from "./blocks.js";
import HtmlRenderer from "./htmlRenderer.js";
import HtmlUnpackFirstPRenderer from "./htmlUnpackFirstPRenderer.js";
import { decodeHTMLStrict } from "./entitiesDecode.js";

class sfGpsDsMarkdown {
  reader = new Parser();
  writer = new HtmlRenderer();

  parse(markdown) {
    return this.reader.parse(markdown);
  }

  render(markdown, attribute) {
    let parsed = this.reader.parse(markdown);
    return this.writer.render(parsed, attribute);
  }

  renderEscaped(markdown, attribute) {
    let parsed = this.reader.parse(markdown.replaceAll("\\n", "\n"));
    return this.writer.render(parsed, attribute);
  }

  renderEscapedUnpackFirstP(markdown, attribute) {
    let tmpWriter = new HtmlUnpackFirstPRenderer();
    let parsed = this.reader.parse(markdown.replaceAll("\\n", "\n"));
    return tmpWriter.render(parsed, attribute);
  }

  renderNode(node, attribute) {
    return this.writer.render(node, attribute);
  }

  renderLinks(markdown, attribute) {
    let ast = this.parse(markdown),
      walker = ast.walker(),
      event,
      type,
      html = "";

    while ((event = walker.next())) {
      type = event.node.type;
      if (type === "link" && event.entering) {
        if (event.node.attrs == null) {
          event.node.attrs = [];
        }
        html += `<li ${attribute ? " " + attribute : ""}>${this.renderNode(
          event.node,
          attribute
        )}</li>`;
      }
    }

    return html;
  }

  extractLinks(markdown) {
    let ast = this.parse(markdown),
      walker = ast.walker(),
      event,
      type,
      index = 0,
      links = [];

    while ((event = walker.next())) {
      type = event.node.type;
      if (type === "link" && event.entering) {
        if (event.node.attrs == null) {
          event.node.attrs = [];
        }

        const node = new DOMParser().parseFromString(
          this.renderNode(event.node),
          "text/html"
        ).body.firstElementChild;
        links.push({
          url: node.getAttribute("href"),
          text: node.textContent,
          index: index++
        });
      }
    }

    return links;
  }

  // ---- extractFirstLink(String markdown) returns { url: String, text: String }
  extractFirstLink(markdown) {
    let ast = this.parse(markdown),
      walker = ast.walker(),
      event,
      type;

    while ((event = walker.next())) {
      type = event.node.type;

      if (type === "link" && event.entering) {
        const node = getFirstChild(this.renderNode(event.node));
        return {
          url: node.getAttribute("href"),
          text: node.textContent
        };
      }
    }

    return { url: null, text: null };
  }

  // ---- extract H1s and content
  extractH1s(markdown) {
    let ast = this.parse(markdown),
      walker = ast.walker(),
      event,
      type,
      level,
      html = "",
      index = 0,
      h1s = [],
      h1,
      currentNode;

    while ((event = walker.next())) {
      type = event.node.type;
      level = event.node.level;

      if (event.entering) {
        if (type === "heading" && level === 1) {
          if (event.node.attrs == null) {
            event.node.attrs = [];
          }

          if (h1) {
            // flush ongoing one
            h1.html = html;
            h1s.push(h1);
          }

          const node = getFirstChild(this.renderNode(event.node));

          h1 = {
            title: node.textContent,
            index: index++
          };

          html = "";
          currentNode = event.node;
        } else if (h1 && !currentNode) {
          currentNode = event.node;
          html += this.renderNode(event.node);
        }
      } else {
        if (event.node === currentNode) {
          currentNode = undefined;
        }
      }
    }

    if (h1) {
      // flush final one
      h1.html = html;
      h1s.push(h1);
    }

    return h1s;
  }

  decodeEntities(str) {
    return decodeHTMLStrict(str);
  }
}

const renderer = new sfGpsDsMarkdown();

export default renderer;
