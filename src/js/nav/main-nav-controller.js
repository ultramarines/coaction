app.controller('MainNavCtrl',
  ['$log', 'current', '$location', function($log, current, $location) {

    var self = this;

    self.current = current;

  }]);
