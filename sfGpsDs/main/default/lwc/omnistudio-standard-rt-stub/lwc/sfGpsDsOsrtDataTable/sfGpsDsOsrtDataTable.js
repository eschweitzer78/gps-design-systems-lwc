import { LightningElement, api, track } from "lwc";
import sldsTemplate from "./dataTable_slds.html";
import ndsTemplate from "./dataTable_nds.html";
import loader from "./dataTable_loader.html";
import currencyjs from "c/sfGpsDsOsrtCurrencyjs";
import { debounce, formatDate, isDate } from "c/sfGpsDsOsrtUtility";
import { find, findIndex, cloneDeep, get } from "c/sfGpsDsOsrtLodash";
import { dataTableLabels as translatedLabels } from "c/sfGpsDsOsrtSalesforceUtils";
import dayjs from "c/sfGpsDsOsrtDayjs";

const inputTypes = [
  "checkbox",
  "currency",
  "date",
  "datetime",
  "email",
  "number",
  "percent",
  "text",
  "textarea",
  "url",
  "icon"
];

let idGenerator = 0;
export default class DataTable extends LightningElement {
  // List of Api Variables
  @api iconUrl;
  @api extraclass;
  @api headerclass;
  @api theme = "slds";
  @api get userSelectableRow() {
    return this._userSelectableRow;
  }
  set userSelectableRow(value) {
    this._userSelectableRow = value === true || value === "true";
  }
  @api groupOrder = "asc";
  @api userSelectableColumn;
  @api groupNameWrapperClass;
  @api hideExtraColumn = false;
  @api fireeventOnDeleteconfirm = false;
  @api rowDeleteDependentColumn = "";
  @api specialcharactersort;
  // Api Getter And Setter Methods
  @api get pagesize() {
    return this._pagesize;
  }
  set pagesize(val) {
    this._pagesize = val;
    if (val && this.isRecordsRendered) {
      this.initPagination();
    }
  }

  @api get sortAcrossGroups() {
    return this._sortAcrossGroups === true || this._sortAcrossGroups === "true";
  }
  set sortAcrossGroups(val) {
    this._sortAcrossGroups = val;
  }

  @api get activeGroups() {
    return this._activeGroups;
  }
  set activeGroups(val) {
    this._activeGroups = val === true || val === "true";
  }

  @api get cellLevelEdit() {
    return this._cellLevelEdit;
  }
  set cellLevelEdit(val) {
    this._cellLevelEdit = val === true || val === "true";
  }

  @api get pagelimit() {
    return this._pagelimit;
  }
  set pagelimit(page) {
    this._pagelimit = Number(page);
  }

  @api get hideTableHeader() {
    return this._hideTableHeader;
  }
  set hideTableHeader(value) {
    this._hideTableHeader = value === true || value === "true";
  }

  @api get issortavailable() {
    return this._issortavailable;
  }
  set issortavailable(value) {
    this._issortavailable = value === true || value === "true";
  }

  @api get issearchavailable() {
    return this._issearchavailable;
  }
  set issearchavailable(value) {
    this._issearchavailable = value === true || value === "true";
  }

  @api get rowLevelEdit() {
    return this._rowLevelEdit;
  }
  set rowLevelEdit(rowLevelEdit) {
    this._rowLevelEdit = rowLevelEdit === true || rowLevelEdit === "true";
  }

  @api get rowDelete() {
    return this._rowDelete;
  }

  set rowDelete(rowDelete) {
    this._rowDelete = rowDelete === true || rowDelete === "true";
  }

  @api get confirmdeleterow() {
    return this._confirmdeleterow;
  }

  set confirmdeleterow(confirmdeleterow) {
    this._confirmdeleterow =
      confirmdeleterow === true || confirmdeleterow === "true";
  }

  @api
  get draggable() {
    return this._draggable && !this.sortingObj.isSorting;
  }
  set draggable(val) {
    this._draggable = val === true || val === "true";
  }

  @api get records() {
    return this._records;
  }
  set records(value) {
    if (value) {
      value = this.validObj(value);
      this.initRecord(value);
    }
  }

  @api get groupBy() {
    return this._groupBy;
  }
  set groupBy(value) {
    if (value) {
      this._groupBy =
        typeof value === "string" && value.indexOf("{") !== -1
          ? this.validObj(value)
          : value;
      if (this.isRecordsRendered) {
        this.tableData = [];
        this.handleRecords();
      }
    }
  }

  @api get columns() {
    return this.dataColumns;
  }
  set columns(value) {
    this.initColumn(value);
  }

  @api get styles() {
    return this._styles;
  }
  set styles(val) {
    if (val) {
      this._styles = typeof val === "string" ? JSON.parse(val) : val;
    }
  }

  @api get tablename() {
    return this._tablename;
  }
  set tablename(value) {
    this._tablename = value;
    this.setTableName(this._tablename);
  }

  @api get hasAccessibilitySupport() {
    return this._hasAccessibilitySupport;
  }
  set hasAccessibilitySupport(val) {
    this._hasAccessibilitySupport = val === true || val === "true";
  }

  @api get highlightSelection() {
    return this._highlightSelection || false;
  }
  set highlightSelection(val) {
    this._highlightSelection = val;
    if (val === true || val === "true") {
      this.setHighlightSelection();
    } else if (val === false || val === "false") {
      this.clearHighlightSelection();
    }
  }

  @api get highlightRow() {
    return this._highlightRow || "0";
  }
  set highlightRow(val) {
    this._highlightRow = val;
    if (
      this.highlightSelection === true ||
      this.highlightSelection === "true"
    ) {
      this.setHighlightSelection();
    }
  }

  firstFocusableElement;
  lastFocusableElement;
  currentRowDeleteBtn;

  clearHighlightSelection(tableBody) {
    tableBody =
      tableBody || this.template.querySelector(".slds-data-table-body");
    if (tableBody) {
      Array.from(tableBody.children).forEach((tableRow) =>
        tableRow.classList.remove(`slds-data-table-row--active`)
      );
    }
  }

  setHighlightSelection() {
    const tableBody = this.template.querySelector(".slds-data-table-body");
    if (tableBody) {
      this.clearHighlightSelection(tableBody);
      if (Array.from(tableBody.children)[this.highlightRow]) {
        Array.from(tableBody.children)[this.highlightRow].classList.add(
          `slds-data-table-row--active`
        );
      }
    }
  }

  handleDatatableStyles() {
    if (this._styles) {
      let table = this.template.querySelector(".table");
      // table background color
      if (table && this._styles.tableBgColor)
        table.style.backgroundColor = this._styles.tableBgColor;
      // table border
      if (table && this._styles.tableBorderType) {
        table.classList.remove(`${this.theme}-table_bordered`);
        if (Array.isArray(this._styles.tableBorderType)) {
          this._styles.tableBorderType.forEach((bod) => {
            table.classList.add(`${this.theme}-${bod}`);
          });
        } else
          table.classList.add(`${this.theme}-${this.styles.tableBorderType}`);
      }
      if (table && this._styles.tableBorderWidth)
        table.style.borderWidth = `${this._styles.tableBorderWidth}px`;
      if (table && this._styles.tableBorderColor)
        table.style.borderColor = this._styles.tableBorderColor;
      // table head
      let headCell = this.template.querySelectorAll(
        `.${this.theme}-data-table-head-cell`
      );
      if (this._styles.headFontWeight && headCell && headCell.length) {
        headCell.forEach((ele) => {
          ele.style.fontWeight = this._styles.headFontWeight;
        });
      }
      if (this._styles.headBgColor && headCell && headCell.length) {
        headCell.forEach((ele) => {
          ele.style.backgroundColor = this._styles.headBgColor;
        });
      }
      // TODO: support list of possible fontFamily
      if (this._styles.headFontFamily && headCell && headCell.length) {
        headCell.forEach((ele) => {
          ele.style.fontFamily = this._styles.headFontFamily;
        });
      }
      if (this._styles.headTextDecoration && headCell && headCell.length) {
        headCell.forEach((ele) => {
          ele.style.textDecoration = this._styles.headTextDecoration;
        });
      }
      // Row
      let tableBody = this.template.querySelector(
        `.${this.theme}-data-table-body`
      );
      let rows = tableBody
        ? tableBody.getElementsByClassName(`${this.theme}-data-table-row`)
        : null;
      if (rows && rows.length && this._styles.rowBgColor) {
        rows = Array.from(rows);
        rows.forEach((row) => {
          row.style.backgroundColor = this._styles.rowBgColor;
        });
      }
      // cell
      let cells = tableBody
        ? tableBody.getElementsByClassName(`${this.theme}-data-table-row-cell`)
        : null;
      if (cells && cells.length && this._styles.cellBorderType) {
        cells = Array.from(cells);
        if (Array.isArray(this._styles.cellBorderType)) {
          this._styles.cellBorderType.forEach((bod) => {
            cells.forEach((cell) => {
              cell.classList.add(`${this.theme}-${bod}`);
            });
          });
        } else
          cells.forEach((cell) => {
            cell.classList.add(`${this.theme}-${this._styles.cellBorderType}`);
          });
      }
      if (cells && cells.length && this._styles.cellBorderWidth) {
        cells.forEach((cell) => {
          cell.style.borderWidth = `${this._styles.cellBorderWidth}px`;
        });
      }
      if (cells && cells.length && this._styles.cellBorderColor) {
        cells.forEach((cell) => {
          cell.style.borderColor = this._styles.cellBorderColor;
        });
      }
      if (cells && cells.length && this._styles.cellBgColor) {
        cells.forEach((cell) => {
          cell.style.backgroundColor = this._styles.cellBgColor;
        });
      }
      if (cells && cells.length && this._styles.cellBoxShadow) {
        cells.forEach((cell) => {
          cell.style.boxShadow = this._styles.cellBoxShadow;
        });
      }
      let dataTableCells = tableBody
        ? tableBody.getElementsByClassName("dataTableCell")
        : null;
      if (dataTableCells && dataTableCells.length) {
        dataTableCells = Array.from(dataTableCells);
        dataTableCells.forEach((cell) => {
          let cellClass = "";
          if (this._styles.cellPadding && this._styles.cellPadding.length) {
            this._styles.cellPadding.forEach((padding) => {
              cellClass =
                cellClass + `${this.theme}-p-${padding.type}_${padding.size} `;
            });
          }
          if (this._styles.cellMargin && this._styles.cellMargin.length) {
            this._styles.cellMargin.forEach((margin) => {
              cellClass =
                cellClass + `${this.theme}-m-${margin.type}_${margin.size} `;
            });
          }
          cell.cellWrapperClass = cellClass;
        });
      }
    }
  }

