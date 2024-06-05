import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

/**
 * @slot Step1
 * @slot Step2
 * @slot Step3
 * @slot Step4
 * @slot Step5
 * @slot Step6
 * @slot Step7
 * @slot Step8
 * @slot Step9
 * @slot Step10
 * @slot Step11
 * @slot Step12
 */
export default class extends SfGpsDsLwc {
  @api type;
  @api cstyle;
  @api headingLevel;
  @api item1title;
  @api item2title;
  @api item3title;
  @api item4title;
  @api item5title;
  @api item6title;
  @api item7title;
  @api item8title;
  @api item9title;
  @api item10title;
  @api item11title;
  @api item12title;
  @api firstChild;
  @api className;

  connectedCallback() {
    this._isLwrOnly = true;

    super.connectedCallback();
    this.classList.add("nsw-scope");
  }
}
