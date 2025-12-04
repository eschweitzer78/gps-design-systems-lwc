function decodeParameters(url) {
  return url
    .split("&")
    .map((t1) => {
      const [e, r] = t1.split("=");
      return {
        [e]: decodeURI(r)
      };
    })
    .reduce((t2, e) => Object.assign(t2, e));
}

export function getStartUrlFromCurrentUrl() {
  try {
    return (
      decodeParameters(window.location.search.substring(1).replace(/\+/g, " "))
        .startURL || ""
    );
    // eslint-disable-next-line no-unused-vars
  } catch (t) {
    return "";
  }
}

export function getDecodedStartUrlFromCurrentUrl() {
  const startUrl = getStartUrlFromCurrentUrl();

  if (startUrl && !startUrl.startsWith("/")) {
    try {
      return decodeURIComponent(startUrl);
      // eslint-disable-next-line no-unused-vars, no-empty
    } catch (e) {}
  }
  return startUrl || "";
}

export function getExpIdFromCurrentUrl() {
  return (
    decodeParameters(window.location.search.substring(1).replace(/\+/g, " "))
      .expid || ""
  );
}

export function appendStartUrlToTargetUrl(targetUrl, startUrl) {
  if (targetUrl && startUrl) {
    targetUrl = targetUrl.includes("?")
      ? targetUrl + "&startURL=" + startUrl
      : targetUrl + "?startURL=" + startUrl;
  }

  return targetUrl;
}
