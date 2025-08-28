import { LOCALE, CURRENCY } from "c/sfGpsDsOsrtSalesforceUtils";
import formatNumber from "./formatNumber";

function formatCurrency(number, options) {
  let locale = options && options.anlocale ? options.anlocale : LOCALE;
  let currency = options && options.money ? options.money : CURRENCY;
  return formatNumber(number, locale, {
    style: "currency",
    currency: currency
  });
}

export default formatCurrency;