  //Getter methods
  get showFirstColumn() {
    return this.isGrouped && !this._hideExtraColumn;
  }
  get _hideExtraColumn() {
    return this.hideExtraColumn === true || this.hideExtraColumn === "true";
  }

  get showRowLevelEdit() {
    return this.isTableEditable && this.rowLevelEdit;
  }
  get rowsAvailable() {
    return (
      this._records &&
      this._records.length > 0 &&
      this.filteredData &&
      this.filteredData.length &&
      !this.noRecords
    );
  }
  get getGroupedHeaderClass() {
    return this._styles && this._styles.showGroupedHeaderAsAnchor
      ? `${this.theme}-anchor-tag-color anchor-tag-color`
      : "";
  }

  get columnHeaderClass() {
    return this._styles && this._styles.columnHeaderCaps
      ? `${this.theme}-truncate ${this.theme}-text-title_caps`
      : `${this.theme}-truncate`;
  }

  // List of Track Variables
  @track updatingTable;
  @track dataColumns = [];
  @track pageData = [];
  @track isGrouped = false;
  @track groupedPageData;
  @track groupArray = [];
  @track tablePageData = [];
  @track tablePageGroupData = [];
  @track filteredTableData = [];
  @track filteredTableGroupData = [];
  @track selectableObj = [];
  @track isLoaded = false;
  @track baseVersion = false;
  @track searchInput = "";
  @track isValidPagesize = false;
  @track _userSelectableColumn;
  @track showDeleteConfirmation = false;
  @track sortingIcon = "utility:arrowdown";
  @track selectAllRow = false;
  @track _userSelectableRow = false;
  @track _tablename;
  @track _hasAccessibilitySupport = false;

  // List of private variables
  dateObj = {};
  _pagelimit = 3;
  _rowDelete = false;
  _draggable = false;
  _cellLevelEdit = true;
  _rowLevelEdit = false;
  isSearchFocused = false;
  _issortavailable = false;
  _hideTableHeader = false;
  _confirmdeleterow = false;
  _issearchavailable = false;
  translatedLabels = {};
  visibleColumns = [];
  columnIndexObj = {};

  recordsOnEdit = [];
  _activeGroups = true;
  deleteRowData = {};
  currentPage = 0;
  totalNumberOfPages;
  currentPageIndex = 0;
  pageNumberList;
  sortingObj = {
    isSorting: false,
    sortField: "",
    icon: "utility:arrowdown",
    reverse: false,
    order: "ascending"
  };
  searchObj = {
    fields: []
  };
  searchFields = [];
  noRecords = false;
  tableData = [];
  tableGroupData = [];
  _records;
  _rowIndex = 0;
  _colIndex = 0;
  _groupIndex = 0;
  index = 0;
  editMode = 0;
  filteredData;
  _dragElem;
  _dragElemRef;
  _isUpdatingCustomUI = false;
  _activeGroupMap = {};
  isTableEditable = false;
  render() {
    return this.updatingTable
      ? loader
      : this.theme === "nds"
        ? ndsTemplate
        : sldsTemplate;
  }

  connectedCallback() {
    this.translatedLabels = translatedLabels;
    this._tablename = this._tablename
      ? this._tablename
      : this.translatedLabels.datatableNameDefaultValue
        ? this.translatedLabels.datatableNameDefaultValue
        : "Datatable";
    this.setTableName(this._tablename);
    this._userSelectableColumn =
      this.userSelectableColumn === true ||
      this.userSelectableColumn === "true";
    this._handleKeyDownOnLastElementInModal =
      this.handleKeyDownOnLastElementInModal.bind(this);
    this._handleKeyDownOnFirstElementInModal =
      this.handleKeyDownOnFirstElementInModal.bind(this);
  }

  renderedCallback() {
    if (
      this.tablePageData &&
      this.tablePageData.length > 0 &&
      !this.isRendered
    ) {
      this.isRendered = true;
      let cellElements = this.querySelectorAll(".dataTableCell");
      if (!this.isGrouped && cellElements && cellElements.length > 0) {
        this.setCustomUITable();
        this.baseVersion = false;
      } else {
        this.baseVersion = true;
      }
    }

    if (
      this.highlightSelection === true ||
      this.highlightSelection === "true"
    ) {
      this.setHighlightSelection();
    }
    /**
     * Below code adds keypress listener to the dataTable rows
     */
    const tableRows = !this.isGrouped
      ? this.template.querySelectorAll('[data-type="row"]')
      : this.template.querySelectorAll('[data-group="row"]');
    if (tableRows?.length) {
      tableRows.forEach((row) => {
        if (!row?.getAttribute("data-table-row-cell-nav")) {
          row.addEventListener("keydown", this.handleKeyDown);
          row.setAttribute("data-table-row-cell-nav", true);
        }
      });
    }
    /**
     * Add tabindex=0 to the first cell of the dataTable.
     * In case of grouped dataTable, do it for first cell of every group.
     */
    if (this.isGrouped && this.tablePageGroupData?.length) {
      for (let i = 0; i < this.tablePageGroupData.length; i++) {
        const groupRow = this.template.querySelector(
          `[data-groupindex="${i}"][data-rowindex="0"]`
        );
        const dataTableCell = groupRow?.querySelectorAll(
          ".flex-datatable-cell"
        );
        if (dataTableCell && dataTableCell.length) {
          dataTableCell.forEach((item, index) => {
            if (index === 0) item.setAttribute("tabindex", 0);
          });
        }
      }
    } else {
      const dataTableCell = this.template.querySelectorAll(
        ".flex-datatable-cell"
      );
      if (dataTableCell && dataTableCell.length) {
        dataTableCell.forEach((item, index) => {
          if (index === 0) item.setAttribute("tabindex", 0);
        });
      }
    }
    const input =
      this.template.querySelector(".slds-search-input") ||
      this.template.querySelector(".nds-search-input");
    if (this.isSearchFocused && input) {
      input.focus();
      this.isSearchFocused = false;
    }
    this.handleDatatableStyles();
    if (this.showDeleteConfirmation) {
      const deleteModalBtns = this.template.querySelectorAll(
        `.${this.theme}-button_neutral`
      );
      if (deleteModalBtns.length) {
        deleteModalBtns[1].focus();
        this.firstFocusableElement = deleteModalBtns[0];
        this.firstFocusableElement.addEventListener(
          "keydown",
          this._handleKeyDownOnFirstElementInModal
        );
        this.lastFocusableElement = deleteModalBtns[1];
        this.lastFocusableElement.addEventListener(
          "keydown",
          this._handleKeyDownOnLastElementInModal
        );
      }
    }
  }

  handleKeyDownOnLastElementInModal(event) {
    // close the modal if escape is pressed
    if (event.key === "Escape") {
      this.deleteRowCancel();
    }

    if (event.key !== "Tab") {
      return;
    }

    // ignore if shiftkey is held down
    if (!event.shiftKey && this.firstFocusableElement) {
      // if focused has reached to last focusable element then focus first focusable element after pressing tab
      this.firstFocusableElement.focus();
      event.preventDefault();
    }
  }

  handleKeyDownOnFirstElementInModal(event) {
    // close the modal if escape is pressed
    if (event.key === "Escape") {
      this.deleteRowCancel();
    }

    if (event.key !== "Tab") {
      return;
    }

    // if shiftkey is held down then we're going backwards and should end up on last element
    if (event.shiftKey && this.lastFocusableElement) {
      // if focused has reached to first focusable element then focus last focusable element after pressing shift and tab
      this.lastFocusableElement.focus();
      event.preventDefault();
    }
  }

  /**
   * Utility Methods - KeyBoard Navigation of dataTable cells.
   */
  updateCellFocus(cellElesArray, columnIndex) {
    // eslint-disable-next-line no-unused-expressions
    cellElesArray?.forEach((ele, index) => {
      const cellEle = ele.querySelector(".dataTableCell");
      if (index === columnIndex) {
        ele.tabIndex = 0;
        ele.focus();
        // if cell is editable, show edit icon
        cellEle?.showEditIcon(true);
      } else {
        ele.tabIndex = -1;
        cellEle?.showEditIcon(false);
      }
    });
  }

  removeCellFocus(cellElesArray) {
    // eslint-disable-next-line no-unused-expressions
    cellElesArray?.forEach((ele) => {
      ele.tabIndex = -1;
      const cellEle = ele.querySelector(".dataTableCell");
      cellEle?.showEditIcon(false);
    });
  }

