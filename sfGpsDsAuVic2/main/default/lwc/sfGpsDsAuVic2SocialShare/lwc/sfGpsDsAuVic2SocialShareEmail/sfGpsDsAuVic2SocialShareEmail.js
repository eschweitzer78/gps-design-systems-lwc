import { LightningElement, api, track, wire } from "lwc";
import getTemplateByDevName from "@salesforce/apex/SfGpsDsAuVic2EmailTemplateController.getTemplateByDevName";

export default class extends LightningElement {
  @api title;
  @api email;
  @api label;

  /* api: url */

  _url;

  @api
  get url() {
    return this._url;
  }

  set url(value) {
    this._url = value;
    this.computeMailtoUrl();
  }

  /* wire: template */

  _template;
  _error;

  @wire(getTemplateByDevName, { developerName: "$email" }) getTemplate({
    error,
    data
  }) {
    if (data) {
      this._error = null;
      this._template = data;
    } else {
      this._error = error;
      this._template = null;
    }

    this.computeMailtoUrl();
  }

  /* track: mailToUrl */

  @track _mailtoUrl;

  /* methods */

  computeMailtoUrl() {
    if (this._template && this._url) {
      const subject = encodeURIComponent(this._template.subject);
      const body = encodeURIComponent(this._template.body);
      const url = encodeURIComponent(this._url);

      this._mailtoUrl = `mailto:?subject=${subject}&body=${body}%0D%0A%20%0D%0A${url}`;
    } else {
      this._mailtoUrl = null;
    }
  }

  /* event management */

  handleClick() {
    this.dispatchEvent(
      new CustomEvent("openShareWindow", {
        detail: {
          action: "share",
          text: "Email",
          label: this.label
        }
      })
    );
  }
}
