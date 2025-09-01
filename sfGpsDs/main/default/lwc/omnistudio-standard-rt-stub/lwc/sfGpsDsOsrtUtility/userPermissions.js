import { getCustomPermissionsForUser } from "c/sfGpsDsOsrtSalesforceUtils";

export default function getUserPermissions() {
  return new Promise(function (resolve, reject) {
    getCustomPermissionsForUser().then(
      function (data) {
        let uspr = [];
        // eslint-disable-next-line array-callback-return
        data.map(function (item) {
          uspr.push(item.DeveloperName);
        });
        resolve(uspr);
      },
      function (error) {
        reject(error);
      }
    );
  });
}