  /**
   * handleKeyDown
   * @param {*} event
   * Handles arrow naviagtion of the DataTable cells.
   * Tab to set focus, arrow keys to navigate around the cells.
   */
  handleKeyDown = (event) => {
    const elem = event.currentTarget;
    let rowIndex = parseInt(elem.dataset.rowindex, 10);
    let cellEles, columnIndex, groupIndex;
    if (this.isGrouped) {
      groupIndex = parseInt(elem.dataset.groupindex, 10);
    }
    switch (event?.key) {
      case "Down":
      case "ArrowDown":
        let pageData = !this.isGrouped
          ? this.tablePageData
          : this.tablePageGroupData[groupIndex]?.groupItems;
        if (rowIndex < pageData?.length - 1) {
          rowIndex = rowIndex + 1;
          cellEles = elem.querySelectorAll(".flex-datatable-cell");
          columnIndex = Array.from(cellEles).findIndex(
            (item) => item.tabIndex === 0
          );
          this.removeCellFocus(cellEles);
          const nextRowEle = !this.isGrouped
            ? this.template.querySelectorAll('[data-type="row"]')[rowIndex]
            : this.template.querySelector(
                `[data-groupindex="${groupIndex}"][data-rowindex="${rowIndex}"]`
              );
          cellEles = nextRowEle.querySelectorAll(".flex-datatable-cell");
          this.updateCellFocus(cellEles, columnIndex);
          event.stopPropagation();
        }
        break;
      case "Up":
      case "ArrowUp":
        if (rowIndex > 0) {
          cellEles = elem.querySelectorAll(".flex-datatable-cell");
          columnIndex = Array.from(cellEles).findIndex(
            (item) => item.tabIndex === 0
          );
          rowIndex = rowIndex - 1;
          this.removeCellFocus(cellEles);
          const preRowEle = !this.isGrouped
            ? this.template.querySelectorAll('[data-type="row"]')[rowIndex]
            : this.template.querySelector(
                `[data-groupindex="${groupIndex}"][data-rowindex="${rowIndex}"]`
              );
          cellEles = preRowEle.querySelectorAll(".flex-datatable-cell");
          this.updateCellFocus(cellEles, columnIndex);
          event.stopPropagation();
        }
        break;
      case "Left":
      case "ArrowLeft":
        cellEles = elem.querySelectorAll(".flex-datatable-cell");
        columnIndex = Array.from(cellEles).findIndex(
          (item) => item.tabIndex === 0
        );
        if (columnIndex > 0) this.updateCellFocus(cellEles, columnIndex - 1);
        event.stopPropagation();
        break;
      case "Right":
      case "ArrowRight":
        cellEles = elem.querySelectorAll(".flex-datatable-cell");
        columnIndex = Array.from(cellEles).findIndex(
          (item) => item.tabIndex === 0
        );
        if (columnIndex < cellEles.length - 1)
          this.updateCellFocus(cellEles, columnIndex + 1);
        event.stopPropagation();
        break;
      case "Enter":
        // 1. find the element in focus
        // 2. if element has inline edit trigger click event
        cellEles = elem.querySelectorAll(".flex-datatable-cell");
        columnIndex = Array.from(cellEles).findIndex(
          (item) => item.tabIndex === 0
        );
        if (columnIndex > -1) {
          this.updateCellFocus(cellEles, columnIndex);
          this.triggerCellEdit(cellEles, columnIndex, rowIndex, groupIndex);
        }
        break;
      case "Tab":
        // On focus leave hide cell edit icon
        cellEles = elem.querySelectorAll(".flex-datatable-cell");
        cellEles?.forEach((ele) => {
          const cellEle = ele.querySelector(".dataTableCell");
          cellEle?.showEditIcon(false);
        });
        break;
      default: // Do nothing
    }
  };
  _isFocusStateSaved = false;

  focusState = {
    rowIndex: null,
    colIndex: null,
    groupindex: null
  };

  triggerCellEdit(cellArray, colIndex, rowIndex, groupIndex) {
    cellArray?.forEach((ele, index) => {
      if (index === colIndex) {
        const cellEle = ele.querySelector(".dataTableCell");
        cellEle.triggerEditCell();
      }
    });
    // Once cell edit is triggered, save the focus state
    this._isFocusStateSaved = true;
    this.focusState.rowIndex = rowIndex;
    this.focusState.colIndex = colIndex;
    if (this.isGrouped) this.focusState.groupindex = groupIndex;
  }

  initRecord(value) {
    value = typeof value === "string" ? JSON.parse(value) : value;
    value = Array.isArray(value) ? value : [value];
    this._records = value.map((obj, index) => {
      const item = { ...obj };
      if (item.originalIndex) {
        item.originalIndex = index + "";
      }
      return {
        originalIndex: index + "",
        ...item
      };
    });
    this.tableData = [];
    this.tableGroupData = [];
    if (!this.baseVersion) {
      this.updatingTable = true;
    }
    this.isLoaded = false;
    this.filteredData = [...this._records];
    this.selectAllRow = false;
    this.isRecordsRendered = true;
    Promise.resolve().then(() => {
      this.handleRecords();
      if (this.searchInput) {
        let searchKey = this.searchInput;
        this.searchListBy(searchKey, this.searchFields);
      }
      this.sortByField(null, true);
    });
  }

  validObj(value) {
    try {
      if (typeof value === "string") {
        if (value.charAt(0) === "\\") {
          value = value.substring(1);
        }
        value = JSON.parse(value);
      }
      return value;
    } catch (e) {
      console.error("Error in parsing datatable columns: " + e);
    }
    return value;
  }

  initPagination() {
    this.isValidPagesize = this.pagesize && parseInt(this.pagesize, 10) > 0;
    if (this.groupBy && this.tableGroupData) {
      this.setGroupedTable(this.tableGroupData);
    } else if (!this.groupBy && this.tableData) {
      this.setUnGroupedTable(this.tableData);
    }
  }

  initColumn(value) {
    this.selectableObj = [];
    if (typeof value === "string") {
      value = this.validObj(value);
    }
    this.dataColumns = value.map((item, index) => {
      this.columnIndexObj[item.fieldName] = index;
      if (item.searchable === true || item.searchable === "true") {
        this.searchFields.push(item.fieldName);
      }
      if (item.editable === true || item.editable === "true") {
        this.isTableEditable = true;
      }
      if ((item.type === "date" || item.type === "datetime") && item.format) {
        this.dateObj[item.fieldName] = item.format;
      }
      if (item.userSelectable === true || item.userSelectable === "true") {
        this.initUserSelectableCol(item);
      }
      let isVisible =
        typeof item.visible === "undefined" ||
        item.visible === true ||
        item.visible === "true";
      if (isVisible) {
        this.visibleColumns.push(item.fieldName);
      }
      return {
        ...item,
        id: item.id || this.uniqueKey(),
        editable: item.editable === "true" || item.editable === true,
        sortable: item.sortable === "true" || item.sortable === true,
        ariaSort: "none",
        visible: isVisible,
        type:
          !item.type || inputTypes.indexOf(item.type) === -1
            ? "text"
            : item.type,
        showUserSelectableColumn:
          item.showUserSelectableColumn ||
          (index === 0 && this._userSelectableRow && this._hideExtraColumn)
      };
    });
    this.dynamicColumns = [...this.dataColumns];
    this.handleRecords();
  }

  initUserSelectableCol(item) {
    let itemName = `${item.fieldName}-menu-${this.uniqueKey()}`;
    this.selectableObj.push({
      ...item,
      checked:
        typeof item.visible === "undefined"
          ? true
          : item.visible === true || item.visible === "true",
      label: item.label,
      value: item.fieldName,
      id: this.uniqueKey(),
      menuItemName: itemName
    });
  }

  groupByHeaderClass() {
    if (this.groupNameWrapperClass) {
      return (
        `${this.theme}-data-table-row tableRow ` + this.groupNameWrapperClass
      );
    }
    return `${this.theme}-data-table-row tableRow ${this.theme}-theme_shade`;
  }

  setCustomUITable() {
    let cellElements = this.querySelectorAll(".dataTableCell");
    cellElements.forEach((elem, i) => {
      let name = elem.dataset.fieldName;
      if (this.visibleColumns.indexOf(name) === -1) {
        elem.style.display = "none";
      } else if (
        this.columnIndexObj[name] &&
        i < this.dataColumns.length &&
        i !== this.columnIndexObj[name]
      ) {
        let temp1 = this.dataColumns[i];
        this.dataColumns[i] = this.dataColumns[this.columnIndexObj[name]];
        this.dataColumns[this.columnIndexObj[name]] = temp1;
        let temp2 = this.columnIndexObj[name];
        this.columnIndexObj[name] = i;
        this.columnIndexObj[temp1.fieldName] = temp2;
      }
    });

    this.tablePageData.forEach((row, index) => {
      row.columns.forEach((cell) => {
        let cellElement = this.querySelectorAll(
          '.dataTableCell[data-field-name="' + cell.fieldName + '"]'
        )[index];
        if (
          (cellElement && !cellElement.columnData) ||
          (cellElement && this._isUpdatingCustomUI)
        ) {
          cellElement.columnData = cell;
          cellElement.cellData = cell.data;
          cellElement.theme = this.theme;
          cellElement.iconUrl = this.iconUrl;
          cellElement.dataset.index = cell.data.originalItemIndex;
          if (!cellElement.dataset.isListenerAdded) {
            cellElement.addEventListener(
              "edit",
              this.handleFieldEdit.bind(this)
            );
          }
          if (
            this.dateObj[cell.fieldName] &&
            (cell.type === "date" || cell.type === "datetime")
          ) {
            cellElement.dateFormat = this.dateObj[cell.fieldName];
            if (cell.type === "date" && cell.dateFormat && cell.data.value) {
              cell.data.value = formatDate(cell.data.value, cell.dateFormat);
            }
          }
          cellElement.dataset.isListenerAdded = true;
          cellElement.rowData = this.records[cell.data.originalItemIndex];
          cellElement.style.display = "table-cell";
          cellElement.style.verticalAlign = "top";
          cellElement.isCustomUi = true;
          if (index > 0) {
            cellElement.style.borderTop = "1px solid rgb(221, 219, 218)";
          }
        }
      });
    });

    this._isUpdatingCustomUI = false;
  }

  handleSelectableCol(data) {
    let menuItem =
      data && data.detail && data.detail.result
        ? { ...data.detail.result }
        : {};
    if (this._userSelectableColumn) {
      let obj = this.dataColumns.find(
        (item) => item.label.toLowerCase() === menuItem.name
      );
      obj.visible = !obj.visible;
      //if removing sorted column
      if (this.sortingObj.sortField === menuItem.name) {
        this.sortingObj.isSorting = false;
        this.sortingObj.sortField = "";
      }
      this.handleRecords();
    }
  }

