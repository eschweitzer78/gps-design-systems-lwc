const isSessionStorageSupported = () => {
  if (typeof sessionStorage !== "undefined") {
    return true;
  }
  return false;
};

export default isSessionStorageSupported;
