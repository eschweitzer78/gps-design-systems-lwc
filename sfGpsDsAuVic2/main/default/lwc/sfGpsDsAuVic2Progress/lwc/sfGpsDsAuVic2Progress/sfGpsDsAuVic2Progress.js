import { LightningElement, api, track } from "lwc";
import {
  normaliseBoolean,
  formatTemplate,
  toNumber,
  isString
} from "c/sfGpsDsHelpers";
import BreakpointsMixin from "c/sfGpsDsAuVic2BreakpointsMixin";

const EXPANDABLE_DEFAULT = false;
const AUTOEXPANDABLE_DEFAULT = false;
const INITIALLYEXPANDED_DEFAULT = false;

const CURRENTSTEP_DEFAULT = 1;

const I18N = {
  active: "active",
  complete: "complete",
  defaultTitle: "Progress",
  defaultSubtitle: "Step {currentStep} of {nbSteps}"
};

const DEBUG = false;
const CLASS_NAME = "SfGpsDsAuVic2Progress";

export default class extends BreakpointsMixin(LightningElement) {
  @api steps;
  @api className;

  /* api: title */

  _title = I18N.defaultTitle;
  _titleOriginal = I18N.defaultTitle;

  @api
  get title() {
    return this._titleOriginal;
  }

  set title(value) {
    this._titleOriginal = value;
    this._title =
      (isString(value) ? value : String(value)) || I18N.defaultTitle;
  }

  /* api: currentStep */

  _currentStep = CURRENTSTEP_DEFAULT;
  _currentStepOriginal = CURRENTSTEP_DEFAULT;

  @api
  get currentStep() {
    return this._currentStepOriginal;
  }

  set currentStep(value) {
    if (DEBUG) console.debug(CLASS_NAME, "> set currentStep", value);

    const valueAsNumber = toNumber(value);
    this._currentStepOriginal = value;
    this._currentStep = Number.isNaN(valueAsNumber) ? null : valueAsNumber;

    if (DEBUG)
      console.debug(CLASS_NAME, "< set currentStep", this._currentStep);
  }

  /* api: expandable */

  _expandable = EXPANDABLE_DEFAULT;
  _expandableOriginal = EXPANDABLE_DEFAULT;

  @api
  get expandable() {
    return this._expandableOriginal;
  }

  set expandable(value) {
    if (DEBUG) console.debug(CLASS_NAME, "> set expandable", value);

    this._expandableOriginal = value;
    this._expandable = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: EXPANDABLE_DEFAULT
    });

    if (DEBUG) console.debug(CLASS_NAME, "< set expandable", this._expandable);
  }

  /* api: autoExpandable */

  _autoExpandable = AUTOEXPANDABLE_DEFAULT;
  _autoExpandableOriginal = AUTOEXPANDABLE_DEFAULT;

  @api
  get autoExpandable() {
    return this._autoExpandableOriginal;
  }

  set autoExpandable(value) {
    if (DEBUG) console.debug(CLASS_NAME, "> set autoExpandable", value);

    this._autoExpandableOriginal = value;
    this._autoExpandable = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: AUTOEXPANDABLE_DEFAULT
    });

    if (DEBUG)
      console.debug(CLASS_NAME, "< set autoExpandable", this._autoExpandable);
  }

  /* api: initiallyExpanded */

  _initiallyExpanded = INITIALLYEXPANDED_DEFAULT;
  _initiallyExpandedOriginal = INITIALLYEXPANDED_DEFAULT;

  @api
  get initiallyExpanded() {
    return this._initiallyExpandedOriginal;
  }

  set initiallyExpanded(value) {
    if (DEBUG) console.debug(CLASS_NAME, "> set initiallyExpanded", value);

    this._initiallyExpandedOriginal = value;
    this._initiallyExpanded = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: INITIALLYEXPANDED_DEFAULT
    });

    this._isExpanded = this._initiallyExpanded;

    if (DEBUG)
      console.debug(
        CLASS_NAME,
        "< set initiallyExpanded",
        this._initiallyExpanded
      );
  }

  /* tracked */

  @track _isExpanded;

  /* computed */

  get computedIsExpandable() {
    const isSmallScreen = this.bpSmaller("m");

    if (DEBUG) {
      console.debug(
        CLASS_NAME,
        "> computedIsExpandable",
        "isSmallScreen",
        isSmallScreen,
        "autoExpandable",
        this._autoExpandable,
        "expandable",
        this._expandable
      );
    }

    const rv = this._autoExpandable ? isSmallScreen : this._expandable;

    if (DEBUG) console.debug(CLASS_NAME, "< computedIsExpandable", rv);
    return rv;
  }

  get computedExpandableIsExpanded() {
    if (DEBUG) console.debug(CLASS_NAME, "> computedExpandableIsExpanded");

    const rv = this.computedIsExpandable ? this._isExpanded : true;

    if (DEBUG) console.debug(CLASS_NAME, "< computedExpandableIsExpanded", rv);
    return rv;
  }

  get i18n() {
    return I18N;
  }

  get computedClassName() {
    return {
      "rpl-progress": true,
      "rpl-progress--expandable": this.computedIsExpandable,
      "rpl-progress--expanded": this._isExpanded,
      [this.className]: this.className
    };
  }

  get computedDefaultSubTitle() {
    if (DEBUG)
      console.debug(
        CLASS_NAME,
        "> computedSubTitle",
        JSON.stringify(this.steps)
      );

    const rv = formatTemplate(I18N.defaultSubtitle, {
      currentStep: this._currentStep,
      nbSteps: (this.steps || []).length
    });

    if (DEBUG) console.debug(CLASS_NAME, "< computedSubTitle", rv);
    return rv;
  }

  get decoratedSteps() {
    if (DEBUG)
      console.debug(CLASS_NAME, "> decoratedSteps", JSON.stringify(this.steps));

    const rv = (this.steps || []).map((step, index) => {
      const isActive = index + 1 === this._currentStep;
      const isComplete = index + 1 < this._currentStep;

      return {
        ...step,
        key: `step-${index + 1}`,
        isActive,
        isComplete,
        className: {
          "rpl-progress-step": true,
          "rpl-type-p-large-fixed": !isActive,
          "rpl-type-h3-fixed": isActive,
          "rpl-progress-step--complete": isComplete,
          "rpl-progress-step--active": isActive
        }
      };
    });

    if (DEBUG)
      console.debug(CLASS_NAME, "< decoratedSteps", JSON.stringify(rv));

    return rv;
  }

  /* event management */

  handleClick() {
    if (this.computedIsExpandable) {
      this._isExpanded = !this._isExpanded;
    }
  }

  @track _hasSlot = false;

  handleSlotChange() {
    this._hasSlot = true;
  }
}
