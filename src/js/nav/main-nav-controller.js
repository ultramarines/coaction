app.controller('MainNavCtrl',
  ['ajaxService', '$http', '$location', '$log', 'current', 'Login', function(ajaxService, $http, $location, $log, current, Login) {

    var self = this;

    self.login = Login();

    self.showLoginForm = false;

    self.showUserMenu = false;

    self.hasUser = false;

    self.userLogin = function(login) {
      if (login.username && login.password) {
        self.hasUser = true;
        self.showLoginForm = false;
        self.login = Login();
      } else {
        alert('you need to enter a username and password, dummy');
      }
    }

    self.toggleLoginForm = function() {
      self.showLoginForm = !self.showLoginForm;
    }

    self.toggleUserMenu = function() {
      self.showUserMenu = !self.showUserMenu;
    }

    self.logout = function() {
      self.hasUser = false;
      self.showUserMenu = false;
    }

    //TODO: create login dropdown
    //TODO: create current.user dropdown

  }]);
