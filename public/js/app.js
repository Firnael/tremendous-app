angular.module("contactsApp", ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "test.html",
                controller: "TestController"
            })
            .otherwise({
                redirectTo: "/"
            })
    })
    .controller("TestController", function($scope) {
        $scope.nice = "Nice"
    });