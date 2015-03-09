app.factory('usersService', ['ajaxService', '$http', function(ajaxService, $http) {

  return {

    userList: function() {
      return ajaxService.call($http.get('api/users'));
    }
  };

}]);
