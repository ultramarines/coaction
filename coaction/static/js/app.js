// Declare our app module, and import the ngRoute and ngAnimate
// modules into it.
var app = angular.module('app', ['ngRoute']);

// Set up our 404 handler
app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.otherwise({
    controller: 'Error404Ctrl',
    controllerAs: 'vm',
    templateUrl: 'static/errors/404/error-404.html'
  });
}]);

app.factory('ajaxService', ['$log', function($log) {

  return {
    call: function(p) {
      return p.then(function (result) {
        return result.data;
      })
      .catch(function (error) {
        $log.log(error);
      });
    }
  };

}]);

app.factory('current', ['ajaxService', '$http', '$log', function(ajaxService, $http, $log) {
  var self = this;
  self.user = {};

  self.login = function(login) {
    self.user.username = login.username;
    return true;
  }

  self.logout = function() {
    self.user = {}
    return false;
  }

  return self;

  //TODO: make this a thing
}]);

app.controller('Error404Ctrl', ['$location', function ($location) {
  this.message = 'Could not find: ' + $location.url();
}]);

app.config(['$routeProvider', function($routeProvider){
  var routeDefinition = {
    templateUrl: 'static/js/lists/list.html',
    controller: 'ListCtrl',
    controllerAs: 'vm',
    resolve: {
      tasks: ['tasksService', function(tasksService) {
          return tasksService.list().then(function(result) {
            return result.tasks;
          }).catch(function(err) {
            $log.log(err);
            alert('tasks failed to load');
          });
      }]
    }
  };

  $routeProvider.when('/lists', routeDefinition);
  $routeProvider.when('/', routeDefinition);

}]).controller('ListCtrl', ['tasksService', 'tasks', 'Task', '$log', function(tasksService, tasks, Task, $log) {
  var self = this;
  self.tasks = tasks;
  self.newTask = Task();

  self.addTask = function() {
    tasksService.addTask(self.newTask).then(function(result) {
      var addedTask = result.task;
      self.tasks.push(addedTask);
      self.newTask = Task();
      $log.log(addedTask);
    }).catch(function (err) {
      $log.log(err);
      alert('addTask Failed :(');
    })
  };

  self.toggleTask = function(task) {
    //TODO: make taskService.toggleStatus() a thing, then make this a thing
    tasksService.toggleStatus(task);
  };

  self.deleteTask = function(task) {
    tasksService.deleteTask(task).then(function(result) {
      var deletedTask = result.task;
      $log.log(deletedTask);
      var index = self.tasks.indexOf(task);
      self.tasks.splice(index, 1);
    }).catch(function(err) {
      $log.log(err);
      alert('deletion failed');
    });
  };

}]);

app.factory('Task', function() {
  return function(spec) {
    spec = spec || {};
    return {
      title: spec.title,
      status: false,
      assignee: spec.assignee || '',
    };
  };
});

app.factory('Login', function() {
  return function (spec) {
    spec = spec || {};

    return {
      username: spec.username,
      password: spec.password
    };
  };
});

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

app.factory('tasksService', ['ajaxService', '$http', '$log', function(ajaxService, $http, $log) {

  return {

    addTask: function(task) {
      return ajaxService.call($http.post('/api/tasks', task));
    },
    list: function() {
      return ajaxService.call($http.get('api/tasks'));
    },
    deleteTask: function(task) {
      var url = '/api/tasks/' + task.id;
      return ajaxService.call($http.delete(url));
    },
    toggleTask: function(task) {
      //TODO: make this a thing
      // if (task.status === false) {
      //   task.status = true;
      // } else {
      //   task.status = false;
      // }
      // return task;
    }
  };

}]);

//# sourceMappingURL=app.js.map