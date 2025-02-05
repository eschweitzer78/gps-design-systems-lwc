/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
({
  setColors: function (component, event, helper) {
    var rootEl = document.documentElement;

    rootEl.style.setProperty(
      "--sf-gps-ds-au-vic-color-primary",
      component.get("v.primaryColor")
    );
    rootEl.style.setProperty(
      "--sf-gps-ds-au-vic-color-dark-primary",
      component.get("v.darkPrimaryColor")
    );
    rootEl.style.setProperty(
      "--sf-gps-ds-au-vic-color-secondary",
      component.get("v.secondaryColor")
    );
  }
});
