import { api } from 'lwc';
import SfGpsDsLwc from "c/sfGpsDsLwc";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsAuNswStickyContainerLwr";

/**
 * @slot StickyContent
 */
export default 
class SfGpsDsAuNswStickyContainerLwr
extends SfGpsDsLwc {
  static renderMode = "light";
  
  // @ts-ignore
  @api
  className?: string;

  constructor() {
    super(true);
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("nsw-scope");
  }
}