import { 
  api 
} from "lwc";
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
  // @ts-ignore
  @api 
  mode = "horizontal";

  // @ts-ignore
  @api 
  tab1Label?: string

  // @ts-ignore
  @api 
  tab1IconName?: string;

  // @ts-ignore
  @api 
  tab2Label?: string
  
  // @ts-ignore
  @api 
  tab2IconName?: string;

  // @ts-ignore
  @api 
  tab3Label?: string
  
  // @ts-ignore
  @api 
  tab3IconName?: string;

  // @ts-ignore
  @api 
  tab4Label?: string
  
  // @ts-ignore
  @api 
  tab4IconName?: string;

  // @ts-ignore
  @api 
  tab5Label?: string
  
  // @ts-ignore
  @api 
  tab5IconName?: string;

  // @ts-ignore
  @api 
  tab6Label?: string
  
  // @ts-ignore
  @api 
  tab6IconName?: string;

  // @ts-ignore
  @api 
  tab7Label?: string
  
  // @ts-ignore
  @api 
  tab7IconName?: string;

  // @ts-ignore
  @api 
  tab8Label?: string
  
  // @ts-ignore
  @api 
  tab8IconName?: string;

  // @ts-ignore
  @api 
  tab9Label?: string
  
  // @ts-ignore
  @api 
  tab9IconName?: string;

  // @ts-ignore
  @api 
  tab10Label?: string
  
  // @ts-ignore
  @api 
  tab10IconName?: string;

  // @ts-ignore
  @api 
  className?: string;

  /* lifecycle */

  constructor() {
    super(true);
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("vic2-scope");
  }
}
