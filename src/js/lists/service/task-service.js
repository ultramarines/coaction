app.factory('tasksService', ['ajaxService', '$http', function(ajaxService, $http) {

  return {

    addTask: function(task) {
      return ajaxService.call($http.post('/api/tasks', task));
    },
    taskList: function() {
      return ajaxService.call($http.get('api/tasks'));
    },
    // userList: function() {
    //   return ajaxService.call($http.get('api/users'));
    // },
    deleteTask: function(task) {
      var url = '/api/tasks/' + task.id;
      return ajaxService.call($http.delete(url));
    },
    toggleTask: function(task) {
      var url = '/api/tasks/' + task.id;
      if (task.status === 'new' || task.status === 'started') {
        return ajaxService.call($http.put(url, { status: 'done' }));
      } else {
        return ajaxService.call($http.put(url, { status: 'started' }));
      }
    },
    assignTask: function(task) {
      var assignments = task.assigned_to;
      assignments.push(task.newAssignment);
      var url = '/api/tasks/' + task.id;
      return ajaxService.call($http.put(url, { assigned_to: assignments }));
    },
    updateTask: function(task, field) {
      var url = '/api/tasks/' + task.id;
      var update = {};
      return ajaxService.call($http.put(url, update));
    }
  };

}]);
