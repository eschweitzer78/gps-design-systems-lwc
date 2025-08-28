import { LightningElement, api, track } from "lwc";
import pubsub from "c/sfGpsDsOsrtPubsub";
import { getDataHandler } from "c/sfGpsDsOsrtUtility";
import { listLabels as translatedLabels } from "c/sfGpsDsOsrtSalesforceUtils";
import sldsTemplate from "./list_slds.html";
import ndsTemplate from "./list_nds.html";

export default class List extends LightningElement {
  /* api: isSearchAvailable */

  _isSearchAvailable; // Added

  @api
  get isSearchAvailable() {
    return this._isSearchAvailable;
  }

  set isSearchAvailable(val) {
    this._isSearchAvailable = val === "true" || val === true;
  }

  /* api: isSortAvailable */

  _isSortAvailable;

  @api
  get isSortAvailable() {
    return this._isSortAvailable;
  }

  set isSortAvailable(val) {
    this._isSortAvailable =
      typeof val === "string" && val === "true"
        ? true
        : typeof val === "string" && val === "false"
          ? false
          : typeof val === "boolean"
            ? val
            : false;
  }

  @track filteredData = [];
  @api sortAttribute;
  @api searchAttribute;
  @api enableLoadMore = false;
  @api loadMoreNumberOfItems;
  @api theme = "slds";
  @api channel;
  @api height;
  @api loadMoreBtnLabel = translatedLabels.cmpLoadMore;
  @api maxHeight;
  @track showLoadMore = false;
  @track isBaseVersion;
  @track allData = [];
  @track iconUrl;
  @track sortIconName = "utility:arrowup";
  @track showIcon = false;
  @track showSortIcon;
  @track _loadMoreBtnLabel;
  isDataLoaded;
  privateFieldName = "Name";
  allDataCopy;
  isDataSource = false;
  isSorted = false;
  start = 0;
  scrollTop = 0;
  sourceType;
  listItem;
  translatedLabels = {};

  /* api: fieldName */
  @api
  get fieldName() {
    return this.privateFieldName;
  }

  set fieldName(value) {
    this.privateFieldName = value ? value : "Name";
  }

  /* api: recordSource */

  @api
  get recordSource() {
    return this.sourceType;
  }

  set recordSource(val) {
    if (val && val.type) {
      this.filteredData = [];
      this.start = 0;
      let requestData = JSON.stringify(val);
      this.sourceType = val;
      this.isDataSource = true;
      getDataHandler(requestData)
        .then((data) => {
          this.successCb(data);
        })
        .catch((error) => {
          this.errorCallback(error);
        });
    }
  }

  /* api: records */

  @api
  get records() {
    return this.allData;
  }

  set records(value) {
    // To be able to update the value;
    if (!this.isDataSource) {
      const validObj = (str) => {
        try {
          return JSON.parse(str);
        } catch (e) {
          return [];
        }
      };
      value = typeof value === "string" ? validObj(value) : value;
      let dataValue =
        value &&
        value.map((item) => {
          const mappedItem = { ...item };
          mappedItem.id = mappedItem.id || this.uniqueKey();
          mappedItem.Name = mappedItem[this.fieldName];
          return mappedItem;
        });
      this.allData = dataValue;
      this.filteredData = [];
      this.start = 0;
    } else if (value && value.length > 0) {
      // eslint-disable-next-line no-console
      console.log(
        "WARNING: You should not set records and a datasource. Only the data from the datasource will be shown in the list."
      );
    }
  }

  /* lifecycle */

  render() {
    if (this.theme === "nds") {
      return ndsTemplate;
    }
    return sldsTemplate;
  }

  connectedCallback() {
    this.iconUrl =
      this.theme === "nds"
        ? this.isLocal
          ? "/static/css/nds/assets/icons/"
          : ""
        : this.isLocal
          ? "/node_modules/@salesforce-ux/design-system/assets/icons/"
          : "";
    if (this.channel) {
      pubsub.register(this.channel, {
        result: this.onresult.bind(this)
      });
    }
    this.showSortIcon =
      (typeof this.isSortAvailable === "string" &&
        this.isSortAvailable === "true") ||
      (typeof this.isSortAvailable === "boolean" && this.isSortAvailable)
        ? true
        : false;
    this.translatedLabels = translatedLabels;
  }

  loadMore(e) {
    this.addItems(this.start);
    e.preventDefault();
  }

  addItems(start) {
    for (let i = start; i < start + this.step; i++) {
      if (this.allData && this.allData[i]) {
        this.filteredData.push(this.allData[i]);
        if (this.allData.length - 1 === i) {
          this.isDataLoaded = true;
          this.showLoadMore = false;
          break;
        } else this.isDataLoaded = false;
      }
    }
    if (this.listItem)
      this.listItem.records = Object.assign([], this.filteredData);
    this.start = start + this.step;
  }

