/**
 * Created by Javi on 20/06/14.
 */

angular
    .module('contactsApp')
    .controller('contactsCtrl', function ($scope, contactsServices, $q, $http, $timeout) {

        var ActiveRecord = 0;
        $scope.allRecords = [];
        $scope.rec = new ContactObj();

        $scope.isLoading = true;
        contactsServices.getAll().then(function (allRecs) {
            $scope.allRecords = allRecs;
            $scope.isLoading = false;
        });

        $scope.rec = contactsServices.getRec(ActiveRecord);

        $scope.saveRecord = function () {
            contactsServices.save($scope.getSelectedRecord);
        };

        $scope.getFirstRecord = function () {
            ActiveRecord = 0;

            $scope.rec = null;
            $scope.rec = contactsServices.getRec(ActiveRecord);
        };

        $scope.getPreviousRecord = function () {
            ActiveRecord -= 1;
            if (ActiveRecord < 0) {
                ActiveRecord = 0;
            }

            $scope.rec = null;
            $scope.rec = contactsServices.getRec(ActiveRecord);
        };

        $scope.getNextRecord = function () {
            ActiveRecord += 1;
            if (ActiveRecord > $scope.countAll() - 1) {
                ActiveRecord = $scope.countAll() - 1;
            }

            $scope.rec = null;
            $scope.rec = contactsServices.getRec(ActiveRecord);
        };

        $scope.getLastRecord = function () {
            ActiveRecord = $scope.countAll() - 1;

            $scope.rec = null;
            $scope.rec = contactsServices.getRec(ActiveRecord);
        };

        /*
         $scope.findById = function(id) {
         ActiveRecord = -1;
         for( var obj in $scope.allRecords ){
         ActiveRecord += 1;

         if (obj.id == id)
         return obj;
         }

         ActiveRecord = -1;
         return null;
         };
         */

        $scope.countAll = function () {
            return $scope.allRecords.length;
        };

        $scope.sumAllBalance = function () {

            // Usando Underscore
//        var balanceArr = _.map($scope.allRecords,
//            function (it) {
//                return it.balanceAmount;
//            });
//
//        var total = _.reduce(balanceArr,
//            function (acum, value) {
//                return acum + value;
//            });

            // Usando los objetos estándar
            var balanceArr = $scope.allRecords.map(
                function (it) {
                    return it.balanceAmount;
                });

            return balanceArr.reduce(
                function (acum, value) {
                    return acum + value;
                }, 0);
        };

        $scope.getFormDisabled = function () {
            if ($scope.formDisabled === undefined) {
                $scope.formDisabled = true;
            }

            return $scope.formDisabled;
        };

        $scope.changeFormDisabled = function () {
            $scope.formDisabled = !$scope.formDisabled;

            return $scope.formDisabled;
        };
    });
