({
  handleOpenMenu: function (component) {
    component.set("v.menuActive", true);
  },
  handleCloseMenu: function (component) {
    component.set("v.menuActive", false);
  },
  handleSearch: function (component, event) {
    var queryTerm = event.getSource().get("v.value");

    // Navigate to search page using lightning/navigation API:
    // https://developer.salesforce.com/docs/component-library/bundle/lightning:navigation/documentation

    var navService = component.find("navService");

    navService.navigate({
      type: "standard__search",
      state: {
        term: queryTerm
      }
    });
  },
  handleHome: function (component) {
    var navService = component.find("navService");

    navService.navigate({
      // Pass in pageReference
      type: "standard__namedPage",
      attributes: {
        pageName: "home"
      }
    });
  },
  handleLogin: function (component) {
    var navService = component.find("navService");

    navService.navigate({
      type: "comm__loginPage",
      attributes: {
        actionName: "login"
      }
    });
  }
});
