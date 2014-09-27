/**
 * Created by Javi on 25/06/14.
 */


angular
    .module('myApp')
    .controller('contactSearchCtrl', function ($scope, $location, contactServices) {

        $scope.searchByIndex = function(idx) {
            var rec = contactServices.searchByIndex(idx);
            if (rec)
                $location.path('/searchByIdx/' + idx);
        };

    });
