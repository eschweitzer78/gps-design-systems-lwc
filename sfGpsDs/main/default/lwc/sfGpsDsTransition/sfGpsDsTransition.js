import { LightningElement, api, track } from "lwc";
// import { nextTick } from "c/sfGpsDsHelpers";

/* Mimicking vue.js' Transition */

export default class SfGpsDsTransition extends LightningElement {
  _name;
  _enterFromClass;
  _enterToClass;
  _enterActiveClass;
  _leaveFromClass;
  _leaveToClass;
  _leaveActiveClass;

  @api set name(value) {
    this._name = value;
    this._enterFromClass = `${value}-enter-from`;
    this._enterToClass = `${value}-enter-to`;
    this._enterActiveClass = `${value}-enter-active`;
    this._leaveFromClass = `${value}-leave-from`;
    this._leaveToClass = `${value}-leave-to`;
    this._leaveActiveClass = `${value}-leave-active`;
    this.className = this._enterFromClass;
  }

  get name() {
    return this._name;
  }

  @api disabled = false;
  @track className;

  handleSlotChange() {
    if (this.disabled) {
      return;
    }

    // this.enterTo();
    // For some reason this does not seem to work as required

    // nextTick(() => { this.enterTo(); });
    // TODO for some reason nextTick does not seem to work as required either

    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(() => {
      this.enterTo();
    }, 1);
  }

  handleTransitionEnd() {
    if (this.className.includes(this._enterActiveClass)) {
      this.className = "";
    }
  }

  enterFrom() {
    this.className = this._enterFromClass;
  }

  enterTo() {
    this.className = this._enterToClass + " " + this._enterActiveClass;
  }

  leaveFrom() {
    this.className = this._leaveFromClass;
  }

  leaveTo() {
    this.className = this._leaveToClass + " " + this._leaveActiveClass;
  }
}
