import { track, api, LightningElement } from "lwc";
import { dispatchOmniEvent } from "c/sfGpsDsOsrtOmniscriptUtils";
import { allCustomLabels } from "c/sfGpsDsOsrtOmniscriptCustomLabels";
import pubsub from "c/sfGpsDsOsrtPubsub";
import { RUN_MODES } from "c/sfGpsDsOsrtOmniscriptInternalUtils";
import { load as loadNewport } from "c/sfGpsDsOsrtNewportLoader";
import { OmniscriptActionCommonUtil } from "c/sfGpsDsOsrtOmniscriptActionUtils";
import { delay } from "c/sfGpsDsOsrtAsyncUtils";

import tmpl from "./omniscriptKnowledgeBase_slds.html";
import tmpl_nds from "./omniscriptKnowledgeBase_nds.html";

/**
 * @module ns/omniscriptKnowledgeBase
 */
export default class OmniscriptKnowledgeBase extends LightningElement {
  @api _theme; //obsolete

  /**
   * @scope public (api)
   * @type {String}
   * @description Stores theme layout.
   */
  @api layout;

  /**
   * @scope public (api)
   * @type {String}
   * @description Flag to determine where component is run.
   */
  @api runMode = RUN_MODES.PLAYER;

  /**
   * @scope public (api)
   * @type {Object}
   * @description Contains detailed options which used to make remote call and setting up label of KB.
   */
  @api knowledgeOptions;

  /**
   * @scope private (track)
   * @type {String}
   * @description Set user input value for getting related articles of KB.
   */
  @track inputSearchKeyword = "";

  /**
   * @type {String}
   * @scope public
   * @description Set KB Label of KB.
   */
  @api kbLabel;

  /**
   * @type {Object[]}
   * @scope private (track)
   * @description Holding set of articles based on specific user keyword.
   */
  @track articlesResults = [];

  /**
   * @type {Object}
   * @scope private (track)
   * @description Contains details of an article ie: article body, title and link.
   */
  @track articleBodyResults = {
    articleBody: "",
    articleTitle: "",
    articleLink: ""
  };

  /**
   * @type {Boolean}
   * @scope private (track)
   * @description Setting up true/false: whether can show on step or not.
   */
  @track canShowKbOnStep = false;

  dispatchOmniEventUtil = dispatchOmniEvent;

  /**
   * @type {Boolean}
   * @scope private (track)
   * @description Toggled KB container for Newport(hide/show container based on user convenience), Default is always
   *            false.
   */
  @track isToggled = false;

  /**
   * @type {Boolean}
   * @scope private (track)
   * @description Open Modal of an article via template(hide/show modal using this property), Default is always false.
   */
  @track _kbModal = false;

  /**
   * @type {Object}
   * @scope private (track)
   * @description Contains an article details.
   */
  @track _article = {};

  /**
   * @type {String} - Setting up class for modal container.
   * @scope private
   */
  _modalContainerClass;

  /**
   * @type {String} - Setting up class for footer of modal.
   * @scope private
   */
  _footerClasses;

  /**
   * @type {Boolean} - setting up true if article detailed view should open inside Omniscript.
   * @scope private
   */
  _isOpenOmniScript = false;

  /**
   * @type {Boolean} - setting up true if article detailed view should open inside Omniscript.
   * @scope private
   */
  _isConfiguredOnOmniScript = false;

  /**
   * @type {String}
   * @scope private (track)
   * @description Setting KB Label from options of KB if doesn't exist.
   */
  @track displayLabel;

  /**
   * @type {String}
   * @scope private (track)
   * @description Setting newport root block class: 'via-nds' if configured on omniscript.
   */
  @track _omniNewportClass;

  /**
   * @type {Boolean} - setting up true if stepchart placement is on top.
   * @scope private
   */
  _isStepChartTop;

  /**
   * @type {String} - Setting up theme.
   * @scope private
   */
  _themeKB = "slds";

  /**
   * @type {String} - Setting up omniscript key.
   * @scope private
   */
  omniKey;

  /**
   * @type {String}
   * @scope public (api)
   * @description Setting up OmniScript key.
   */
  @api omniscriptKey;

  /**
   * @type {Boolean}
   * @scope private (track)
   * @description Checks whether template needs to render or not.
   */
  @track renderTemplate;

