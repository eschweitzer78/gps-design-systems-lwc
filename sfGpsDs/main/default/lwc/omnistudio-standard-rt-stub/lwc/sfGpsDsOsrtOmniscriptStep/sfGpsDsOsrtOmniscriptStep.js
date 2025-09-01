import { api, track } from "lwc";
import OmniscriptGroupElement from "c/sfGpsDsOsrtOmniscriptGroupElement";
import { getNamespaceDotNotation } from "c/sfGpsDsOsrtOmniscriptInternalUtils";
import pubsub from "c/sfGpsDsOsrtPubsub";

import tmpl from "./omniscriptStep_slds.html";
import tmpl_nds from "./omniscriptStep_nds.html";

/**
 * @module ns/omniscriptStep
 * @extends OmniscriptGroupElement
 * @typicalname omniscriptStep
 */
export default class OmniscriptStep extends OmniscriptGroupElement {
  _origActive;
  /**
   * @type {Object} - Knowledge Options.
   * @scope private
   */
  _savedKnowledgeOptions;
  /**
   * @type {Object} - Object with callback method(handleKnowledgeInitialized) for pubsub.
   * @scope private
   */
  _kbInitializedObj;
  /**
   * @type {Object} - Object with callback method(handleArticleBodyInitialized) for pubsub.
   * @scope private
   */
  _kbArticleBodyInitializedObj;

  /**
   * @type {String} - Label for button to toggle inline article (SLDS only). Initialized to
   * label/c.OmniscriptHideDetails ("Hide Details") in initialRenderCallback().
   * @scope private
   */
  _toggleArticleLabel;

  /**
   * @type {Object} - Article detailed info object.
   * @scope private
   */
  @track articleBodyResults = {
    articleBody: "",
    articleTitle: "",
    articleLink: ""
  };

  /**
   * @type {Boolean} - Whether article will display or not.
   * @scope private
   */
  @track visible = true;

  /**
   * @scope private
   * @description Overwrites inherited renderedCallback.
   * @returns {Void}
   */
  renderedCallback() {
    let newVal = this.jsonDef.bAccordionActive;
    if (
      this._origActive !== undefined &&
      newVal !== undefined &&
      this._origActive !== newVal &&
      newVal === false
    ) {
      this._initialRender = true;
    }
    this._origActive = newVal;
    if (!newVal) {
      if (this._initialWatch === "true") {
        this.combinedWatch();
        this._initialWatch = "false";
      }
      pubsub.unregister(
        `${this.scriptHeaderDef.omniscriptKey}omnikbarticlebodyinit`,
        this._kbArticleBodyInitializedObj
      );
      pubsub.unregister(
        `${this.scriptHeaderDef.omniscriptKey}omnikbarticlebodyresult`,
        this._kbArticleBodyResultObj
      );
    } else {
      super.renderedCallback();
    }

    if (this.articleBodyResults.setFocusToArticle) {
      const articleLink = this.template.querySelector(
        ".vlc-slds-knowledge--header > a"
      );
      if (articleLink) {
        articleLink.focus();
      }
      this.articleBodyResults.setFocusToArticle = false;
    }
  }

  /**
   * @scope private
   * @description Overwrites initialRenderCallback. Called on first render cycle.
   * @returns {Void}
   */
  initialRenderCallback() {
    if (
      this.jsonDef.bAccordionActive &&
      this.jsonDef.type === "Step" &&
      this.scriptHeaderDef.kbIndex >= 0
    ) {
      this.articleBodyResults = {
        articleBody: "",
        articleTitle: "",
        articleLink: ""
      };
      if (
        this._propSetMap.showPersistentComponent[this.scriptHeaderDef.kbIndex]
      ) {
        this._kbInitializedObj = {
          data: this.handleKnowledgeInitialized.bind(this)
        };
        this._kbArticleBodyInitializedObj = {
          data: this.handleArticleBodyInitialized.bind(this)
        };
        this._kbArticleBodyResultObj = {
          data: this.kbArticleBodyResult.bind(this)
        };
        pubsub.register(
          `${this.scriptHeaderDef.omniscriptKey}omnikbinitilized`,
          this._kbInitializedObj
        );
        pubsub.register(
          `${this.scriptHeaderDef.omniscriptKey}omnikbarticlebodyinit`,
          this._kbArticleBodyInitializedObj
        );
        pubsub.register(
          `${this.scriptHeaderDef.omniscriptKey}omnikbarticlebodyresult`,
          this._kbArticleBodyResultObj
        );
      }
      this._toggleArticleLabel =
        this.scriptHeaderDef.allCustomLabels.OmniStepHideDetails;
      this._savedKnowledgeOptions = this.knowledgeOptions();
      pubsub.fire(
        `${this.scriptHeaderDef.omniscriptKey}omnikboptionschange`,
        "data",
        this._savedKnowledgeOptions
      );
    }

    if (this.seedJson) {
      const apiJson = JSON.parse(JSON.stringify(this.seedJson));
      if (Object.getOwnPropertyNames(apiJson).length > 0) {
        this.dispatchOmniEventUtil(
          this,
          { apiResponse: apiJson, overwrite: true },
          "omniactionbtn"
        );
      }
    }

    // OWC-537
    if (
      this._propSetMap.omniClearSaveState &&
      Array.isArray(this._propSetMap.omniClearSaveState) &&
      this._propSetMap.omniClearSaveState.length > 0
    ) {
      Promise.resolve().then(() => {
        const state = {
          operation: "clearState",
          keyList: this._propSetMap.omniClearSaveState
        };
        this.dispatchOmniEventUtil(this, state, "omnicustomsavestate");
      });
    }

    // Messaging Framework Support
    if (
      !this._isDesignMode &&
      this.evaluateMessagingUtil(
        this.jsonDef.propSetMap,
        this.scriptHeaderDef.omniAnalyticsEnabled
      )
    ) {
      // Executes handleMessaging utility once Step has fully loaded
      Promise.resolve()
        .then(() => {
          // Do nothing during first cycle
        })
        .finally(() => {
          // Once step is fully loaded, store start time and ready time.
          // - Start time = moment bAccordionActive = true (refer to the Header Component)
          // - Ready Time = moment when active step is fully loaded
          const readyTime = Date.now();
          const messagingData = {
            ReadyTime: readyTime,
            StartTime: this.jsonDef.st,
            LoadDuration: readyTime - this.jsonDef.st,
            OmniEleType: this.jsonDef.type,
            OmniEleName: this.jsonDef.name,
            Resume: this.resume,
            StepWaitTime: readyTime - this.jsonDef.swt
          };

          this.handleMessagingUtil(
            this,
            "omniscript_step",
            messagingData,
            this.jsonDef,
            "OS Step Load"
          );
        });
    }
    const stepHeader = this.template.querySelector("h1");
    if (!this._isDesignMode && stepHeader) {
      stepHeader.focus();
    }
  }

