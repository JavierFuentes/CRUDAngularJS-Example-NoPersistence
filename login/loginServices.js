/**
 * Created by Javi on 20/06/14.
 */

angular
    .module('loginApp')
    .factory('loginServices', function ($timeout, $q) {
        return {
            loginSubmit: function (credentials) {
                var deferred = $q.defer();

                // Simulamos un retardo de 2 seg. en la validación de las credenciales
                $timeout(function () {
                    if ((credentials.data_mail !== 'admin@admin.com') ||
                        (credentials.data_pass !== 'admin')) {

                        deferred.reject();
                        return;
                    }

                    deferred.resolve();
                }, 2000);

                return deferred.promise;
            }
        }
    });