  /**
   * @scope private
   * @type {OmniscriptActionCommonUtil} - stores instance of the OmniscriptActionCommonUtil class.
   */
  _actionUtilClass;

  /**
   * @scope private
   * @type {String} - Stores debug label.
   */
  _debugLabel;

  /**
   * @type {Object} - contains an article params.
   * @scope private
   */
  _articleParams;

  /**
   * @type {Object} - contains an knowledgeBase options.
   * @scope private
   */
  _knowledgeBaseOptions;

  /**
   * @type {Boolean} - checking whether its enabled inside omniscript or not.
   * @scope private
   */
  _openInOmniEnable = true;

  /**
   * @type {Object} - Custom labels for Knowledge base.
   * @scope private
   */
  _customLabelsUtil = allCustomLabels;

  /**
   * @scope private
   * type {String} - String indicating number of articles.
   */
  _numArticlesLabel;

  /**
   * @scope private
   * @description Overwrites native connectedCallback.
   * @returns {Void}
   */
  connectedCallback() {
    let renderPromise;
    // load global styling sheet
    if (
      this.getAttribute("data-omni-key") == null &&
      this.layout === "newport"
    ) {
      renderPromise = loadNewport(this);
    } else {
      renderPromise = Promise.resolve(true);
    }
    renderPromise.then(() => {
      this.renderTemplate = true;
      this._themeKB = this.layout === "newport" ? "nds" : "slds";
      this._headerClasses = `${this._themeKB}-modal__header ${this._themeKB}-text-heading_medium'`;
      this._modalClasses = `${this._themeKB}-modal ${this._themeKB}-fade-in-open`;
      this._footerClasses = `${this._themeKB}-modal__footer ${this._themeKB}-theme_default`;
      this._modalContainerClass = `${this._themeKB}-modal_prompt modal-container`;
      this._isConfiguredOnOmniScript =
        this.getAttribute("data-omni-key") == null ? false : true;
      this._omniNewportClass = this._isConfiguredOnOmniScript ? "" : "via-nds";
      this._isStepChartTop =
        this.getAttribute("data-stepchart-placement") === "top" ? true : false;
      this.omniKey = this.omniscriptKey == null ? "" : this.omniscriptKey;
      this._knowledgeOptionsChangeObj = {
        data: this.handleKnowledgeOptions.bind(this)
      };
      this._kbArticleOptionsObj = {
        data: this.handleKbArticleOptions.bind(this)
      };
      pubsub.register(
        `${this.omniKey}omnikboptionschange`,
        this._knowledgeOptionsChangeObj
      );

      pubsub.register(
        `${this.omniKey}omnikbarticlebodychange`,
        this._kbArticleOptionsObj
      );
      if (this.knowledgeOptions != null) {
        this._openInOmniEnable = false;
        this._knowledgeBaseOptions = this.knowledgeOptions;
        if (this._knowledgeBaseOptions.allCustomLabels) {
          this._customLabelsUtil = Object.assign(
            {},
            this._customLabelsUtil,
            this._knowledgeBaseOptions.allCustomLabels
          );
        }
        this.handleKnowledgeOptions(this._knowledgeBaseOptions);
      } else {
        pubsub.fire(
          `${this.omniKey}omnikbinitilized`,
          "data",
          "knowledge component initilized"
        );
      }
    });
    this._actionUtilClass = new OmniscriptActionCommonUtil();
    this._handleKeyDown = this.handleKeyDown.bind(this);
    this._handleKeyDownOnLastElementInModal =
      this.handleKeyDownOnLastElementInModal.bind(this);
    this._handleKeyDownOnFirstElementInModal =
      this.handleKeyDownOnFirstElementInModal.bind(this);
  }

  /**
   * @scope private
   * @description handleKnowledgeOptions - for setting up KB Label, kbOptions, inputsearchkeyword, articles and making remote call based on options
   * @param {Object} data - an object having options to make a remote call.
   * @returns {Void}
   */
  handleKnowledgeOptions(data) {
    this._articleParams = data.kbArticleBodyParam;
    this._knowledgeBaseOptions = data;
    let kbOptions, option;

    if (this._knowledgeBaseOptions) {
      kbOptions = JSON.parse(JSON.stringify(this._knowledgeBaseOptions));
      option = kbOptions.options ? JSON.parse(kbOptions.options) : null;
      this.displayLabel = this.kbLabel || kbOptions.displayLabel;
      this.inputSearchKeyword = option ? option.keyword : "";
      this.canShowKbOnStep = this._isConfiguredOnOmniScript
        ? this._knowledgeBaseOptions.isKbEnabledOnStep
        : true;
      if (this.canShowKbOnStep && this.inputSearchKeyword)
        this.kbInvokeAction(this._knowledgeBaseOptions);
      else this.articlesResults = [];
    }
  }