  handleRecords() {
    this.isValidPagesize = this.pagesize && parseInt(this.pagesize, 10) > 0;
    if (!this.groupBy) {
      this._rowIndex = 0;
      if (this.filteredData) {
        this.tableData = [];
        this.filteredData.map((item, index) => {
          this.tableData.push({
            id: "row-" + this._rowIndex,
            columns: [],
            originalItemIndex: item.originalIndex,
            hide: item.hide ? "display:none" : "",
            displayClass: `${this.theme}-data-table-row tableRow`,
            selectRow: this.selectAllRow || item.selectrow,
            isDeleteActive: this.rowDeleteDependentColumn
              ? item[this.rowDeleteDependentColumn] && this.rowDelete
              : false,
            ariaLabel: translatedLabels.selectRowAriaLabel.replace(
              "{0}",
              this._rowIndex + 1
            )
          });
          this._colIndex = 0;
          this.dataColumns.map((column) => {
            if (column.visible) {
              let cell = {
                id: "row-" + this._rowIndex + "-col-" + this._colIndex,
                data: {
                  label: true,
                  editable: column.editable && this._cellLevelEdit,
                  position: this._rowIndex + "_" + this._colIndex++,
                  value: item[column.fieldName],
                  [column.type || "text"]: false,
                  originalItemIndex: item.originalIndex,
                  isDeleteActive: this.rowDeleteDependentColumn
                    ? item[this.rowDeleteDependentColumn] && this.rowDelete
                    : false
                },
                fieldName: column.fieldName,
                fieldTitle: column.fieldTitle,
                type: column.type
              };
              if (column.type === "url" && column.preventNavigation) {
                cell.preventNavigation = true;
              }
              if (column.showUserSelectableColumn) {
                cell.showUserSelectableColumn = true;
              }
              if (
                this.dateObj[cell.fieldName] &&
                (cell.type === "date" || cell.type === "datetime")
              ) {
                cell.dateFormat = this.dateObj[cell.fieldName];
                if (
                  cell.type === "date" &&
                  cell.dateFormat &&
                  cell.data.value
                ) {
                  cell.data.value = formatDate(
                    cell.data.value,
                    cell.dateFormat
                  );
                }
              }
              if (column.onclick) {
                cell.click = column.onclick;
              }
              this.tableData[index].columns.push(cell);
            }
            return "";
          });
          this._rowIndex++;
          return item;
        });
      }

      this.allData = cloneDeep(this.tableData);
      //For pagination
      let pageItems;
      if (this.pagesize && this.isValidPagesize) {
        pageItems = this.pagination(this.tableData);
      }
      Promise.resolve().then(() => {
        this.tablePageData =
          this.pagesize && this.isValidPagesize ? pageItems : this.tableData;
      });
    } else if (this.groupBy) {
      this.isGrouped = true;
      this._rowIndex = 0;
      this._groupIndex = 0;
      if (this.filteredData) {
        this.tableGroupData = [];
        let isGroupOpen = this._activeGroups;
        this.filteredData.map((item) => {
          let groupFieldName =
            typeof this.groupBy === "string"
              ? this.groupBy
              : this.groupBy.groupFieldName;
          let group = this.tableGroupData.find(
            (grp) => grp.groupName === item[groupFieldName]
          );
          if (!this._activeGroups) {
            isGroupOpen = this._activeGroupMap[item[groupFieldName]];
          }
          if (!group) {
            group = {
              id: "group-" + this._groupIndex++,
              groupName: item[groupFieldName],
              groupItems: [],
              isOpen: isGroupOpen,
              class: isGroupOpen
                ? `${this.theme}-data-table-row tableRow`
                : `${this.theme}-hide ${this.theme}-data-table-row tableRow`,
              iconName: isGroupOpen
                ? "utility:chevrondown"
                : "utility:chevronright",
              colspan: 1,
              displayClass: this.groupByHeaderClass(),
              columns: [], //for group summmary / description
              groupAriaControls: `group-${this._groupIndex - 1}`
            };
            group.rowIndex = 0;
            this._rowIndex = 0;
            this.tableGroupData.push(group);
          }
          let groupItem = {
            id: group.id + "-row-" + group.rowIndex,
            columns: [],
            position: this._groupIndex - 1 + "_" + this._rowIndex,
            editMode: false,
            displayClass: `${this.theme}-data-table-row-cell tableRowCell flex-datatable-cell`,
            originalItemIndex: item.originalIndex,
            selectRow: this.selectAllRow || item.selectrow,
            isDeleteActive: this.rowDeleteDependentColumn
              ? item[this.rowDeleteDependentColumn] && this.rowDelete
              : false
          };
          group.groupAriaControls += ` ${groupItem.id}`;
          let numberOfColVisible = 0;
          this.dataColumns.map((column) => {
            if (column.visible) {
              numberOfColVisible++;
              let cell = {
                id: groupItem.id + "-col-" + this._colIndex,
                data: {
                  label: true,
                  editable: column.editable && this._cellLevelEdit,
                  position:
                    this._groupIndex -
                    1 +
                    "_" +
                    this._rowIndex +
                    "_" +
                    this._colIndex++,
                  value: item[column.fieldName],
                  [column.type || "text"]: false,
                  originalItemIndex: item.originalIndex
                },
                fieldName: column.fieldName,
                fieldTitle: column.fieldTitle,
                type: column.type
              };
              if (column.type === "url" && column.preventNavigation) {
                cell.preventNavigation = true;
              }
              if (column.showUserSelectableColumn) {
                cell.showUserSelectableColumn = true;
              }
              if (
                this.dateObj[cell.fieldName] &&
                (cell.type === "date" || cell.type === "datetime")
              ) {
                cell.dateFormat = this.dateObj[cell.fieldName];
                if (
                  cell.type === "date" &&
                  cell.dateFormat &&
                  cell.data.value
                ) {
                  cell.data.value = formatDate(
                    cell.data.value,
                    cell.dateFormat
                  );
                }
              }
              groupItem.columns.push(cell);
            }
            return "";
          });
          if (typeof this.groupBy === "string") {
            group.colspan = numberOfColVisible + 1 + (this.rowDelete ? 1 : 0);
          }
          this._colIndex = 0;
          group.groupItems.push(groupItem);
          group.rowIndex++;
          this._rowIndex++;
          return item;
        });
        if (this.groupOrder) {
          this.tableGroupData.sort(
            this.dynamicSort(
              "groupName",
              this.groupOrder.toLowerCase() !== "asc"
            )
          );
        }
        if (
          typeof this.groupBy !== "string" &&
          this.groupBy.sortFieldName &&
          this.groupBy.sortOrder
        ) {
          this.sortingObj.sortField = this.groupBy.sortFieldName;
          this.tableGroupData = this.tableGroupData.map((item) => {
            item.groupItems = item.groupItems.sort(
              this.dynamicSort(
                "columns",
                this.groupBy.sortOrder === "asc" ? false : true,
                this.sortRows
              )
            );
            return item;
          });
        }

        if (typeof this.groupBy !== "string" && this.groupBy.fields) {
          this.tableGroupData.map((group) => {
            this.dataColumns.map((column) => {
              if (column.visible) {
                let cell = {
                  id: group.id + "-col-" + this._groupIndex++,
                  data: {
                    label: true,
                    editable: false,
                    value: ""
                  },
                  fieldName: column.fieldName,
                  fieldTitle: column.fieldTitle,
                  type: column.type
                };
                if (column.type === "url" && column.preventNavigation) {
                  cell.preventNavigation = true;
                }
                if (
                  this.dateObj[cell.fieldName] &&
                  (cell.type === "date" || cell.type === "datetime")
                ) {
                  cell.dateFormat = this.dateObj[cell.fieldName];
                  if (
                    cell.type === "date" &&
                    cell.dateFormat &&
                    cell.data.value
                  ) {
                    cell.data.value = formatDate(
                      cell.data.value,
                      cell.dateFormat
                    );
                  }
                }
                if (column.showUserSelectableColumn) {
                  cell.showUserSelectableColumn = true;
                }
                let groupSummaryField = this.groupBy.fields.find(
                  (field) => field.name === column.fieldName
                );

                if (groupSummaryField) {
                  let groupItems = this.filteredData.filter(
                    (item) =>
                      group.groupName === item[this.groupBy.groupFieldName]
                  );
                  let groupSummaryValue = this.getComputedSummaryValue(
                    groupItems,
                    groupSummaryField
                  );
                  cell.data.value = groupSummaryValue;
                  group[groupSummaryField.name] = groupSummaryValue;
                }
                group.columns.push(cell);
              }
              return "";
            });
            return "";
          });
        }
      }
      this.allData = cloneDeep(this.tableGroupData);
      //Pagination
      this.setGroupedTable(this.tableGroupData);
    }
    Promise.resolve().then(() => {
      this.updatingTable = false;
      this.isLoaded = true;
      if (!this.baseVersion) this.isRendered = false;
      this.handleRecordsComplete();
    }, 0);
    this._isUpdatingCustomUI = true;
  }

  handleRecordsComplete() {
    //Placeholder method for users extending datatable, if they further want to update table data.
  }

  getComputedSummaryValue(items, groupSummaryField) {
    let groupItems = [...items];
    if (!groupSummaryField.methodToCalculateSummary) {
      let doSum = function (groupItemsToAdd) {
        let sum = "";
        groupItemsToAdd.forEach((item) => {
          sum = currencyjs(item[groupSummaryField.name]).add(sum).format(true);
        });
        return sum;
      };
      return doSum(groupItems);
    }
    return groupSummaryField.methodToCalculateSummary.call(this, groupItems);
  }

  fixGroupDataPosition(array) {
    array.forEach((group, groupIndex) => {
      group.groupItems.forEach((row, rowIndex) => {
        row.position = groupIndex + "_" + rowIndex;
        row.columns.forEach((col, colIndex) => {
          col.position = groupIndex + "_" + rowIndex + "_" + colIndex;
        });
      });
    });
    return array;
  }

