angular.module('eishare', [])
.factory('apiService', ['$http', '$q', function($http, $q) {
  return {
    searchTearm: function(term) {
      concole.log(term);
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: 'http://en.wikipedia.org/w/api.php',
        data: {
          action: 'opensearch',
          format: 'json',
          search: term
        }
      })
      .success(function(response){
        deferred.resolve(response);
      })
      .error(function(msg, code){
        deferred.reject(msg);
      });
      return deferred.promise;
    }
  };
  
}])
.directive('autoComplete', ['apiService', function(apiService){
  return {
    restrict: 'E',
    template: '<input type="text"></input>',
    transclude: true,
    replace: true,
    link: function(scope, elem, attrs) {
      var keyups = Rx.Observable.fromEvent(elem, 'keyup')
      .map(function() {
        return elem.val();
      })
      .filter(function(text) {
        return text.length > 2;
      })
      .distinctUntilChanged()
      .throttle(500)
      .flatMapLatest(apiService.searchTerm)
      .subscribe(function(data){
        var res = data[1];
        res.forEach(function(d) {
          console.log(d);
        })
      }, function(error) {
        console.log(error);
      });
    }
  };
}]);