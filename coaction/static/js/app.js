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
          return tasksService.list();
      }]
    }
  };

  $routeProvider.when('/lists', routeDefinition);
  $routeProvider.when('/', routeDefinition);

}]).controller('ListCtrl', ['tasksService', 'tasks', 'Task', function(tasksService, tasks, Task) {
  var self = this;
  self.tasks = tasks;
  self.newTask = Task();

  self.addTask = function() {
    var createdTask = tasksService.addTask(self.newTask);
    if (createdTask.id) {
      self.tasks.push(createdTask);
    } else {
      alert('addition unsuccessful');
    }
    self.newTask = Task();
  };

  self.toggleTask = function(task) {
    //TODO: make taskService.toggleStatus() a thing, then make this a thing
    tasksService.toggleStatus(task);
  };

  self.deleteTask = function(task) {
    var deletedTask = tasksService.deleteTask(task);
    if (deletedTask.id) {
      var index = self.tasks.indexOf(task);
      self.tasks.splice(index, 1);
    } else {
      alert('deletion unsuccessful');
    }
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

app.factory('tasksService', ['ajaxService', '$http', '$log', function(ajaxService, $http, $log) {

  return {

    addTask: function(task) {
      var addedTask = {};
      ajaxService.call($http.post('/api/tasks', task)).then(function(result) {
        addedTask = result.data;
        return addedTask;
      }).catch(function(err) {
        $log.log(err);
      });
    },
    list: function() {
      return ajaxService.call($http.get('api/tasks'));
    },
    deleteTask: function(task) {
      var url = '/api/tasks/' + task.id;
      var deletedTask = {};
      ajaxService.call($http.delete(url)).then(function(result) {
        deletedTask = result.data;
        return deletedTask;
      }).catch(function(err) {
        $log.log(error);
      })
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