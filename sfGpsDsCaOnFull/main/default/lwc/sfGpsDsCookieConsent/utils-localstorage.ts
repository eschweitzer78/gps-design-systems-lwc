
import { safeRun } from "./utils-general";

export const localStorageManager = {
  _setItem: (key: string, value: string) => {
    safeRun(() => localStorage.setItem(key, value));
  },
  _getItem: (key: string) => safeRun(() => localStorage.getItem(key)) || '',
  _removeItem: (key: string) => safeRun(() => localStorage.removeItem(key))
};