  /**
   * @scope private
   * @description Gets updated articles based on input keyword via template.
   * @param {Event} event
   * @param {Object} event.target.value - getting user input value
   * @param {Object} event.keyCode - getting input value when user hits enter
   * @returns {Void}
   */
  searchKnowledgeArticle(event) {
    if (
      (event && event.keyCode !== 13) ||
      event.target.value === this.inputSearchKeyword
    )
      return;

    this.inputSearchKeyword = event.target.value;
    let kbOptions = this._knowledgeBaseOptions
      ? JSON.parse(JSON.stringify(this._knowledgeBaseOptions))
      : null;
    if (kbOptions) {
      let option = kbOptions.options ? JSON.parse(kbOptions.options) : {};
      option.keyword = this.inputSearchKeyword;
      if (kbOptions.knowledgeRecordTypeFilter) {
        if (option.typeFilter.length === 0) {
          let tempTypeFilter = "";
          for (const [recordType] of Object.entries(
            this._knowledgeBaseOptions.knowledgeArticleTypeQueryFieldsMap
          )) {
            tempTypeFilter = tempTypeFilter + recordType + ",";
          }
          tempTypeFilter = tempTypeFilter.slice(0, tempTypeFilter.length - 1);
          option.typeFilter = tempTypeFilter;
        }
        // Handling more than 1 recordTypes specified in step level
        if (option.typeFilter.split(",").length > 1) {
          const typeFilters = option.typeFilter.split(",");
          option.recordTypeFilters = "";
          for (let i = 0; i < option.typeFilter.split(",").length; i++) {
            if (
              this._knowledgeBaseOptions.knowledgeArticleTypeQueryFieldsMap[
                typeFilters[i]
              ] !== undefined
            ) {
              const currentFieldsSplit =
                this._knowledgeBaseOptions.knowledgeArticleTypeQueryFieldsMap[
                  typeFilters[i]
                ].split(",");
              // Handle more than 1 fields specified for recordType
              if (currentFieldsSplit.length > 1) {
                let tempString = "";
                for (let j = 0; j < currentFieldsSplit.length; j++) {
                  tempString +=
                    typeFilters[i] + ":" + currentFieldsSplit[j] + ",";
                }
                option.recordTypeFilters += tempString;
              } else {
                const allString = ":ALL,";
                if (
                  this._knowledgeBaseOptions.knowledgeArticleTypeQueryFieldsMap[
                    typeFilters[i]
                  ].length === 0
                ) {
                  // Handle case where no fields are specified for record type, which case we have to search in all fields
                  option.recordTypeFilters =
                    option.recordTypeFilters + typeFilters[i] + allString;
                } else {
                  option.recordTypeFilters =
                    option.recordTypeFilters +
                    typeFilters[i] +
                    ":" +
                    this._knowledgeBaseOptions
                      .knowledgeArticleTypeQueryFieldsMap[typeFilters[i]] +
                    ",";
                }
              }
            } else {
              // Handle case where recordType is not present at setup level, so giving preference to step level and searching in all fields
              const allString = ":ALL";
              option.recordTypeFilters =
                option.recordTypeFilters + typeFilters[i] + allString + ",";
            }
          }
        } else {
          if (
            this._knowledgeBaseOptions.knowledgeArticleTypeQueryFieldsMap[
              option.typeFilter
            ] === undefined
          ) {
            // Handle case where recordType is not present at setup level, so giving preference to step level and searching in all fields
            const allString = ":ALL";
            option.recordTypeFilters = option.typeFilter + allString;
          } else {
            const currentFieldsSplit =
              this._knowledgeBaseOptions.knowledgeArticleTypeQueryFieldsMap[
                option.typeFilter
              ].split(",");
            if (currentFieldsSplit.length > 1) {
              let tempString = "";
              for (let i = 0; i < currentFieldsSplit.length; i++) {
                tempString +=
                  option.typeFilter + ":" + currentFieldsSplit[i] + ",";
              }
              option.recordTypeFilters = tempString;
            } else {
              const allString = ":ALL";
              if (
                this._knowledgeBaseOptions.knowledgeArticleTypeQueryFieldsMap[
                  option.typeFilter
                ].length === 0
              ) {
                // Handle case where no fields are specified for record type, which case we have to search in all fields
                option.recordTypeFilters = option.typeFilter + allString;
              } else {
                option.recordTypeFilters =
                  option.typeFilter +
                  ":" +
                  this._knowledgeBaseOptions.knowledgeArticleTypeQueryFieldsMap[
                    option.typeFilter
                  ];
              }
            }
          }
        }
        kbOptions.doFiltering = false;
      }
      kbOptions.options = JSON.stringify(option);
      if (this.inputSearchKeyword) this.kbInvokeAction(kbOptions);
    }
  }

