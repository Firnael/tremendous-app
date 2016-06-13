angular.module("app", ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "views/test.html",
                controller: "testCtrl",
                controllerAs: "vm"
            })
            .otherwise({
                redirectTo: "/"
            });
    });
