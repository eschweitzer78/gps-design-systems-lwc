import { 
  api, 
  track 
} from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
import OnClickOutside from "c/sfGpsDsOnClickOutside";

import { 
  AdaptedNavigationMenuItem 
} from "c/sfGpsDsNavigation";

export default 
class SfGpsDsAuNswHeaderProfile 
extends SfGpsDsElement {
  // @ts-ignore
  @api 
  signInLabel: string = "Log in";

  // @ts-ignore
  @api 
  isGuest?: boolean;

  // @ts-ignore
  @api 
  userAlias?: string;

  // @ts-ignore
  @api 
  navItems?: AdaptedNavigationMenuItem[];

  // @ts-ignore
  @api 
  className?: string;

  // @ts-ignore
  @track 
  _isOpen = false;

  /* event management */

  // eslint-disable-next-line no-unused-vars
  handleOpenProfile(
    _event: MouseEvent
  ): void {
    this._isOpen = true;
  }

  // eslint-disable-next-line no-unused-vars
  handleCloseProfile(
    _event: MouseEvent
  ): void {
    this._isOpen = false;
  }

  // eslint-disable-next-line no-unused-vars
  handleLogin(
    _event: MouseEvent
  ): void {
    this.dispatchEvent(new CustomEvent("login"));
  }

  handleClickNavigate(
    event: MouseEvent
  ): void {
    event.preventDefault();

    const index = (event.currentTarget as HTMLElement).dataset.ndx;
    this.dispatchEvent(new CustomEvent("navigate", { detail: index }));
  }

  ignore(
    event: MouseEvent
  ): void {
    event.preventDefault();
    event.stopPropagation();
  }

  /* lifecycle */

  _onClickOutside?: OnClickOutside;

  constructor() {
    super();

    this.handleMounted(() => {
      if (!this._onClickOutside) {
        this._onClickOutside = new OnClickOutside();
        this._onClickOutside.bind(this, "containerRef", () => {
          this._isOpen = false;
        });
      }
    });

    this.handleUnmounted(() => {
      if (this._onClickOutside) {
        this._onClickOutside.unbind(this, "containerRef");
        this._onClickOutside = undefined;
      }
    })
  }
}
