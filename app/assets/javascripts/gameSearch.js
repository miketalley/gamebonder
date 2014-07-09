var gamesApp = angular.module('gamesApp', ['customFilters'])
.factory('dbSvc', function($http){
  return {
    get: function(tableToGet){
      $http.get('../../' + tableToGet + '.json');
    },
    post: function(tableToPost, dataToPost){
      $http.post('../../' + tableToPost + '.json', dataToPost);
    }
  };
})
.controller('GamesController', ['$scope', '$http', '$location', '$q', 'dbSvc', function($scope, $http, $location, $q, dbSvc){
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


  var existsInDB = function(tableToCheck, searchObject){
    var tableScan;
    var returnValue = false;

    tableScan = getDB(tableToCheck);

    tableScan.then(function(results){
      // If the searchObject is an array of games(checking if bond exists)
      if($.isArray(searchObject)){
        console.log('Searching for bond...' + searchObject[0].name + ' & ' + searchObject[1].name);
        angular.forEach(results.data, function(result){
          if(result.source_id === searchObject[0].id && result.target_id === searchObject[1].id){
            returnValue = true;
          }
        });
      }
      // If searchObject is game check if it exists
      else{
        console.log('Searching for game...' + searchObject);
        angular.forEach(results.data, function(result){
          if(result.id === searchObject.id){
            returnValue = true;
          }
        });
      }
    }).then(function(){
      return returnValue;
    });
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
    gamesPosted.then(function(result){
      console.log('Bond Added! ID: ' + result.id);
    });
  };

  // Adds Source and Target games to DB
  // Once complete, calls bondGames to create bond
  var addGames = function(source, target){
    console.log('Running addGames');
    var foundSource, foundTarget;
    var resultsArray = [];
    var postSource, postTarget;

    foundSource = existsInDB('games', source);
    foundTarget = existsInDB('games', target);

    console.log('foundSource: ' + foundSource);
    console.log('foundTarget: ' + foundTarget);

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
  };


  $scope.newBond = function(source, target, description){
    var bond = existsInDB('bonds', [source, target]);
    console.log('Bond = ' + bond);

    if(bond){
      bond.strength = bond.strength + 1;
    }
    else {
      addGames(source, target);
    }
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
