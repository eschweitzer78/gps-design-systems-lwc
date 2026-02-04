/**
 * Invoke Apex Method
 * @param {apexClass} method - Apex method that is to be invoked (needs to have @AuraEnabled)
 * @param {object} param - Parameters to be passed into the invoked apex class
 * @param example of param:
 */
export function invokeApexMethod(method, param) {
  return method(param);
}
