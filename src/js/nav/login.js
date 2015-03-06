app.factory('Login', function() {
  return function (spec) {
    spec = spec || {};

    return {
      username: spec.username,
      password: spec.password
    };
  };
});