  /**
   * @scope private
   * @description Makes remote call based on options
   * @param {Object} params - an object having options to make a remote call.
   * @returns {Promise}
   */
  kbInvokeAction(params) {
    this.articlesResults = [];
    this._debugLabel = params.label;
    let kbOptions = this._knowledgeBaseOptions
      ? JSON.parse(JSON.stringify(this._knowledgeBaseOptions))
      : null;
    if (kbOptions && !params.hasOwnProperty("doFiltering")) {
      let option = kbOptions.options ? JSON.parse(kbOptions.options) : {};
      if (kbOptions.knowledgeRecordTypeFilter) {
        if (option.typeFilter.length === 0) {
          let tempTypeFilter = "";
          // Handle case where step level record type is empty and we need all recordTypes from setup level
          for (const [recordType] of Object.entries(
            this._knowledgeBaseOptions.knowledgeArticleTypeQueryFieldsMap
          )) {
            tempTypeFilter = tempTypeFilter + recordType + ",";
          }
          tempTypeFilter = tempTypeFilter.slice(0, tempTypeFilter.length - 1);
          option.typeFilter = tempTypeFilter;
        }
        // Handling more than 1 recordTypes specified in step level
        if (option.typeFilter.split(",").length > 1) {
          const typeFilters = option.typeFilter.split(",");
          option.recordTypeFilters = "";
          for (let i = 0; i < option.typeFilter.split(",").length; i++) {
            if (
              this._knowledgeBaseOptions.knowledgeArticleTypeQueryFieldsMap[
                typeFilters[i]
              ] !== undefined
            ) {
              const currentFieldsSplit =
                this._knowledgeBaseOptions.knowledgeArticleTypeQueryFieldsMap[
                  typeFilters[i]
                ].split(",");
              // Handle more than 1 fields specified for recordType
              if (currentFieldsSplit.length > 1) {
                let tempString = "";
                for (let j = 0; j < currentFieldsSplit.length; j++) {
                  tempString +=
                    typeFilters[i] + ":" + currentFieldsSplit[j] + ",";
                }
                option.recordTypeFilters += tempString;
              } else {
                const allString = ":ALL,";
                if (
                  this._knowledgeBaseOptions.knowledgeArticleTypeQueryFieldsMap[
                    typeFilters[i]
                  ].length === 0
                ) {
                  // Handle case where no fields are specified for record type, which case we have to search in all fields
                  option.recordTypeFilters =
                    option.recordTypeFilters + typeFilters[i] + allString;
                } else {
                  option.recordTypeFilters =
                    option.recordTypeFilters +
                    typeFilters[i] +
                    ":" +
                    this._knowledgeBaseOptions
                      .knowledgeArticleTypeQueryFieldsMap[typeFilters[i]] +
                    ",";
                }
              }
            } else {
              // Handle case where recordType is not present at setup level, so giving preference to step level and searching in all fields
              const allString = ":ALL";
              option.recordTypeFilters =
                option.recordTypeFilters + typeFilters[i] + allString + ",";
            }
          }
        } else {
          if (
            this._knowledgeBaseOptions.knowledgeArticleTypeQueryFieldsMap[
              option.typeFilter
            ] === undefined
          ) {
            // Handle case where recordType is not present at setup level, so giving preference to step level and searching in all fields
            const allString = ":ALL";
            option.recordTypeFilters = option.typeFilter + allString;
          } else {
            const currentFieldsSplit =
              this._knowledgeBaseOptions.knowledgeArticleTypeQueryFieldsMap[
                option.typeFilter
              ].split(",");
            if (currentFieldsSplit.length > 1) {
              let tempString = "";
              for (let i = 0; i < currentFieldsSplit.length; i++) {
                tempString +=
                  option.typeFilter + ":" + currentFieldsSplit[i] + ",";
              }
              option.recordTypeFilters = tempString;
            } else {
              const allString = ":ALL";
              if (
                this._knowledgeBaseOptions.knowledgeArticleTypeQueryFieldsMap[
                  option.typeFilter
                ].length === 0
              ) {
                // Handle case where no fields are specified for record type, which case we have to search in all fields
                option.recordTypeFilters = option.typeFilter + allString;
              } else {
                option.recordTypeFilters =
                  option.typeFilter +
                  ":" +
                  this._knowledgeBaseOptions.knowledgeArticleTypeQueryFieldsMap[
                    option.typeFilter
                  ];
              }
            }
          }
        }
        params.options = option;
      }
    }
    return this._actionUtilClass
      .executeAction(params, null, this)
      .then((resp) => {
        if (!resp.error && resp.result) {
          const articlesResults = resp.result.vlcKnowledge
            ? resp.result.vlcKnowledge.knowledgeItems
            : [];
          this.articlesResults = articlesResults.map((article) => {
            const title = article.title || "";
            article.openLabel =
              this._customLabelsUtil.OmniScriptOpenFormatted.replace(
                "{0}",
                title
              );
            article.modalLabel =
              this._customLabelsUtil.OmniScriptModalFormatted.replace(
                "{0}",
                title
              );
            return article;
          });
          this._numArticlesLabel =
            this._customLabelsUtil.OmniKnowledgeArticlesCount.replace(
              "{0}",
              articlesResults.length
            );
        }
      });
  }

