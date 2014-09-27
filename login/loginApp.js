/**
 * Created by Javi on 11/06/14.
 */

//'use strict'; // da problemas con Angular

angular
    .module('loginApp', ['ngRoute', 'login'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/login',
            {
                templateUrl: './login/login.html',
                controller: 'loginCtrl'
            })
            .otherwise(
            {
                redirectTo: '/login'
            })
    });