  /**
   * @scope private
   * @description callback method for initializing Knowledge component with kbOptions and fire pubsub event to trigger changes in KB
   * @returns {Void}
   */
  handleKnowledgeInitialized() {
    this._savedKnowledgeOptions = this.knowledgeOptions();
    pubsub.fire(
      `${this.scriptHeaderDef.omniscriptKey}omnikboptionschange`,
      "data",
      this._savedKnowledgeOptions
    );
    pubsub.unregister(
      `${this.scriptHeaderDef.omniscriptKey}omnikbinitilized`,
      this._kbInitializedObj
    );
    this._kbInitializedObj = null;
  }

  /**
   * @scope private
   * @description Overwrites inherited stateRefresh. Gets called in combinedWatch.
   * @returns {Void}
   */
  stateRefresh() {
    if (
      this.jsonDef.bAccordionActive &&
      this.jsonDef.type === "Step" &&
      this.scriptHeaderDef.kbIndex >= 0 &&
      this._propSetMap.showPersistentComponent[this.scriptHeaderDef.kbIndex]
    ) {
      let options = this.knowledgeOptions();
      if (!this.lodashUtil.isEqual(options, this._savedKnowledgeOptions))
        pubsub.fire(
          `${this.scriptHeaderDef.omniscriptKey}omnikboptionschange`,
          "data",
          options
        );
      this._savedKnowledgeOptions = options;
    }
  }

  /**
   * @scope private
   * @description Overwrites inherited render.
   * @returns {Template}
   */
  render() {
    return this.layout === "newport" ? tmpl_nds : tmpl;
  }

  /**
   * @scope private
   * @description Setting up knowledge otions from persistentComponent object
   * @returns {Object}
   */
  knowledgeOptions() {
    const isKbEnabledOnStep =
      this._propSetMap.showPersistentComponent[this.scriptHeaderDef.kbIndex];
    if (!isKbEnabledOnStep) {
      return { isKbEnabledOnStep: isKbEnabledOnStep };
    }
    let kbOptionsParam,
      options,
      optionKeyword,
      keyword = "",
      input = {};
    let _step = this.jsonDef;
    let kbObject;
    this._stepWithMergeField = {};
    let kbArticleBodyParam;

    if (_step && _step.type === "Step") {
      kbArticleBodyParam = this.knowledgeArticleOptions();
      if (this.scriptHeaderDef && this.scriptHeaderDef.propSetMap) {
        kbObject = this.scriptHeaderDef.propSetMap.persistentComponent.find(
          ({ id }) => id === "vlcKnowledge"
        );
      }
      this.knowledgeLabel =
        this.scriptHeaderDef && this.scriptHeaderDef.propSetMap && kbObject
          ? kbObject.label
          : "";
      options = JSON.parse(JSON.stringify(this._propSetMap.knowledgeOptions));

      options = options == null ? {} : options;
      optionKeyword = options.keyword;

      //mergefield
      if (optionKeyword) {
        keyword = this.handleMergeFieldUtil(
          optionKeyword,
          this._jsonData,
          this.scriptHeaderDef.labelMap,
          null
        );
      }

      const sClassName =
        getNamespaceDotNotation() + "DefaultKnowledgeOmniScriptIntegration";
      const sMethodName = "searchArticle";
      options.keyword = keyword;

      if (this.scriptHeaderDef.propSetMap.bLK === true) {
        options.lkObj = this.scriptHeaderDef.propSetMap.lkObjName;
      }

      kbOptionsParam = {
        sClassName: sClassName,
        sMethodName: sMethodName,
        input: JSON.stringify(input),
        options: JSON.stringify(options),
        label: _step && _step.name,
        displayLabel: this.knowledgeLabel,
        isKbEnabledOnStep: isKbEnabledOnStep,
        kbArticleBodyParam: kbArticleBodyParam,
        lightningKBObjName: this.scriptHeaderDef.propSetMap.lkObjName,
        knowledgeRecordTypeFilter:
          this.scriptHeaderDef.propSetMap.knowledgeRecordTypeFilter,
        knowledgeArticleTypeQueryFieldsMap:
          this.scriptHeaderDef.propSetMap.knowledgeArticleTypeQueryFieldsMap,
        lightningKBEnable: this.scriptHeaderDef.propSetMap.bLK
      };
      if (this.scriptHeaderDef.multiLang || this.scriptHeaderDef.extraL) {
        kbOptionsParam.allCustomLabels = this.scriptHeaderDef.allCustomLabels;
        kbOptionsParam.multiLang = true;
      }
    }
    return kbOptionsParam;
  }

