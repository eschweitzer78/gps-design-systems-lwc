function makeUrl() {
  let types, queryStringObj, queryString;
  types = {
    "/native/bridge.app": "hybrid",
    "/one/one.app": "web"
  };
  queryStringObj = {
    isdtp: "p1",
    sfdcIFrameOrigin: getOrigin(),
    sfdcIFrameHost:
      "sfNativeBridge" in window
        ? "hybrid"
        : types[window.location.pathname.toLowerCase()] || "web"
  };
  // eslint-disable-next-line no-shadow
  queryString = Object.keys(queryStringObj).reduce(function (queryString, key) {
    return (
      queryString +
      (queryString.length > 1 ? "&" : "") +
      encodeURIComponent(key) +
      "=" +
      encodeURIComponent(queryStringObj[key])
    );
  }, "");

  return queryString;
}

function getOrigin() {
  return "origin" in window.location
    ? window.location.origin
    : [
        window.location.protocol,
        "//",
        window.location.hostname,
        window.location.port ? ":" + window.location.port : ""
      ].join("");
}

export default makeUrl;
