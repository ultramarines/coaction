app.factory('tasksService', ['ajaxService', '$http', '$log', function(ajaxService, $http, $log) {

  return {

    addTask: function(task) {
      var addedTask = {};
      ajaxService.call($http.post('/api/tasks', task)).then(function(result) {
        addedTask = result;
        return addedTask;
      }).catch(function(err) {
        $log.log(err);
      });
    },
    list: function() {
      return ajaxService.call($http.get('api/tasks'));
    },
    deleteTask: function(task) {
      var url = '/api/tasks/' + task.id;
      var deletedTask = {};
      ajaxService.call($http.delete(url)).then(function(result) {
        deletedTask = result.data;
        return deletedTask;
      }).catch(function(err) {
        $log.log(error);
      })
    },
    toggleTask: function(task) {
      //TODO: make this a thing
      // if (task.status === false) {
      //   task.status = true;
      // } else {
      //   task.status = false;
      // }
      // return task;
    }
  };

}]);
