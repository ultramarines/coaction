app.factory('current', ['ajaxService', '$location', '$http', '$log', function(ajaxService, $location, $http, $log) {
  var self = this;
  self.user = {};

  ajaxService.call($http.get('/api/me'))
    .then(function(result) {
      self.user = result;
      console.log(result);
    });

  self.login = function(user) {
    $log.log(user);
    ajaxService.call($http.post('/api/login', user))
      .then(function(result) {
        self.user = result;
        $location.path('/lists');
      });
  };

  self.logout = function() {
    ajaxService.call($http.get('/api/logout'))
      .then(function(result) {
        $log.log(result);
        self.user = {};
        $location.path('/');
      });
  };

  self.signup = function(user) {
    $log.log(user);
    ajaxService.call($http.post('/api/register', user))
      .then(function(result) {
        self.user = result.user;
        $log.log(result);
        $location.path('/lists');
      });
  };

  return self;

  //TODO: make this a thing
}]);
