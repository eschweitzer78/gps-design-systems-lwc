import { logOmniScriptMetrics } from "c/sfGpsDsOsrtOmniscriptRestApi";

export class OmniScriptMetricsGenerator {
  /**
   * Cached common metrics data
   * @type {any}
   * @scope private
   */
  _metricsHeader;

  /**
   * Cached full metrics
   * @type {any}
   * @scope private
   */
  _omniscriptMetrics;

  /**
   * Cached step metrics
   * @type {Map<Number, any>}
   * @scope private
   */
  _cachedMetrics;

  /**
   * Are we running the metrics at design mode?
   * @type {boolean}
   * @scope private
   */
  _isDesignMode;

  constructor({ jsonDef, theme, isActive, isPreview, isDesignMode }) {
    this._cachedMetrics = new Map();
    this._isDesignMode = isDesignMode;
    this._metricsHeader = this._buildMetricsHeader(
      jsonDef,
      theme,
      isActive,
      isPreview
    );

    // Generate the metrics for this OS
    this._generate(jsonDef);
  }

  _buildMetricsHeader(jsonDef, theme, isActive, isPreview) {
    return {
      operation: "",
      omniscriptId: jsonDef.sOmniScriptId,
      type: jsonDef.bpType,
      subType: jsonDef.bpSubType,
      language: jsonDef.bpLang,
      theme: theme || "slds",
      instanceId: jsonDef.sInstanceId,
      versionNumber: jsonDef.bpVersion,
      isActive,
      isPreview,
      stepCount: (jsonDef.children || []).length,

      elementsOnScreen: "",
      currentStep: -1,
      totalUniqueElements: 0,
      childOmniScripts: "",
      childFlexCards: "",
      elementsMap: "",
      conditionalElementsMap: "",
      stepVisitCount: 0
    };
  }

  get(operation, idx = null) {
    let metrics = {};

    if (idx === null) {
      metrics = this._omniscriptMetrics;
    } else if (this._cachedMetrics.has(idx)) {
      const data = this._cachedMetrics.get(idx);
      data.stepVisitCount += 1;

      // Save the visit count
      this._cachedMetrics.set(idx, data);

      // Metrics
      metrics = {
        ...data.metrics,
        stepVisitCount: data.stepVisitCount
      };
    }

    return {
      ...this._metricsHeader,
      operation,
      currentStep: idx === null ? -1 : idx,
      ...metrics
    };
  }

  /**
   * Generates the metrics for this OmniScript
   * @scope private
   */
  _generate(jsonDef) {
    const uniqueElements = new Set();
    const childFlexCards = new Set();
    const elementsMap = new Map();
    const conditionalElementsMap = new Map();

    // Extract the metrics for the whole JSON def
    this._extractChildrenMetrics(
      true,
      jsonDef.children,
      uniqueElements,
      childFlexCards,
      elementsMap,
      conditionalElementsMap
    );

    // Save the OS metrics
    this._omniscriptMetrics = this._buildMetrics(
      uniqueElements,
      childFlexCards,
      elementsMap,
      conditionalElementsMap
    );
  }

  /**
   *
   * @param {Boolean} isRoot
   * @param {Array} children
   * @param {Set} uniqueElements
   * @param {Set} childFlexCards
   * @param {Map<String, Number>} elementsMap
   * @param {Map<String, Number>} conditionalElementsMap
   */
  _extractChildrenMetrics(
    isRoot,
    children,
    parentUniqueElements,
    parentChildFlexCards,
    parentElementsMap,
    parentConditionalElementsMap
  ) {
    if (!children || !Array.isArray(children)) {
      return;
    }

    children.forEach((child, idx) => {
      const uniqueElements = new Set();
      const childFlexCards = new Set();
      const elementsMap = new Map();
      const conditionalElementsMap = new Map();

      this._extractChildMetrics(
        child,
        uniqueElements,
        childFlexCards,
        elementsMap,
        conditionalElementsMap
      );

      if (isRoot) {
        // Save the metrics in the cache
        this._cachedMetrics.set(idx, {
          stepVisitCount: 0,
          metrics: this._buildMetrics(
            uniqueElements,
            childFlexCards,
            elementsMap,
            conditionalElementsMap
          )
        });
      }

      // Merge with the parent data
      this._mergeMaps(elementsMap, parentElementsMap);
      this._mergeMaps(conditionalElementsMap, parentConditionalElementsMap);
      this._mergeSet(uniqueElements, parentUniqueElements);
      this._mergeSet(childFlexCards, parentChildFlexCards);
    });
  }

