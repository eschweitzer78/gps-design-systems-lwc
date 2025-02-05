import { api, track, wire } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { getListInfoByName } from "lightning/uiListsApi";
import getListViewNameById from "@salesforce/apex/SfGpsDsListViewController.getListViewNameById";
import getCount from "@salesforce/apex/SfGpsDsListViewController.getCount";
import getRecords from "@salesforce/apex/SfGpsDsListViewController.getEnhancedRecords";

const LISTVIEW_OBJECTID = "00B";
const LISTVIEW_SETTINGS = "*#$LISTVIEW_SETTINGS";
const DEBUG = false;

export default class extends SfGpsDsLwc {
  @api objectApiName;
  @api pageSize = 10;

  @api labelColumn;
  @api titleColumn;
  @api dateColumn;
  @api tagsColumn;
  @api imageColumn;
  @api imageAltColumn;
  @api className;
  @api titleClassName;

  @track _isLoading = false;

  /* api: filterName */

  _filterName;
  _filterNameOriginal;

  @api
  get filterName() {
    return this._filterNameOriginal;
  }

  set filterName(value) {
    this._filterNameOriginal = value;

    if (value && value.toString().startsWith(LISTVIEW_OBJECTID)) {
      getListViewNameById({ id: value })
        .then((result) => {
          this._filterName = result;
        })
        .catch((error) => {
          this.addError("CO-LV", "Error while getting list view name.");
          this._filterName = null;

          if (DEBUG) {
            console.log("CO-LV", JSON.stringify(error));
          }
        });
    } else {
      this._filterName = value;
    }
  }

  _listInfo;
  _rawRecords;

  @wire(getListInfoByName, {
    objectApiName: "$objectApiName",
    listViewApiName: "$_filterName"
  })
  handleListInfo({ error, data }) {
    if (data) {
      this._listInfo = data;
      this._isLoading = true;

      getCount({
        objectApiName: this._listInfo.listReference.objectApiName,
        filterLogicString: this._listInfo.filterLogicString,
        filteredByInfo: JSON.stringify(this._listInfo.filteredByInfo)
      })
        .then((result) => {
          this._error = null;
          this._itemsTotal = result;
          this._pageSize = this.pageSize;
          this._activePage = 1;
          this._lastPage = Math.ceil(this._itemsTotal / this._pageSize);
          this._itemsFrom = 1;
          this._isLoading = false;
          this._orderedByInfo = this._listInfo.orderedByInfo;

          let sortOptions = this._listInfo.displayColumns
            .filter((column) => column.sortable)
            .map((column) => ({
              label: column.label,
              value: column.fieldApiName
            }));

          this._sortOptions = [
            { label: "List view default", value: LISTVIEW_SETTINGS },
            ...sortOptions
          ];

          this._sortValue = LISTVIEW_SETTINGS;

          this.updateRecords();
        })
        .catch((errorc) => {
          this.addError("CO-QC", "Query count error.");
          console.log(`Query count error ${errorc}`);

          this._error = errorc;
          this._itemsTotal = 0;
          this._pageSize = this.pageSize;
          this._lastPage = 1;
          this._activePage = 1;
          this._itemsFrom = 0;
          this._isLoading = false;

          this.updateRecords();
        });
    } else if (error) {
      this.addError("CO-LI", "Issue while getting list view info");

      console.log("List view error", JSON.stringify(error));
      this._error = error;
      this._listInfo = null;
      this.updateRecords();
    }
  }

  _records;
  @track _name;
  @track _itemsTotal;
  @track _pageSize = 10;
  @track _lastPage;
  @track _itemsFrom = 1;
  @track _itemsTo;
  @track _activePage = 1;

  @track _sortValue;
  @track _sortOptions;
  @track _displayColumns;
  @track _orderedByInfo; // current orderedBy clause

  updateRecords() {
    if (this._listInfo == null || this._itemsTotal === 0) {
      this._rawRecords = null;
      this.updateVisibleRecords();
      return;
    }

    this._isLoading = true;

    getRecords({
      objectApiName: this._listInfo.listReference.objectApiName,
      displayColumns: JSON.stringify(this._listInfo.displayColumns),
      filterLogicString: this._listInfo.filterLogicString,
      filteredByInfo: JSON.stringify(this._listInfo.filteredByInfo),
      orderedByInfo: JSON.stringify(this._orderedByInfo),
      offset: this._itemsFrom - 1,
      pageSize: this._pageSize
    })
      .then((result) => {
        this._rawRecords = result;
        this._error = undefined;
        this._isLoading = false;

        this.updateVisibleRecords();
      })
      .catch((error2) => {
        this.addError("CO-GR", "Issue while getting records");
        console.log("getRecords error", JSON.stringify(error2));
        this._error = error2;
        this._rawRecords = null;
        this._isLoading = false;

        this.updateVisibleRecords();
      });
  }

  updateVisibleRecords() {
    if (this._rawRecords == null || this._listInfo == null) {
      this._records = null;
      return;
    }

    this._name = this._listInfo.label;
    this._displayColumns = this._listInfo.displayColumns.map((column) => ({
      ...column
    }));

    this._records = this._rawRecords;
    this._itemsTo = this._itemsFrom + this._records.length - 1;
  }

  handlePageChange(event) {
    let formerActivePage = this._activePage;
    this._activePage = Math.max(1, Math.min(event.detail, this._lastPage));
    this._itemsFrom = (this._activePage - 1) * this._pageSize + 1;

    if (formerActivePage !== this._activePage) {
      this.updateRecords();
    }
  }

  handleResultsBarChange(event) {
    let fieldApiName = event.detail;

    if (fieldApiName === LISTVIEW_SETTINGS) {
      this._orderedByInfo = this._listInfo.orderedByInfo;
      this._activePage = 1;
      this._itemsFrom = 1;
      this._sortValue = LISTVIEW_SETTINGS;

      this.updateRecords();
    } else {
      let dc = this._listInfo.displayColumns;
      for (let i = 0; i < dc.length; i++) {
        if (dc[i].fieldApiName === fieldApiName) {
          this._orderedByInfo = [
            {
              fieldApiName: fieldApiName,
              isAscending: true,
              label: dc[i].label
            }
          ];

          this._activePage = 1;
          this._itemsFrom = 1;
          this._sortValue = fieldApiName;

          this.updateRecords();

          break;
        }
      }
    }
  }

  handleItemNavigate(event) {
    let navsvc = this.template.querySelector("c-sf-gps-ds-navigation-service");
    if (navsvc) {
      navsvc.navigateTo("standard__recordPage", {
        objectApiName: event.detail.objectApiName || this.objectApiName,
        recordId: event.detail.recordId,
        actionName: "view"
      });
    }
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("nsw-scope");
  }

  _rendered = false;

  renderedCallback() {
    let items = this.template.querySelectorAll(".item");
    let navsvc = this.template.querySelector("c-sf-gps-ds-navigation-service");

    if (
      navsvc == null ||
      items.length === 0 ||
      items.length !== this._records.length
    ) {
      return;
    }

    for (let i = 0; i < this._records.length; i++) {
      if (this._records[i]?.columns?.Id?.value) {
        navsvc
          .generateUrl("standard__recordPage", {
            objectApiName: this.objectApiName,
            recordId: this._records[i].columns.Id.value,
            actionName: "view"
          })
          .then((url) => {
            items[i].link = url;
          });
      }
    }
  }
}
