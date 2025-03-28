const RELATIVE_REG = new RegExp("^(?!(?:[a-z]+:)?//)", "i");

export function isRelativeUrl(url) {
  return _isTelOrEmailUrl(url) ? false : RELATIVE_REG.test(url);
}

export function isExternalUrl(url) {
  const tmp = document.createElement("a");
  tmp.href = url;

  return tmp.host !== new URL(document.URL).host;
}

export function isAnchorLink(url) {
  return typeof url === "string" && url.length > 0 && url[0] === "#";
}

export function getAnchorLinkName(str) {
  // Anchorlink should support any unicode characters.
  // But as anchorlink need to be used in URL, we strip out some special characters.
  // https://developers.google.com/maps/documentation/urls/url-encoding
  return str
    .toLowerCase()
    .replace(/(&\w+?;)/gim, " ")
    .replace(/[_.~"<>%|'!*();:@&=+$,/?%#[\]{}\n`^\\]/gim, "")
    .replace(/(^\s+)|(\s+$)/gim, "")
    .replace(/\s+/gm, "-");
}

function _isTelOrEmailUrl(url) {
  const types = ["tel:", "mailto:", "sms:"];

  for (let type of types) {
    if (url !== undefined && url !== null) {
      if (url.startsWith(type)) {
        return true;
      }
    }
  }

  return false;
}

export function decodeSpecialCharacters(html) {
  const map = {
    "&amp;": "&",
    "&gt;": ">",
    "&lt;": "<",
    "&apos;": "'",
    "&#039;": "'",
    "&quot;": '"',
    "&nbsp;": " "
  };
  let replaceableCodes = "(";
  let first = true;

  for (const code in map) {
    if (Object.hasOwn(map, code)) {
      replaceableCodes += first ? code : `|${code}`;
      first = false;
    }
  }

  replaceableCodes += ")";
  return html.replace(new RegExp(replaceableCodes, "gi"), (code) => {
    return map[code.toLowerCase()];
  });
}
