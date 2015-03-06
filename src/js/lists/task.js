app.factory('Task', function() {
  return function(spec) {
    spec = spec || {};
    return {
      title: spec.title,
      status: spec.status || false
    };
  };
});
