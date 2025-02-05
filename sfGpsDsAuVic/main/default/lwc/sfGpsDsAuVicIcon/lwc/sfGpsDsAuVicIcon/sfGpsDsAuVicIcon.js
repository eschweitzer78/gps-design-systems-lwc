import { api, track } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

import iconAccessible from "./icons/accessible";
import iconAddition from "./icons/addition";
import iconAi from "./icons/ai";
import iconAlertFire from "./icons/alert_fire";
import iconAlertFlood from "./icons/alert_flood";
import iconAertHighTemperature from "./icons/alert_high_temperature";
import iconAlertInformation from "./icons/alert_information";
import iconAlertLightning from "./icons/alert_lightning";
import iconAlertMedical from "./icons/alert_medical";
import iconAlertSmoke from "./icons/alert_smoke";
import iconAlertTransport from "./icons/alert_transport";
import iconArrowDownPrimary from "./icons/arrow_down_primary";
import iconArrowDownTertiary from "./icons/arrow_down_tertiary";
import iconArrowLeftPrimary from "./icons/arrow_left_primary";
import iconArrowLeftSecondary from "./icons/arrow_left_secondary";
import iconArrowRightPrimaryS from "./icons/arrow_right_primary_s";
import iconArrowRightPrimary from "./icons/arrow_right_primary";
import iconArrowRightSecondary from "./icons/arrow_right_secondary";
import iconArrowUpPrimary from "./icons/arrow_up_primary";
import iconAttach from "./icons/attach";
import iconBlankSolid from "./icons/blank_solid";
import iconBrowser from "./icons/browser";
import iconCalendar from "./icons/calendar";
import iconChildFriendly from "./icons/child_friendly";
import iconClose from "./icons/close";
import iconCrossCircle from "./icons/cross_circle";
import iconCsv from "./icons/csv";
import iconDoc from "./icons/doc";
import iconDocumentTransparent from "./icons/document_transparent";
import iconDocument from "./icons/document";
import iconDocx from "./icons/docx";
import iconDollarNegative from "./icons/dollar_negative";
import iconDot from "./icons/dot";
import iconDotm from "./icons/dotm";
import iconDotx from "./icons/dotx";
import iconDown from "./icons/down";
import iconDownload from "./icons/download";
import iconEmailSolid from "./icons/email_solid";
import iconEmailTransparent from "./icons/email_transparent";
import iconEnlargeScreen from "./icons/enlarge_screen";
import iconEps from "./icons/eps";
import iconExternalLink from "./icons/external_link";
import iconFacebook from "./icons/facebook";
import iconFree from "./icons/free";
import iconFullscreen from "./icons/fullscreen";
import iconHamburger from "./icons/hamburger";
import iconHelp from "./icons/help";
import iconHome from "./icons/home";
import iconIcs from "./icons/ics";
import iconIndd from "./icons/indd";
import iconInstragram from "./icons/instagram";
import iconLeft from "./icons/left";
import iconLink65 from "./icons/link_65";
import iconLink90 from "./icons/link_90";
import iconLink from "./icons/link";
import iconLinkedIn from "./icons/linkedin";
import iconListIndent from "./icons/list_indent";
import iconList from "./icons/list";
import iconLoadingStar from "./icons/loading_star";
import iconLock from "./icons/lock";
import iconMapMarker from "./icons/map-marker";
import iconMenuHome from "./icons/menu-home";
import iconMicropohone from "./icons/microphone";
import iconPause from "./icons/pause";
import iconPdf from "./icons/pdf";
import iconPhoneNumber from "./icons/phone-number";
import iconPlay from "./icons/play";
import iconPpt from "./icons/ppt";
import iconPptx from "./icons/pptx";
import iconPrint from "./icons/print";
import iconRight from "./icons/right";
import iconSearch from "./icons/search";
import iconSenior from "./icons/senior";
import iconShareAlternative from "./icons/share_alternative";
import iconShare from "./icons/share";
import iconSpotify from "./icons/spotify";
import iconStar from "./icons/star";
import iconStop from "./icons/stop";
import iconSuccess from "./icons/success";
import iconTable from "./icons/table";
import iconTick from "./icons/tick";
import iconTif from "./icons/tif";
import iconTrash from "./icons/trash";
import iconTwitter from "./icons/twitter";
import iconTxt from "./icons/txt";
import iconUp from "./icons/up";
import iconUpload from "./icons/upload";
import iconUser from "./icons/user";
import iconView from "./icons/view";
import iconWebinar from "./icons/webinar";
import iconWechat from "./icons/wechat";
import iconWhatsapp from "./icons/whatsapp";
import iconXls from "./icons/xls";
import iconXlsm from "./icons/xlsm";
import iconXlsx from "./icons/xlsx";
import iconYoutubeChannel from "./icons/youtube_channel";
import iconZip from "./icons/zip";
import iconZoomIn from "./icons/zoom_in";
import iconZoomOut from "./icons/zoom_out";

