import { getUserProfile } from "c/sfGpsDsOsrtSalesforceUtils";

let userProfilePromise;
function getUserProfileFn() {
  if (userProfilePromise) {
    return userProfilePromise;
  }
  userProfilePromise = new Promise((resolve) => {
    getUserProfile().then((data) => {
      resolve(data);
    });
  });
  return userProfilePromise;
}

export default getUserProfileFn;
