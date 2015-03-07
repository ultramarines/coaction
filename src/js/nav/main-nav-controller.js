app.controller('MainNavCtrl',
  ['ajaxService', '$http', '$location', '$log', 'current', 'User', function(ajaxService, $http, $location, $log, current, User) {

    var self = this;

    self.current = current;

  }]);
