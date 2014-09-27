/**
 * Created by Javi on 13/06/14.
 */

angular
    .module('contactsApp', ['ngRoute'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/card',
            {
                templateUrl: './card.html',
                controller: 'contactsCtrl'
            })
            .when('/list',
            {
                templateUrl: './list.html',
                controller: 'contactsCtrl'
            })
            .when('/statistics',
            {
                templateUrl: './statistics.html',
                controller: 'contactsCtrl'
            })
            .otherwise(
            {
                redirectTo: ''
            })
    });
