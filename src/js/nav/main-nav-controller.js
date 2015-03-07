app.controller('MainNavCtrl',
  ['ajaxService', '$http', '$location', '$log', 'current', 'Login', function(ajaxService, $http, $location, $log, current, Login) {

    var self = this;

    self.login = Login();

    self.showLoginForm = false;

    self.showUserMenu = false;

    self.hasUser = false;

    self.currentUser = current.user;

    self.userLogin = function(login) {
      if (login.username && login.password) {
        self.hasUser = current.login(self.login);
        self.currentUser = current.user;
        self.showLoginForm = false;
        self.login = Login();
      } else {
        alert('you need to enter a username and password, dummy');
      }
    };

    self.toggleLoginForm = function() {
      self.showLoginForm = !self.showLoginForm;
    };

    self.toggleUserMenu = function() {
      self.showUserMenu = !self.showUserMenu;
    };

    self.logout = function() {
      self.hasUser = current.logout();
      self.currentUser = current.user;
      self.showUserMenu = false;
    };

    //TODO: create login dropdown
    //TODO: create current.user dropdown

  }]);