  /**
   * @scope private
   * @description Overwrites native render.
   * @returns {Template}
   */
  render() {
    return this.layout === "newport" ? tmpl_nds : tmpl;
  }

  /**
   * @scope private
   * @description Toggles class for newport
   * @param {Object} params - an object having options to make a remote call.
   * @return {String} - Will return classes
   */
  get classToggleWidth() {
    let containerClasses = !this.isToggled
      ? `${this._themeKB}-col ${this._themeKB}-knowledge-block ${this._themeKB}-knowledge_cont-init-width`
      : `${this._themeKB}-col ${this._themeKB}-knowledge-block ${this._themeKB}-knowledge_full-cont-width`;
    containerClasses =
      this.layout === "newport"
        ? containerClasses + " nds-knowledge-wrapper"
        : containerClasses;
    return containerClasses;
  }

  /**
   * @scope private
   * @description Support "Enter" and "Space" to toggles kb container for newport via template.
   * @param {Event} evt
   * @returns {Void}
   */
  handleKeyToggle(evt) {
    if (evt.keyCode === 13 || evt.keyCode === 32) {
      evt.preventDefault();
      this.toggleKb(evt);
    }
  }

  /**
   * @scope private
   * @description Toggles kb container for newport via template.
   * @param {Event} evt
   * @param {Boolean} isToggled - true/false open/close container
   * @returns {Void}
   */
  toggleKb(evt) {
    evt.stopPropagation();
    this.isToggled = !this.isToggled;
    delay(100).then(() => {
      if (this.isToggled) {
        this.focusInput();
      } else {
        this.focusExpandButton();
      }
    });
  }

  /**
   * @scope private
   * @description Focus the search text input.
   * @returns {Void}
   */
  focusInput() {
    const input = this.template.querySelector('[data-focusable-input="true"]');
    if (input) {
      input.focus();
    }
  }

  /**
   * @scope private
   * @description Focus the button for expanding the component.
   * @returns {Void}
   */
  focusExpandButton() {
    const button = this.template.querySelector(
      `button.${this._themeKB}-knowledge-expand`
    );
    if (button) {
      button.focus();
    }
  }

  /**
   * @scope private
   * @description Opens modal for an article detail view via template
   * @param {Event} evt
   * @returns {Void}
   */
  openModal(evt) {
    this._isOpenOmniScript = false;
    this._article =
      this.articlesResults[evt.currentTarget.getAttribute("data-info")];
    this.getArticleBody();
  }

