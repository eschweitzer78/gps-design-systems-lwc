import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuNswHeroBannerAltComm";

export default 
class SfGpsDsAuNswHeroBannerAltComm 
extends SfGpsDsLwc {
  // @ts-ignore
  @api 
  imageSrc?: string;

  // @ts-ignore
  @api 
  imageAlt?: string;

  // @ts-ignore
  @api 
  className?: string;

  // @ts-ignore
  @api
  titleLink?: string;
  _titleLink = this.defineMarkdownFirstLinkProperty("titleLink", {
    errorCode: "TL-MD",
    errorText: "Issue when parsing Title link markdown"
  });

  // @ts-ignore
  @api
  content?: string;
  _contentHtml = this.defineMarkdownContentProperty("content", {
    errorCode: "IN-MD",
    errorText: "Issue when parsing Content markdown"
  });

  /* computed */

  get _titleUrl(): string | undefined {
    return this._titleLink.value?.url;
  }

  get _titleLabel(): string | undefined {
    return this._titleLink.value?.text || "";
  }
  
  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("nsw-scope");
  }

  renderedCallback() {
    super.renderedCallback?.();

    if (this._contentHtml.value && this.refs.content) {
      /*
       * We have to add an empty span if there is a title to trigger the appropriate css for *+p and similar
       * as the react component would have one for the title in the same scope,
       * but here our containment hierarchy is a bit different.
       */

      const markup =
        (this._titleLabel ? "<span></span>" : "") + (this._contentHtml.value || "");
      replaceInnerHtml(this.refs.content, markup);
    }
  }
}
