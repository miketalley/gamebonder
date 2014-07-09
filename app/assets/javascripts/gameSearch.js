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
    var foundBond;

    console.log('Searching for bond between...' + source.name + ' & ' + target.name);
    angular.forEach(bondList, function(bond){
      if(bond.source_id === source.id && bond.target_id === target.id){
        foundBond = bond;
      }
    });

    return foundBond;
  };


  var gameExists = function(gamesList, gameToFind){
    var foundGame = false;

    console.log('Searching for game...' + gameToFind.name);
    angular.forEach(gamesList, function(game){
      if(game.id === gameToFind.id){
          foundGame = true;
      }
    });

    return foundGame;
  };

  var reasonExists = function(reasons, description){
    var foundReason;

    angular.forEach(reasons, function(reason){
      if(reason.description === description){
        foundReason = reason;
      }
    });

    return foundReason;
  };


  // Adds a bond between two games to DB
  var bondGames = function(source, target){
    var gamesPosted, newBond;

    console.log('Running bondGames...');
    console.log('SourceID: ' + source.id);
    console.log('TargetID: ' + target.id);
    bond = {
      source_id: source.id,
      target_id: target.id,
      strength: 1
    };

    gamesPosted = postDB('bonds', bond);

    return gamesPosted;
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
        console.log('Found: Source & Target');
        // bondGames(source, target);
      }
      else if(!foundSource && foundTarget){
        console.log('Found: !Source & Target');
        postSource = {
            name: source.name,
            giant_bomb_id: source.id,
            icon_url: source.image.icon_url,
            thumb_url: source.image.tiny_url
          };
        postDB('games', postSource);
        // bondGames(source, target);
      }
      else if(foundSource && !foundTarget){
        console.log('Found: Source & !Target');
        postTarget = {
            name: target.name,
            giant_bomb_id: target.id,
            icon_url: target.image.icon_url,
            thumb_url: target.image.tiny_url
          };
        postDB('games', postTarget);
        // bondGames(source, target);
      }
      else{
        console.log('Found: !Source & !Target -- Dropped to Else');
        postSource = {
            name: source.name,
            giant_bomb_id: source.id,
            icon_url: source.image.icon_url,
            thumb_url: source.image.tiny_url
          };
        postDB('games', postSource);

        postTarget = {
            name: target.name,
            giant_bomb_id: target.id,
            icon_url: target.image.icon_url,
            thumb_url: target.image.tiny_url
          };
        postDB('games', postTarget);
        // bondGames(source, target);
      }
    });
  };

  var addReason = function(bond, description){
    var getReasonsDB;
    var reasonFound;
    var reason = {
      description: description,
      bond_id: bond.id
    };

    getReasonsDB = getDB('reasons');

    getReasonsDB.then(function(results){
      reasonFound = reasonExists(results, description);
    })
    .then(function(){
      if(reasonFound){
        reasonFound.strength++;
        console.log('Reason ID: ' + reasonFound.id + ' Strength: ' + reasonFound.strength);
        putDB('reasons', reasonFound);
      }
      else{
        postDB('reasons', reason);
        console.log('Reason not found... adding');
      }
    });
  };


  $scope.newBond = function(source, target, description){
    var getBondDB = getDB('bonds');
    var bondFound, newBond, bondAdded;

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
        addReason(bondFound, description);
      }
      else {
        addGames(source, target);
        bondAdded = bondGames(source, target);

        bondAdded
        .then(function(result){
          console.log('Bond Added! ID: ' + result.id);
          newBond = result;
        })
        .then(function(){
          addReason(newBond, description);
        });
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
