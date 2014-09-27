/**
 * Created by Javi on 21/06/14.
 */

angular
    .module('myApp')
    .controller('contactListCtrl', function ($scope, $location, $filter, contactServices) {

        $scope.actionMessage = 'Cargando datos...';
        $scope.showWarning = true;
        $scope.showError = false;
        $scope.isLoading = true;

        $scope.recsPerPage = 6;
        $scope.pageNo = 1;
        $scope.totalPages = 1;

        $scope.currOrderField = 'id';
        $scope.currOrderReverse = true;

        $scope.allRecords = [];

        // Carga Inicial de todos los registros
        contactServices.getAll()
            .then(function (data) {
                $scope.allRecords = data;

                $scope.totalPages = Math.ceil($scope.allRecords.length / $scope.recsPerPage);

                $scope.isLoading = false;
                $scope.showWarning = false;
                $scope.actionMessage = '';
            })
            .catch(function (reason) {
                $scope.showWarning = false;
                $scope.showError = true;
                $scope.actionMessage = 'Ha habido el siguiente problema en la carga: ' + reason;
            });

        // Estas dos funciones nos permiten compartir y mantener sincronizado
        // un mismo dato declarado en contactServices entre los $scope de ambos Controladores
        $scope.switchBatchMode = function() {
            $scope.batchMode = contactServices.switchBatchMode();
        };
        $scope.getBatchMode = function() {
            return contactServices.getBatchMode();
        };

        $scope.getLabel = function (fieldName) {
            var fieldLabel = contactServices.getLabel(fieldName, false);

            if (fieldName === 'row')
                fieldName = 'id';

            if (fieldName === $scope.currOrderField) {
                if ($scope.currOrderReverse === false)
                    fieldLabel += ' ^'; // ↑
                else
                    fieldLabel += ' v'; // ↓
            }

            return fieldLabel;
        };

        $scope.getAge = function (rec) {
            return contactServices.getAge(rec);
        };

        $scope.getSexValues = function () {
            return contactServices.getSexValues();
        };

        $scope.openCard = function (rec) {
            contactServices.setCurrentRecord(rec);
            $location.path('/edit/' + rec.id);
        };

        $scope.first = function () {
            $scope.pageNo = 1;
            $scope.showError = false;
        };

        $scope.prev = function () {
            if ($scope.pageNo > 1)
                $scope.pageNo--;
            $scope.showError = false;
        };

        $scope.next = function () {
            if ($scope.pageNo < $scope.totalPages)
                $scope.pageNo++;
            $scope.showError = false;
        };

        $scope.last = function () {
            $scope.pageNo = $scope.totalPages;
            $scope.showError = false;
        };

        $scope.setOrderBy = function (field) {
            if ($scope.allRecords[0].hasOwnProperty(field)) {

                $scope.showError = false;

                if ($scope.currOrderField !== field) {
                    $scope.currOrderField = field;
                    $scope.currOrderReverse = false;
                } else {
                    $scope.currOrderReverse = !$scope.currOrderReverse;
                }

            } else {
                $scope.showError = true;
                $scope.actionMessage = 'El campo ' + field + ' no existe.';
            }
        };

        // Contamos cuántos registros tienen la cadena introducida
        // A esta función se la llama por cada tecla introducida en el input del filtro!
        // (si escribes 'false' no funciona pero con 'true' sí)

        $scope.countFilteredRecords2 = function(){

            var ordered = $filter('orderBy')($scope.allRecords, $scope.currOrderField, $scope.currOrderReverse);
            var filtered = $filter('filter')(ordered,$scope.myFilter);

            return filtered.length;
        };
        $scope.countFilteredRecords = function (filterText) {

            var n = 0;

            if (!filterText) {

                n = $scope.allRecords.length;

            } else {

                var last = -1;
                for (var i = 0; i < $scope.allRecords.length; i++) {
                    for (p in $scope.allRecords[i]) {
                        if (i != last)  // Optimización: si ya se ha encontrado una coincidencia, siguiente registro
                            if ($scope.allRecords[i].hasOwnProperty(p))
                                if (p.indexOf('$') === -1) {  // != $$hashKey
                                    //console.log(filterText, p, $scope.allRecords[i][p], n);
                                    if ($scope.allRecords[i][p])
                                        if ($scope.allRecords[i][p].toString().toLowerCase()
                                            .indexOf(filterText.toLowerCase()) > -1)
                                            if (i != last) {  // Sólo contamos cada registro una vez
                                                last = i;
                                                n++;
                                            }
                                }
                    }
                }
                //console.log('Total reg. contados', n);
            }

            $scope.totalPages = Math.ceil(n / $scope.recsPerPage);
            if ($scope.totalPages)
                if ($scope.pageNo > $scope.totalPages)
                    $scope.pageNo = $scope.totalPages;

            return(n);  // Devolvemos el número de registros coincidentes
        };

    })
;