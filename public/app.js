angular.module("app", ['ngRoute', 'timer', 'chart.js'])
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
            .when("/admin", {
                templateUrl: "views/admin.html",
                controller: "adminCtrl",
                controllerAs: "vm"
            })
            .when("/progress", {
                templateUrl: "views/progress.html",
                controller: "progressCtrl",
                controllerAs: "vm"
            })
            .when('/character/:characterName', {
                templateUrl: 'views/character.html',
                controller: 'characterCtrl',
                controllerAs: "vm"
            })
            .otherwise({
                redirectTo: "/"
            });
    });
