import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

/**
 * @slot Tab1
 * @slot Tab2
 * @slot Tab3
 * @slot Tab4
 * @slot Tab5
 * @slot Tab6
 * @slot Tab7
 * @slot Tab8
 * @slot Tab9
 * @slot Tab10
 */
export default class extends SfGpsDsLwc {
  @api tab1Label;
  @api tab1IconName;
  @api tab2Label;
  @api tab2IconName;
  @api tab3Label;
  @api tab3IconName;
  @api tab4Label;
  @api tab4IconName;
  @api tab5Label;
  @api tab5IconName;
  @api tab6Label;
  @api tab6IconName;
  @api tab7Label;
  @api tab7IconName;
  @api tab8Label;
  @api tab8IconName;
  @api tab9Label;
  @api tab9IconName;
  @api tab10Label;
  @api tab10IconName;

  /* lifecycle */

  connectedCallback() {
    this._isLwrOnly = true;
    super.connectedCallback();

    this.classList.add("vic2-scope");
  }
}
