app.config(['$routeProvider', function($routeProvider){
  var routeDefinition = {
    templateUrl: 'static/js/lists/list.html',
    controller: 'ListCtrl',
    controllerAs: 'vm',
    resolve: {
      tasks: ['tasksService', '$log', function(tasksService, $log) {
          return tasksService.taskList().then(function(result) {
            return result.tasks;
          }).catch(function(err) {
            $log.log(err + ' -> tasks failed to load');
          });
      }],
      users: ['usersService', '$log', function(usersService, $log) {
          return usersService.userList().then(function(result) {
            return result.users;
          }).catch(function(err) {
            $log.log(err + ' -> users failed to load');
          });
      }],
    }
  };

  $routeProvider.when('/lists', routeDefinition);

}]).controller('ListCtrl', ['tasksService', 'tasks', 'users', 'Task', '$log', function(tasksService, tasks, users, Task, $log) {
  var self = this;
  self.tasks = tasks;
  // self.tasks.forEach(function(item) {
  //   item.date_due = new Date(item.date_due);
  // });
  self.users = users;
  self.newTask = Task();
  self.statusFilter = 'all';
  self.nullPointer = null;

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
        $log.log('addTask Failed :(');
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
        $log.log('status unchanged');
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
        $log.log('deletion failed');
      });
  };

  self.assignTask = function(task) {
    if (task.assigned_to.indexOf(task.newAssignment) !== -1) { // no redundant assignments
      return;
    }

    tasksService.assignTask(task)
      .then(function(result) {
        $log.log(result);
      })
      .catch(function(err) {
        $log.log(err);
      });
  };

  self.toggleDetail = function(task) {
    if (task.detail) {
      task.detail = false;
    } else {
      task.detail = true;
    }
  };

  self.isAssignee = function(user, task) {
    if (user.email === task.assigned_to) {
      return true;
    } else {
      return false;
    }
  };

  self.updateTask = function(task, field) {
    tasksService.updateTask(task, field).then(function(data){
      $log.log(data);
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

  self.updateDate = function(task) {
    self.toggleSettingDate(task);
    var myDate = new Date(task.date_due);
    task.date_due = myDate.toISOString().slice(0, 10);
    tasksService.updateTask(task, 'date_due').then(function(data){
      $log.log(data);
    });
  };

  self.toggleSettingDate = function(task) {
    if (task.settingDate) {
      task.settingDate = false;
    } else {
      task.settingDate = true;
    }
  };

  self.dateOptions = {
    changeYear: true,
    changeMonth: true,
    dateFormat: "yy-mm-dd"
  };

}]);
