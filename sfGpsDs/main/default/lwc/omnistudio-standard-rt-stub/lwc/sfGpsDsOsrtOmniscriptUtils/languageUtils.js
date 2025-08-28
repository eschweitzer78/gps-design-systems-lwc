/**
 * This function will need to be updated whenever the corresponding PlatformApplicationUtilities.isRTL is also updated
 * @param language contains the language code to be checked
 */
export function isRTL(language) {
  // iw is the old hebrew code from ISO 639 (used in Apex)
  // he is the new hebrew code from ISO 639-1 (used in LWC)
  return (
    language === "iw" ||
    language === "he" ||
    language === "ar" ||
    language === "ur"
  );
}
