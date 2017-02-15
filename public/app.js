angular.module("app", ['ngRoute', 'ngAnimate', 'timer', 'chart.js'])
    .service('authInterceptor', function($q) {
      var service = this;
      service.responseError = function(rejection) {
        if (rejection.status === 401) {
          window.location = "/";
        }
        return $q.reject(rejection);
      };
    })
    .config(function($routeProvider, $httpProvider) {
      $httpProvider.interceptors.push('authInterceptor');

      var checkAuthenticated = function($q, $http, $location, $rootScope) {
        var deferred = $q.defer();
        $http.get('/authenticated').success(function(user) {
          var authenticated = user ? true : false;
          if($location.url() === '/') {
            deferred.resolve();
            if(authenticated) {
              $rootScope.user = user;
              $location.url('/home');
            }
          }
          else {
            if(authenticated) {
              $rootScope.user = user;
              deferred.resolve();
            } else {
              deferred.reject();
              $location.url('/');
            }
          }
        });
        return deferred.promise;
      }

      $routeProvider
          .when("/", {
              templateUrl: "views/cover.html",
              controller: "coverCtrl",
              controllerAs: "vm",
              resolve: {
                authenticated: checkAuthenticated
              }
          })
          .when("/home", {
              templateUrl: "views/home.html",
              controller: "homeCtrl",
              controllerAs: "vm",
              resolve: {
                authenticated: checkAuthenticated
              }
          })
          .when("/roster", {
              templateUrl: "views/roster.html",
              controller: "rosterCtrl",
              controllerAs: "vm",
              resolve: {
                authenticated: checkAuthenticated
              }
          })
          .when("/recipes", {
              templateUrl: "views/recipes.html",
              controller: "recipesCtrl",
              controllerAs: "vm",
              resolve: {
                authenticated: checkAuthenticated
              }
          })
          .when("/mythic", {
              templateUrl: "views/mythic.html",
              controller: "mythicCtrl",
              controllerAs: "vm",
              resolve: {
                authenticated: checkAuthenticated
              }
          })
          .when("/admin", {
              templateUrl: "views/admin.html",
              controller: "adminCtrl",
              controllerAs: "vm",
              resolve: {
                authenticated: checkAuthenticated
              }
          })
          .when("/progress", {
              templateUrl: "views/progress.html",
              controller: "progressCtrl",
              controllerAs: "vm",
              resolve: {
                authenticated: checkAuthenticated
              }
          })
          .when("/ranking", {
              templateUrl: "views/ranking.html",
              controller: "rankingCtrl",
              controllerAs: "vm",
              resolve: {
                authenticated: checkAuthenticated
              }
          })
          .when('/character/:characterName', {
              templateUrl: 'views/character.html',
              controller: 'characterCtrl',
              controllerAs: "vm",
              resolve: {
                authenticated: checkAuthenticated
              }
          })
          .otherwise({
              redirectTo: "/home"
          });
    })
    .run(function ($rootScope) {
      // Open or close sidenav
      $rootScope.open = '';
    });
