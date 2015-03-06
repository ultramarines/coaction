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
