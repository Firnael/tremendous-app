angular.module("tremendousApp", ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "views/test.html",
                controller: "controllers/testCtrl"
            })
            .otherwise({
                redirectTo: "/"
            });
    });
