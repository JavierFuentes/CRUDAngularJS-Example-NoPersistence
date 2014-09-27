/**
 * Created by Javi on 20/06/14.
 */

/*
 function asyncGetData($q, $http) {
 var deferred = $q.defer();

 $http({method: 'GET', url: '../../assets/data_contacts.json'})
 .success(function (data, status, headers, config) {

 // Generamos el Array de ContactObj
 result = data.map(
 function (it) {
 return new ContactObj(it);
 });

 console.log('dentro: ', result);  // Aquí sí tengo los datos!

 deferred.resolve(result); //return asíncrono
 })
 .error(function (data, status, headers, config) {
 alert('Error descargando los datos', status);

 deferred.reject('Error descargando los datos'); //Exception asíncrono
 });

 return deferred.promise;
 }
 */

angular
    .module('contactsApp')
    .factory('contactsServices', function ($q, $http, $timeout) {
        var allObjectData = [];

        // Devolvemos el objeto que contendrá los métodos tipo DAO
        return {
            getAll: function () {

                var deferred = $q.defer();

                if (allObjectData.length === 0) {
                    $http({method: 'GET', url: '../../assets/data_contacts.json'})
                        .success(function (data, status, headers, config) {

                            // Generamos el Array de ContactObj
                            var result = data.map(
                                function (it) {
                                    return new ContactObj(it);
                                });

                            console.log('dentro: ', result);  // Aquí sí tengo los datos!

                            allObjectData = result;
                            deferred.resolve(allObjectData); //return asíncrono
                        })
                        .error(function (data, status, headers, config) {
                            alert('Error descargando los datos', status);

                            deferred.reject('Error descargando los datos'); //Exception asíncrono
                        });
                } else {
                    $timeout(function () {
                        deferred.resolve(allObjectData); //return asíncrono
                    }, 2000);
                }

                return deferred.promise;
            },

            getRec: function (pos) {
                pos = pos || 0;

                if (pos < 0) {
                    pos = 0;
                }

                if (pos >= allObjectData.length) {
                    pos = allObjectData.length - 1;
                }

                return (allObjectData[pos]);
            },

            save: function (record) {
                var newObjRecord = new ContactObj(record);

                allObjectData.put(newObjRecord);
            },

            delete: function (record) {
                // TODO
            }

        };
    });