  successCb(data) {
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch (e) {
        console.error(e);
      }
    }
    let dataValue =
      data &&
      data.map((item) => {
        const mappedItem = { ...item };
        mappedItem.id = "record-source-" + this.uniqueKey();
        mappedItem.Name = mappedItem[this.fieldName];
        return mappedItem;
      });
    this.allData = dataValue;
    this.addItems(this.start);
  }

  errorCallback(error) {
    console.error(error);
  }

  debounce(func, wait, immediate) {
    let timeout;
    return function () {
      let context = this,
        args = arguments[0];
      let later = function () {
        timeout = null;
        if (!immediate) func.call(context, args);
      };
      let callNow = immediate && !timeout;
      clearTimeout(timeout);
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  scrollHandler = this.debounce(() => {
    let scrollTop = this.template.querySelector(".content").scrollTop;
    if (
      this.filteredData &&
      this.filteredData.length < this.allData.length &&
      scrollTop > this.scrollTop
    ) {
      let scrollValue = scrollTop - this.scrollTop;
      this.step = Math.floor(scrollValue / 35) + 2;
      this.scrollTop = scrollTop;
      this.addItems(this.start);
    }
  }, 100);

  disconnectedCallback() {
    if (this.channel) {
      pubsub.unregister(this.channel, {
        onresult: this.onresult.bind(this)
      });
    }
  }

  renderedCallback() {
    if (JSON.stringify(this.allData) !== JSON.stringify(this.allDataCopy)) {
      this.allDataCopy = this.allData;
      const contentEl = this.template.querySelector(".content");
      const child = this.template.querySelector(".content li");
      if (this.height) {
        contentEl.style.height =
          this.height && /^[0-9]+$/.test(this.height)
            ? this.height + "px"
            : this.height
              ? this.height
              : "100vh";
      } else if (this.maxHeight) {
        contentEl.style.maxHeight =
          this.maxHeight && /^[0-9]+$/.test(this.maxHeight)
            ? this.maxHeight + "px"
            : this.maxHeight
              ? this.maxHeight
              : "100vh";
      } else {
        contentEl.style.height = "100vh";
      }
      let h = contentEl.clientHeight;
      if (this.enableLoadMore === "true" || this.enableLoadMore === true) {
        let isLoadMore =
          this.loadMoreNumberOfItems &&
          (typeof this.loadMoreNumberOfItems === "number" ||
            (typeof this.loadMoreNumberOfItems === "string" &&
              /^\d+$/.test(this.loadMoreNumberOfItems)));
        this._loadMoreBtnLabel =
          this.loadMoreBtnLabel && this.loadMoreBtnLabel.length
            ? this.loadMoreBtnLabel
            : translatedLabels.cmpLoadMore;
        if (isLoadMore && !this.isDataLoaded) this.showLoadMore = true;
        else contentEl.addEventListener("scroll", this.scrollHandler);
      } else {
        contentEl.addEventListener("scroll", this.scrollHandler);
      }
      this.step =
        this.showLoadMore && this.loadMoreNumberOfItems
          ? Math.round(this.loadMoreNumberOfItems)
          : child
            ? Math.round(h / child.clientHeight) + 5
            : Math.round(h / 35) + 5;
      if (!this.isDataSource && this.allData) {
        this.addItems(this.start);
      }
      this.showSortIcon = this.isSortAvailable;
    }
    if (typeof this.filteredData !== "undefined") {
      this.listItem = this.querySelector("*:nth-child(1)");
      this.isBaseVersion = this.listItem ? false : true;
      if (!this.isBaseVersion && this.listItem.records !== this.filteredData) {
        this.listItem.records = Object.assign([], this.filteredData);
        this.listItem.theme = this.theme;
      }
    }
  }

  searchKeyChangeHandler(event) {
    const searchKey = event.target.value;
    this.searchListBy(searchKey, this.searchAttribute);
  }

  get isEmpty() {
    return this.filteredData.length === 0;
  }

  toggleIcon(event) {
    if (!this.isSorted)
      this.showIcon = event.type === "mouseenter" ? true : false;
  }

  sortList() {
    this.sortIconName =
      this.sortIconName === "utility:arrowdown" || !this.isSorted
        ? "utility:arrowup"
        : "utility:arrowdown";
    const reverse = this.sortIconName === "utility:arrowdown" ? true : false;
    this.isSorted = true;
    this.showIcon = true;
    this.sortListBy(reverse, this.sortAttribute);
  }

  @api
  searchListBy(searchKey, field) {
    this.filteredData = this.allData.filter((item) => {
      if (field) {
        let searchFields = field.split(",");
        let isFound = false;
        searchFields.forEach(function (searchField) {
          if (isFound) {
            return;
          }
          isFound =
            item[searchField] &&
            item[searchField].toLowerCase().includes(searchKey.toLowerCase());
        });
        return isFound;
      }
      return item.Name.toLowerCase().includes(searchKey.toLowerCase());
    });
    if (this.listItem)
      this.listItem.records = Object.assign([], this.filteredData);
    this.showLoadMore = false;
  }

  @api
  sortListBy(reverse, field) {
    const dataObj = Object.assign([], this.filteredData);
    this.filteredData = dataObj.sort(
      this.dynamicSort(field || "Name", reverse)
    );
    if (this.listItem)
      this.listItem.records = Object.assign([], this.filteredData);
  }

  dynamicSort(field, reverse, primer) {
    var key = primer
      ? function (x) {
          return primer(x[field]);
        }
      : function (x) {
          return x[field];
        };
    reverse = !reverse ? 1 : -1;
    return function (a, b) {
      return (
        (a = key(a)),
        (b = key(b)),
        reverse *
          (typeof a === "string" && typeof b === "string"
            ? (a.toLowerCase() > b.toLowerCase() ? 1 : -1) -
              (b.toLowerCase() > a.toLowerCase() ? 1 : -1)
            : (a > b ? 1 : -1) - (b > a ? 1 : -1))
      );
    };
  }

  uniqueKey() {
    return Date.now() + "-" + Math.random();
  }

  onresult(value) {
    if (typeof value === "string") {
      try {
        value = JSON.parse(value);
      } catch (e) {
        //log error
      }
    }
    let dataValue =
      value &&
      value.map((item) => {
        return Object.assign(
          {
            id: item.id || this.uniqueKey()
          },
          item
        );
      });
    this.allData = dataValue;
    this.filteredData = [];
    this.start = 0;
  }
}
