import { LightningElement, api, track } from "lwc";

/**
 * Showcase component for Search functionality
 * Used for E2E testing of search autocomplete and debounce behavior
 */
export default class ShowcaseSearch extends LightningElement {
  @api pageTitle = "Search Showcase";

  @track searchResults = [];
  @track searchQuery = "";
  @track isSearching = false;
  @track selectedResult = null;

  // Search configuration
  minSearchChars = 3;
  debounceTimeout = 300;
  maxResults = 10;

  // Mock search data for testing
  mockSearchData = [
    {
      id: "1",
      title: "Ontario Health Card",
      category: "Services",
      description: "Apply for or renew your health card"
    },
    {
      id: "2",
      title: "Driver's License",
      category: "Services",
      description: "Get or renew your driver's license"
    },
    {
      id: "3",
      title: "Ontario Works",
      category: "Programs",
      description: "Financial and employment assistance"
    },
    {
      id: "4",
      title: "OSAP",
      category: "Education",
      description: "Ontario Student Assistance Program"
    },
    {
      id: "5",
      title: "Business Registration",
      category: "Business",
      description: "Register your business in Ontario"
    }
  ];

  handleSearchInput(event) {
    this.searchQuery = event.detail.value || event.target.value;
    this.dispatchEvent(
      new CustomEvent("searchinput", { detail: { query: this.searchQuery } })
    );
  }

  handleSearch(event) {
    const query = event.detail?.query || this.searchQuery;

    if (query.length < this.minSearchChars) {
      this.searchResults = [];
      return;
    }

    this.isSearching = true;

    // Simulate search with mock data
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(() => {
      this.searchResults = this.mockSearchData.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase())
      );
      this.isSearching = false;

      this.dispatchEvent(
        new CustomEvent("searchcomplete", {
          detail: {
            query,
            resultCount: this.searchResults.length
          }
        })
      );
    }, 200);
  }

  handleResultSelect(event) {
    const resultId = event.currentTarget.dataset.id;
    this.selectedResult = this.searchResults.find((r) => r.id === resultId);

    this.dispatchEvent(
      new CustomEvent("resultselect", {
        detail: this.selectedResult
      })
    );
  }

  handleClear() {
    this.searchQuery = "";
    this.searchResults = [];
    this.selectedResult = null;
  }

  get hasResults() {
    return this.searchResults.length > 0;
  }

  get noResults() {
    return (
      this.searchQuery.length >= this.minSearchChars &&
      !this.isSearching &&
      this.searchResults.length === 0
    );
  }

  get resultCountMessage() {
    const count = this.searchResults.length;
    return count === 1 ? "1 result found" : `${count} results found`;
  }
}
