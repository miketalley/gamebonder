var gamesApp = angular.module('gamesApp', ['customFilters'])
.controller('GamesController', ['$scope', '$http', '$location', '$q', function($scope, $http, $location, $q, listActive, listPageCount){
  $scope.pageSize = 5;

  // Returns T/F if object already exists in DB
  var existsInDB = function(objectType, object) {
    var foundIt = false;
    var response;
    var defer = $q.defer();

    $http.get('../../' + objectType + '.json')
      .success(function(data){
        defer.resolve(data);
      })
      .error(function(){
        defer.reject('Error - Barfed');
      });

    response = defer.promise;

    response.then(function(results){
      angular.forEach(results, function(result){
        if(object.isArray()){
          if(result.source_id === object[0].id && result.target_id === object[1].id){
            foundIt = true;
          }
        }
        else{
          if(result.id === object.id){
            foundIt = true;
          }
        }
      });
    });
    return foundIt;
  };

  // Adds a bond between two games to DB
  var bondGames = function(newSourceAndTarget){
    $http({
      url: '../../bonds.json',
      method: "POST",
      dataType: 'json',
      data: {
        bond: {
          source_id: newSourceAndTarget[0].id,
          target_id: newSourceAndTarget[1].id,
          strength: 1
        }
      }
    });
  };

  // Adds Source and Target games to DB
  // Once complete, calls bondGames to create bond
  var addSourceAndTarget = function(games){
    var gamePosts = [];
    var resultsArray = [];

    angular.forEach(games, function(game) {
      var foundGame = existsInDB('game', game);

      if(!foundGame){
        gamePosts.push(
          $http({
            url: '../../games.json',
            method: "POST",
            dataType: 'json',
            data: {
              game: {
                name: game.name,
                giant_bomb_id: game.id,
                icon_url: game.image.icon_url
              }
            }
          })
        );
      }
      else{
        resultsArray.push(gameToPush);
      }
    });

    $q.all(gamePosts)
    .then(
      function(results){
        angular.forEach(results, function(result){
          resultsArray.push(result.data);
        });
      }
    );
    bondGames(resultsArray);
  };


  $scope.newBond = function(source, target, description){
    var sourceAndTarget = [source, target];
    var bond = existsInDB('bond', sourceAndTarget);

    if(bond){
      bond.strength = bond.strength + 1;
    }
    else {
      addSourceAndTarget(sourceAndTarget);
    }
  };

  $scope.searchList = function(searchTerm, list){

    populateList = function(data) {
      if(list === 'source'){
        $scope.sourcePage = 0;
        $scope.sourceList = data.results;
        $scope.sourcePageCount = Math.floor($scope.sourceList.length / $scope.pageSize);
      }
      else{
        $scope.targetPage = 0;
        $scope.targetList = data.results;
        $scope.targetPageCount = Math.floor($scope.targetList.length / $scope.pageSize);
      }
    };

    $.ajax({
      url: "http://api.giantbomb.com/search/",
      type: "get",
      data: {api_key : "5a62be4c8f2f18be4666979b769e4b43286554af", query: searchTerm, field_list : "name,id,image,site_detail_url", format : "jsonp", json_callback : 'populateList' },
      dataType: "jsonp"
    });

    // $http.jsonp("http://www.giantbomb.com/api/game/1/?format=json&api_key=5a62be4c8f2f18be4666979b769e4b43286554af&callback=JSON_CALLBACK").success(function(data){
    //   $scope.sourceList = data.results;
    // });


  };

  $scope.pullGame = function(id){
    // http://www.giantbomb.com/api/game/[GAME ID HERE]/?&format=json&api_key=5a62be4c8f2f18be4666979b769e4b43286554af
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
// .config(['$httpProvider', function($httpProvider) {
//     $httpProvider.defaults.useXDomain = true;
//     delete $httpProvider.defaults.headers.common['X-Requested-With'];
//   }
// ]);
