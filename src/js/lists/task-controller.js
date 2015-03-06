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