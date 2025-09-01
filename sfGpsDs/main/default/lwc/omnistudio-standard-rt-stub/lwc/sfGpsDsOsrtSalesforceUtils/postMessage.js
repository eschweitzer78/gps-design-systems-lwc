/**
 * This is to workaround an issue with LWS where objects are coming from a red realm.
 *
 * To explain why does this make the trick:
 * There are APIs that are remapped to what we call system mode APIs, `Intl` is one of them,
 * meaning, all the details are going to be blue objects.
 * This API happens to have few methods that return normal objects, in this case blue objects...
 * what we do is to get a red obj (from your sandbox), and use Object.assign() to move the key/value pairs into the blue object.
 * @param {*} window
 * @param {*} data
 * @param {*} domain
 */
export function safePostMessage(window, data, domain) {
  window.postMessage(createSerializableObject(data), domain);
}

const RTF1 = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

function createSerializableObject(obj) {
  if (typeof obj !== "object" || obj === null || obj === undefined) {
    return obj;
  }
  if (Array.isArray(obj)) {
    const parts = RTF1.formatToParts(10, "seconds");
    parts.splice(0, 3); // this emptys the array.
    obj.forEach((k) => {
      parts.push(createSerializableObject(k));
    });
    return parts;
  }
  const o = new Intl.NumberFormat("en").resolvedOptions();
  Object.keys(o).forEach((k) => delete o[k]);
  const newObj = Object.assign(o, obj);
  Object.keys(obj).forEach((k) => {
    newObj[k] = createSerializableObject(obj[k]);
  });
  return newObj;
}
