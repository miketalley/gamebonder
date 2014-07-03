var gamesApp = angular.module('gamesApp', ['customFilters'])

.controller('GamesController', ['$scope', '$http', function($scope, $http, listActive, listPageCount){
  var gamesList = [];
  var apiUrl = "http://www.giantbomb.com/api/search/?api_key=5a62be4c8f2f18be4666979b769e4b43286554af&format=json&resources=game&query=";
  $scope.pageSize = 5;
  $scope.sourcePage = 0;
  $scope.targetPage = 0;

  $scope.newBond = function(source, target, description){
    $http({
      url: './bonds',
      method: "POST",
      data: {
        bond: {
          name: name,
          appid: appid,
          img_url: img_url
        }
       }
    })
    .success();
  };

  var populateGamesList = function(data){
    gamesList = data;
  };

  var getGames = function(){
    $http({
      url: '/gamesList',
      method: 'GET'
      })
      .success(populateGamesList);
  };

  getGames();

  $scope.searchList = function(searchTerm, list){
    function searchMatch(game){
      return game.name.indexOf(searchTerm) !== -1;
    }

    if(list === 'source'){
      $scope.sourceList = gamesList.filter(searchMatch);
      $scope.sourcePageCount = Math.floor($scope.sourceList.length / $scope.pageSize);
      // return sourceList;
    }
    else{
      $scope.targetList = gamesList.filter(searchMatch);
      // return targetList;
    }
  };

  $scope.selectSource = function(source){
    $scope.source = source;
    $scope.sourceSelected = true;
  };

  $scope.cancelSource = function(){
    $scope.source = null;
    $scope.sourceSelected = false;
  };

  $scope.selectTarget = function(target){
    $scope.target = target;
    $scope.targetSelected = true;
  };

  $scope.cancelTarget = function(){
    $scope.target = null;
    $scope.targetSelected = false;
  };


}]);
