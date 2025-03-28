import { LightningElement, api, track } from "lwc";

const CLEAR_VALUE = "-- Clear --";

export default class extends LightningElement {
  @api label; // string
  @api description; // string
  @api required; // boolean
  @api schema; // JSON Schema
  @api errors; // PropertyError[] w/ PropertyError = { message }

  @track options;
  @track error;
  @track communityId;

  /* api: value */

  _value;

  @api
  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
  }

  /* event management */

  handleChange(event) {
    this._value = event.target.value;

    this.dispatchEvent(
      new CustomEvent("valuechange", {
        detail: {
          value: this.value === CLEAR_VALUE ? null : this.value
        }
      })
    );
  }

  /* lifecycle */

  connectedCallback() {
    /* this is a bit of a hack as there is no documented way for an editor to know which community it's editing for... */

    if (window.PicassoWebServices) {
      window.PicassoWebServices.CommNavigation.GetNavigationLinkSets(
        (data) => {
          if (data?.NavigationLinkSets) {
            let options = data.NavigationLinkSets.map((item) => ({
              label: item.name,
              value: item.developerName
            }));
            options.unshift({ label: "-- Clear --", value: CLEAR_VALUE });
            this.options = options;
            this.error = null;
          } else {
            this.options = [];
            this.error = "Cannot get navigation data.";
          }
        },
        (error) => {
          this.options = [];
          this.error = error;
        }
      );
    }
  }
}
