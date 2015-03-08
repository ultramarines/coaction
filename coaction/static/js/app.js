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

app.controller('Error404Ctrl', ['$location', function ($location) {
  this.message = 'Could not find: ' + $location.url();
}]);

app.config(['$routeProvider', function($routeProvider){
  var routeDefinition = {
    templateUrl: 'static/js/lists/list.html',
    controller: 'ListCtrl',
    controllerAs: 'vm',
    resolve: {
      tasks: ['tasksService', '$log', function(tasksService, $log) {
          return tasksService.list().then(function(result) {
            $log.log(result);
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

app.factory('Task', function() {
  return function(spec) {
    spec = spec || {};
    return {
      title: spec.title || '',
      status: 'new',
    };
  };
});

app.factory('current', ['ajaxService', '$location', '$http', '$log', function(ajaxService, $location, $http, $log) {
  var self = this;
  self.user = {};

  ajaxService.call($http.get('/api/me'))
    .then(function(result) {
      self.user = result.user;
      console.log(self.user.id);
      $location.path('/lists');
    }).catch(function(err){
      $location.path('/');
    });

  self.login = function(user) {
    $log.log(user);
    ajaxService.call($http.post('/api/login', user))
      .then(function(result) {
        self.user = result.user;
        $location.path('/lists');
      });
  };

  self.logout = function() {
    ajaxService.call($http.get('/api/logout'))
      .then(function(result) {
        $log.log(result);
        self.user = {};
        $location.path('/');
      });
  };

  self.signup = function(user) {
    $log.log(user);
    ajaxService.call($http.post('/api/register', user))
      .then(function(result) {
        self.user = result.user;
        $log.log(result);
        $location.path('/lists');
      });
  };

  return self;

  //TODO: make this a thing
}]);

app.config(['$routeProvider', function($routeProvider){
  var routeDefinition = {
    templateUrl: 'static/js/login/login.html',
    controller: 'LoginCtrl',
    controllerAs: 'vm',
  };

  $routeProvider.when('/', routeDefinition);

}]).controller('LoginCtrl', ['$log', '$location', 'current', 'User', function($log, $location, current, User) {
  var self = this;
  self.newLogin = User();
  self.newSignup = User();
  self.current = current;

  self.userView = 'login';

  self.toggleView = function() {
    if(self.userView === 'login') {
      self.userView = 'signup';
    } else {
      self.userView = 'login';
    }
  }

  self.login = function() {
    $log.log(self.newLogin);
    self.current.login(self.newLogin);
    self.newLogin = User();
  };

  self.signup = function() {
    self.current.signup(self.newSignup);
    self.newSignup = User();
  };
}]);

app.factory('User', function() {
  return function (spec) {
    spec = spec || {};
    return {
      name: spec.name,
      email: spec.email,
      password: spec.password
    };
  };
});

app.controller('MainNavCtrl',
  ['$log', 'current', '$location', function($log, current, $location) {

    var self = this;

    self.current = current;

    self.location = $location.url();

    if( self.location === '/') {
      self.hideLogo = true;
    }

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

app.filter('statusFilter', function() {
  return function(input, status) {

    var filteredInput = [];

    if (status === 'all') {
      return input;
    }

    input.forEach(function(item) {
      if (item.status === status) {
        filteredInput.push(item);
      }
    });

    return filteredInput;
  };
});

app.factory('tasksService', ['ajaxService', '$http', function(ajaxService, $http) {

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
      var url = '/api/tasks/' + task.id;
      if (task.status === 'new' || task.status === 'started') {
        return ajaxService.call($http.put(url, {status: 'done'}));
      } else {
        return ajaxService.call($http.put(url, {status: 'started'}));
      }
    }
  };

}]);

//# sourceMappingURL=app.js.map