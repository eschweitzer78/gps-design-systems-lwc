import entityMap from "./entitiesMapsEntities.js";
import legacyMap from "./entitiesMapsLegacy.js";
import xmlMap from "./entitiesMapsXml.js";
import decodeCodePoint from "./entitiesDecodeCodepoint";

const strictEntityRe = /&(?:[a-zA-Z0-9]+|#[xX][\da-fA-F]+|#\d+);/g;

export const decodeXML = getStrictDecoder(xmlMap);
export const decodeHTMLStrict = getStrictDecoder(entityMap);

//export type MapType = Record<string, string>;

function getStrictDecoder(map) {
  const replace = getReplacer(map);
  return (str) => String(str).replace(strictEntityRe, replace);
}

const sorter = (a, b) => (a < b ? 1 : -1);

export const decodeHTML = (function () {
  const legacy = Object.keys(legacyMap).sort(sorter);
  const keys = Object.keys(entityMap).sort(sorter);

  for (let i = 0, j = 0; i < keys.length; i++) {
    if (legacy[j] === keys[i]) {
      keys[i] += ";?";
      j++;
    } else {
      keys[i] += ";";
    }
  }

  const re = new RegExp(
    `&(?:${keys.join("|")}|#[xX][\\da-fA-F]+;?|#\\d+;?)`,
    "g"
  );
  const replace = getReplacer(entityMap);

  function replacer(str) {
    if (str.substr(-1) !== ";") {
      str += ";";
    }
    return replace(str);
  }

  // TODO consider creating a merged map
  return (str) => String(str).replace(re, replacer);
})();

function getReplacer(map) {
  return function replace(str) {
    if (str.charAt(1) === "#") {
      const secondChar = str.charAt(2);
      if (secondChar === "X" || secondChar === "x") {
        return decodeCodePoint(parseInt(str.substr(3), 16));
      }
      return decodeCodePoint(parseInt(str.substr(2), 10));
    }

    return map[str.slice(1, -1)] || str;
  };
}
