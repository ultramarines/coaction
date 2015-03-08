app.config(['$routeProvider', function($routeProvider){
  var routeDefinition = {
    templateUrl: 'static/js/lists/list.html',
    controller: 'ListCtrl',
    controllerAs: 'vm',
    resolve: {
      tasks: ['tasksService', '$log', function(tasksService, $log) {
          return tasksService.list().then(function(result) {
            return result.tasks;
          }).catch(function(err) {
            $log.log(err + ' -> tasks failed to load');
          });
      }]
    }
  };

  $routeProvider.when('/lists', routeDefinition);

}]).controller('ListCtrl', ['tasksService', 'tasks', 'Task', function(tasksService, tasks, Task) {
  var self = this;
  self.tasks = tasks;
  self.newTask = Task();
  self.statusFilter = 'all';

  self.addTask = function() {
    if (self.newTask.title === '') {
      alert('you need to enter a task');
      return;
    }
    tasksService.addTask(self.newTask)
      .then(function(result) {
        var addedTask = result.task;
        self.tasks.push(addedTask);
        self.newTask = Task();
      })
      .catch(function (err) {
        alert('addTask Failed :(');
      });
  };

  self.toggleTask = function(task) {
    // var oldStatus = task.status;
    tasksService.toggleTask(task)
      .then(function(result) {
        // var toggledTask = result.task;
        self.tasks[self.tasks.indexOf(task)] = result.task;
        // alert(toggledTask.title + ' was ' + oldStatus + ', is now ' + toggledTask.status);
      })
      .catch(function(err) {
        alert('status unchanged');
      });
  };

  self.deleteTask = function(task) {
    tasksService.deleteTask(task)
      .then(function(result) {
        var deletedTask = result.task;
        var index = self.tasks.indexOf(task);
        self.tasks.splice(index, 1);
      })
      .catch(function(err) {
        alert('deletion failed');
      });
  };

  self.filterByNew = function() {
    self.statusFilter = 'new';
  };

  self.filterByStarted = function() {
    self.statusFilter = 'started';
  };

  self.filterByDone = function() {
    self.statusFilter = 'done';
  };

  self.filterByAll = function() {
    self.statusFilter = 'all';
  };

}]);
