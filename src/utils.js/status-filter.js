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
  }
})
