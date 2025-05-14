/* This is a fairly generic, low-level LWR component with up to 12 child divs and slots */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import tmpl from "./sfGpsDsDivLwrDiv.html";
import tmplNoDiv from "./sfGpsDsDivLwrNoDiv.html";

/**
 * @slot Div1
 * @slot Div2
 * @slot Div3
 * @slot Div4
 * @slot Div5
 * @slot Div6
 * @slot Div7
 * @slot Div8
 * @slot Div9
 * @slot Div10
 * @slot Div11
 * @slot Div12
 */
export default class extends SfGpsDsLwc {
  static renderMode = "light";

  @api id;
  @api type;
  @api nItems = 12;
  @api className;
  @api item1ClassName;
  @api item1Id;
  @api item2ClassName;
  @api item2Id;
  @api item3ClassName;
  @api item3Id;
  @api item4ClassName;
  @api item4Id;
  @api item5ClassName;
  @api item5Id;
  @api item6ClassName;
  @api item6Id;
  @api item7ClassName;
  @api item7Id;
  @api item8ClassName;
  @api item8Id;
  @api item9ClassName;
  @api item9Id;
  @api item10ClassName;
  @api item10Id;
  @api item11ClassName;
  @api item11Id;
  @api item12ClassName;
  @api item12Id;

  get has2() {
    return this.nItems >= 2;
  }

  get has3() {
    return this.nItems >= 3;
  }

  get has4() {
    return this.nItems >= 4;
  }

  get has5() {
    return this.nItems >= 5;
  }

  get has6() {
    return this.nItems >= 6;
  }

  get has7() {
    return this.nItems >= 7;
  }

  get has8() {
    return this.nItems >= 8;
  }

  get has9() {
    return this.nItems >= 9;
  }

  get has10() {
    return this.nItems >= 10;
  }

  get has11() {
    return this.nItems >= 11;
  }

  get has12() {
    return this.nItems >= 12;
  }

  /* lifecycle */

  render() {
    return this.type === "no div" ? tmplNoDiv : tmpl;
  }

  connectedCallback() {
    this._isLwrOnly = true;
    super.connectedCallback();
  }
}
