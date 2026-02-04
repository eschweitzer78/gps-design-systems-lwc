/**
 * Global nsObject for storing namespace prefixes.
 */
export let nsObject = {
  namespaceDotNotation: undefined,
  namespacePrefix: undefined
};

export let isInsidePckg = false;

/**
 * This registers a specific namespace key to the global nsObject.
 * @param {string} nsPrefix
 */
export const registerNs = (nsPrefix) => {
  if (nsPrefix) {
    nsObject = {
      namespaceDotNotation:
        nsPrefix.length > 0 ? nsPrefix.slice(0, -2) + "." : "",
      namespacePrefix: nsPrefix
    };
  } else {
    nsObject = {
      namespaceDotNotation: "",
      namespacePrefix: ""
    };
  }
};

/**
 * This registers if code is inside package
 * @param {string} nsPrefix
 */
export const registerIsInsidePckg = (val) => {
  isInsidePckg = val === "true" || val === true;
};

/**
 * This send back the namespace prefix long version.
 * @return {string}
 */
export const getNameSpacePrefix = () => nsObject.namespacePrefix;

/**
 * This send back the namespace prefix with dot notation.
 * @return {string}
 */
export const getNamespaceDotNotation = () =>
  nsObject.namespaceDotNotation || "";
