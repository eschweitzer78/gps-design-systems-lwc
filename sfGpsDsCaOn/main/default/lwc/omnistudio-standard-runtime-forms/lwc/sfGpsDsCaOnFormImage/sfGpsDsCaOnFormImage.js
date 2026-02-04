/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { track } from "lwc";
import SfGpsDsFormFile from "c/sfGpsDsFormFile";
import { computeClass } from "c/sfGpsDsHelpers";
import tmpl from "./sfGpsDsCaOnFormImage.html";

/**
 * @slot Image
 * @description Ontario Design System Image Upload for OmniStudio forms.
 * Extends the base File upload with image-specific features and preview.
 *
 * This component overrides the standard OmniScript Image element to provide
 * Ontario Design System styling with image preview functionality.
 *
 * ## Architecture
 * - Extends: SfGpsDsFormFile (base file upload)
 * - Accepts: Image file types only (.jpg, .jpeg, .png, .gif, .webp)
 * - Features: Image thumbnail preview after upload
 *
 * ## Key Features
 * - Image-only file type restriction
 * - Thumbnail preview of uploaded images
 * - Multiple image upload support
 * - Delete functionality with preview update
 *
 * ## OmniScript Configuration
 * In OmniScript Designer, configure the Image element:
 * - Multiple: Allow multiple image uploads
 * - Required: Make the field required
 *
 * ## OmniScript Registration
 * Register in your OmniScript LWC override:
 * ```javascript
 * import sfGpsDsCaOnFormImage from "c/sfGpsDsCaOnFormImage";
 *
 * static elementTypeToLwcConstructorMap = {
 *   ...OmniscriptBaseOsrt.elementTypeToLwcConstructorMap,
 *   "Image": sfGpsDsCaOnFormImage,
 * };
 * ```
 *
 * Compliance:
 * - LWR: Uses lightning-file-upload (LWR compatible)
 * - LWS: No eval(), proper namespace imports
 * - Ontario DS: Ontario form field structure with image preview grid
 * - WCAG 2.1 AA: Alt text support, keyboard accessible, screen reader support
 */
export default class SfGpsDsCaOnFormImage extends SfGpsDsFormFile {
  /**
   * Accepted image file formats.
   * @type {string}
   */
  _imageAccepts = ".jpg,.jpeg,.png,.gif,.webp";

  /**
   * Base URL for image preview.
   * @type {string}
   * @track
   */
  @track _baseUrl = "";

  /**
   * Computed aria-describedby value.
   * @type {string}
   * @track
   */
  @track computedAriaDescribedBy;

  /* ========================================
   * COMPUTED PROPERTIES - CSS CLASSES
   * ======================================== */

  /**
   * Computes CSS classes for the label element.
   * @returns {string} Space-separated CSS classes
   */
  get computedLabelClassName() {
    return computeClass({
      "ontario-label": true,
      "ontario-label--required": this._propSetMap.required
    });
  }

  /* ========================================
   * COMPUTED PROPERTIES - DISPLAY STATE
   * ======================================== */

  /**
   * Determines if required/optional flag should display.
   * @returns {boolean} True if required or optional is set
   */
  get showFlag() {
    return this._propSetMap?.required || this._propSetMap?.optional;
  }

  /**
   * Returns the label for the upload button.
   * AODA: Provides an accessible name for the file upload button.
   * @returns {string} Upload button label
   */
  get uploadButtonLabel() {
    return this.isMultiple
      ? "Choose images to upload"
      : "Choose an image to upload";
  }

  /**
   * Returns the flag text ("required" or "optional").
   * @returns {string} Flag text for display
   */
  get flagText() {
    if (this._propSetMap?.required) return "required";
    if (this._propSetMap?.optional) return "optional";
    return "";
  }

  /**
   * Determines if any images have been uploaded.
   * @returns {boolean} True if _value array has items
   */
  get hasImages() {
    return this._value && this._value.length > 0;
  }

  /**
   * Determines if multiple images can be uploaded.
   * @returns {boolean} True if multiple is enabled
   */
  get isMultiple() {
    return this._propSetMap?.multiple === true;
  }

  /**
   * Determines if more images can be added.
   * For single-image mode, disabled after first upload.
   * @returns {boolean} True if upload is disabled
   */
  get isUploadDisabled() {
    if (this.isMultiple) return false;
    return this._value && this._value.length > 0;
  }

  /**
   * Determines if upload is enabled (inverse of disabled).
   * Used in template since lwc:if doesn't support negation.
   * @returns {boolean} True if upload is enabled
   */
  get isUploadEnabled() {
    return !this.isUploadDisabled;
  }

  /**
   * Returns the accepted file formats for images.
   * @returns {string} Comma-separated list of extensions
   */
  get acceptedFormats() {
    return this._imageAccepts;
  }

  /**
   * Transforms uploaded images for template rendering.
   * Includes preview URL for each image.
   * @returns {Array<Object>} Decorated image objects
   */
  get decoratedImages() {
    return (this._value || []).map((file, index) => {
      // Files uploaded via OmniOut may have publicUrl
      // Otherwise construct URL from vId (version ID)
      let previewUrl = file.publicUrl;
      if (!previewUrl && file.vId) {
        previewUrl = `${this._baseUrl}sfc/servlet.shepherd/version/download/${file.vId}`;
      }

      return {
        ...file,
        key: file.data || index,
        index,
        previewUrl,
        altText: file.filename || `Uploaded image ${index + 1}`,
        deleteAriaLabel: `Remove ${file.filename || `image ${index + 1}`}`
      };
    });
  }

  /* ========================================
   * LIFECYCLE METHODS
   * ======================================== */

  /**
   * Returns the Ontario DS template for this component.
   * @returns {Object} The template to render
   */
  render() {
    return tmpl;
  }

  /**
   * Initializes component with Ontario DS scoping and base URL.
   */
  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }

    // CSS scoping class for Ontario DS styles
    this.classList.add("caon-scope");

    // Set base URL for image previews
    this._initBaseUrl();
  }

  /**
   * Computed aria-describedby initialization flag.
   * @type {boolean}
   * @private
   */
  _ariaDescribedByInitialized = false;

  /**
   * Updates aria-describedby after render.
   * Optimized: Only queries DOM once after initial render.
   */
  renderedCallback() {
    if (super.renderedCallback) super.renderedCallback();

    // Optimization: Only compute aria-describedby once
    if (!this._ariaDescribedByInitialized) {
      const helpers = this.template.querySelectorAll(".ontario-hint");
      if (helpers.length > 0) {
        this.computedAriaDescribedBy = [...helpers]
          .map((item) => item.id)
          .join(" ");
        this._ariaDescribedByInitialized = true;
      }
    }
  }

  /* ========================================
   * PRIVATE METHODS
   * ======================================== */

  /**
   * Initializes the base URL for image preview.
   * Uses network path for community sites.
   * LWS Note: window.location may be restricted - fallback to "/" if unavailable.
   * @private
   */
  _initBaseUrl() {
    try {
      // LWS: window.location may be restricted in some security contexts
      if (typeof window !== "undefined" && window.location) {
        const networkPath = this.scriptHeaderDef?.networkUrlPathPrefix
          ? `${this.scriptHeaderDef.networkUrlPathPrefix}/`
          : "";
        this._baseUrl = `${window.location.protocol}//${window.location.hostname}/${networkPath}`;
      } else {
        this._baseUrl = "/";
      }
    } catch {
      // LWS may restrict window.location - fallback to root
      this._baseUrl = "/";
    }
  }
}
