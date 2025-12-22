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
export default class default_1 extends SfGpsDsLwc {
  // @ts-ignore
  @api
  mode = "horizontal";
  // @ts-ignore
  @api
  tab1Label;
  // @ts-ignore
  @api
  tab1IconName;
  // @ts-ignore
  @api
  tab2Label;
  // @ts-ignore
  @api
  tab2IconName;
  // @ts-ignore
  @api
  tab3Label;
  // @ts-ignore
  @api
  tab3IconName;
  // @ts-ignore
  @api
  tab4Label;
  // @ts-ignore
  @api
  tab4IconName;
  // @ts-ignore
  @api
  tab5Label;
  // @ts-ignore
  @api
  tab5IconName;
  // @ts-ignore
  @api
  tab6Label;
  // @ts-ignore
  @api
  tab6IconName;
  // @ts-ignore
  @api
  tab7Label;
  // @ts-ignore
  @api
  tab7IconName;
  // @ts-ignore
  @api
  tab8Label;
  // @ts-ignore
  @api
  tab8IconName;
  // @ts-ignore
  @api
  tab9Label;
  // @ts-ignore
  @api
  tab9IconName;
  // @ts-ignore
  @api
  tab10Label;
  // @ts-ignore
  @api
  tab10IconName;
  // @ts-ignore
  @api
  className;
  /* lifecycle */
  constructor() {
    super(true);
  }
  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("vic2-scope");
  }
}
