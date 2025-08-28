import { track } from "lwc";
import OmniscriptFile from "c/sfGpsDsOsrtOmniscriptFile";
import tmpl from "./omniscriptImage_slds.html";
import tmpl_nds from "./omniscriptImage_nds.html";
import { getCurrentBaseUrl } from "c/sfGpsDsOsrtOmniscriptRestApi";

/**
 * @module ns/omniscriptImage
 * @extends OmniscriptFile
 * @typicalname omniscriptImage
 */
export default class OmniscriptImage extends OmniscriptFile {
  /**
   * Flag used to track if multiple files can be uploaded
   * @type {Boolean}
   * @scope track (private)
   */
  @track multiple;

  /**
   * A list of file extensions that can be uploaded
   * @type {String}
   * @scope track (private)
   */
  @track accepts;

  /**
   * The class of the parent container
   * @type {String}
   * @scope track (private)
   */
  @track _parentContainerClasses = "";

  /**
   * The base URL used to load image preview
   * @type {String}
   * @scope track (private)
   */
  _baseUrl;

  /**
   * Property that keeps track if the component is disabled
   * @type {Boolean}
   */
  get disabled() {
    return this._propSetMap.multiple === true ? false : this._value.length > 0;
  }

  /**
   * A list of uploaded images
   * @type {Array}
   */
  get images() {
    return this._value.map((file) => {
      // Files uploaded using OmniOut have public URL
      const url =
        file.publicUrl ||
        this._baseUrl + "sfc/servlet.shepherd/version/download/" + file.vId;
      return {
        ...file,
        url: url
      };
    });
  }

  // Lifecycle Hooks

  /**
   * Overwrites inherited initCompVariables. This method is executed once during connectedCallback.
   * @scope private
   * @returns {void}
   */
  initCompVariables() {
    super.initCompVariables();
    this.multiple = this._propSetMap.multiple === true;
    this.accepts = ".jpg,.png,.jpeg,.gif,.webp";

    const networkPath = this.scriptHeaderDef.networkUrlPathPrefix
      ? this.scriptHeaderDef.networkUrlPathPrefix + "/"
      : "";

    this._baseUrl = getCurrentBaseUrl(networkPath); //;`${window.location.protocol}//${window.location.hostname}/${networkPath}`;
  }

  /**
   * Overwrites native LWC renderedCallback
   * @return {Template}
   * @scope private
   */
  render() {
    return this.layout === "newport" ? tmpl_nds : tmpl;
  }

  handleFocusOut() {
    this.reportValidity();
  }
}