  fixCustomUIPosition(array) {
    let tableData = array.map((row, rowIndex) => {
      row.columns.forEach((col, colIndex) => {
        col.data.position = rowIndex + "_" + colIndex;
        col.id = "row-" + rowIndex + "-col-" + colIndex;
      });
      row.id = "row-" + rowIndex;
      return row;
    });
    return tableData;
  }

  handleFieldClick() {
    //dummy event to prevent error.
  }

  handleFieldEdit(event) {
    const currentElem = event.detail.result;
    const itemIndex = currentElem.currentTarget.dataset.rowOriginalIndex;
    const fieldName = currentElem.currentTarget.dataset.fieldName;
    let fieldValue;
    if (currentElem.type !== "click") {
      fieldValue =
        event.currentTarget.columnData.type === "checkbox" ||
        event.currentTarget.columnData.type === "icon"
          ? currentElem.currentTarget.checked
          : currentElem.currentTarget.value;
    }
    let obj = {
      editable: currentElem.type === "click" ? true : false,
      fieldName: fieldName,
      fieldValue: fieldValue
    };
    this.setRowLevelEdit(itemIndex, "fieldEdit", obj);
  }

  get tableClass() {
    return `${this.theme}-table table ${this.theme}-data-table ${
      this.theme
    }-max-medium-table_stacked-horizontal ${this.theme}-table_header-fixed ${
      this.theme
    }-table_bordered ${this.theme}-table_edit ${
      this.theme
    }-table_resizable-cols ${this.extraclass ? this.extraclass : ""}`;
  }

  get tableHeaderClass() {
    return `${this.theme}-data-table-head-cell tableHeadCell ${
      this.sortable ? `${this.theme}-is-sortable` : ""
    } ${this.headerclass ? this.headerclass : ""}`;
  }

  sortRows = (row) => {
    let col = row.find(
      (_item) => _item.fieldName === this.sortingObj.sortField
    );
    if (col) {
      return col.data.value;
    }
    return "";
  };

  setSortObj(elem, reset) {
    if (reset) {
      this.sortingObj = {
        isSorting: false,
        sortField: "",
        icon: "utility:arrowdown",
        reverse: false,
        order: "ascending"
      };
      return;
    }
    this.sortingObj.sortField = elem.dataset.field;
    this.sortingObj.reverse = !this.sortingObj.reverse;
    this.sortingObj.order = this.sortingObj.reverse
      ? "descending"
      : "ascending";
    this.sortingIcon = this.sortingObj.reverse
      ? "utility:arrowdown"
      : "utility:arrowup";
    if (this.recordsOnEdit.length) {
      this.resetEditRow();
      this.recordsOnEdit = [];
    }
    elem
      .querySelector(".hover-icon")
      .classList.add(`${this.theme}-transition-hide`);
  }

  sortOrder = new Array("desc", "asc", "reset");

  getSortOrder() {
    if (!this.sortOrder.length) this.sortOrder = ["desc", "asc", "reset"];
    return this.sortOrder.shift();
  }

  sortByField(event, restoreSorting) {
    if (event !== null && this.getSortOrder() === "reset") {
      this.undoSort();
      return;
    }
    if (event !== null) {
      this.sortingObj.isSorting = true;
    }
    if (restoreSorting && !this.sortingObj.isSorting) {
      return;
    }
    if (!restoreSorting) {
      let elem = event.currentTarget;
      const sortable = elem.dataset.sortable;
      if (sortable !== "true" && sortable !== true) {
        return;
      }
      this.setSortObj(elem);
    }
    this.dataToSort = {};
    this.dataColumns = this.dataColumns.map((item) => {
      item.sortingEnabled = this.sortingObj.sortField === item.fieldName;
      if (item.sortingEnabled) {
        item.ariaSort = this.sortingObj.order;
        this.dataToSort.type = item.type;
        if (item.format && item.type === "date") {
          this.dataToSort.format = item.format;
        }
      } else {
        item.ariaSort = "none";
      }
      return item;
    });
    let tableArray = this.groupBy
      ? [...this.tableGroupData]
      : [...this.tableData];
    if (!this.groupBy) {
      if (!this.baseVersion) {
        this.updatingTable = true;
      }
      this.tableData = tableArray.sort(
        this.dynamicSort("columns", this.sortingObj.reverse, this.sortRows)
      );
      this.setUnGroupedTable(this.tableData);
    } else {
      if (this.sortAcrossGroups) {
        this.tableGroupData = this.sortGroupedTable(tableArray);
      } else {
        this.tableGroupData = tableArray.map((item) => {
          item.groupItems = item.groupItems.sort(
            this.dynamicSort("columns", this.sortingObj.reverse, this.sortRows)
          );
          return item;
        });
      }
      this.setGroupedTable(this.tableGroupData);
    }
  }

  undoSort() {
    this.dataToSort = {};
    this.dataColumns = this.dataColumns.map((item) => {
      item.sortingEnabled = false;
      return item;
    });
    this.setSortObj(null, true);
    this.handleRecords();
  }

  dynamicSort(field, reverse, primer) {
    var key = primer
      ? function (x) {
          return x ? primer(x[field]) : null;
        }
      : function (x) {
          return x ? x[field] : null;
        };

    reverse = reverse ? -1 : 1;
    let type = "string";
    let dateMask = "YYYY-MM-DD";

    let fetchFieldInfo = () => {
      if (this.dataToSort && this.dataToSort.format) {
        dateMask = this.dataToSort.format;
        dateMask = dateMask.replace(/y/g, "Y");
      }
    };

    // Using this method to bypass parsing when there are special characters like 江東区, 千代田区 etc
    let hasSpecialCharacters = (a) => {
      var pattern = /[^a-zA-Z0-9\s]/;
      if (!this.specialcharactersort) {
        return false;
      }
      return pattern.test(a);
    };

    let formatValue = (a) => {
      let keyValue = key(a);
      type =
        this.dataToSort && this.dataToSort.type
          ? this.dataToSort.type
          : "string";
      let regex =
        type === "number" || type === "currency"
          ? /[^0-9.]/g
          : /[^a-zA-Z0-9.]/g;
      a =
        typeof keyValue == "string" &&
        type !== "date" &&
        !hasSpecialCharacters(keyValue)
          ? keyValue.replace(regex, "")
          : keyValue;
      a =
        typeof a == "string" &&
        type !== "date" &&
        !hasSpecialCharacters(keyValue)
          ? !/[a-zA-Z]/.test(a)
            ? Number(a)
            : a.toLowerCase()
          : a;
      a =
        typeof a === "string" && type === "date" ? formatDate(a, dateMask) : a;
      return a ? a : "";
    };
    let isValidDate = function (obj) {
      return isDate(obj) && !isNaN(obj.getTime());
    };
    return function (a, b) {
      fetchFieldInfo();
      a = formatValue(a);
      b = formatValue(b);
      if (type === "date") {
        a = a ? a : new Date(0);
        b = b ? b : new Date(0);
        let dateObj1 = dayjs(a, dateMask);
        dateObj1 =
          dateObj1 && !isValidDate(dateObj1.toDate()) ? dayjs(a) : dateObj1;
        let dateObj2 = dayjs(b, dateMask);
        dateObj2 =
          dateObj2 && !isValidDate(dateObj2.toDate()) ? dayjs(b) : dateObj2;
        // eslint-disable-next-line no-sequences
        return a, b, reverse * (dateObj1.isAfter(dateObj2) ? 1 : -1);
      }
      // eslint-disable-next-line no-sequences
      return a, b, reverse * ((a > b ? 1 : -1) - (b > a ? 1 : -1));
    };
  }

  mouseoverHead(event) {
    const target = event.target;
    const hoverIcon = target.querySelector(".hover-icon");
    if (!hoverIcon) {
      return;
    }
    if (
      !target.querySelector(".sorted-icon") &&
      (target.dataset.sortable === true || target.dataset.sortable === "true")
    ) {
      hoverIcon.classList.remove(`${this.theme}-transition-hide`);
    }
  }

  mouseoutHead(event) {
    const target = event.target;
    const hoverIcon = target && target.querySelector(".hover-icon");
    if (hoverIcon) {
      hoverIcon.classList.add(`${this.theme}-transition-hide`);
    }
  }

  uniqueKey() {
    return "key-" + idGenerator++ + Date.now();
  }

  mouseoverField(event) {
    const target = event.currentTarget;
    const hoverIcon = target.querySelector(".hover-icon");
    if (!hoverIcon) {
      return;
    }
    hoverIcon.classList.remove(`${this.theme}-transition-hide`);
    event.stopPropagation();
  }

  mouseoutField(event) {
    const target = event.currentTarget;
    const hoverIcon = target.querySelector(".hover-icon");
    if (hoverIcon) {
      hoverIcon.classList.add(`${this.theme}-transition-hide`);
    }
    event.stopPropagation();
  }

  setUnGroupedTable(tableArray, type) {
    let onlyPage = type === "goToPage";
    if (!onlyPage) {
      this.tableData = this.fixCustomUIPosition(tableArray);
    }
    if (!this.groupBy) this.tablePageData = [];
    Promise.resolve().then(() => {
      if (!this.groupBy) {
        this.tablePageData =
          this.pagesize && this.isValidPagesize
            ? this.pagination(this.tableData)
            : this.tableData;
        if (onlyPage) {
          this.tablePageData = this.fixCustomUIPosition(this.tablePageData);
        }
      }
    });
    if (!this.baseVersion) {
      this._isUpdatingCustomUI = true;
      Promise.resolve().then(() => {
        this.updatingTable = false;
        this.isRendered = false;
      }, 0);
    }
  }

