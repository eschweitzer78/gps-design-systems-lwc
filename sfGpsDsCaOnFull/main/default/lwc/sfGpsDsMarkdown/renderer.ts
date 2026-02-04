"use strict";

import type { Node, NodeWalkerEvent } from "./node";

export default class Renderer {
  buffer?: string;
  lastOut?: string;

  /**
   *  Walks the AST and calls member methods for each Node type.
   *
   *  @param ast {Node} The root of the abstract syntax tree.
   */

  render(ast: Node, attribute?: string) {
    let walker = ast.walker();
    let e: NodeWalkerEvent | null;

    this.buffer = "";
    this.lastOut = "\n";

    while ((e = walker.next())) {
      const type = e.node.type;

      // @ts-ignore
      if (this[type]) {
        // @ts-ignore
        this[type](e.node, e.entering, attribute);
      }
    }
    return this.buffer;
  }

  /**
   *  Concatenate a literal string to the buffer.
   *
   *  @param str {String} The string to concatenate.
   */

  lit(str: string): void {
    this.buffer += str;
    this.lastOut = str;
  }

  /**
   *  Output a newline to the buffer.
   */

  cr(): void {
    if (this.lastOut !== "\n") {
      this.lit("\n");
    }
  }

  /**
   *  Concatenate a string to the buffer possibly escaping the content.
   *  Concrete renderer implementations should override this method.
   *
   *  @param str {String} The string to concatenate.
   */

  out(str: string): void {
    this.lit(str);
  }

  /**
   *  Escape a string for the target renderer.
   *
   *  Abstract function that should be implemented by concrete
   *  renderer implementations.
   *
   *  @param str {String} The string to escape.
   */

  esc(str: string): string {
    return str;
  }
}
