app.factory('tasksService', ['ajaxService', '$http', '$log', function(ajaxService, $http, $log) {

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
