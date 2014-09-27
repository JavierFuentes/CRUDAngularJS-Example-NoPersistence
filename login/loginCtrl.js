/**
 * Created by Javi on 20/06/14.
 */

angular
    .module('loginApp')
    .controller('loginCtrl', function ($scope, loginServices) {

        // Inicialización de valores para los textbox
        $scope.credentials = {
            data_mail: 'admin@admin.com',
            data_pass: 'admin'
        };

        $scope.loginMessage = '';
        $scope.loginError = false;
        $scope.isLoading = false;

        $scope.loginSubmit = function () {
            $scope.loginMessage = 'Validando credenciales.';
            $scope.loginError = false;
            $scope.isLoading = true;

            // Delegamos en el servicio la comprobación del Login
            loginServices.loginSubmit($scope.credentials)
                .then(function () {
                    //$location.path('/list');        // Requiere inyectar $location al controlador
                    window.location = "./views/contacts/main.html";   // NO Requiere inyectar $location al controlador
                })
                .catch(function () {
                    $scope.loginMessage = 'Email o Password incorrectos';
                    $scope.loginError = true;
                })
                .finally(function () {
                    $scope.isLoading = false;
                });
        };
    });

