const FormElementMixin = (Base, setFormOuter = true) =>
  class extends Base {
    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }

      this._readOnlyClass = "sfgpsdsauvic2-read-only";

      if (setFormOuter) {
        this.classList.add("rpl-form__outer"); //, "sfgpsdsauvic2-os-show");
      }
    }

    omniShow() {
      const show = super.omniShow();

      if (show) {
        if (setFormOuter) this.classList.add("rpl-form__outer");
        this.classList.remove("sfgpsdsauvic2-os-hide");
        this.classList.add("sfgpsdsauvic2-os-show");
      } else {
        if (setFormOuter) this.classList.remove("rpl-form__outer");
        this.classList.remove("slds-hide");
        this.classList.remove("sfgpsdsauvic2-os-show");
        this.classList.add("sfgpsdsauvic2-os-hide");
      }

      return show;
    }

    applyCtrlWidth() {
      // Control width applied to each element
      if (this.jsonDef && this._propSetMap) {
        if (this._propSetMap.controlWidth != null) {
          this.classList.add("sfgpsdsauvic2-os-show");
        }
        this.classList.add("rpl-col-12");
        this.classList.add(`rpl-col-${this._propSetMap.controlWidth}-m`);
      }
    }
  };

export default FormElementMixin;