  setGroupedTable(tableArray, type) {
    let onlyPage = type === "goToPage";
    if (!onlyPage) {
      this.tableGroupData =
        type === "search" ? tableArray : this.fixGroupDataPosition(tableArray);
    }
    let pagedData =
      this.pagesize && this.isValidPagesize
        ? this.pagination(this.tableGroupData)
        : this.tableGroupData;
    Promise.resolve(0).then(() => {
      this.tablePageGroupData = pagedData;
      if (onlyPage) {
        this.tablePageGroupData = this.fixCustomUIPosition(
          this.tablePageGroupData
        );
      }
      this.isLoaded = true;
    });
  }

  resetEditRow() {
    if (!this.groupBy) {
      if (!this.baseVersion) {
        this.updatingTable = true;
      }
      let tableArray = [...this.tableData];
      tableArray = tableArray.map((item) => {
        if (this.recordsOnEdit.indexOf(item.originalItemIndex) !== -1) {
          item = this.getTableRecord(item, false);
        }
        return item;
      });
      this.tableData = tableArray;
    } else {
      let tableArray = [...this.tableGroupData];
      tableArray = tableArray.map((group) => {
        let groupData = group.groupItems.map((item) => {
          if (this.recordsOnEdit.indexOf(item.originalItemIndex) !== -1) {
            item = this.getTableRecord(item, false);
          }
          return item;
        });
        group.groupItems = [...groupData];
        return group;
      });
      this.tableGroupData = tableArray;
    }
  }

  editDataRow(event) {
    let rowIndex = event.currentTarget.dataset.index;
    event.stopPropagation();
    this.setRowLevelEdit(rowIndex, "rowEdit");
  }

  setRowLevelEditIcon(rowIndex, setIcon) {
    let editIconEle = this.template.querySelector(
      '.rowLevelEdit[data-index="' + rowIndex + '"]'
    );
    let checkBtnIconEle = this.template.querySelector(
      '.rowLevelCheck[data-index="' + rowIndex + '"]'
    );
    if (editIconEle) {
      editIconEle.classList.toggle(`${this.theme}-hide`, setIcon);
      editIconEle.classList.toggle("edit-mode", setIcon);
    }
    if (checkBtnIconEle) {
      checkBtnIconEle.classList.toggle(`${this.theme}-hide`, !setIcon);
      checkBtnIconEle.classList.toggle(`edit-in-progress`, setIcon);
    }
  }

  getIndex = (row, rowIndex) => {
    return row.findIndex((_item) => _item.originalItemIndex === rowIndex);
  };

  setRowLevelEdit(rowIndex, type, element) {
    let record;
    let editable = true;
    let tableArray = this.groupBy
      ? cloneDeep(this.tableGroupData)
      : cloneDeep(this.tableData);
    if (!this.groupBy) {
      let index = this.getIndex(tableArray, rowIndex);
      if (index !== -1) {
        record = tableArray[index];
        if (type === "fieldEdit") {
          if (record.editRowMode) {
            return;
          }
          editable = element.editable;
        } else if (type === "saveRow") {
          editable = false;
          record = this.saveRowValue(record, element);
          record.editRowMode = false;
        } else {
          record.editRowMode = true;
          this.fireEvent("rowclick", record);
        }
        if (!this.baseVersion) {
          this.updatingTable = true;
        }
        record = this.getTableRecord(record, editable, type, element);
        tableArray[index] = { ...record };
        Promise.resolve().then(() => {
          this.setUnGroupedTable(tableArray);
          if (type === "saveRow" || (type === "fieldEdit" && !editable)) {
            this.allData = cloneDeep(this.tableData);
          }
        });
      }
    } else {
      let groupIndex = 0;
      let itemIndex = 0;
      tableArray.some((group, index) => {
        itemIndex = this.getIndex(group.groupItems, rowIndex);
        if (itemIndex !== -1) {
          groupIndex = index;
          return true;
        }
        return false;
      });
      if (itemIndex !== -1) {
        record = tableArray[groupIndex].groupItems[itemIndex];
        if (type === "fieldEdit") {
          if (record.editRowMode) {
            return;
          }
          editable = element.editable;
        } else if (type === "saveRow") {
          editable = false;
          record = this.saveRowValue(record, element);
          record.editRowMode = false;
        } else {
          record.editRowMode = true;
          this.fireEvent("rowclick", record);
        }
        record = this.getTableRecord(record, editable, type, element);
        tableArray[groupIndex].groupItems[itemIndex] = { ...record };
        Promise.resolve().then(() => {
          this.setGroupedTable(tableArray);
          if (type === "saveRow" || (type === "fieldEdit" && !editable)) {
            this.allData = cloneDeep(this.tableGroupData);
          }
        });
      }
    }
    if (type === "fieldEdit" && !editable) {
      let originalRecord = this.filteredData.find(
        (item) => item.originalIndex === rowIndex
      );
      originalRecord[element.fieldName] = element.fieldValue;
      this.fireEvent("update");
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      setTimeout(() => {
        // Update the focus where it was
        if (this._isFocusStateSaved) {
          this._isFocusStateSaved = false;
          if (this.isGrouped) {
            // Remove focus from all cell in the group
            const groupRows = this.template.querySelectorAll(
              `[data-groupindex="${this.focusState.groupindex}"]`
            );
            groupRows?.forEach((row, rowInd) => {
              const cellEles = row?.querySelectorAll(".flex-datatable-cell");
              cellEles?.forEach((cell, index) => {
                cell?.setAttribute("tabindex", -1);
                if (
                  rowInd === this.focusState.rowIndex &&
                  index === this.focusState.colIndex
                ) {
                  cell?.setAttribute("tabindex", 0);
                  cell?.focus();
                  cell?.querySelector(".dataTableCell")?.showEditIcon(true);
                }
              });
            });
          } else {
            // First remove all the other focused cells
            const cells = this.template.querySelectorAll(
              ".flex-datatable-cell"
            );
            cells?.forEach((cell) => cell.setAttribute("tabindex", -1));
            // Set focus to the edited cell
            const row = this.template.querySelector(
              `[data-rowindex="${this.focusState.rowIndex}"]`
            );
            const cellEles = row?.querySelectorAll(".flex-datatable-cell");
            if (cellEles) {
              const cellEle = cellEles[this.focusState.colIndex];
              cellEle?.setAttribute("tabindex", 0);
              cellEle?.focus();
              cellEle?.querySelector(".dataTableCell")?.showEditIcon(true);
            }
          }
        }
      }, 0);
    }
    this.triggerOnEditMode(type, record, rowIndex);
  }

  triggerOnEditMode(type, record, rowIndex) {
    if (type === "saveRow") {
      let recordIndex = this.recordsOnEdit.indexOf(record.originalItemIndex);
      if (recordIndex !== -1) {
        this.recordsOnEdit.splice(recordIndex, 1);
      }
    } else {
      this.recordsOnEdit.push(record.originalItemIndex);
    }
    if (type === "rowEdit") {
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      setTimeout(() => {
        this.setRowLevelEditIcon(rowIndex, true);
      }, 0);
    }
  }

  getTableRecord(record, editable, type, fieldObj) {
    let isField = type === "fieldEdit";
    let fieldName = isField && fieldObj ? fieldObj.fieldName : "";
    let fieldValue = isField && fieldObj ? fieldObj.fieldValue : "";
    record.columns = record.columns.map((item) => {
      let isValid = isField ? fieldName === item.fieldName : true;
      if (isValid) {
        this.dataColumns.some((column) => {
          if (column.visible && column.fieldName === item.fieldName) {
            let colEditMode = column.editable && editable;
            item.data.label = !colEditMode;
            item.data[column.type || "text"] = colEditMode;
            item.data.editable =
              !colEditMode && column.editable && this._cellLevelEdit;
            if (isField && !editable) {
              item.data.value = fieldValue;
            }
            return true;
          }
          return false;
        });
        if (
          this.rowDeleteDependentColumn === item.fieldName &&
          this.rowDelete
        ) {
          record.isDeleteActive =
            item.data.value === "true" || item.data.value === true
              ? true
              : item.data.value === "false" || item.data.value === false
                ? false
                : record.isDeleteActive;
        }
      }
      return item;
    });
    return record;
  }

  editGroupDataRow(event) {
    let rowIndex = event.currentTarget.dataset.index;
    event.stopPropagation();
    this.setRowLevelEdit(rowIndex, "rowEdit");
  }

  saveDataRow(event) {
    let element = event.currentTarget;
    const rowIndex = element.dataset.index;
    const iconElem = element.querySelectorAll(".edit-mode");
    const btnElem = element.querySelector("c-sf-gps-ds-osrt-button");
    let record = this.filteredData.find(
      (item) => item.originalIndex === rowIndex
    );

    if (
      this.highlightSelection === true ||
      this.highlightSelection === "true"
    ) {
      this.highlightRow = rowIndex;
      this.setHighlightSelection();
    }

    this.fireEvent("rowclick", record, event.target.dataset.fieldName);
    if (
      (btnElem && btnElem.classList.contains(`${this.theme}-hide`)) ||
      event.target !== btnElem
    ) {
      return;
    }

    iconElem.forEach((ele) => {
      ele.classList.remove(`${this.theme}-hide`, `edit-mode`);
    });
    btnElem.classList.add(`${this.theme}-hide`);
    btnElem.classList.remove(`edit-in-progress`);
    this.setRowLevelEdit(rowIndex, "saveRow", element);
    this.fireEvent("update");
  }

  saveRowValue(record, element) {
    const rowIndex = element.dataset.index;
    let inputElem = element.querySelectorAll(".dataTableCell");
    if (inputElem.length === 0) {
      inputElem = this.querySelectorAll(
        '.dataTableCell[data-index="' + rowIndex + '"]'
      );
    }
    let originalRecord = this.filteredData.find(
      (item) => item.originalIndex === rowIndex
    );
    inputElem.forEach((elem) => {
      let cell = elem.cellElem;
      if (!cell) {
        return;
      }
      let fieldName = cell.dataset.fieldName;
      let colIndex = record.columns.findIndex(
        (_item) => _item.fieldName === fieldName
      );
      if (fieldName && colIndex !== -1) {
        let value =
          cell.type === "checkbox" || cell.type === "icon"
            ? cell.checked
            : cell.value;
        record.columns[colIndex].data.value = value;
        originalRecord[fieldName] = value;
      }
    });
    return record;
  }