  /**
   * Merges the value of src into target
   * @param {Set} src
   * @param {Set} target
   */
  _mergeSet(src, target) {
    Array.from(src).forEach((item) => {
      if (!target.has(item)) {
        target.add(item);
      }
    });
  }

  /**
   * Merges src Map into target Map
   * @param {Map<String, Number>} src
   * @param {Map<String, Number>} target
   */
  _mergeMaps(src, target) {
    src.forEach((srcValue, srcKey) => {
      let newValue = srcValue;

      if (target.has(srcKey)) {
        newValue += target.get(srcKey);
      }

      target.set(srcKey, newValue);
    });
  }

  /**
   * Build the metrics as strings
   * @param {Set} uniqueElements
   * @param {Set} childFlexCards
   * @param {Map<String, Number>} elementsMap
   * @param {Map<String, Number>} conditionalElementsMap
   * @returns
   */
  _buildMetrics(
    uniqueElements,
    childFlexCards,
    elementsMap,
    conditionalElementsMap
  ) {
    return {
      uniqueElements: Array.from(uniqueElements).join(","),
      totalUniqueElements: uniqueElements.size,
      childFlexCards: Array.from(childFlexCards).join(","),
      conditionalElementsMap: Array.from(conditionalElementsMap.keys())
        .map((k) => k + ":" + conditionalElementsMap.get(k))
        .join(","),
      elementsMap: Array.from(elementsMap.keys())
        .map((k) => k + ":" + elementsMap.get(k))
        .join(",")
    };
  }

  /**
   *
   * @param {any} child
   * @param {Set<String>} uniqueElements
   * @param {Set<String>} childOmniScripts
   * @param {Set<String>} childFlexCards
   * @param {Map<String, Integer>} elementsMap
   * @param {Map<String, Integer>} conditionalElementsMap
   */
  _extractChildMetrics(
    child,
    uniqueElements,
    childFlexCards,
    elementsMap,
    conditionalElementsMap
  ) {
    if (child.type) {
      uniqueElements.add(child.type);

      const count = elementsMap.get(child.type) || 0;
      elementsMap.set(child.type, count + 1);
    }

    if (child.propSetMap) {
      if (
        child.propSetMap?.show &&
        child.propSetMap.show !== null &&
        child.type
      ) {
        conditionalElementsMap.set(
          child.type,
          this._getMetricsValueFromMap(conditionalElementsMap, child.type) + 1
        );
      }
    }

    if (child.eleArray && Array.isArray(child.eleArray)) {
      child.eleArray.forEach((item) => {
        uniqueElements.add(item.type);

        const count = elementsMap.get(item.type) || 0;
        elementsMap.set(item.type, count + 1);

        if (item.propSetMap) {
          if (
            item.propSetMap?.show &&
            item.propSetMap.show !== null &&
            item.type
          ) {
            conditionalElementsMap.set(
              item.type,
              this._getMetricsValueFromMap(conditionalElementsMap, item.type) +
                1
            );
          }

          if (
            item.type === "Custom Lightning Web Component" &&
            (item.propSetMap.lwcName || "").startsWith("cf")
          ) {
            childFlexCards.add(item.propSetMap.lwcName);
          }
        }

        this._extractChildrenMetrics(
          false,
          item.children,
          uniqueElements,
          childFlexCards,
          elementsMap,
          conditionalElementsMap
        );
      });
    }

    this._extractChildrenMetrics(
      false,
      child.children,
      uniqueElements,
      childFlexCards,
      elementsMap,
      conditionalElementsMap
    );
  }

  /**
   *
   * @param {Map<String, Number>} map
   * @param {String} key
   */
  _getMetricsValueFromMap(map, key) {
    if (!map.has(key)) {
      return 0;
    }
    return map.get(key);
  }

  save(metrics) {
    // Do not run metrics when running this file in the designer
    if (this._isDesignMode) {
      return;
    }

    Promise.resolve()
      .then(() => {
        return logOmniScriptMetrics({ metrics: JSON.stringify(metrics) });
      })
      .catch(() => {});
  }
}