  /**
   * @scope private
   * @description Setting up knowledge article otions of an article
   * @returns {Object}
   */
  knowledgeArticleOptions(article) {
    let kbArticleBodyParam,
      options,
      input = {};
    let _step = this.jsonDef;
    this._stepWithMergeField = {};

    if (_step && _step.type === "Step") {
      options = JSON.parse(JSON.stringify(this._propSetMap.knowledgeOptions));

      options = options == null ? {} : options;

      if (article != null) {
        options.aType = article.articleType;
        options.articleId = article.articleId;
      }

      const sClassName =
        getNamespaceDotNotation() + "DefaultKnowledgeOmniScriptIntegration";
      const sMethodName = "getArticleBody";

      const searchFlds =
        this.scriptHeaderDef.propSetMap.knowledgeArticleTypeQueryFieldsMap;
      if (searchFlds) {
        options.bodyFields = searchFlds[options.aType];
      }

      if (this.scriptHeaderDef.propSetMap.bLK === true) {
        options.aType = this.scriptHeaderDef.propSetMap.lkObjName;
      }

      kbArticleBodyParam = {
        sClassName: sClassName,
        sMethodName: sMethodName,
        input: JSON.stringify(input),
        options: JSON.stringify(options),
        label: _step && _step.name
      };
    }
    return kbArticleBodyParam;
  }

  /**
   * @scope private
   * @description callback method for firing pubsub event to get article option
   * @returns {Void}
   */
  handleArticleBodyInitialized(data) {
    pubsub.fire(
      `${this.scriptHeaderDef.omniscriptKey}omnikbarticlebodychange`,
      "data",
      this.knowledgeArticleOptions(data)
    );
  }

  /**
   * @scope private
   * @description callback method for setting up article Body Results.
   * @param {Object} data
   * @returns {Void}
   */
  kbArticleBodyResult(data) {
    this.articleBodyResults = data;
  }

  /**
   * @scope private
   * @description Hide article container from template and nullify articleBodyResults object.
   * @returns {Void}
   */
  closeArticle() {
    this.articleBodyResults = {
      articleBody: "",
      articleTitle: "",
      articleLink: ""
    };
  }

  /**
   * @scope private
   * @description Toggle article container to expand/collapse
   * @returns {Void}
   */
  toggleArticle() {
    const { OmniStepHideDetails, OmniStepShowDetails } =
      this.scriptHeaderDef.allCustomLabels;
    this.visible = !this.visible;
    this._toggleArticleLabel = this.visible
      ? OmniStepHideDetails
      : OmniStepShowDetails;
  }

  getBoundsForDesigner() {
    const container = this.template.querySelector(
      this.layout === "lightning"
        ? ".omniscript-step__body > .slds-grid"
        : ".omniscript-step__body-nds"
    );
    const outerWrapper = this.getBoundingClientRect();
    if (container) {
      const computedStyle = getComputedStyle(container);
      const boundingRect = container.getBoundingClientRect();
      const bounds = Object.assign(
        {},
        JSON.parse(JSON.stringify(outerWrapper)),
        {
          containerBounds: boundingRect,
          paddingLeft: this.safeParseStyleToNumber(computedStyle.paddingLeft),
          paddingRight: this.safeParseStyleToNumber(computedStyle.paddingRight),
          paddingTop: this.safeParseStyleToNumber(computedStyle.paddingTop),
          paddingBottom: this.safeParseStyleToNumber(
            computedStyle.paddingBottom
          )
        }
      );
      // height for container isn't stretched fully so we'll hack it to the height of the parent element
      bounds.containerBounds.height = this.safeParseStyleToNumber(
        getComputedStyle(container.parentNode).height
      );
      return bounds;
    }
    return this.getBoundingClientRect();
  }

  @api clearInvalid() {
    this.invalidElements = {};
  }
}
