app.factory('Login', function() {
  return function (spec) {
    spec = spec || {};
    return {
      email: spec.email,
      password: spec.password
    };
  };
});
