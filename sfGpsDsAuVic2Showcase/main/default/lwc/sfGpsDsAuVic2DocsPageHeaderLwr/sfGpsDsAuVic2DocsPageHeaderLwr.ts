import { 
  api 
} from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import type { 
  Link 
} from "c/sfGpsDsMarkdown";

const LINKS_DEFAULT: Link[] = [];

export default 
class SfGpsDsAuVic2DocsPageHeaderLwr 
extends SfGpsDsLwc {
  // @ts-ignore
  @api 
  title = "";

  // @ts-ignore
  @api 
  description?: string;

  // @ts-ignore
  @api
  links?: string;
  _links = this.defineMarkdownLinksProperty("links", {
    errorCode: "LI-MD",
    errorText: "Issue when parsing Links markdown",
    defaultValue: LINKS_DEFAULT
  }) ;

  /* computed */

  get computedShowLinks(): boolean {
    return !!this._links.value?.length;
  }

  /* lifecycle */

  constructor() {
    super(true); // isLwrOnly
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("vic2-scope");
  }
}
