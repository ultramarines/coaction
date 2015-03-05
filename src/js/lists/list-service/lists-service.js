app.factory('tasksService', ['ajaxService', '$http', function(ajaxService, $http) {

  return {

    addTask: function(task, list) {
      return task;
    },
    list: function() {
      return list;
    },
    deleteTask: function(task) {
      return true;
    },
    toggleTask: function(task) {
      if (task.status === false) {
        task.status = true;
      } else {
        task.status = false;
      }
      return task;
    }
  };

}]);
