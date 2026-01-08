import { globalObj } from "./core-global";
import { OPT_OUT_MODE } from './utils-constants';

/**
 * Keep track of categories enabled by default (useful when mode==OPT_OUT_MODE)
 */
export const retrieveEnabledCategoriesAndServices = () => {
  const state = globalObj._state;

  for (const categoryName of state._allCategoryNames) {
    const category = state._allDefinedCategories[categoryName];

    if (category.readOnly || category.enabled) {
      state._defaultEnabledCategories.push(categoryName);
      const services = state._allDefinedServices[categoryName] || {};

      for (let serviceName in services) {
        state._enabledServices[categoryName].push(serviceName);
        if (state._userConfig.mode === OPT_OUT_MODE) {
          state._acceptedServices[categoryName].push(serviceName);
        }
      }
    }
  }
};