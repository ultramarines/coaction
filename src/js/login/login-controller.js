app.config(['$routeProvider', function($routeProvider){
  var routeDefinition = {
    templateUrl: 'static/js/login/login.html',
    controller: 'LoginCtrl',
    controllerAs: 'vm',
  };

  $routeProvider.when('/', routeDefinition);

}]).controller('LoginCtrl', ['$log', '$location', 'current', 'User', function($log, $location, current, User) {
  var self = this;
  self.newLogin = User();
  self.newSignup = User();
  self.current = current;

  self.userView = 'login';

  self.toggleView = function() {
    if(self.userView === 'login') {
      self.userView = 'signup';
    } else {
      self.userView = 'login';
    }
  }

  self.login = function() {
    $log.log(self.newLogin);
    self.current.login(self.newLogin);
    self.newLogin = User();
  };

  self.signup = function() {
    self.current.signup(self.newSignup);
    self.newSignup = User();
  };
}]);