  /**
   * @scope private
   * @description Closes the modal of an opened article detail view via template.
   * @returns {Void}
   */
  closeModal() {
    this.articleBodyResults = {
      articleBody: "",
      articleTitle: "",
      articleLink: ""
    };
    this._kbModal = false;
    //add focus back to the element which triggered the modal
    if (this.previousFocusedElement) {
      this.previousFocusedElement.focus();
    }
  }

  /**
   * @scope private
   * @description Opens an article detail view inside omniscript via template
   * @param {Event} evt
   * @returns {Void}
   */
  openInOmniscript(evt) {
    this._isOpenOmniScript = true;
    this._article =
      this.articlesResults[evt.currentTarget.getAttribute("data-info")];
    pubsub.fire(`${this.omniKey}omnikbarticlebodyinit`, "data", this._article);
  }

  /**
   * @scope private
   * @description Gets detailed info object of an article.
   * @returns {Void}
   */
  getArticleBody() {
    let params = JSON.parse(JSON.stringify(this._articleParams));
    let articalOption = JSON.parse(params.options);
    articalOption.aType = this._article.articleType;
    articalOption.articleId = this._article.articleId;
    const searchFlds =
      this._knowledgeBaseOptions.knowledgeArticleTypeQueryFieldsMap != null
        ? this._knowledgeBaseOptions.knowledgeArticleTypeQueryFieldsMap
        : "";
    if (searchFlds) {
      articalOption.bodyFields = searchFlds[articalOption.aType];
    }
    if (
      (this._knowledgeBaseOptions.lightningKBEnable != null &&
        this._knowledgeBaseOptions.lightningKBEnable) === true
    ) {
      articalOption.aType = this._knowledgeBaseOptions.lightningKBObjName;
    }
    params.options = JSON.stringify(articalOption);
    this.kbArticleInvokeAction(params);
  }

  /**
   * @scope private
   * @description Callback function of pubsub event for getting article body options
   * @param {Object} data - an object having options to make a remote call for an article.
   * @returns {Void}
   */
  handleKbArticleOptions(data) {
    this.kbArticleInvokeAction(data);
  }

  /**
   * @scope private
   * @description Makes remote call based on article options
   * @param {Object} params - an object having options to make a remote call.
   * @returns {Promise}
   */
  kbArticleInvokeAction(params) {
    this._debugLabel = params.label;

    return this._actionUtilClass
      .executeAction(params, null, this)
      .then((resp) => {
        if (!resp.error && resp.result) {
          let body;
          let articleDetails = resp.result.vlcArticleBody
            ? resp.result.vlcArticleBody
            : [];

          if (articleDetails.length) {
            body = "";
            for (let count = 0; count < articleDetails.length; count++) {
              for (let key in articleDetails[count]) {
                if (articleDetails[count].hasOwnProperty(key)) {
                  if (count !== 0)
                    body +=
                      this.layout === "lightning" ? "<br/><hr/>" : "<br/>";
                  body += articleDetails[count][key];
                }
              }
            }
            this.articleBodyResults.articleBody = body;
          }
          this.articleBodyResults.articleTitle = this._article.title;
          this.articleBodyResults.articleLink =
            "/articles/" + this._article.aType + "/" + this._article.urlName;
          this.articleBodyResults.setFocusToArticle = true;

          if (this._isOpenOmniScript) {
            let copyResult = JSON.parse(
              JSON.stringify(this.articleBodyResults)
            );
            pubsub.fire(
              `${this.omniKey}omnikbarticlebodyresult`,
              "data",
              copyResult
            );
          } else {
            this._kbModal = true;
            this.setFocusOnModal();
          }
        }
      });
  }

  /**
   * @scope private
   * @description Find the first focusable element and add keydown event listener
   * @returns {Void}
   */
  setFirstFocusableElement() {
    this.firstFocusableElement = this.template.querySelector(
      `.${this._themeKB}-modal__container > header`
    );
    if (this.firstFocusableElement) {
      this.firstFocusableElement.addEventListener(
        "keydown",
        this._handleKeyDownOnFirstElementInModal
      );
    }
  }

