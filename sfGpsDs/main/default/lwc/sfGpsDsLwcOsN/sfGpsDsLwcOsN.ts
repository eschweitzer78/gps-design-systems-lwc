/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api, 
  track 
} from "lwc";
import SfGpsDsElementOs from "c/sfGpsDsElementOs";
import mdEngine from "c/sfGpsDsMarkdownOs";
import { 
  OmniscriptBaseMixin 
} from "omnistudio/omniscriptBaseMixin";

import type { 
  LwcError, 
  PropertyDefMarkdownOptions 
} from "c/sfGpsDsLwcOsN";
import type { 
  PropertyAccessor 
} from "c/sfGpsDsElementOs";
import type { 
  Link 
} from "c/sfGpsDsMarkdownOs";

/* IMPORTANT NOTE: this class is not automatically derived from sfGpsDsLwcOs */

// eslint-disable-next-line no-unused-vars
const DEBUG = false;
// eslint-disable-next-line no-unused-vars
const CLASS_NAME = "SfGpsDsLwcOsN";

export default 
class SfGpsDsLwcOsN 
extends OmniscriptBaseMixin<SfGpsDsElementOs>(
  SfGpsDsElementOs
) {
  static PACKAGE_NAME = "omnistudio";

  /* getters for parity with non OS version - no easy way to do that with scope imports not permitted */

  get communityId() {
    return null;
  }

  get communityBasePath() {
    return null;
  }

  get isPreview() {
    return false;
  }

  // @ts-ignore
  @track 
  _sfGpsDsErrors?: LwcError[];

  /* methods: internal */

  addError(
    code: string, 
    description: string
  ): void {
    let errors = this._sfGpsDsErrors || [];
    this._sfGpsDsErrors = [
      ...errors,
      {
        index: errors.length,
        code: code,
        description: description
      }
    ];
  }

  clearErrors(): void {
    this._sfGpsDsErrors = undefined;
  }

  // @ts-ignore
  @api
  getErrors() {
    return this._sfGpsDsErrors;
  }

  /* methods: markdown attributes */

  defineMarkdownContentProperty(
    propertyName: string, 
    options?: PropertyDefMarkdownOptions
  ): PropertyAccessor<string> {
    const safeOptions: PropertyDefMarkdownOptions = options || {};

    return this.defineProperty(
      propertyName, 
      {
        ...options,
        transform: (markdown) => {
          try {
            return markdown ? mdEngine.renderEscaped(markdown) : "";
          // eslint-disable-next-line no-unused-vars
          } catch (e) {
            this.addError(safeOptions.errorCode || "MD-CO", safeOptions.errorText || `Issue when parsing ${propertyName} markdown.`);
            return null;
          } 
        }
      }
    );
  }

  defineMarkdownUnpackedFirstPProperty(
    propertyName: string, 
    options?: PropertyDefMarkdownOptions
  ): PropertyAccessor<string> {
    const safeOptions: PropertyDefMarkdownOptions = options || {};

    return this.defineProperty(
      propertyName, 
      {
        ...options,
        transform: (markdown) => {
          try {
            return markdown ? mdEngine.renderEscapedUnpackFirstP(markdown) : "";
          // eslint-disable-next-line no-unused-vars
          } catch (e) {
            this.addError(safeOptions.errorCode || "MD-CO", safeOptions.errorText || `Issue when parsing ${propertyName} markdown.`);
            return null;
          } 
        }
      }
    );
  }

  defineMarkdownFirstLinkProperty<T = Link>(
    propertyName: string, 
    options?: PropertyDefMarkdownOptions
  ): PropertyAccessor<T> {
    const safeOptions: PropertyDefMarkdownOptions = options || {};

    return this.defineProperty(
      propertyName, 
      {
        ...options,
        transform: (markdown) => {
          try {
            return markdown ? mdEngine.extractFirstLink(markdown) : "";
          // eslint-disable-next-line no-unused-vars
          } catch (e) {
            this.addError(safeOptions.errorCode || "MD-CO", safeOptions.errorText || `Issue when parsing ${propertyName} markdown.`);
            return null;
          } 
        },
        defaultValue: safeOptions.defaultValue || {}
      }
    );
  }
  
  defineMarkdownLinksProperty<T = Link>(
    propertyName: string, 
    options?: PropertyDefMarkdownOptions
  ): PropertyAccessor<T[]> {
    const safeOptions: PropertyDefMarkdownOptions = options || {};

    return this.defineProperty(
      propertyName, 
      {
        ...options,
        transform: (markdown) => {
          try {
            return markdown ? mdEngine.extractLinks(markdown) : (safeOptions.defaultValue || "");
          // eslint-disable-next-line no-unused-vars
          } catch (e) {
            this.addError(safeOptions.errorCode || "MD-CO", safeOptions.errorText || `Issue when parsing ${propertyName} markdown.`);
            return null;
          } 
        }
      }
    );
  }

  // backward LWC compatibility
  // @ts-ignore
  @api 
  // @ts-ignore
  get handleBeforeMount() { 
    // @ts-ignore
    return super.handleBeforeMount(); 
  }

  // @ts-ignore
  @api 
  // @ts-ignore
  get handleMounted() { 
    // @ts-ignore
    return super.handleMounted(); 
  }

  // @ts-ignore
  @api 
  // @ts-ignore
  get handleBeforeUpdate() { 
    // @ts-ignore
    return super.handleBeforeUpdate(); 
  }

  // @ts-ignore
  @api 
  // @ts-ignore
  get handleUpdated() { 
    // @ts-ignore
    return super.handleUpdated(); 
  }

  // @ts-ignore
  @api 
  // @ts-ignore
  get handleBeforeUnmount() { 
    // @ts-ignore
    return super.handleBeforeUnmount(); 
  }

  // @ts-ignore
  @api 
  // @ts-ignore
  get handleUnmounted() { 
    return this.handleUnmounted(); 
  }
}