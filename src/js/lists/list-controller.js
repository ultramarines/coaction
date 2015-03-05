app.config(['$routeProvider', function($routeProvider){
  var routeDefinition = {
    templateUrl: 'static/js/lists/list.html',
    controller: 'ListCtrl',
    controllerAs: 'vm',
    resolve: {
      tasks: ['tasksService', function(tasksService) {
          return [];
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
