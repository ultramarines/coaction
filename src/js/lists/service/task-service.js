app.factory('tasksService', ['ajaxService', '$http', function(ajaxService, $http) {

  return {

    addTask: function(task) {
      return ajaxService.call($http.post('/api/tasks', task));
    },

    taskList: function() {
      return ajaxService.call($http.get('api/tasks'));
    },

    assignmentList: function() {
      return ajaxService.call($http.get('/api/assignments'));
    },

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
      var index = task.assigned_to.indexOf(task.newAssignment);
      if (index !== -1) {
        task.assigned_to.splice(index, 1);
        var assignments = task.assigned_to;
      } else {
        var assignments = task.assigned_to;
        assignments.push(task.newAssignment);
      }
      var url = '/api/tasks/' + task.id;
      return ajaxService.call($http.put(url, { assigned_to: assignments }));
    },

    setAssigned: function(task) {
      var url = '/api/tasks/' + task.id;
      var assignee = {};
      assignee.assigned_to = task.assigned_to;
      return ajaxService.call($http.put(url, assignee));
    },

    updateTask: function(task, field) {
      var url = '/api/tasks/' + task.id;
      var update = {};
      update[field] = task[field];
      return ajaxService.call($http.put(url, update));
    },
  };

}]);
