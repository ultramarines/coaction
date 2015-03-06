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
          // tasksService.list();
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
    tasksService.addTask(self.newTask);
    self.tasks.push(self.newTask);
    self.newTask = Task();
  };

  self.toggleTask = function(task) {
    tasksService.toggleStatus(task);
  };

  self.deleteTask = function(task) {
    tasksService.deleteTask(task);
    var index = self.tasks.indexOf(task);
    self.tasks.splice(index, 1);
  };

}]);

app.factory('Task', function() {
  return function(spec) {
    spec = spec || {};
    return {
      title: spec.title,
      status: spec.status || false
    };
  };
});

app.factory('tasksService', ['ajaxService', '$http', function(ajaxService, $http) {

  return {

    addTask: function(task, list) {
      return task;
    },
    list: function() {
      return list;
    },
    deleteTask: function(task) {
      return true;
    },
    toggleTask: function(task) {
      if (task.status === false) {
        task.status = true;
      } else {
        task.status = false;
      }
      return task;
    }
  };

}]);

//# sourceMappingURL=app.js.map