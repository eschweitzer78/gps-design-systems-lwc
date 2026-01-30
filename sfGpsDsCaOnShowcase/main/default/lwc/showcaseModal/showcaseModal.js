import { LightningElement, api, track } from "lwc";

/**
 * Showcase component for Modal
 * Used for E2E testing of focus trap, keyboard navigation, and scroll lock
 */
export default class ShowcaseModal extends LightningElement {
  @api pageTitle = "Modal Showcase";

  @track isBasicModalOpen = false;
  @track isFormModalOpen = false;
  @track isConfirmModalOpen = false;
  @track lastAction = "";

  // Track which trigger opened the modal
  lastTrigger = null;

  // Basic modal
  openBasicModal(event) {
    this.lastTrigger = event.target;
    this.isBasicModalOpen = true;
  }

  closeBasicModal() {
    this.isBasicModalOpen = false;
    this.focusTrigger();
  }

  // Form modal
  openFormModal(event) {
    this.lastTrigger = event.target;
    this.isFormModalOpen = true;
  }

  closeFormModal() {
    this.isFormModalOpen = false;
    this.focusTrigger();
  }

  handleFormSubmit(event) {
    event.preventDefault();
    this.lastAction = "Form submitted";
    this.closeFormModal();
  }

  // Confirm modal
  openConfirmModal(event) {
    this.lastTrigger = event.target;
    this.isConfirmModalOpen = true;
  }

  closeConfirmModal() {
    this.isConfirmModalOpen = false;
    this.focusTrigger();
  }

  handleConfirm() {
    this.lastAction = "Confirmed";
    this.closeConfirmModal();
  }

  handleCancel() {
    this.lastAction = "Cancelled";
    this.closeConfirmModal();
  }

  // Handle escape key
  handleKeydown(event) {
    if (event.key === "Escape") {
      if (this.isBasicModalOpen) this.closeBasicModal();
      if (this.isFormModalOpen) this.closeFormModal();
      if (this.isConfirmModalOpen) this.closeConfirmModal();
    }
  }

  // Return focus to trigger button
  focusTrigger() {
    if (this.lastTrigger) {
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      setTimeout(() => {
        this.lastTrigger.focus();
      }, 0);
    }
  }

  get hasLastAction() {
    return this.lastAction !== "";
  }

  connectedCallback() {
    this.template.addEventListener("keydown", this.handleKeydown.bind(this));
  }

  disconnectedCallback() {
    this.template.removeEventListener("keydown", this.handleKeydown.bind(this));
  }
}
