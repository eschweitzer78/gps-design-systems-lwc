import entityMap from "./entitiesMapsEntities";
import legacyMap from "./entitiesMapsLegacy";
import xmlMap from "./entitiesMapsXml";
import decodeCodePoint from "./entitiesDecodeCodepoint";

interface EntitiesMap {
  [key: string]: string
}

const strictEntityRe = /&(?:[a-zA-Z0-9]+|#[xX][\da-fA-F]+|#\d+);/g;

export const decodeXML = getStrictDecoder(xmlMap);
export const decodeHTMLStrict = getStrictDecoder(entityMap);

function getStrictDecoder(map: EntitiesMap) {
  const replace = getReplacer(map);
  return (str: string) => String(str).replace(strictEntityRe, replace);
}

const sorter = (a: any, b: any): number => (a < b ? 1 : -1);

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

  function replacer(str: string) {
    if (str.substr(-1) !== ";") {
      str += ";";
    }
    return replace(str);
  }

  // TODO consider creating a merged map
  return (str: string): string => String(str).replace(re, replacer);
})();

function getReplacer(map: EntitiesMap) {
  return function replace(str: string) {
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
