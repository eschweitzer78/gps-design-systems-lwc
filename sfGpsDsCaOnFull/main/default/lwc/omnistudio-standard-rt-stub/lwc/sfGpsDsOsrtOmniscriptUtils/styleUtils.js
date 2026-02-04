import { loadStyle } from "lightning/platformResourceLoader";
import {
  omniLwcUtils,
  omniLwcUtilsRtl,
  getCommunityName,
  replaceUrlHost,
  isCommunity,
  getCommunityBaseUrl
} from "c/sfGpsDsOsrtOmniscriptRestApi";
import { load as loadNewport } from "c/sfGpsDsOsrtNewportLoader";

let isLoaded = false;

/**
 * Load utility stylesheet into the page (if not yet loaded).
 * @param {LightningElement} component
 */
export function loadUtilsCss(component, useRTL = false) {
  if (!isLoaded) {
    isLoaded = true;
    return loadStyle(component, useRTL ? omniLwcUtilsRtl : omniLwcUtils);
  }
  return Promise.resolve();
}

/**
 * @description Gets and loads OmniScript Header styles.
 * @param {*} comp
 * @param {String} layout
 * @param {Promise[]}
 */
export function loadHeaderStyles(comp, layout, useRTL = false) {
  let loadDesignSystemPromise;

  // Load the global design systems
  if (layout === "newport") {
    loadDesignSystemPromise = loadNewport(comp, useRTL);
  } else {
    loadDesignSystemPromise = loadUtilsCss(comp, useRTL);
  }

  // Load the global design system first then load custom global stylesheets
  return Promise.all([
    loadDesignSystemPromise,
    isCommunity(),
    getCommunityName(),
    getCommunityBaseUrl()
  ]).then((responses) => {
    // Apply custom stylesheets, if configured
    if (comp.jsonDef.propSetMap.stylesheet && !comp._isDesignMode) {
      const layoutProp = layout + (useRTL ? "Rtl" : "");

      if (comp.jsonDef.propSetMap.stylesheet[layoutProp]) {
        const bCommunity = responses[1];
        const communityName = responses[2];
        const communityBaseUrl = responses[3];
        const url = replaceUrlHost(
          `/resource/${comp.jsonDef.propSetMap.stylesheet[layoutProp]}`,
          bCommunity,
          communityName,
          communityBaseUrl
        );

        loadStyle(comp, url);
      }
    }
  });
}

/**
 * Create a template for a class attribute value. The call the returned function to generate the base class,
 * or call with additional classes to add/toggle classes.
 * @param {string} template - The template string which will comprise the base class list.
 * @example
 * ``` JavaScript
 * // Define your template as a  property or constant with default values. Note that 'theme' is a string.
 * const bodyClassTmpl = cssClassTmpl(`${'theme'}-card ${'theme'}-grid ${'theme'}-grid_vertical-stretch`);
 * // Call the returned template to generate the classes default classes.
 * connectedCallback() {
 *   // Assign the tracked variable.
 *   this.bodyClasses = bodyClassTmpl(this._theme);
 * }
 * // use the same template to add more class names to this.bodyClasses.
 * setVisibility(isVisible) {
 *   if (isVisible) {
 *     // Reset bodyClasses to default.
 *     this.bodyClasses = bodyClassTmpl(this._theme);
 *   } else {
 *     // Update bodyClasses with the given theme's hide utility.
 *     this.bodyClasses = bodyClassTmpl(this._theme, `${this._theme}-hide`)
 *   }
 * }
 * ```
 */
export function cssClassTmpl(template) {
  const keys = Array.prototype.slice.call(arguments, 1);
  /**
   * @param {string} [theme='slds'] - Value to applied to the ${'theme'} token passed in the original template creation.
   * @param {(string|string[])} [extraClasses] - Additional classes to be applied.
   * Can be a string or an array of strings.
   */
  return function (theme = "slds", extraClasses) {
    const result = [template[0]];
    keys.forEach(function (key, i) {
      result.push(theme, template[i + 1]);
    });
    if (typeof extraClasses === "string") result.push(` ${extraClasses}`);
    if (Array.isArray(extraClasses))
      extraClasses.map((className) => result.push(` ${className}`));
    return result.join("");
  };
}