  toggleGroupedRow(event) {
    let index = event.currentTarget.dataset.index;
    this.tablePageGroupData[index].isOpen =
      !this.tablePageGroupData[index].isOpen;
    if (
      !this.activeGroups &&
      (this.rowDelete || this.rowLevelEdit || this.cellLevelEdit)
    ) {
      this._activeGroupMap[this.tablePageGroupData[index].groupName] =
        this.tablePageGroupData[index].isOpen;
    }
    this.tablePageGroupData[index].class = this.tablePageGroupData[index].isOpen
      ? `${this.theme}-data-table-row tableRow`
      : ` ${this.theme}-data-table-row tableRow ${this.theme}-hide`;
    event.currentTarget.querySelector(
      `c-sf-gps-ds-osrt-icon[data-index="${index}"]`
    ).iconName = this.tablePageGroupData[index].isOpen
      ? "utility:chevrondown"
      : "utility:chevronright";
  }

  searchKeyChangeHandler = debounce((target) => {
    this.isSearchFocused = true;
    this.isLoaded = false;
    const searchKey = target.value;
    this.searchListBy(searchKey, this.searchFields);
  }, 500);

  @api searchListBy(searchKey, field) {
    this.searchInput = searchKey;
    this.isLoaded = false;
    this.currentPage = 0;
    if (this.selectAllRow) {
      this.selectAllRow = false;
      this.fireEvent("selectrow", "none");
    }
    if (this.recordsOnEdit && this.recordsOnEdit.length) {
      this.recordsOnEdit.forEach((index) => {
        this.setRowLevelEditIcon(index, false);
      });
      this.recordsOnEdit = [];
    }
    this.noRecords = true;
    if (this.groupBy) {
      this.tableGroupData = [];
      if (this.searchInput) {
        let tableArray = cloneDeep(this.allData);
        tableArray.forEach((group) => {
          let validGroup = false;
          let groupData = [];
          group.groupItems.forEach((item) => {
            let columns = item.columns;
            let validItem = columns.some((col) => {
              if (field.indexOf(col.fieldName) !== -1) {
                let value = col.data.value;
                value = value ? value.toString() : "";
                if (value.toLowerCase().includes(searchKey.toLowerCase())) {
                  return true;
                }
              } else if (field.length === 0 && searchKey) {
                return false;
              } else if (field.length === 0 && !searchKey) {
                return true;
              }
              return false;
            });
            if (validItem) {
              item.displayClass = `${this.theme}-data-table-row-cell tableRowCell`;
              this.noRecords = false;
              validGroup = true;
              groupData.push(item);
            }
          });
          if (validGroup) {
            group.displayClass = this.groupByHeaderClass();
            group.groupItems = [...groupData];
            this.tableGroupData.push(group);
          }
        });
      } else {
        this.tableGroupData = cloneDeep(this.allData);
        this.noRecords = false;
      }
      this.setGroupedTable(this.tableGroupData, "search");
    } else if (!this.groupBy) {
      if (!this.baseVersion) {
        this.updatingTable = true;
      }
      this.tableData = [];
      if (this.searchInput) {
        let tableArray = cloneDeep(this.allData);
        tableArray.forEach((item) => {
          let columns = item.columns;
          let validItem = columns.some((col) => {
            if (field.indexOf(col.fieldName) !== -1) {
              let value = col.data.value;
              value = value ? value.toString() : "";
              if (value.toLowerCase().includes(searchKey.toLowerCase())) {
                return true;
              }
            } else if (field.length === 0 && searchKey) {
              return false;
            } else if (field.length === 0 && !searchKey) {
              return true;
            }
            return false;
          });
          if (validItem) {
            item.displayClass = `${this.theme}-data-table-row tableRow`;
            item.hide = "";
            this.noRecords = false;
            this.tableData.push(item);
          }
        });
      } else {
        this.tableData = cloneDeep(this.allData);
        this.noRecords = false;
      }
      this.setUnGroupedTable(this.tableData);
    }
    Promise.resolve().then(() => {
      this.isLoaded = true;
    });
  }

  pagination(data) {
    let pagesize = parseInt(this.pagesize, 10);
    this.totalNumberOfPages = Math.ceil(data.length / pagesize);
    if (
      this.currentPage >= this.totalNumberOfPages &&
      this.totalNumberOfPages > 0
    ) {
      this.currentPage = this.totalNumberOfPages - 1;
    }
    return data.slice(
      this.currentPage * pagesize,
      (this.currentPage + 1) * pagesize
    );
  }

  goToPage(event, pageNum) {
    if (event) {
      const changePage = event.target.dataset.index;
      if (changePage === "prev") {
        if (this.prevDisabled) return;
        this.currentPage--;
      }
      if (changePage === "next") {
        if (this.nextDisabled) return;
        this.currentPage++;
      }
      if (this.recordsOnEdit.length) {
        this.resetEditRow();
        this.recordsOnEdit = [];
      }
      if (changePage !== "next" && changePage !== "prev") {
        this.currentPage = parseInt(changePage, 10) - 1;
      }
    } else {
      this.currentPage = pageNum;
    }
    if (!this.groupBy) {
      if (!this.baseVersion) {
        this.updatingTable = true;
      }
      this.setUnGroupedTable(this.tableData, "goToPage");
    } else {
      this.setGroupedTable(this.tableGroupData, "goToPage");
    }
  }

  get range() {
    var ret, end;
    this.currentPageIndex = 0;
    const size = this.totalNumberOfPages + 1;
    let start = this.currentPage + 1;

    ret = [];
    end =
      start +
      (this.pagelimit > this.totalNumberOfPages
        ? this.totalNumberOfPages
        : this.pagelimit);

    if (size < end) {
      end = size;
      start =
        size -
        (this.pagelimit > this.totalNumberOfPages
          ? this.totalNumberOfPages
          : this.pagelimit);
      if (start < 0) {
        start = 0;
      }
    }
    for (let i = start; i < end; i++) {
      ret.push(i);
    }
    this.pageNumberList = ret;
    return ret;
  }

  get prevDisabled() {
    return this.currentPage === 0;
  }

  get nextDisabled() {
    return this.currentPage + 1 === this.totalNumberOfPages;
  }

  get pageIndex() {
    if (this.currentPageIndex >= this.pagelimit) {
      this.currentPageIndex = 0;
    }
    this.currentPageIndex++;
    return "";
  }

  get pageButtonClass() {
    return `${this.theme}-button ${
      this.currentPage + 1 === this.pageNumberList[this.currentPageIndex]
        ? `${this.theme}-button--brand`
        : `${this.theme}-button--neutral`
    }`;
  }

  get ariaCurrentValue() {
    return this.currentPage + 1 === this.pageNumberList[this.currentPageIndex]
      ? "page"
      : null;
  }

  get ariaLabelValue() {
    return `${this.translatedLabels.datatablePaginationButtonLabel} ${
      this.pageNumberList[this.currentPageIndex]
    } of ${this.totalNumberOfPages}`;
  }

  fireEvent(eventName, data, field) {
    let event = new CustomEvent(eventName, {
      bubbles: true,
      composed: true,
      detail: {
        result: data || this.filteredData,
        fieldName: field ? field : ""
      },
      data: data || this.filteredData
    });
    this.dispatchEvent(event);
  }

  deleteRow(event) {
    event.stopPropagation();
    let rowToDeleteInFilteredDataIndex;
    const iconElem = event.target.parentElement.querySelectorAll(
      "c-sf-gps-ds-osrt-icon"
    );
    const buttonElem =
      event.target.parentElement.querySelector(".rowLevelCheck");
    if (iconElem && iconElem.length) {
      iconElem.forEach((ele) => {
        if (ele.classList.contains("edit-mode")) {
          ele.classList.remove(`${this.theme}-hide`, `edit-mode`);
        }
      });
    }
    if (buttonElem) {
      buttonElem.classList.add(`${this.theme}-hide`);
    }
    const deletedRow = this.records[this.deleteRowData];
    if (deletedRow && deletedRow.uniqueKey) {
      rowToDeleteInFilteredDataIndex = this.filteredData.findIndex((item) => {
        return item.uniqueKey === deletedRow.uniqueKey;
      });
    }
    let index = rowToDeleteInFilteredDataIndex || this.deleteRowData;
    this.fireEvent("delete", this.filteredData[index]);
    this.fireEvent("update");
    let recordsCopy = [...this.filteredData];
    recordsCopy.splice(index, 1);
    this.records = recordsCopy;
  }

  openDeleteConfirm(event) {
    event.stopPropagation();
    this.deleteRowData = event.target.dataset.index;
    this.currentRowDeleteBtn = event.target;
    if (this._confirmdeleterow) {
      this.showDeleteConfirmation = true;
    } else {
      this.deleteRow(event);
    }
  }

  deleteRowConfirm(event) {
    this.showDeleteConfirmation = false;
    if (
      !this.fireeventOnDeleteconfirm ||
      this.fireeventOnDeleteconfirm === "false"
    )
      this.deleteRow(event);
    else this.waitTillDeleteHappens(event);
  }

  waitTillDeleteHappens = (event) => {
    event.stopPropagation();
    this.fireEvent("deleteconfirm", this.records[this.deleteRowData]);
  };

  deleteRowCancel() {
    this.showDeleteConfirmation = false;
    // focus the delete button that invoked the delete flow
    this.currentRowDeleteBtn.focus();
  }

  /**Drag N Drop*/

  get tableColspan() {
    let colspan = this.dataColumns;
    if (this.draggable) colspan += 1;
    if (this.rowLevelEdit) colspan += 1;
    return colspan;
  }

  onDragStart(e) {
    if (this.draggable) {
      this._dragElem = e.currentTarget;
    }
  }

