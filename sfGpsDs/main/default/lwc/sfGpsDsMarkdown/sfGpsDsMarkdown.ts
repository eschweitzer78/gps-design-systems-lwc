/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/*
 * Based on open-source code:
 * - commonmark.js by John MacFarlane et al., https://github.com/commonmark/commonmark.js, under CC-BY-SA 4.0 licence.
 * - code derived from "he" (HTML Entities) by Mathias Bynens https://mths.be/he, under MIT licence.
 */

import { 
  getFirstChild, 
  isString
} from "c/sfGpsDsHelpers";
import { 
  Parser 
} from "./blocks";
import HtmlRenderer from "./htmlRenderer";
import HtmlUnpackFirstPRenderer from "./htmlUnpackFirstPRenderer";
import { 
  decodeHTMLStrict 
} from "./entitiesDecode";

import type { 
  Node, 
  NodeWalkerEvent 
} from "./node";
import type { 
  Link, 
  Header 
} from "c/sfGpsDsMarkdown";

class SfGpsDsMarkdown {
  reader = new Parser();
  writer = new HtmlRenderer();

  parse(
    markdown: string
  ): Node {
    return this.reader.parse(markdown);
  }

  render(
    markdown: string, 
    attribute?: string
  ): string {
    if (!isString(markdown)) {
      return "";
    }

    const parsed = this.reader.parse(markdown);
    return this.writer.render(parsed, attribute);
  }

  renderEscaped(
    markdown: string, 
    attribute?: string
  ): string {
    if (!isString(markdown)) {
      return "";
    }

    const parsed = this.reader.parse(markdown.replaceAll("\\n", "\n"));
    return this.writer.render(parsed, attribute);
  }

  renderEscapedUnpackFirstP(
    markdown: string, 
    attribute?: string
  ): string {
    if (!isString(markdown)) {
      return "";
    }

    let tmpWriter = new HtmlUnpackFirstPRenderer();
    const parsed = this.reader.parse(markdown.replaceAll("\\n", "\n"));
    return tmpWriter.render(parsed, attribute);
  }

  renderNode(
    node: Node, 
    attribute?: string
  ) {
    return this.writer.render(node, attribute);
  }

  renderLinks(
    markdown: string, 
    attribute?: string
  ): string {
    let html = "";

    if (isString(markdown)) {
      let ast = this.parse(markdown),
        walker = ast.walker(),
        event: NodeWalkerEvent | null;

      while ((event = walker.next())) {
        if (event.node.type === "link" && event.entering) {
          if (event.node.attrs == null) {
            event.node.attrs = [];
          }

          html += `<li ${attribute ? " " + attribute : ""}>${this.renderNode(
            event.node,
            attribute
          )}</li>`;
        }
      }
    }
    
    return html;
  }

  extractLinks(
    markdown: string
  ): Link[] {
    let links = [];

    if (isString(markdown)) {
      let ast = this.parse(markdown),
        walker = ast.walker(),
        event: NodeWalkerEvent | null,
        index = 0;

      while ((event = walker.next())) {
        if (event.node.type === "link" && event.entering) {
          if (event.node.attrs == null) {
            event.node.attrs = [];
          }

          const node = new DOMParser().parseFromString(
            this.renderNode(event.node),
            "text/html"
          ).body.firstElementChild;
          links.push({
            url: node?.getAttribute("href") || undefined,
            text: node?.textContent || undefined,
            index: index++
          });
        }
      }
    }

    return links;
  }

  extractFirstLink(
    markdown: string
  ): Link {
    if (isString(markdown)) {
      let ast = this.parse(markdown),
        walker = ast.walker(),
        event: NodeWalkerEvent | null;

      while ((event = walker.next())) {
        if (event.node.type === "link" && event.entering) {
          const node = getFirstChild(this.renderNode(event.node));

          return {
            url: node?.getAttribute("href") || "",
            text: node?.textContent || ""
          };
        }
      }
    }

    return { url: undefined, text: undefined };
  }

  extractH1s(
    markdown: string
  ): Header[] {
    let h1s: Header[] = [];

    if (isString(markdown)) {
      let ast = this.parse(markdown),
        walker = ast.walker(),
        event: NodeWalkerEvent | null,
        html = "",
        index = 0,
        h1: Header | null = null,
        currentNode: Node | undefined = undefined;

      while ((event = walker.next())) {
        if (event.entering) {
          if (event.node.type === "heading" && event.node.level === 1) {
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
              title: node?.textContent || undefined,
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
    }

    return h1s;
  }

  decodeEntities(
    str: string
  ): string {
    return decodeHTMLStrict(str);
  }
}

export default new SfGpsDsMarkdown();
