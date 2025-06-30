import { 
  api, 
  track 
} from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";

const SCROLL_THRESHOLD = 1080;

export default 
class SfGpsDsAuVic2LayoutBackToTop 
extends SfGpsDsElement {
  // @ts-ignore
  @api 
  label = "Back to top";

  // @ts-ignore
  @api 
  topElementId = "rpl-skip-links";

  // @ts-ignore
  @api 
  className?: string;

  // @ts-ignore
  @track 
  scrollY: number = 0;

  /* computed */

  get isShown() {
    return this.scrollY > SCROLL_THRESHOLD;
  }

  get isSticky() {
    if (!this._containerEl) {
      return false;
    }

    const rect = this._containerEl.getBoundingClientRect();
    return rect.top > window.innerHeight;
  }

  get computedClassName(): any {
    return {
      "rpl-back-to-top": true,
      "rpl-back-to-top--visible": this.isShown,
      "rpl-back-to-top--sticky": this.isSticky,
      "rpl-u-screen-only": true,
      [this.className || ""]: !!this.className
    };
  }

  get computedUrl() {
    return `#${this.topElementId}`;
  }

  /* event management */

  handleScroll(): void {
    if (this._containerEl) {
      this.scrollY = window.scrollY || window.pageYOffset;
    }
  }

  /* lifecycle */

  _handleScroll?: EventListener;
  _containerEl?: HTMLElement;

  constructor() {
    super();

    this.handleMounted(() => {
      this._handleScroll = this.handleScroll.bind(this);
      window.addEventListener("scroll", this._handleScroll);
    });

    this.handleUnmounted(() => {
      if (this._handleScroll)
        window.removeEventListener("scroll", this._handleScroll);
    });

    this.handleFirstRender(() => {
      this._containerEl = this.refs.containerRef;
    });
  }
}