  onDragEnter(e) {
    if (this.draggable) {
      e.preventDefault();
      this._dragElemRef = e.currentTarget;
    }
  }
  onDragLeave(e) {
    if (this.draggable) {
      e.preventDefault();
      if (
        e.currentTarget.classList
          .toString()
          .includes(`${this.theme}-border-top-20-lightgray`)
      ) {
        e.currentTarget.classList.remove(
          `${this.theme}-border-top-20-lightgray`
        );
      }
      e.currentTarget.classList.add(`${this.theme}-border-top-none`);

      if (
        e.currentTarget.classList
          .toString()
          .includes(`${this.theme}-border-bottom-20-lightgray`)
      ) {
        e.currentTarget.classList.remove(
          `${this.theme}-border-bottom-20-lightgray`
        );
      }
      e.currentTarget.classList.add(`${this.theme}-border-bottom-none`);
    }
  }

  isFirstHalf = false;

  onDragOver(e) {
    if (this.draggable) {
      e.preventDefault();
      const rect = e.target.getBoundingClientRect();
      this.isFirstHalf = e.clientY < rect.top + rect.height / 2;

      if (this.isFirstHalf) {
        if (
          e.currentTarget.classList
            .toString()
            .includes(`${this.theme}-border-bottom-20-lightgray`)
        ) {
          e.currentTarget.classList.remove(
            `${this.theme}-border-bottom-20-lightgray`
          );
        }
        if (
          e.currentTarget.classList
            .toString()
            .includes(`${this.theme}-border-top-none`)
        )
          e.currentTarget.classList.remove(`${this.theme}-border-top-none`);
        e.currentTarget.classList.add(
          `${this.theme}-border-bottom-none`,
          `${this.theme}-border-top-20-lightgray`
        );
      } else {
        if (
          e.currentTarget.classList
            .toString()
            .includes(`${this.theme}-border-top-20-lightgray`)
        ) {
          e.currentTarget.classList.remove(
            `${this.theme}-border-top-20-lightgray`
          );
        }
        if (
          e.currentTarget.classList
            .toString()
            .includes(`${this.theme}-border-bottom-none`)
        )
          e.currentTarget.classList.remove(`${this.theme}-border-bottom-none`);
        e.currentTarget.classList.add(
          `${this.theme}-border-top-none`,
          `${this.theme}-border-bottom-20-lightgray`
        );
      }
    }
  }

  onDrop() {
    if (this.draggable) {
      if (!this.isGrouped && !this.baseVersion) {
        this.updatingTable = true;
      }
      let elemIndex = this._dragElem.dataset.index;
      let refEleIndex = this._dragElemRef.dataset.index;
      let recordToMove = find(this.filteredData, { originalIndex: elemIndex });
      let recordToDisplace = find(this.filteredData, {
        originalIndex: refEleIndex
      });

      let groupFieldName = this.isGrouped
        ? typeof this.groupBy === "string" && this.groupBy.indexOf("{") === -1
          ? this.groupBy
          : this.groupBy.groupFieldName
        : null;
      let isInSameGroup = groupFieldName
        ? recordToMove[groupFieldName] === recordToDisplace[groupFieldName]
        : false;
      if (!this.isGrouped || isInSameGroup) {
        let indexInRecordsToMove = findIndex(this.filteredData, {
          originalIndex: this._dragElemRef.dataset.index
        });
        if (!this.isFirstHalf) indexInRecordsToMove++;
        let indexInRecords = findIndex(this.filteredData, {
          originalIndex: elemIndex
        });
        this.filteredData.splice(indexInRecordsToMove, 0, recordToMove);
        this.filteredData.splice(
          indexInRecordsToMove < indexInRecords
            ? indexInRecords + 1
            : indexInRecords,
          1
        );
        this.handleRecords();
      }
      if (
        this._dragElemRef.classList
          .toString()
          .includes(`${this.theme}-border-top-20-lightgray`)
      ) {
        this._dragElemRef.classList.remove(
          `${this.theme}-border-top-20-lightgray`
        );
      }
      if (
        this._dragElemRef.classList
          .toString()
          .includes(`${this.theme}-border-bottom-20-lightgray`)
      ) {
        this._dragElemRef.classList.remove(
          `${this.theme}-border-bottom-20-lightgray`
        );
      }
      this._dragElemRef.classList.add(
        `${this.theme}-border-top-none`,
        `${this.theme}-border-bottom-none`
      );

      this.fireEvent("update");
    }
  }

  selectGroupedRow(isSelected, rowIndex) {
    let groupIndex = 0;
    let itemIndex = 0;
    this.tableGroupData.some((group, index) => {
      itemIndex = this.getIndex(group.groupItems, rowIndex);
      if (itemIndex !== -1) {
        groupIndex = index;
        return true;
      }
      return false;
    });
    if (itemIndex !== -1)
      this.tableGroupData[groupIndex].groupItems[itemIndex].selectRow =
        isSelected;
  }

  selectUnGroupedRow(isSelected, rowIndex) {
    let index = this.getIndex(this.tableData, rowIndex);
    if (index !== -1) this.tableData[index].selectRow = isSelected;
  }

  handleSelectRow(event) {
    event.stopPropagation();
    const rowIndex = event.target.dataset.index;
    const isSelected = event.target.checked;
    let record = this.filteredData.find(
      (item) => item.originalIndex === rowIndex
    );
    record.selectrow = isSelected;
    if (this.groupBy) {
      this.selectGroupedRow(isSelected, rowIndex);
    } else {
      this.selectUnGroupedRow(isSelected, rowIndex);
    }
    this.fireEvent("selectrow", record);
  }

  handleSelectAllRow = debounce((target) => {
    let isChecked = target.checked;
    this.selectAllRow = isChecked;
    let selectedRecords = [];
    let selectedRowIndexes = [];
    if (this.groupBy) {
      this.tableGroupData.forEach((item) => {
        item.groupItems.forEach((groupItem) => {
          groupItem.selectRow = isChecked;
          if (this.searchInput) {
            selectedRowIndexes.push(groupItem.originalItemIndex);
          }
        });
      });
    } else {
      this.tableData.forEach((item) => {
        item.selectRow = isChecked;
        if (this.searchInput) {
          selectedRowIndexes.push(item.originalItemIndex);
        }
      });
    }
    if (this.searchInput) {
      selectedRecords = this.filteredData.filter((item) => {
        return selectedRowIndexes.indexOf(item.originalIndex) !== -1;
      });
    }
    let records = this.searchInput ? [...selectedRecords] : "all";
    if (isChecked) {
      this.fireEvent("selectrow", records);
    } else {
      this.fireEvent("selectrow", "none");
    }
  }, 200);

  sortGroupedTable(tableArray) {
    let fieldInfo = this.dataColumns.find((item) => {
      return item.fieldName === this.sortingObj.sortField;
    });
    let data = [...tableArray];
    let sortItem1, sortItem2;
    if (fieldInfo.type === "date") {
      data.sort((a, b) => {
        sortItem1 = new Date(a[this.sortingObj.sortField]);
        sortItem2 = new Date(b[this.sortingObj.sortField]);
        return this.sortingObj.reverse
          ? sortItem2 - sortItem1
          : sortItem1 - sortItem2;
      });
    } else {
      data.sort((a, b) => {
        sortItem1 = a.groupName.toLowerCase();
        sortItem2 = b.groupName.toLowerCase();
        if (this.sortingObj.reverse) {
          return sortItem1 < sortItem2 ? 1 : sortItem1 > sortItem2 ? -1 : 0;
        }
        return sortItem1 > sortItem2 ? 1 : sortItem1 < sortItem2 ? -1 : 0;
      });
    }
    return data;
  }

  get showEditIcon() {
    return this.showRowLevelEdit || this.rowDelete;
  }

  /**
   * handleEnterPress - Supports sorting by pressing enter key
   * @param event
   */
  handleEnterPress(event) {
    event.stopPropagation();
    let code = event.keyCode || event.which;
    if (code === 13) {
      this.sortByField(event);
    }
  }
  /**
   * Utility methods to handle keyboard focus of dataTable headers
   */
  handleTableHeaderFocusIn(event) {
    event.stopPropagation();
    const ele = event.currentTarget;
    ele?.classList.add(`${this.theme}-has-focus`);
    const sortIcon = ele.querySelector(".hover-icon");
    sortIcon?.classList.remove(`${this.theme}-transition-hide`);
    const spanEle = ele.querySelector('[data-field="sorticon"]');
    spanEle?.setAttribute("aria-hidden", "false");
  }

  handleTableHeaderFocusOut(event) {
    event.stopPropagation();
    const ele = event.currentTarget;
    ele?.classList.remove(`${this.theme}-has-focus`);
    const sortIcon = ele.querySelector(".hover-icon");
    sortIcon?.classList.add(`${this.theme}-transition-hide`);
    const spanEle = ele.querySelector('[data-field="sorticon"]');
    spanEle?.setAttribute("aria-hidden", "true");
  }

  getInterpolatedValue(field) {
    if (!field) return "";
    let label = field;
    if (
      label &&
      label.indexOf("{") !== -1 &&
      (this._record || this._allMergeFields)
    ) {
      return label.replace(/\{(.*?)\}/g, (match, expr) => {
        let value = get(this._record, expr);
        if (this._allMergeFields && !value) {
          value = get(this._allMergeFields, expr);
        }
        return typeof value !== "undefined" ? value : match;
      });
    }
    return label;
  }

  setTableName(name) {
    this.setAttribute("aria-label", this.getInterpolatedValue(name));
  }

  disconnectedCallback() {
    if (this.firstFocusableElement) {
      this.firstFocusableElement.removeEventListener(
        "keydown",
        this._handleKeyDownOnFirstElementInModal
      );
    }
    if (this.lastFocusableElement) {
      this.lastFocusableElement.removeEventListener(
        "keydown",
        this._handleKeyDownOnLastElementInModal
      );
    }
  }
}
