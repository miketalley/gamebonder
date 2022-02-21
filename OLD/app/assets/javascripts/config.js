// // Module specific configuration
// angular.module('app.config')
//   .value('app.config', {
//     basePath: '/' // Set your base path here
//   });

// // Make sure your config is included in your module
// angular.module('app', ['app.config']);

// // Access your config e.g. in a controller
// angular.module('app')
//   .controller('TestCtrl', ['$scope','app.config', function($scope, config){

//     // Use config base path to assemble url
//     $scope.url = config.basePath + 'GetUserList';
//     ...
//   }]);
