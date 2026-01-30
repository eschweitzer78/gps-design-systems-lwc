import { LightningElement, api, track } from "lwc";

/**
 * Showcase component for NAICS Code Picker
 * Used for E2E testing of cascading dropdowns and dependent filtering
 */
export default class ShowcaseNaicsPicker extends LightningElement {
  @api pageTitle = "NAICS Code Picker Showcase";

  @track selectedCode = null;
  @track selectedDescription = "";
  @track selectionHistory = [];

  // Track selection levels for display
  @track sectorValue = "";
  @track subSectorValue = "";
  @track industryGroupValue = "";
  @track industryValue = "";
  @track nationalIndustryValue = "";

  handleCodeChange(event) {
    const detail = event.detail;
    this.selectedCode = detail.value || detail.code;
    this.selectedDescription = detail.label || detail.description || "";

    // Track the selection
    this.selectionHistory = [
      ...this.selectionHistory,
      {
        id: Date.now(),
        code: this.selectedCode,
        description: this.selectedDescription,
        timestamp: new Date().toLocaleTimeString()
      }
    ];

    this.dispatchEvent(new CustomEvent("naicsselected", { detail }));
  }

  handleLevelChange(event) {
    const level = event.target.dataset.level;
    const value = event.detail.value;

    switch (level) {
      case "sector":
        this.sectorValue = value;
        this.subSectorValue = "";
        this.industryGroupValue = "";
        this.industryValue = "";
        this.nationalIndustryValue = "";
        break;
      case "subsector":
        this.subSectorValue = value;
        this.industryGroupValue = "";
        this.industryValue = "";
        this.nationalIndustryValue = "";
        break;
      case "industrygroup":
        this.industryGroupValue = value;
        this.industryValue = "";
        this.nationalIndustryValue = "";
        break;
      case "industry":
        this.industryValue = value;
        this.nationalIndustryValue = "";
        break;
      case "nationalindustry":
        this.nationalIndustryValue = value;
        break;
      default:
        // Unknown level - no action needed
        break;
    }
  }

  clearSelection() {
    this.selectedCode = null;
    this.selectedDescription = "";
    this.sectorValue = "";
    this.subSectorValue = "";
    this.industryGroupValue = "";
    this.industryValue = "";
    this.nationalIndustryValue = "";
  }

  clearHistory() {
    this.selectionHistory = [];
  }

  get hasSelection() {
    return this.selectedCode !== null;
  }

  get hasHistory() {
    return this.selectionHistory.length > 0;
  }

  get currentSelectionLevels() {
    const levels = [];
    if (this.sectorValue)
      levels.push({ label: "Sector", value: this.sectorValue });
    if (this.subSectorValue)
      levels.push({ label: "Sub-sector", value: this.subSectorValue });
    if (this.industryGroupValue)
      levels.push({ label: "Industry Group", value: this.industryGroupValue });
    if (this.industryValue)
      levels.push({ label: "Industry", value: this.industryValue });
    if (this.nationalIndustryValue)
      levels.push({
        label: "National Industry",
        value: this.nationalIndustryValue
      });
    return levels;
  }
}
