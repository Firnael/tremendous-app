angular.module("app", ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "views/test.html",
                controller: "testCtrl"
            })
            .otherwise({
                redirectTo: "/"
            });
    });
