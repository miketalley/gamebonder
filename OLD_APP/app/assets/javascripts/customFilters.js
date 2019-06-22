angular.module('customFilters', [])
.filter('startFrom', function(){
  return function(data, start){
    if(angular.isArray(data) && angular.isNumber(start)){
      return data.slice(start);
    }
  };
});
