import { 
  api 
} from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

import type { 
  CStyle 
} from "c/sfGpsDsAuNswSteps";
import type { 
  HeadingLevel 
} from "c/sfGpsDsAuNswStepsItem";

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
export default 
class SfGpsDsAuNswStepsLwr
extends SfGpsDsLwc {
  // @ts-ignore
  @api
  type?: string;

  // @ts-ignore
  @api 
  cstyle?: CStyle;

  // @ts-ignore
  @api 
  headingLevel?: HeadingLevel;

  // @ts-ignore
  @api 
  item1title?: string;

  // @ts-ignore
  @api 
  item2title?: string;

  // @ts-ignore
  @api 
  item3title?: string;

  // @ts-ignore
  @api 
  item4title?: string;

  // @ts-ignore
  @api 
  item5title?: string;

  // @ts-ignore
  @api 
  item6title?: string;

  // @ts-ignore
  @api 
  item7title?: string;;

  // @ts-ignore
  @api 
  item8title?: string;

  // @ts-ignore
  @api 
  item9title?: string;

  // @ts-ignore
  @api 
  item10title?: string;

  // @ts-ignore
  @api 
  item11title?: string;

  // @ts-ignore
  @api 
  item12title?: string;

  // @ts-ignore
  @api 
  // @ts-ignore
  firstChild?: boolean;

  // @ts-ignore
  @api 
  className?: string;

  /* lifecycle */
  
  constructor() {
    super(true);
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("nsw-scope");
  }
}
