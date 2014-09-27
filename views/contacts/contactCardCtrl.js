/**
 * Created by Javi on 21/06/14.
 */

angular
    .module('myApp')
    .controller('contactCardCtrl', function ($scope, $location, $routeParams, contactServices) {

        $scope.rec = null;

        $scope.actionMessage = 'Cargando datos...';
        $scope.showWarning = true;
        $scope.showError = false;
        $scope.isLoading = true;

        if ($location.path().search("/new") >= 0) {

            // Presentamos la ficha en blanco
            $scope.actionMessage = '';
            $scope.showWarning = false;
            $scope.isLoading = false;

            $scope.rec = contactServices.getBlankRecord();

        } else {

            // Presentamos la ficha con los datos del registro activo
            if ($location.path().search("/searchByIdx") >= 0) {
                $scope.actionMessage = '';
                $scope.showWarning = false;
                $scope.isLoading = false;

                $scope.rec = myUtils.copyObject(contactServices.searchByIndex($routeParams.id));
            } else {
                contactServices.findById($routeParams.id)
                    .then(function (data) {
                        $scope.actionMessage = '';
                        $scope.showWarning = false;
                        $scope.isLoading = false;

                        // angular.copy() NO crea una instancia de Contact
                        // y la necesito para refactorizar el cálculo de la Edad
                        //// $scope.rec = angular.copy(data);
                        $scope.rec = myUtils.copyObject(data);
                    })
                    .catch(function (reason) {
                        $scope.actionMessage = 'Ha habido el siguiente problema en la carga: ' + reason;
                        $scope.isLoading = true;
                        $scope.showWarning = true;
                    })
                    .finally(function () {
                    });
            }
        }

        $scope.getIndexOf = function (rec) {
            return contactServices.getIndexOf(rec);
        };

        $scope.getLabel = function (fieldName) {
            return contactServices.getLabel(fieldName, true);
        };

        $scope.getAge = function (rec) {
            return contactServices.getAge(rec);
        };

        $scope.getBoolList = function () {
            return myUtils.getBoolList();
        };

        $scope.getSexList = function () {
            return myUtils.getSexList();
        };

        // Estas dos funciones nos permiten compartir y mantener sincronizado
        // un mismo dato declarado en contactServices entre los $scope de ambos Controladores
        $scope.switchBatchMode = function () {
            $scope.batchMode = contactServices.switchBatchMode();
        };
        $scope.getBatchMode = function () {
            return contactServices.getBatchMode();
        };

        $scope.saveOrUpdate = function (rec) {
            $scope.actionMessage = 'Guardando datos...';
            $scope.showWarning = true;
            $scope.showError = false;

            contactServices.saveOrUpdate(rec)
                .then(function (result) {
                    $scope.actionMessage = result;
                    $location.path('/list')
                })
                .catch(function (reason) {
                    $scope.showWarning = false;
                    $scope.actionMessage = 'Se ha producido un error al guardar los datos... ' + reason;
                    $scope.showError = true;
                })
        };

        $scope.remove = function (rec) {
            $scope.actionMessage = 'Eliminando el registro...';
            $scope.showWarning = true;
            $scope.showError = false;

            contactServices.remove(rec)
                .then(function (result) {
                    $scope.actionMessage = result;
                    $location.path('/list')
                })
                .catch(function (reason) {
                    $scope.showWarning = false;
                    $scope.actionMessage = 'Se ha producido un error al eliminar el registro... ' + reason;
                    $scope.showError = true;
                })
        };

        $scope.cancel = function () {
            $location.path('/list');
        };
    });