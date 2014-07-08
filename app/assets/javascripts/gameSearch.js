var gamesApp = angular.module('gamesApp', ['customFilters'])
.controller('GamesController', ['$scope', '$http', '$location', '$q', function($scope, $http, $location, $q, listActive, listPageCount){
  $scope.pageSize = 5;

  // Checks if bond already exists in DB
  var bondExists = function(source, target) {
    var response;
    $http({
      url: '../../bonds.json',
      method: 'GET'
      // beforeSend: function(xhr){
      //   xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
      // }
    })
    .success(function(data){
      for(var i = 0; i < data.length; i++){
        if(data[i].source.id === source.id){
          if(data[i].target.id === target.id){
            response = data[i];
          }
        }
        response = false;
      }
    });
    return response;
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

    angular.forEach(games, function(game) {
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
    });

    $q.all(gamePosts)
    .then(
      function(results){
        var resultsArray = [];

        angular.forEach(results, function(result){
          resultsArray.push(result.data);
        });

        bondGames(resultsArray);
      }
    );
  };


  $scope.newBond = function(source, target, description){
    var sourceAndTarget = [source, target];
    var bond = bondExists(source, target);

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
