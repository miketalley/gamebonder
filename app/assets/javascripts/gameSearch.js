var gamesApp = angular.module('gamesApp', ['customFilters'])
// .factory('dbSvc', function($http){
//   return {
//     get: function(tableToGet){
//       $http.get('../../' + tableToGet + '.json');
//     },
//     post: function(tableToPost, dataToPost){
//       $http.post('../../' + tableToPost + '.json', dataToPost);
//     }
//   };
// })
.controller('GamesController', ['$scope', '$http', '$location', '$q', function($scope, $http, $location, $q){
  $scope.pageSize = 5;

  var getDB = function(tableToGet) {
    console.log('Running DB get...' + tableToGet);
    url = '../../' + tableToGet + '.json';
    var defer = $q.defer();

    $http.get(url)
    .success(function(results){
      defer.resolve(results);
    })
    .error(function(results){
      defer.reject('Error Getting');
    });

    return defer.promise;
  };


  var postDB = function(tableToPost, dataToPost) {
    console.log('Running DB post...' + tableToPost);
    url = '../../' + tableToPost + '.json';
    var defer = $q.defer();

    $http.post(url, dataToPost)
    .success(function(results){
      defer.resolve(results);
    })
    .error(function(results){
      defer.reject('Error Posting');
    });

    return defer.promise;
  };

  var putDB = function(tableToPut, dataToPut) {
    console.log('Running DB put...' + tableToPut);
    url = '../../' + tableToPut + '/' + dataToPut.id + '.json';
    var defer = $q.defer();

    $http.put(url, dataToPut)
    .success(function(results){
      defer.resolve(results);
    })
    .error(function(results){
      defer.reject('Error Posting');
    });

    return defer.promise;
  };

  var bondExists = function(bondList, source, target){
    var returnValue;

    console.log('Searching for bond between...' + source.name + ' & ' + target.name);
    angular.forEach(bondList, function(bond){
      if(bond.source_id === source.id && bond.target_id === target.id){
        returnValue = bond;
      }
    });

    return returnValue;
  };


  var gameExists = function(gamesList, gameToFind){
    var returnValue = false;

    console.log('Searching for game...' + gameToFind.name);
    angular.forEach(gamesList, function(game){
      if(game.id === gameToFind.id){
          returnValue = true;
      }
    });

    return returnValue;
  };


  // Adds a bond between two games to DB
  var bondGames = function(source, target){
    var gamesPosted;

    console.log('Running bondGames...');
    console.log('SourceID: ' + source.id);
    console.log('TargetID: ' + target.id);
    bond = {
      source_id: source.id,
      target_id: target.id,
      strength: 1
    };

    gamesPosted = postDB('bonds', bond);

    gamesPosted
    .then(function(result){
      console.log('Bond Added! ID: ' + result.id);
    });
  };

  // Adds Source and Target games to DB
  // Once complete, calls bondGames to create bond
  var addGames = function(source, target){
    console.log('Running addGames');
    var getGamesDB;
    var foundSource, foundTarget;
    var postSource, postTarget;

    getGamesDB = getDB('games');

    getGamesDB
    .then(function(results){
      foundSource = gameExists(results.data, source);
      foundTarget = gameExists(results.data, target);
      console.log('foundSource: ' + foundSource);
      console.log('foundTarget: ' + foundTarget);
    })
    .then(function(){
      if(foundSource && foundTarget){
      bondGames(source, target);
      }
      else if(!foundSource && foundTarget){
        postSource = {
            name: source.name,
            giant_bomb_id: source.id,
            icon_url: source.image.icon_url
          };
        postDB('games', postSource);
        bondGames(source, target);
      }
      else if(foundSource && !foundTarget){
        postTarget = {
            name: source.name,
            giant_bomb_id: source.id,
            icon_url: source.image.icon_url
          };
        postDB('games', postTarget);
        bondGames(source, target);
      }
      else{
        postSource = {
            name: source.name,
            giant_bomb_id: source.id,
            icon_url: source.image.icon_url
          };
        postDB('games', postSource);

        postTarget = {
            name: source.name,
            giant_bomb_id: source.id,
            icon_url: source.image.icon_url
          };
        postDB('games', postTarget);
        bondGames(source, target);
      }
    });
  };


  $scope.newBond = function(source, target, description){
    var getBondDB = getDB('bonds');
    var bondFound;

    getBondDB
    .then(function(results){
      bondFound = bondExists(results, source, target);
      console.log('Bond Found: ' + bondFound);
    })
    .then(function(){
      if(bondFound){
        bondFound.strength++;
        console.log('Bond ID: ' + bondFound.id + ' Strength: ' + bondFound.strength);
        putDB('bonds', bondFound);
      }
      else {
        addGames(source, target);
      }
    });
  };

  $scope.searchList = function(searchTerm, list){

    populateList = function(data) {
      if(list === 'source'){
        $scope.$apply(function(){
          $scope.sourcePage = 0;
          $scope.sourceList = data.results;
          $scope.sourcePageCount = Math.floor($scope.sourceList.length / $scope.pageSize);
        });
      }
      else{
        $scope.$apply(function(){
          $scope.targetPage = 0;
          $scope.targetList = data.results;
          $scope.targetPageCount = Math.floor($scope.targetList.length / $scope.pageSize);
        });
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
