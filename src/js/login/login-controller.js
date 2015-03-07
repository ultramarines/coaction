app.config(['$routeProvider', function($routeProvider){
  var routeDefinition = {
    templateUrl: 'static/js/login/login.html',
    controller: 'LoginCtrl',
    controllerAs: 'vm',
  };

  $routeProvider.when('/', routeDefinition);

}]).controller('LoginCtrl', ['ajaxService', '$log', '$http', 'current', 'Login', 'Signup', function(ajaxService, $log, $http, current, Login, Signup) {
  var self = this;
  self.login = Login();
  self.signup = Signup();


}]);
