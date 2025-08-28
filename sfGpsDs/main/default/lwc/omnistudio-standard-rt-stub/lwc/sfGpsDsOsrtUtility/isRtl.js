/**
 * RTL support for Arabic,Aramaic,Dhivehi/Maldivian,Hebrew,Kurdish (Sorani),Persian/Farsi,Urdu Languages
 */

function isRtl() {
  let userLang = navigator.language || navigator.userLanguage;
  let langArr = ["ar", "he", "ku", "fa", "ur", "dv"];
  return langArr.some((lang) => userLang === lang) ? "rtl" : "ltr";
}

export default isRtl;