const iconProperties = [
  iconAccessible,
  iconAddition,
  iconAi,
  iconAlertFire,
  iconAlertFlood,
  iconAertHighTemperature,
  iconAlertInformation,
  iconAlertLightning,
  iconAlertMedical,
  iconAlertSmoke,
  iconAlertTransport,
  iconArrowDownPrimary,
  iconArrowDownTertiary,
  iconArrowLeftPrimary,
  iconArrowLeftSecondary,
  iconArrowRightPrimaryS,
  iconArrowRightPrimary,
  iconArrowRightSecondary,
  iconArrowUpPrimary,
  iconAttach,
  iconBlankSolid,
  iconBrowser,
  iconCalendar,
  iconChildFriendly,
  iconClose,
  iconCrossCircle,
  iconCsv,
  iconDoc,
  iconDocumentTransparent,
  iconDocument,
  iconDocx,
  iconDollarNegative,
  iconDot,
  iconDotm,
  iconDotx,
  iconDown,
  iconDownload,
  iconEmailSolid,
  iconEmailTransparent,
  iconEnlargeScreen,
  iconEps,
  iconExternalLink,
  iconFacebook,
  iconFree,
  iconFullscreen,
  iconHamburger,
  iconHelp,
  iconHome,
  iconIcs,
  iconIndd,
  iconInstragram,
  iconLeft,
  iconLink65,
  iconLink90,
  iconLink,
  iconLinkedIn,
  iconListIndent,
  iconList,
  iconLoadingStar,
  iconLock,
  iconMapMarker,
  iconMenuHome,
  iconMicropohone,
  iconPause,
  iconPdf,
  iconPhoneNumber,
  iconPlay,
  iconPpt,
  iconPptx,
  iconPrint,
  iconRight,
  iconSearch,
  iconSenior,
  iconShareAlternative,
  iconShare,
  iconSpotify,
  iconStar,
  iconStop,
  iconSuccess,
  iconTable,
  iconTick,
  iconTif,
  iconTrash,
  iconTwitter,
  iconTxt,
  iconUp,
  iconUpload,
  iconUser,
  iconView,
  iconWebinar,
  iconWechat,
  iconWhatsapp,
  iconXls,
  iconXlsm,
  iconXlsx,
  iconYoutubeChannel,
  iconZip,
  iconZoomIn,
  iconZoomOut
].reduce((map, obj) => {
  let key = Object.keys(obj)[0];
  let value = obj[key];
  map[key] = {
    height: value.height,
    width: value.width,
    paths: value.paths
      ? value.paths.map((element, index) => ({
          key: `path-${index}`,
          value: element
        }))
      : [],
    polygons: value.polygons
      ? value.polygons.map((element, index) => ({
          key: `polygon-${index}`,
          value: element
        }))
      : []
  };
  return map;
}, {});

const sizes = {
  s: 0.5,
  m: 1,
  l: 1.5,
  xl: 2,
  xxl: 2.5
};

export default class extends SfGpsDsLwc {
  static renderMode = "light";

  _symbol;

  @api set symbol(value) {
    this._symbol = value;
    this.legacyIcon =
      value && iconProperties[`${this.iconPrefix + value}`] !== undefined;
  }

  get symbol() {
    return this._symbol;
  }

  /**
   * Colour of the icon defined in in Global/Colors e.g. primary, secondary, dark_neutral.
   * @values primary, secondary, dark_neutral, etc
   * String
   */
  @api color;

  /**
   * Icon size [s, m, l, xl, xxl].
   * @values s, m, l, xl, xxl
   * String
   */

  @api size;

  @track legacyIcon;

  get isIcon() {
    return this.icon || this.legacyIcon;
  }

  get computedHref() {
    return "#" + this.iconPrefix + this.symbol;
  }

  get iconPrefix() {
    return "rpl_icon_";
  }

  get iconClassName() {
    if (!this.icon && !this.legacyIcon) {
      return "";
    }

    let rtn = `rpl-icon rpl-icon--${this.symbol}`;
    return this.color ? `${rtn} rpl-icon--color_${this.color}` : rtn;
  }

  get iconStyle() {
    let icon = this.icon;

    if (!icon && !this.legacyIcon) {
      return "";
    }

    let width = icon && icon.width ? icon.width : null;
    let height = icon && icon.height ? icon.height : null;

    if (this.legacyIcon) {
      let legacyIcon = iconProperties[`${this.iconPrefix + this.symbol}`];
      width = legacyIcon?.width;
      height = legacyIcon?.height;
    }

    let size =
      sizes[this.size] === undefined ? parseFloat(this.size) : sizes[this.size];
    size = isNaN(size) ? 1 : size;

    return `width: ${width * size}px; height: ${height * size}px`;
  }

  get icon() {
    return !this.symbol ? null : iconProperties[this.symbol];
  }

  get computedAriaHidden() {
    return (!this.icon && !this.legacyIcon) || this.symbol !== "external_link";
  }

  get computedTitle() {
    if (!this.icon && !this.legacyIcon) {
      return "";
    }

    return this.symbol === "external_link" ? "External Link" : "";
  }

  get computedBox() {
    if (!this.icon || !this.icon.width || !this.icon.height) {
      return null;
    }

    return `0 0 ${this.icon.width} ${this.icon.height}`;
  }
}
