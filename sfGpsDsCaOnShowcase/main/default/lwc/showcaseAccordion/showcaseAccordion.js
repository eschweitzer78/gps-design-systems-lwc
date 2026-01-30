import { LightningElement, api, track } from "lwc";

/**
 * Showcase component for Accordion
 * Used for E2E testing of expand/collapse, ARIA states, and keyboard navigation
 */
export default class ShowcaseAccordion extends LightningElement {
  @api pageTitle = "Accordion Showcase";

  @track _basicSections = [
    {
      id: "1",
      heading: "Section 1: Getting Started",
      content:
        "This is the content for section 1. It explains how to get started with the service.",
      expanded: false
    },
    {
      id: "2",
      heading: "Section 2: Requirements",
      content:
        "This is the content for section 2. It lists the requirements and eligibility criteria.",
      expanded: false
    },
    {
      id: "3",
      heading: "Section 3: How to Apply",
      content:
        "This is the content for section 3. It provides step-by-step instructions on how to apply.",
      expanded: false
    },
    {
      id: "4",
      heading: "Section 4: Contact Information",
      content:
        "This is the content for section 4. It contains contact information for support.",
      expanded: false
    }
  ];

  @track _singleOpenSections = [
    {
      id: "s1",
      heading: "Payment Options",
      content:
        "Content about payment options. Only one section can be open at a time.",
      expanded: true
    },
    {
      id: "s2",
      heading: "Refund Policy",
      content: "Content about refund policy. Opening this will close others.",
      expanded: false
    },
    {
      id: "s3",
      heading: "Shipping Information",
      content: "Content about shipping information.",
      expanded: false
    }
  ];

  get basicSections() {
    return this._basicSections.map((section) => ({
      ...section,
      icon: section.expanded ? "−" : "+"
    }));
  }

  get singleOpenSections() {
    return this._singleOpenSections.map((section) => ({
      ...section,
      icon: section.expanded ? "−" : "+"
    }));
  }

  @track lastExpandedSection = "";

  handleToggle(event) {
    const sectionId = event.currentTarget.dataset.id;

    this._basicSections = this._basicSections.map((section) => ({
      ...section,
      expanded: section.id === sectionId ? !section.expanded : section.expanded
    }));

    const section = this._basicSections.find((s) => s.id === sectionId);
    this.lastExpandedSection = section.expanded ? section.heading : "";
  }

  handleSingleOpenToggle(event) {
    const sectionId = event.currentTarget.dataset.id;

    // Close all, then open the clicked one
    this._singleOpenSections = this._singleOpenSections.map((section) => ({
      ...section,
      expanded: section.id === sectionId ? !section.expanded : false
    }));

    const section = this._singleOpenSections.find((s) => s.id === sectionId);
    this.lastExpandedSection = section.expanded ? section.heading : "";
  }

  expandAll() {
    this._basicSections = this._basicSections.map((section) => ({
      ...section,
      expanded: true
    }));
    this.lastExpandedSection = "All sections";
  }

  collapseAll() {
    this._basicSections = this._basicSections.map((section) => ({
      ...section,
      expanded: false
    }));
    this.lastExpandedSection = "";
  }

  get hasExpandedSection() {
    return this.lastExpandedSection !== "";
  }

  get allExpanded() {
    return this._basicSections.every((s) => s.expanded);
  }

  get allCollapsed() {
    return this._basicSections.every((s) => !s.expanded);
  }
}
