import { LightningElement, api } from "lwc";
// import { nextTick } from "c/sfGpsDsHelpers";

/* NOTE: Not sure we can achieve this as this only works triggers only when component is slotted
   whereas vue can do that when a slotted component is conditionally rendered (v-if) or displayed (v-show)
*/

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
    this._enterFromClass = `${value}-enter ${value}-enter-from`; // TODO check vue doc to confirm which class is expected
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
  //@track className;

  handleSlotChange() {
    if (this.disabled) {
      return;
    }

    this.enterFrom();

    // For some reason this does not seem to work as required

    // nextTick(() => { this.enterTo(); });
    // TODO for some reason nextTick does not seem to work as required either

    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(() => {
      this.enterTo();
    }, 1);
  }

  handleTransitionStart(event) {
    console.log("handleTransitionStart", event.propertyName);
  }

  handleTransitionEnd(event) {
    console.log("handleTransitionEnd", event.propertyName, event.elapsedTime);
    if (this.classList.contains(this._enterActiveClass)) {
      this.className = null;
      console.log("transitionEnd " + this.className);
    }
  }

  enterFrom() {
    this.className = `${this._enterFromClass} ${this._enterActiveClass}`;
    console.log("enterFrom " + this.className);
  }

  enterTo() {
    this.className = `${this._enterToClass} ${this._enterActiveClass}`;
    console.log("enterTo " + this.className);
  }

  leaveFrom() {
    this.className = `${this._leaveFromClass} ${this._leaveActiveClass}`;
    console.log("leaveFrom " + this.className);
  }

  leaveTo() {
    this.className = `${this._leaveToClass} ${this._leaveActiveClass}`;
    console.log("leaveTo " + this.className);
  }

  /*
  connectedCallback() {
    console.log("connected");
  }

  disconnectedCallback() {
    console.log('disconnected');
  }
  */
}
