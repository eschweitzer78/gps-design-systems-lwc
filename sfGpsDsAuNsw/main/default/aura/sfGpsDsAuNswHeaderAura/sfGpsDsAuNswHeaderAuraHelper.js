({
  getUser: function (component) {
    var getUser = component.get("c.getUser");
    getUser.setCallback(this, function (response) {
      var state = response.getState();

      switch (state) {
        case "SUCCESS":
          var user = response.getReturnValue();

          component.set("v.isGuest", user.isGuest);
          component.set("v.userAlias", user.userAlias);
          component.set("v.cBasePath", "/" + user.cBasePath + "/s");
          break;

        case "INCOMPLETE":
          break;

        case "ERROR":
          var errors = response.getError();

          if (errors) {
            if (errors[0] && errors[0].message) {
              // TODO better error handling
              component.set("v.error", errors[0].message);
            }
          } else {
            component.set("v.error", "Unknown error");
          }

          break;

        default:
      }
    });

    $A.enqueueAction(getUser);
  },
  computeClassName: function (component) {
    var profile = component.get("v.profileIpName");
    var className = component.get("v.className");
    var computedClassNameArray = [];

    computedClassNameArray.push("nsw-header");
    if (profile) computedClassNameArray.push("nsw-header__has-profile");
    if (className) computedClassNameArray.push(className);

    component.set("v.computedClassName", computedClassNameArray.join(" "));
  },
  setSearchVisible: function (component, visible) {
    component.set("v.searchIsOpen", visible);
  }
});
