app.factory('current', ['ajaxService', '$http', '$log', function(ajaxService, $http, $log) {
  var self = this;
  self.user = {};

  self.login = function(login) {
    self.user.username = login.username;
    return true;
  };

  self.logout = function() {
    self.user = {};
    return false;
  };

  return self;

  //TODO: make this a thing
}]);
