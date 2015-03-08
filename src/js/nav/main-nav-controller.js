app.controller('MainNavCtrl',
  ['$log', 'current', '$location', function($log, current, $location) {

    var self = this;

    self.current = current;

    self.location = $location.url();

    if( self.location === '/') {
      self.hideLogo = true;
    }
    console.log(self.hideLogo);

  }]);
