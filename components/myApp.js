/**
 * Created by Javi on 13/06/14.
 */

angular
    .module('myApp', ['ngRoute'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/list',
            {
                templateUrl: './list.html',
                controller: 'contactListCtrl'
            })
            .when('/edit/:id', {
                templateUrl: './card.html',
                controller: 'contactCardCtrl'
            })
            .when('/new',
            {
                templateUrl: './card.html',
                controller: 'contactCardCtrl'
            })
            .when('/search', {
                templateUrl: './search.html',
                controller: 'contactSearchCtrl'
            })
            .when('/searchByIdx/:id', {           // Permitirá abrir la ficha por posición en el array
                templateUrl: './card.html',
                controller: 'contactCardCtrl'
            })
            .when('/statistics',
            {
                templateUrl: './statistics.html',
                controller: 'contactStatisticsCtrl'
            })
            .otherwise(
            {
                redirectTo: '/list'
            })
    });
