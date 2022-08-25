export const getSObjectValue = (object, field) => {
  return object[field.fieldApiName];
};
