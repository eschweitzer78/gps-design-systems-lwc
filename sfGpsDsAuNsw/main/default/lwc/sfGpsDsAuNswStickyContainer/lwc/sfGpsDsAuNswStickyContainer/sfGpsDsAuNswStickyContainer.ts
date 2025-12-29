import { api } from 'lwc';
import SfGpsDsElement from "c/sfGpsDsElement";
import { uniqueId } from 'c/sfGpsDsHelpers';

const DEBUG = false;
const CLASS_NAME = "SfGpsDsAuNswStickyContainer";

export default 
class SfGpsDsAuNswStickyContainer 
extends SfGpsDsElement {
  static renderMode = "light";

  // @ts-ignore
  @api
  className?: string;

  /* getters */

  get computedClassName(): any {
    return {
      "nsw-sticky-container": true,
      "js-sticky-container": true,
      [this.className || ""]: !!this.className
    }
  }

  /* getters */

  _scId?: string;

  get computedId(): string {
    if (!this._scId) {
      this._scId = uniqueId("nsw-sticky-container");
    }

    return this._scId;
  }
  
  /* methods */

  // @ts-ignore
  @api
  updateStickyBodyPadding(): void {
    if (DEBUG) {
      console.debug(CLASS_NAME, "> updateStickyBodyPadding");
    }

    if (!this._isRendered) {
      if (DEBUG) {
        console.debug(CLASS_NAME, "< updateStickyBodyPadding not rendered");
      }

      return;
    }

    const el = this.refs.container;

    const rect = el.getBoundingClientRect 
      ? el.getBoundingClientRect() 
      : { height: el.offsetHeight || 0 };

    if (DEBUG) {
      console.debug(CLASS_NAME, "= updateStickyBodyPadding", JSON.stringify(rect));
    }

    const h = Math.max(0, Math.round(rect.height || 0))

    document.body.style.setProperty('--nsw-sticky-height', `${h}px`)
    document.body.style.paddingBottom = `${h}px`

    if (DEBUG) {
      console.debug(CLASS_NAME, "< updateStickyBodyPadding", h);
    }
  }

  /* lifecycle */

  _onResizeObserver?: ResizeObserver;
  //_onMutationObserver?: MutationObserver;

  constructor() {
    super();

    this.handleMounted(() => {
      if (DEBUG) console.debug(CLASS_NAME, "> handleMounted");

      const el = this.refs.container;
      el.style.position = "fixed";
      el.style.bottom = "0";
      el.style.left = "0";
      el.style.right = "0";
      el.style.width = "100%";
      el.style.display = "block";

      this.updateStickyBodyPadding();
  
      if (window.ResizeObserver) {
        this._onResizeObserver = new ResizeObserver(() => {
          if (DEBUG) console.debug(CLASS_NAME, "> onResizeObserver");
          this.updateStickyBodyPadding();
          if (DEBUG) console.debug(CLASS_NAME, "< onResizeObserver");
        });
        this._onResizeObserver.observe(el);
      }

      /*
      if (window.MutationObserver) {
        this._onMutationObserver = new MutationObserver(() => {
          console.debug(CLASS_NAME, "> onMutationObserver");
          this.updateStickyBodyPadding();
          console.debug(CLASS_NAME, "< onMutationObserver");
        });
        this._onMutationObserver.observe(el, { childList: true, subtree: true });
      }
      */

      if (DEBUG) console.debug(CLASS_NAME, "< handleMounted");
    });

    this.handleBeforeUnmount(() => {
      this._onResizeObserver?.disconnect();
      //this._onMutationObserver?.disconnect();
    });
  }
}