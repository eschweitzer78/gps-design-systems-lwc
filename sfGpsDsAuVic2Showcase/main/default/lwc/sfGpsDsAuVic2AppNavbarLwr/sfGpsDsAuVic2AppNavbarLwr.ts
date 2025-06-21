import { 
  api, 
  track 
} from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { 
  computeClass 
} from "c/sfGpsDsHelpers";
import STATIC_RESOURCE from "@salesforce/resourceUrl/sfGpsDsAuVic2";
import cBasePath from "@salesforce/community/basePath";

const MENUOPEN_DEFAULT = false;

/**
 * @slot MenuContents
 */
export default 
class SfGpsDsAuVic2AppNavbar
extends SfGpsDsLwc {
  static renderMode: "light" | "shadow" = "light";

  // @ts-ignore
  @api 
  logoSrc?: string;
  // @ts-ignore
  @api 
  logoAlt?: string;
  // @ts-ignore
  @api 
  sectionTitle?: string;
  // @ts-ignore
  @api 
  sectionColor?: string;

  // @ts-ignore
  @track 
  _focusTrapActivated?: boolean;

  // @ts-ignore
  @track 
  _isMenuOpen = MENUOPEN_DEFAULT;

  get isMenuOpen(): boolean {
    return this._isMenuOpen;
  }

  set isMenuOpen(value: boolean) {
    this._isMenuOpen = value;
    this.watchIsMenuOpen();
  }

  /* computed */

  get computedStyle(): string | null {
    return computeClass({
      [`--docs-header-color: ${this.sectionColor}`]: this.sectionColor
    }, ";");
  }

  get computedMenuStyle(): string | null {
    return computeClass({
      "--local-vertical-nav-background: transparent": true,
      "--local-vertical-nav-item-gutter: var(--rpl-sp-3)": true,
      "--local-vertical-nav-hover-bg: var(--rpl-clr-neutral-300)": true
    }, ";");
  }

  get computedLogoSrc() {
    return (
      this.logoSrc || `${STATIC_RESOURCE}/assets/logos/logo-vic-gov.svg#logo`
    );
  }

  get computedLogoAlt() {
    return this.logoAlt || "Government of Victoria Logo";
  }

  get computedHref() {
    return cBasePath || "/";
  }

  /* methods */

  watchIsMenuOpen() {
    const isOpen = this._isMenuOpen;

    if (isOpen) {
      // activateFocusTrap
      this._focusTrapActivated = true;
      document.body.classList.add("rpl-u-viewport-locked");
      window.scroll(0, 0);
    } else {
      // deactivateFocusTrap
      this._focusTrapActivated = false;
      document.body.classList.remove("rpl-u-viewport-locked");
    }
  }

  /* event management */

  handleCloseMenu() {
    this.isMenuOpen = false;
  }

  handleToggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  handleEscapeKey(event: KeyboardEvent) {
    if (event.code === "Escape") {
      this.handleCloseMenu();
    }
  }

  handleNavigate(event: CustomEvent) {
    event.stopPropagation();
    this.isMenuOpen = false;
  }

  /* lifecycle */

  constructor() {
    super(true); // isLwrOnly
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("vic2-scope");
  }

  disconnectedCallback() {
    if (this._focusTrapActivated) {
      document.body.classList.remove("rpl-u-viewport-locked");
    }
  }
}
