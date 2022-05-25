/* eslint-disable @lwc/lwc/no-inner-html */
import { replaceInnerHtml, htmlDecode, getFirstChild } from "c/sfGpsDsHelpers";

describe("c-sf-gps-ds-helpers.dom", () => {
  afterEach(() => {});

  it("replaces innerHtml", () => {
    let fragment = document.createElement("span");
    let paragraph = document.createElement("p");
    const content = document.createTextNode("Hello");
    paragraph.appendChild(content);
    fragment.appendChild(paragraph);

    let toBeReplaced = document.createElement("div");
    replaceInnerHtml(toBeReplaced, fragment.outerHTML);

    expect(toBeReplaced.innerHTML).not.toBeNull();
    expect(toBeReplaced.innerHTML).toBe(fragment.outerHTML);
  });

  it("decodes HTML", () => {
    let decoded = htmlDecode("&lt;p&gt;Hello&lt;/p&gt;");
    expect(decoded).toBe("<p>Hello</p>");
  });

  it("gets a node's first child", () => {
    let fragment = document.createElement("span");
    let paragraph = document.createElement("p");
    const content = document.createTextNode("Hello");
    let div = document.createElement("div");

    paragraph.appendChild(content);
    fragment.appendChild(paragraph);
    fragment.appendChild(div);

    expect(getFirstChild(fragment.innerHTML).outerHTML).toBe(
      paragraph.outerHTML
    );
  });
});
