/*
 * Copyright (c) 2022-2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, track } from "lwc";
import SfGpsDsFormTypeaheadOsN from "c/sfGpsDsFormTypeaheadOsN";
import { debounce } from "omnistudio/utility";
import { isArray } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuNswSFormAddressTypeaheadOsN.html";

const STATUS_TYPING = "typing";
const STATUS_SELECTED = "selected";
const STATUS_RESOLVED = "resolved";
const MODE_SMART = "smart";
const MODE_MANUAL = "manual";
const DEFAULT_STATE = "NSW";
const DEFAULT_COUNTRY = "AUSTRALIA";

const DEFAULT_MANUAL_ENTRY_COUNTRIES_OBJ = {
  AUSTRALIA: "Australia",
  AFGHANISTAN: "Afghanistan",
  ALBANIA: "Albania",
  ALGERIA: "Algeria",
  "AMERICAN SAMOA": "American Samoa",
  ANDORRA: "Andorra",
  ANGOLA: "Angola",
  ANGUILLA: "Anguilla",
  "ANTIGUA AND BARBUDA": "Antigua and Barbuda",
  ARGENTINA: "Argentina",
  ARMENIA: "Armenia",
  ARUBA: "Aruba",
  AUSTRIA: "Austria",
  AZERBAIJAN: "Azerbaijan",
  BAHAMAS: "Bahamas",
  BAHRAIN: "Bahrain",
  BANGLADESH: "Bangladesh",
  BARBADOS: "Barbados",
  BELARUS: "Belarus",
  BELGIUM: "Belgium",
  BELIZE: "Belize",
  BENIN: "Benin",
  BERMUDA: "Bermuda",
  BHUTAN: "Bhutan",
  BOLIVIA: "Bolivia",
  "BONAIRE, SAINT EUSTATIUS AND SABA": "Bonaire, Saint Eustatius and Saba",
  "BOSNIA AND HERZEGOVINA": "Bosnia and Herzegovina",
  BOTSWANA: "Botswana",
  BRAZIL: "Brazil",
  "BRUNEI DARUSSALAM": "Brunei Darussalam",
  BULGARIA: "Bulgaria",
  "BURKINA FASO": "Burkina Faso",
  BURUNDI: "Burundi",
  CAMBODIA: "Cambodia",
  CAMEROON: "Cameroon",
  CANADA: "Canada",
  "CAPE VERDE": "Cape Verde",
  "CAYMAN ISLANDS": "Cayman Islands",
  "CENTRAL AFRICAN REPUBLIC": "Central African Republic",
  CHAD: "Chad",
  CHILE: "Chile",
  CHINA: "China",
  COLOMBIA: "Colombia",
  COMOROS: "Comoros",
  CONGO: "Congo",
  "CONGO, DEMOCRATIC REPUBLIC OF THE": "Congo, Democratic Republic of the",
  "COOK ISLANDS": "Cook Islands",
  "COSTA RICA": "Costa Rica",
  CROATIA: "Croatia",
  CUBA: "Cuba",
  CURACAO: "Curacao",
  CYPRUS: "Cyprus",
  "CZECH REPUBLIC": "Czech Republic",
  "DEMOCRATIC REPUBLIC OF TIMOR-LESTE": "Democratic Republic of Timor-Leste",
  DENMARK: "Denmark",
  "DIEGO GARCIA": "Diego Garcia",
  DJIBOUTI: "Djibouti",
  DOMINICA: "Dominica",
  "DOMINICAN REPUBLIC": "Dominican Republic",
  ECUADOR: "Ecuador",
  EGYPT: "Egypt",
  "EL SALVADOR": "El Salvador",
  "EQUATORIAL GUINEA": "Equatorial Guinea",
  ERITREA: "Eritrea",
  ESTONIA: "Estonia",
  ETHIOPIA: "Ethiopia",
  "FALKLAND ISLANDS": "Falkland Islands",
  "FAROE ISLANDS": "Faroe Islands",
  FIJI: "Fiji",
  FINLAND: "Finland",
  FRANCE: "France",
  "FRENCH GUIANA": "French Guiana",
  "FRENCH POLYNESIA": "French Polynesia",
  "GABONESE REPUBLIC": "Gabonese Republic",
  GAMBIA: "Gambia",
  GEORGIA: "Georgia",
  GERMANY: "Germany",
  GHANA: "Ghana",
  GIBRALTAR: "Gibraltar",
  GREECE: "Greece",
  GREENLAND: "Greenland",
  GRENADA: "Grenada",
  GUADELOUPE: "Guadeloupe",
  GUAM: "Guam",
  GUATEMALA: "Guatemala",
  GUINEA: "Guinea",
  "GUINEA-BISSAU": "Guinea-Bissau",
  GUYANA: "Guyana",
  HAITI: "Haiti",
  HONDURAS: "Honduras",
  "HONG KONG, CHINA": "Hong Kong, China",
  HUNGARY: "Hungary",
  ICELAND: "Iceland",
  INDIA: "India",
  INDONESIA: "Indonesia",
  IRAN: "Iran",
  IRAQ: "Iraq",
  IRELAND: "Ireland",
  ISRAEL: "Israel",
  ITALY: "Italy",
  "IVORY COAST": "Ivory Coast",
  JAMAICA: "Jamaica",
  JAPAN: "Japan",
  JORDAN: "Jordan",
  KAZAKHSTAN: "Kazakhstan",
  KENYA: "Kenya",
  KIRIBATI: "Kiribati",
  "KOREA (NORTH)": "Korea (North)",
  "KOREA (SOUTH)": "Korea (South)",
  KOSOVO: "Kosovo",
  KUWAIT: "Kuwait",
  KYRGYZSTAN: "Kyrgyzstan",
  "LAO PEOPLE'S DEMOCRATIC REPUBLIC": "Lao People's Democratic Republic",
  LATVIA: "Latvia",
  LEBANON: "Lebanon",
  LESOTHO: "Lesotho",
  LIBERIA: "Liberia",
  LIBYA: "Libya",
  LIECHTENSTEIN: "Liechtenstein",
  LITHUANIA: "Lithuania",
  LUXEMBOURG: "Luxembourg",
  "MACAO, CHINA": "Macao, China",
  MACEDONIA: "Macedonia",
  MADAGASCAR: "Madagascar",
  MALAWI: "Malawi",
  MALAYSIA: "Malaysia",
  MALDIVES: "Maldives",
  MALI: "Mali",
  MALTA: "Malta",
  "MARSHALL ISLANDS": "Marshall Islands",
  MARTINIQUE: "Martinique",
  MAURITANIA: "Mauritania",
  MAURITIUS: "Mauritius",
  MEXICO: "Mexico",
  MICRONESIA: "Micronesia",
  MOLDOVA: "Moldova",
  MONACO: "Monaco",
  MONGOLIA: "Mongolia",
  MONTENEGRO: "Montenegro",
  MONTSERRAT: "Montserrat",
  MOROCCO: "Morocco",
  MOZAMBIQUE: "Mozambique",
  MYANMAR: "Myanmar",
  NAMIBIA: "Namibia",
  NAURU: "Nauru",
  NEPAL: "Nepal",
  NETHERLANDS: "Netherlands",
  "NEW CALEDONIA": "New Caledonia",
  "NEW ZEALAND": "New Zealand",
  NICARAGUA: "Nicaragua",
  NIGER: "Niger",
  NIGERIA: "Nigeria",
  NIUE: "Niue",
  "NORFOLK ISLAND": "Norfolk Island",
  "NORTHERN MARIANA ISLANDS": "Northern Mariana Islands",
  NORWAY: "Norway",
  OMAN: "Oman",
  PAKISTAN: "Pakistan",
  PALAU: "Palau",
  "PALESTINIAN AUTHORITY": "Palestinian Authority",
  PANAMA: "Panama",
  "PAPUA NEW GUINEA": "Papua New Guinea",
  PARAGUAY: "Paraguay",
  PERU: "Peru",
  PHILIPPINES: "Philippines",
  PITCAIRN: "Pitcairn",
  POLAND: "Poland",
  PORTUGAL: "Portugal",
  "PUERTO RICO": "Puerto Rico",
  QATAR: "Qatar",
  ROMANIA: "Romania",
  "RUSSIAN FEDERATION": "Russian Federation",
  RWANDA: "Rwanda",
  "SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA":
    "Saint Helena, Ascension and Tristan da Cunha",
  "SAINT KITTS AND NEVIS": "Saint Kitts and Nevis",
  "SAINT LUCIA": "Saint Lucia",
  "SAINT PIERRE AND MIQUELON": "Saint Pierre and Miquelon",
  "SAINT VINCENT AND THE GRENADINES": "Saint Vincent and the Grenadines",
  SAMOA: "Samoa",
  "SAN MARINO": "San Marino",
  "SAO TOME AND PRINCIPE": "Sao Tome and Principe",
  "SAUDI ARABIA": "Saudi Arabia",
  SENEGAL: "Senegal",
  SERBIA: "Serbia",
  SEYCHELLES: "Seychelles",
  "SIERRA LEONE": "Sierra Leone",
  SINGAPORE: "Singapore",
  "SINT MAARTEN": "Sint Maarten",
  "SLOVAK REPUBLIC": "Slovak Republic",
  SLOVENIA: "Slovenia",
  "SOLOMON ISLANDS": "Solomon Islands",
  SOMALIA: "Somalia",
  "SOUTH AFRICA": "South Africa",
  "SOUTH SUDAN": "South Sudan",
  SPAIN: "Spain",
  "SRI LANKA": "Sri Lanka",
  SUDAN: "Sudan",
  SURINAME: "Suriname",
  SWAZILAND: "Swaziland",
  SWEDEN: "Sweden",
  SWITZERLAND: "Switzerland",
  "SYRIAN ARAB REPUBLIC": "Syrian Arab Republic",
  "TAIWAN, REPUBLIC OF CHINA": "Taiwan, Republic of China",
  TAJIKISTAN: "Tajikistan",
  TANZANIA: "Tanzania",
  THAILAND: "Thailand",
  "TOGOLESE REPUBLIC": "Togolese Republic",
  TOKELAU: "Tokelau",
  TONGA: "Tonga",
  "TRINIDAD AND TOBAGO": "Trinidad and Tobago",
  TUNISIA: "Tunisia",
  TURKEY: "Turkey",
  TURKMENISTAN: "Turkmenistan",
  "TURKS AND CAICOS ISLANDS": "Turks and Caicos Islands",
  TUVALU: "Tuvalu",
  UGANDA: "Uganda",
  UKRAINE: "Ukraine",
  "UNITED ARAB EMIRATES": "United Arab Emirates",
  "UNITED KINGDOM": "United Kingdom",
  "UNITED STATES": "United States",
  URUGUAY: "Uruguay",
  UZBEKISTAN: "Uzbekistan",
  VANUATU: "Vanuatu",
  VATICAN: "Vatican",
  VENEZUELA: "Venezuela",
  VIETNAM: "Vietnam",
  "VIRGIN ISLANDS (BRITISH)": "Virgin Islands (British)",
  "VIRGIN ISLANDS (U.S)": "Virgin Islands (U.S)",
  "WALLIS AND FUTUNA": "Wallis and Futuna",
  "WESTERN SAHARA": "Western Sahara",
  YEMEN: "Yemen",
  ZAMBIA: "Zambia",
  ZIMBABWE: "Zimbabwe"
};

const DEFAULT_MANUAL_ENTRY_COUNTRIES = Object.keys(
  DEFAULT_MANUAL_ENTRY_COUNTRIES_OBJ
).map((key) => ({
  value: key,
  label: DEFAULT_MANUAL_ENTRY_COUNTRIES_OBJ[key]
}));

const DEFAULT_MANUAL_ENTRY_LABEL = "I can't find my address";
const DEFAULT_MANUAL_ENTRY_LABEL_OVERSEAS =
  "I can't find my address or I live overseas";
const DEFAULT_BACK_TO_LOOKUP_LABEL = "Switch back to address look up";
const DEFAULT_MANUAL_ENTRY_COUNTRIES_ENABLED = false;

export default class extends SfGpsDsFormTypeaheadOsN {
  @api street;
  @api suburb;
  @api state = DEFAULT_STATE;
  @api postcode;
  @api country = DEFAULT_COUNTRY;
  @api states = [
    { label: "ACT", value: "ACT" },
    { label: "NSW", value: "NSW" },
    { label: "NT", value: "NT" },
    { label: "QLD", value: "QLD" },
    { label: "SA", value: "SA" },
    { label: "TAS", value: "TAS" },
    { label: "VIC", value: "VIC" },
    { label: "WA", value: "WA" }
  ];

  @track isSmart = true;
  @track elementValueLabel;
  @track elementValueValue;
  @track elementValueStatus = STATUS_TYPING;

  // EVENT HANDLING

  handleToggle() {
    this.isSmart = !this.isSmart;

    this.dispatchOmniEventUtil(
      this,
      this.createAggregateNode(),
      "omniaggregate"
    );

    this.checkValidity();
  }

  handleFieldBlur(event) {
    switch (event.target.name) {
      case "street":
        if (this.street !== event.target.value) {
          // eslint-disable-next-line @lwc/lwc/no-api-reassignments
          this.street = event.target.value;
        }

        break;

      case "suburb":
        if (this.suburb !== event.target.value) {
          // eslint-disable-next-line @lwc/lwc/no-api-reassignments
          this.suburb = event.target.value;
        }

        break;

      case "state":
        if (this.state !== event.target.value) {
          // eslint-disable-next-line @lwc/lwc/no-api-reassignments
          this.state = event.target.value;
        }

        break;

      case "postcode":
        if (this.postcode !== event.target.value) {
          // eslint-disable-next-line @lwc/lwc/no-api-reassignments
          this.postcode = event.target.value;
        }

        break;

      case "country":
        if (this.country !== event.target.value) {
          // eslint-disable-next-line @lwc/lwc/no-api-reassignments
          this.country = event.target.value;
          // eslint-disable-next-line @lwc/lwc/no-api-reassignments
          this.state = this.computedIsDomestic ? DEFAULT_STATE : "";
        }

        break;

      default:
    }

    this.dispatchOmniEventUtil(
      this,
      this.createAggregateNode(),
      "omniaggregate"
    );

    this.checkValidity();
  }

  handleLookup() {
    if (this.isSmart) {
      super.handleLookup();
    }
  }

  // Render/Callbacks/Override

  render() {
    return tmpl;
  }

  performTypeahead(e, testValue = true) {
    this._didTypeahead = true;
    const t = e.value || null;
    this.elementValueLabel = t;

    if (!testValue || this.elementValue !== t) {
      this.setElementValue(this.getSmartValue(), false, false);

      this.dispatchOmniEventUtil(
        this,
        this.createAggregateNode(),
        "omniaggregate"
      );

      if (t === null) {
        this.options = [];
      } else {
        if (this._propSetMap.useDataJson) {
          this.getOptionsDataJson();
        } else {
          Promise.resolve().then(() => {
            this.getOptions(this._propSetMap.taAction);
          });
        }
      }

      this.dispatchOmniEventUtil(this, { item: "$Vlocity.nullify" }, "select");
    }
  }

  handleTypeahead(event) {
    if (this.isSmart) {
      this.elementValueStatus = STATUS_TYPING;

      if (!this.typeaheadFn) {
        this.typeaheadFn = debounce((e) => {
          this.performTypeahead(e);
        }, this._propSetMap.callFrequency);
      }

      this.typeaheadFn(event);

      // solve an issue with validation with the original widget
      // when entering text, not selecting an item and choosing next
      // which shows a validation error when it should not
      this.checkValidity();
    }
  }

  handleBlur(event) {
    this.elementValueLabel = event.target.value;
    let proxyEvent = {
      target: {
        value: this.elementValue
      }
    };

    super.handleBlur(proxyEvent);
  }

  handleSelect(event) {
    super.handleSelect({
      target: {
        value: this.getSmartValue({
          elementValueLabel: event.target.value,
          elementValueValue: event.detail.item,
          elementValueStatus: STATUS_SELECTED
        })
      },
      detail: event.detail
    });

    // for some reason this is otherwise not (never?) refreshed
    this.jsonDataStr = JSON.stringify(this._jsonData);

    this.hitEndPoint(this._propSetMap.taAction)
      .then((e) => this.handleResponse(e))
      .then((e) => this.dataProcessorHook(e))
      .then((e) => {
        this.applyCallResp(
          {
            ...this.elementValue,
            value: isArray(e) ? e[0] : e,
            status: STATUS_RESOLVED
          },
          true
        );

        this.checkValidity();
      })
      .catch((e) => this.handleError(e));
  }

  /* Override, we don't want all the fancy stuff */

  applyCallResp(json, bApi = false, bValidation = false) {
    if (bValidation) {
      this.setCustomValidation(json);
    } else {
      json = this.treatResp(json);

      if (
        json !== undefined &&
        !this.lodashUtil.isEqual(this.elementValue || {}, json)
      ) {
        this.setElementValue(json, bApi, bValidation);
        this.dispatchOmniEventUtil(
          this,
          this.createAggregateNode(),
          "omniaggregate"
        );
      }
    }
  }

  _didTypeahead = false;
  _didGetValue = false;

  connectedCallback() {
    this._didTypeahead = false;
    this._didGetValue = false;
    super.connectedCallback();

    if (this.elementValue) {
      this.ingest(this.elementValue);
    } else {
      this.isSmart = true;
      this.elementValueLabel = null;
      this.elementValueValue = {};
      this.elementValueStatus = STATUS_TYPING;
    }
  }

  ingest(v) {
    if (v && (typeof v === "string" || v instanceof String)) {
      this.isSmart = true;
      this.elementValueLabel = v;
      this.elementValueValue = {};
      this.elementValueStatus = STATUS_TYPING;
    } else if (v && typeof v === "object") {
      this.isSmart = v.mode ? v.mode === MODE_SMART : true;
      this.elementValueLabel = v.label;
      this.elementValueValue = { ...v.value };
      this.elementValueStatus = v.status ? v.status : STATUS_TYPING;

      if (!this.isSmart && this.elementValueValue.addressDetails) {
        // eslint-disable-next-line @lwc/lwc/no-api-reassignments
        this.street = this.elementValueValue.addressDetails.street;
        // eslint-disable-next-line @lwc/lwc/no-api-reassignments
        this.suburb = this.elementValueValue.addressDetails.suburb;
        // eslint-disable-next-line @lwc/lwc/no-api-reassignments
        this.state = this.elementValueValue.addressDetails.state;
        // eslint-disable-next-line @lwc/lwc/no-api-reassignments
        this.postcode = this.elementValueValue.addressDetails.postcode;
        // eslint-disable-next-line @lwc/lwc/no-api-reassignments
        this.country =
          this.elementValueValue.addressDetails.country || DEFAULT_COUNTRY;
      }
    } else {
      this.isSmart = true;
      this.elementValueLabel = "";
      this.elementValueValue = {};
      this.elementValueStatus = STATUS_TYPING;
    }
  }

  get elementValue() {
    return this.isSmart ? this.getSmartValue() : this.getManualValue();
  }

  set elementValue(v) {
    this._didGetValue = true;
    this.ingest(v);
  }

  getManualValue() {
    let fullAddress =
      (this.street ? this.street : "") +
      (this.street && (this.suburb || this.state || this.postcode) ? "," : "") +
      (this.street && this.suburb ? " " : "") +
      (this.suburb ? this.suburb : "") +
      ((this.street || this.suburb) && this.state ? " " : "") +
      (this.state ? this.state : "") +
      ((this.street || this.suburb || this.state) && this.postcode ? " " : "") +
      (this.postcode ? this.postcode : "");

    fullAddress = fullAddress ? fullAddress.toUpperCase() : null;

    return {
      value: {
        addressDetails: {
          street: this.street,
          suburb: this.suburb,
          state: this.state,
          postcode: this.postcode,
          country: this.country
        },
        address: fullAddress
      },
      mode: MODE_MANUAL,
      label: fullAddress
    };
  }

  getSmartValue(ev = null) {
    let value = {
      label: (ev ? ev : this).elementValueLabel,
      value: (ev ? ev : this).elementValueValue,
      status: (ev ? ev : this).elementValueStatus,
      mode: MODE_SMART
    };

    return value;
  }

  _ath_options;

  get options() {
    return this._ath_options;
  }
  set options(v) {
    this._ath_options = v;

    if (v && isArray(v)) {
      if (v.length === 1 && v[0].name) {
        // simulate selection after all asynchronous activities are done
        Promise.resolve().then(() => {
          this.handleSelect({
            target: { value: v[0].name },
            detail: v[0]
          });
        });
      }
    }
  }

  renderedCallback() {
    super.renderedCallback();

    if (!this._didTypeahead && this._didGetValue) {
      if (this.isSmart) {
        if (this.elementValueStatus === STATUS_TYPING) {
          this.performTypeahead({ value: this.elementValueLabel }, false);
        } else if (this.elementValueStatus === STATUS_SELECTED) {
          this._didTypeahead = true;
          this.handleSelect({
            target: { value: this.elementValueLabel },
            detail: { item: this.elementValueValue }
          });
        } else {
          this._didTypeahead = true;
        }
      }
    }
  }

  _manualChildInputs;

  get manualChildInputs() {
    if (!this._manualChildInputs) {
      this._manualChildInputs = this.template.querySelectorAll(".manual-field");
    }
    return this._manualChildInputs;
  }

  @api checkValidity() {
    try {
      if (this.isSmart) {
        let cv = true;

        if (
          this.elementValueStatus !== STATUS_RESOLVED &&
          this._propSetMap.required
        ) {
          cv = false;
          this.isValid = false;
        } else {
          cv = super.checkValidity();
        }

        return cv;
      }

      let validity = true;
      this.manualChildInputs.forEach((i) => {
        let v = i.checkValidity();
        validity = validity && v;
      });

      this.isValid = validity;
      return this.isValid;
      // eslint-disable-next-line no-unused-vars
    } catch (t) {
      return true;
    }
  }

  @api reportValidity() {
    try {
      if (this.isSmart) {
        let rv = super.reportValidity();

        if (
          this.elementValueStatus !== STATUS_RESOLVED &&
          this._propSetMap.required &&
          this.elementValueLabel
        ) {
          // There is a condition on this.elementValueLabel as we do not want to show an error message when
          // there is no text as the child input will do it.

          rv = false;
          this.isValid = false;
          this.errorMessage = this._messageWhenValueMissing;
        }

        return rv;
      }

      let validity = true;
      this.manualChildInputs.forEach((i) => {
        let v = i.reportValidity();
        validity = validity && v;
      });

      this.isValid = validity;
      return this.isValid;
      // eslint-disable-next-line no-unused-vars
    } catch (t) {
      return true;
    }
  }

  // STYLE EXPRESSIONS

  get computedLabelClassName() {
    return {
      form__required: this._propSetMap.required
    };
  }

  get computedTypeaheadClassName() {
    return {
      "sfgpsds-hide": !this.isSmart
    };
  }

  get computedManualClassName() {
    return {
      "sfgpsds-hide": this.isSmart
    };
  }

  get complete() {
    return this.isSmart ? this.elementValueStatus === STATUS_RESOLVED : false;
  }

  // LABELS

  get manualEntryCountriesEnabled() {
    return (
      !!this._propSetMap.manualEntryCountriesEnabled ||
      DEFAULT_MANUAL_ENTRY_COUNTRIES_ENABLED
    );
  }

  get manualEntryCountries() {
    return (
      this._propSetMap.manualEntryCountries || DEFAULT_MANUAL_ENTRY_COUNTRIES
    );
  }

  get backToLookUpLabel() {
    return this._propSetMap.backToLookUpLabel || DEFAULT_BACK_TO_LOOKUP_LABEL;
  }

  get manualEntryLabel() {
    return (
      this._propSetMap.manualEntryLabel ||
      (this.manualEntryCountriesEnabled
        ? DEFAULT_MANUAL_ENTRY_LABEL_OVERSEAS
        : DEFAULT_MANUAL_ENTRY_LABEL)
    );
  }

  get computedIsDomestic() {
    return this.country?.toUpperCase() === DEFAULT_COUNTRY.toUpperCase();
  }

  get computedSuburbLabel() {
    return this.computedIsDomestic ? "Suburb" : "City/town";
  }

  get computedPostcodeLabel() {
    return this.computedIsDomestic ? "Postcode" : "Postal/zip code";
  }
}
