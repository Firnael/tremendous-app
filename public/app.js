angular.module("app", ['ngRoute', 'timer'])
    .config(function($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "views/cover.html",
                controller: "coverCtrl",
                controllerAs: "vm"
            })
            .when("/home", {
                templateUrl: "views/home.html",
                controller: "homeCtrl",
                controllerAs: "vm"
            })
            .otherwise({
                redirectTo: "/"
            });
    });