  /**
   * @scope private
   * @description Find the last focusable element and add keydown event listener
   * @returns {Void}
   */
  setLastFocusableElement() {
    this.lastFocusableElement = this.template.querySelector(
      '[role="dialog"] [data-button]'
    );
    if (this.lastFocusableElement) {
      this.lastFocusableElement.addEventListener(
        "keydown",
        this._handleKeyDownOnLastElementInModal
      );
    }
  }

  /**
   * @scope private
   * @description Handle keydown on the first element in the modal
   * @param {Event} event
   * @returns {Void}
   */
  handleKeyDownOnFirstElementInModal(event) {
    const isTabPressed = event.key === "Tab" || event.keyCode === 9;

    if (!isTabPressed) {
      return;
    }

    // if shiftkey is held down then we're going backwards and should end up on last element
    if (event.shiftKey && this.lastFocusableElement) {
      // if focused has reached to last focusable element then focus first focusable element after pressing tab
      this.lastFocusableElement.focus();
      event.preventDefault();
    }
  }

  /**
   * @scope private
   * @description Handle keydown on the last element in the modal
   * @param {Event} event
   * @returns {Void}
   */
  handleKeyDownOnLastElementInModal(event) {
    const isTabPressed = event.key === "Tab" || event.keyCode === 9;

    if (!isTabPressed) {
      return;
    }

    // ignore if shiftkey is held down
    if (!event.shiftKey && this.firstFocusableElement) {
      // if focused has reached to last focusable element then focus first focusable element after pressing tab
      this.firstFocusableElement.focus();
      event.preventDefault();
    }
  }

  /**
   * @scope private
   * @description Set focus on the modal when modal is opened
   * @returns {Void}
   */
  setFocusOnModal() {
    this.previousFocusedElement = this.template.activeElement;
    Promise.resolve().then(() => {
      this.setLastFocusableElement();
      this.setFirstFocusableElement();
      if (this.firstFocusableElement) {
        this.firstFocusableElement.focus();
      }
    });
  }

  /**
   * @scope private
   * @description Handle keydown event to close the modal on escape key press
   * @param {Event} event
   * @returns {Void}
   */
  handleKeyDown(event) {
    const key = event.key;
    if (key === "Escape" || key === "Esc") {
      this.closeModal();
      event.preventDefault();
    }
  }

  /**
   * @scope private
   * @description For redirecting article on new tab with detailed view via template
   * @param {Event} evt
   * @returns {Void}
   */
  redirectToArticleUrl(evt) {
    this._article =
      this.articlesResults[evt.currentTarget.getAttribute("data-info")];
    let url = "/articles/" + this._article.aType + "/" + this._article.urlName;
    window.open(url, "_blank");
  }

  /**
   * @scope private
   * @description For handling keyboard event of Enter or Space
   * @param {Event} evt
   * @returns {Void}
   */
  handleKeydownRedirect(evt) {
    if (evt.key === "Enter" || evt.key === " " || evt.key === "Spacebar") {
      evt.preventDefault();
      this.redirectToArticleUrl(evt);
    }
  }

  /**
   * @scope private
   * @description Overwrites inherited sendDataToDebugConsole. Sends data to the Debug Console event handler.
   * @param {Object} params
   * @param {Object} resp
   * @param {String} label
   * @param {Object} [element]
   * @returns {Void}
   */
  sendDataToDebugConsole(params, resp, label, element) {
    let sendParams = JSON.parse(JSON.stringify(params));
    if (sendParams && sendParams.options) {
      let optionNode = JSON.parse(sendParams.options);
      delete optionNode.options;
      delete optionNode.input;
      sendParams.options = optionNode;
    }

    let sendResp = JSON.parse(JSON.stringify(resp));
    if (sendResp && sendResp.responseResult) {
      sendResp.responseResult = JSON.parse(sendResp.responseResult);
    }

    const debugData = {
      params: sendParams,
      response: sendResp,
      element: {
        label: label,
        elementType: element && element.type ? element.type : element
      }
    };

    if (element && element.stage) {
      debugData.element.stage = element.stage;
    }

    // dispatches action data to debug console
    this.dispatchOmniEventUtil(this, debugData, "omniactiondebug");
  }

  disconnectedCallback() {
    pubsub.unregister(
      `${this.omniKey}omnikboptionschange`,
      this._knowledgeOptionsChangeObj
    );
    pubsub.unregister(
      `${this.omniKey}omnikbarticlebodychange`,
      this._kbArticleOptionsObj
    );
  }
}
