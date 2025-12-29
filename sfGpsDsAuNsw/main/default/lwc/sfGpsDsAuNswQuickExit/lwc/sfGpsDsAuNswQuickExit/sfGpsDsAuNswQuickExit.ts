import { api } from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
import { uniqueId } from "c/sfGpsDsHelpers";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsAuNswQuickExit";

const I18N = {
  exitNow: "Exit now"
}

const ENABLEESC_DEFAULT = false;
const ENABLECLOAK_DEFAULT = false;
const FOCUSFIRST_DEFAULT = false;

export default 
class SfGpsDsAuNswQuickExit 
extends SfGpsDsElement {
  static renderMode = "light";

  // @ts-ignore
  @api
  safeUrl: string = "https://www.google/webhp";

  // @ts-ignore
  @api
  enableEsc?: boolean;

  _enableEsc = this.defineBooleanProperty("enableEsc", {
    defaultValue: ENABLEESC_DEFAULT,
    // eslint-disable-next-line no-unused-vars
    watcher: (_propertyName, oldValue, newValue) => {
      if (newValue && !oldValue) {
        this.bindDoubleEsc(() => this.refs.quickexit.click());
      } else if (!newValue && oldValue) {
        this.unbindDoubleEsc();
      }
    }
  });

  // @ts-ignore
  @api
  enableCloak? = false;

  _enableCloak = this.defineBooleanProperty("enableCloak", {
    defaultValue: ENABLECLOAK_DEFAULT
  });

  // @ts-ignore
  @api
  focusFirst?: boolean;

  _focusFirst = this.defineBooleanProperty("focusFirst", {
    defaultValue: FOCUSFIRST_DEFAULT,
    // eslint-disable-next-line no-unused-vars
    watcher: (_propertyName, oldValue, newValue) => {
      if (newValue && !oldValue) {
        this.setFocusFirst();
      } else if (!newValue && oldValue) {
        this.unsetFocusFirst();
      }
    }
  });

  // @ts-ignore
  @api 
  className?: string;

  /* getters */

  get i18n(): Record<string, string> {
    return I18N
  }

  get isModalOpen(): boolean {
    return (document.querySelector(`dialog[open]`)) != null || 
      (document.querySelector(`[role="dialog"][aria-modal="true"]`) != null);
  }

  _describedById?: string;

  get computedAriaDescribedById(): string {
    if (!this._describedById) {
      this._describedById = uniqueId("nsw-quick-exit__desc");
    }

    return this._describedById;
  }

  /* methods */

  isEditable(el: HTMLElement): boolean {
    if (DEBUG) {
      console.debug(CLASS_NAME, "> isEditable", el);
    }

    let rv = false;

    if (el) {
      const tag = el.tagName && el.tagName.toLowerCase();

      if (tag === "input" || tag === "textarea" || tag === "select") return true;
      if (el.isContentEditable) return true;

      // Common ARIA widgets that own Esc / focus behaviour (e.g., autocomplete/combobox/popups)
      const role = el.getAttribute && el.getAttribute("role")
      rv = (
        role === "combobox" || 
        role === "dialog" || 
        role === "menu" || 
        role === "listbox"
      );
    }

    if (DEBUG) {
      console.debug(CLASS_NAME, "< isEditable", rv);
    }

    return rv;
  }

  _handleKeydown?: EventListener;

  bindDoubleEsc(callback: Function): void {
    if (DEBUG) {
      console.debug(CLASS_NAME, "> bindDoubleEsc");
    }

    let pressCount = 0;
    let timerId = null;
    const TIME_WINDOW = 1000;

    const isEscapeKey = ({ key, keyCode }) => (
      key === "Escape" || key === "Esc" || keyCode === 27
    )

    // Helpers to decide if QE should defer to other UI
    const handleKeydown = (event: KeyboardEvent) => {
      const {
        key, keyCode, defaultPrevented, target,
      } = event
      if (!isEscapeKey({ key, keyCode })) return

      // If another component has already claimed Esc, or focus is in an editable/modal context, defer.
      if (defaultPrevented) return;
      if (this.isEditable(target as HTMLElement) || this.isModalOpen) return;

      pressCount += 1

      if (timerId) {
        clearTimeout(timerId);
      }

      if (pressCount >= 2) {
        event.preventDefault()

        // When Quick Exit triggers (two Esc presses), prevent the default Esc behaviour
        // but do NOT call stopImmediatePropagation; other listeners will still receive the event.

        callback();
        pressCount = 0;
        timerId = null;
      } else {
        timerId = setTimeout(() => {
          pressCount = 0
          timerId = null
        }, TIME_WINDOW)
      }
    }
  
    // Capture phase so we still receive ESC even if other components stop propagation,
    // but we won't suppress them unless we actually trigger QE (and even then we don't stop propagation).

    this._handleKeydown = handleKeydown.bind(this);
    document.addEventListener("keydown", this._handleKeydown, true);

    if (DEBUG) {
      console.debug(CLASS_NAME, "< bindDoubleEsc");
    }
  }

  unbindDoubleEsc(): void {
    if (DEBUG) {
      console.debug(CLASS_NAME, "> unbindDoubleEsc");
    }

    if (this._handleKeydown) {
      document.addEventListener("keydown", this._handleKeydown);
    }

    if (DEBUG) {
      console.debug(CLASS_NAME, "< unbindDoubleEsc");
    }
  }

  _firstTabTarget?: HTMLElement;
  static _firstTabHandlerBound?: EventListener;
  static _firstTabHandled: boolean = false;

  setFocusFirst(): void {
    if (DEBUG) {
      console.debug(CLASS_NAME, "> setFocusFirst", this._focusFirst.value, this._firstTabTarget);
    }

    if (
      SfGpsDsAuNswQuickExit._firstTabHandlerBound || 
      !this._firstTabTarget
    ) {
      console.debug(CLASS_NAME, "> setFocusFirst not applicable");
      return;
    }

    // Latest initialised Quick Exit becomes the first-Tab target.
    // firstTabHandled is global so we only hijack the very first Tab press per page load.

    const handleKeydown = (event: KeyboardEvent) => {
      const {
        key, keyCode, defaultPrevented, target,
      } = event
      const isTab = key === "Tab" || keyCode === 9;

      if (!isTab ||
        SfGpsDsAuNswQuickExit._firstTabHandled ||
        defaultPrevented ||
        !this._firstTabTarget ||
        this.isEditable(target as HTMLElement) || 
        this.isModalOpen
      ) {
        if (DEBUG) {
          console.debug(CLASS_NAME, "= setFocusFirst unapplicable");
        }

        return;
      }

      SfGpsDsAuNswQuickExit._firstTabHandled = true

      event.preventDefault()

      try {
        this._firstTabTarget.focus({ preventScroll: true })
      } catch (errD) {
        try {
          this._firstTabTarget.focus()
        } catch (errE) {
          if (DEBUG) console.debug(CLASS_NAME, "= setFocusFirst", errE);
        }
      }
    }

    SfGpsDsAuNswQuickExit._firstTabHandlerBound = handleKeydown.bind(this);
    document.addEventListener("keydown", handleKeydown, true);

    if (DEBUG) {
      console.debug(CLASS_NAME, "< setFocusFirst");
    }
  }

  unsetFocusFirst(): void {
    document.removeEventListener("keydown", SfGpsDsAuNswQuickExit._firstTabHandlerBound);
  }
  
  /* event management */

  handleClick(event: MouseEvent): void {
    if (DEBUG) {
      console.debug(CLASS_NAME, "> handleClick");
    }

    event.preventDefault();

    if (this._enableCloak.value) {
      document.documentElement.style.setProperty("display", "none", "important");
    }

    // window.location.assign(this.safeUrl);
    window.location.replace(this.safeUrl); // Replace is safer as it does not allow back

    if (DEBUG) {
      console.debug(CLASS_NAME, "< handleClick");
    }
  }

  /* lifecycle */

  constructor() {
    super();

    /* do the following when mounted, on first render */
    this.handleMounted(() => {
      if (DEBUG) console.debug(CLASS_NAME, "> handleMounted");

      this._firstTabTarget = this.refs.quickexit;
      if (this._focusFirst.value) this.setFocusFirst();

      if (DEBUG) console.debug(CLASS_NAME, "< handleMounted");
    });
  }
}