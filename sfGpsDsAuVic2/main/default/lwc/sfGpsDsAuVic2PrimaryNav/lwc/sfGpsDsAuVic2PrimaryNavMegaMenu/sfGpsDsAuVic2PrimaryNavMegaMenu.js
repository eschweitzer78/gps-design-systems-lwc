import { LightningElement, api } from "lwc";
import FocusMixin from "c/sfGpsDsAuVic2PrimaryNavFocusMixin";
import { computeClass } from "c/sfGpsDsHelpers";

const I18N = {
  mainMenuBackLabel: "Main menu"
};

export default class extends FocusMixin(LightningElement) {
  @api items;
  @api showQuickExit;
  @api activeNavItems = {};

  /* computed */

  get currentLevel() {
    if (!this.activeNavItems.level1) return 1;
    if (!this.activeNavItems.level2) return 2;
    if (!this.activeNavItems.level3) return 3;
    return 4;
  }

  get computedClassName() {
    return computeClass({
      "rpl-primary-nav__mega-menu": true,
      [`rpl-primary-nav__mega-menu--current-level-${this.currentLevel}`]: true
    });
  }

  get computedGridOuterClassName() {
    return computeClass({
      "rpl-primary-nav__mega-menu-grid-outer": true,
      "rpl-primary-nav__mega-menu-grid-outer--reduced": this.hasUserActions
    });
  }

  get computedShowQuickLinks() {
    return this.showQuickExit || this.hasUserActions;
  }

  get computedQuickExitParentId() {
    return this.activeNavItems.level1.id;
  }

  get hasANILevel1Items() {
    return this.activeNavItems.level1?.items?.length > 0;
  }

  get hasANILevel2Items() {
    return this.activeNavItems.level2?.items?.length > 0;
  }

  get hasANILevel3Items() {
    return this.activeNavItems.level3?.items?.length > 0;
  }

  get i18n() {
    return I18N;
  }

  /* event handler */

  handleBackButton(event) {
    this.dispatchEvent(new CustomEvent("clickbackbutton"), {
      detail: {
        action: "click",
        text:
          event.target.label ||
          this.activeNavItems["level" + (this.currentLevel - 2)]?.text,
        index: this.currentLevel - 1
      }
    });

    /* Go back to level 3 */

    if (this.currentLevel === 4 && this.activeNavItems.level3) {
      this.dispatchEvent(
        new CustomEvent("toggleitem", {
          detail: {
            action: "open",
            level: 3,
            item: this.activeNavItems.level3
          }
        })
      );
    }

    /* Go back to level 2 */

    if (this.currentLevel === 3 && this.activeNavItems.level2) {
      this.dispatchEvent(
        new CustomEvent("toggleitem", {
          detail: {
            action: "open",
            level: 2,
            item: this.activeNavItems.level2
          }
        })
      );
    }

    /* Go back to level 1 */

    if (this.currentLevel === 2 && this.activeNavItems.level1) {
      this.dispatchEvent(
        new CustomEvent("toggleitem", {
          detail: {
            action: "open",
            level: 1,
            itemId: this.activeNavItems.level1
          }
        })
      );
    }
  }

  handleToggleItem(event) {
    this.dispatchEvent(
      new CustomEvent("toggleitem", {
        detail: event.detail
      })
    );
  }
}
