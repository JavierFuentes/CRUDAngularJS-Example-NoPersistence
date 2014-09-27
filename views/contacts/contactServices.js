/**
 * Created by Javi on 21/06/14.
 */

angular
    .module('myApp')
    .factory('contactServices', function ($q, $http, $timeout) {

        var all = [];
        var currentRecord = null;

        var batchMode = false;
        var arraySendBatch = [];
        var arrayDeleteBatch = [];

        // Definida aquí se puede reutilizar dentro
        // de las funciones del propio servicio.
        var _getIndexOf = function (rec) {
            var index = -1;

            if (!rec)
                return index;

            _.find(all, function (it, idx) {
                if (it.id === rec.id) {
                    index = idx;
                    return idx;
                }
                else return null;
            });

            return index;
        };

        var _getAllData = function () {
            var deferred = $q.defer();

            $timeout(function () {
                $http
                    .get('../../assets/data_contacts.json')
                    .success(function (data /*, status, headers, config*/) {
                        console.log('Obtenemos los datos desde el origen.');
                        deferred.resolve(data);
                    })
                    .error(function (data, status /*, headers, config*/) {
                        deferred.reject(status);
                    });
            }, 1000);

            return deferred.promise;
        };

        var _addDataToList = function (JSONData) {
            var deferred = $q.defer();

            var newRec = (new Contact()).fromServerToView(JSONData);

            var index = _getIndexOf(newRec);

            if (index < 0) {
                all.push(newRec);
                deferred.resolve('Se ha CREADO un nuevo registro ' + newRec.id + ' ' + newRec.firstName);
                console.log('Se ha CREADO un nuevo registro ' + newRec.id + ' ' + newRec.firstName);
            } else {
                all[index] = newRec;
                deferred.resolve('Se ha MODIFICADO el registro ' + newRec.id + ' ' + newRec.firstName);
                console.log('Se ha MODIFICADO el registro ' + newRec.id + ' ' + newRec.firstName);
            }

            return deferred.promise;
        };

        var _sendData = function (rec) {
            var deferred = $q.defer();

            if (rec)
                arraySendBatch.push(rec);   // Metemos en el array el registro notificado desde saveOrUpdate()

            if (batchMode) {
                console.log('Se ha encolado para su envio posterior el registro ' + rec.id + ' ' + rec.firstName);
                console.log('La Cola de Envios tiene ' + arraySendBatch.length + ' pendientes.');
                deferred.resolve('Se ha encolado para su envío posterior el registro ' + rec.id + ' ' + rec.firstName);
            } else {

                $timeout(function () {
                    _sendBatchData(arraySendBatch)
                        .then(function (JSONData) {

                            // Suponemos que el servidor nos devuelve los mismos registros
                            // una vez insertados con su PK (o actualizados en la BD).
                            // Los buscamos en la lista y si no existen los añadimos al array
                            for (var i = 0; i < JSONData.length; i++) {
                                _addDataToList(JSONData[i])
                                    .then(function (data) {
                                        deferred.notify(data);
                                    })
                                    .catch(function (reason) {
                                        deferred.reject(reason);
                                    });
                            }

                            arraySendBatch = [];
                            deferred.resolve(JSONData);
                        })
                        .catch(function (reason) {
                            deferred.reject(reason);
                        });

                }, 1000);

            }
            return deferred.promise;
        };

        var _sendBatchData = function (recArray) {
            var deferred = $q.defer();

            var dataToSend = [];
            if (recArray instanceof Array) {
                for (var i = 0; i < recArray.length; i++)
                    dataToSend.push(recArray[i].fromViewToServer());
            } else {
                dataToSend.push(recArray.fromViewToServer());
            }
            dataToSend = JSON.stringify(dataToSend);
            console.log('\n--- PROCESANDO LA COLA DE ENVIO ---\n' + 'Enviando al Servidor...\n', dataToSend, '\n--- PROCESANDO LA COLA DE ENVIO ---\n');

            // El Servidor es el que realmente tiene que asignar la PK a los nuevos registros
            // y terminar de validar todos los datos recibidos
//            $http
//                .post('http://www.myserver.com/ws/savecontacts.wsdl', dataToSend)
//                .success(function (dataReceived, status, headers, config) {
////                    if (dataReceived.Algo_que_me_indique_si_el_servidor_acepta_los_datos == false)
////                        deferred.reject('El servidor no admite los datos ' + dataReceived);
////                    else
//                    deferred.resolve(dataReceived);
//                    console.log('Recibido del Servidor:', dataReceived);
//                })
//                .error(function (dataReceived, status, headers, config) {
//                    deferred.reject('Ha habido un problema con el servicio ' + config.url);
//                });

            $timeout(function () {
                // *** SIMULADOR
                var rnd = Math.floor(Math.random() * 1000);

                // Simulamos la respuesta del servidor asignando aquí una nueva PK si es necesario
                var dataReceived = JSON.parse(dataToSend);
                if (dataReceived instanceof Array) {
                    for (var i = 0; i < dataReceived.length; i++) {
                        if (!dataReceived[i].id)
                            dataReceived[i].id = 'ZZZTEMP' + (1000000 * all.length + rnd + i);
                    }
                } else {
                    if (!dataReceived.id)
                        dataReceived.id = 'ZZZTEMP' + (1000000 * all.length + +rnd);
                }
                deferred.resolve(dataReceived);
                console.log('\n--- FIN DE LA COLA DE ENVIO ---\n' + 'Recibido del Servidor....\n', dataReceived, '\n--- FIN DE LA COLA DE ENVIO ---\n');
                // *** SIMULADOR END
            }, 1000);

            return deferred.promise;
        };

        var _eraseDataFromList = function (JSONData) {
            var deferred = $q.defer();

            var oldRec = (new Contact()).fromServerToView(JSONData);

            var index = _getIndexOf(oldRec);

            if (index > -1) {
                all.splice(index, 1);
                deferred.resolve('Se ha ELIMINADO el registro ' + oldRec.id + ' ' + oldRec.firstName);
                console.log('Se ha ELIMINADO el registro ' + oldRec.id + ' ' + oldRec.firstName);
            } else {
                deferred.reject('El registro ' + oldRec.id + ' ' + oldRec.firstName + ' no se encuentra en la memoria para su elminacion.');
                console.log('***ERROR: El registro ' + oldRec.id + ' ' + oldRec.firstName + ' no se encuentra en la memoria para su elminacion.');
            }

            return deferred.promise;
        };

        var _deleteData = function (rec) {
            var deferred = $q.defer();

            if (rec)
                arrayDeleteBatch.push(rec);   // Metemos en el array el registro notificado desde remove()

            if (batchMode) {
                console.log('Se ha encolado para su borrado posterior el registro ' + rec.id + ' ' + rec.firstName);
                console.log('La Cola de Borrados tiene ' + arrayDeleteBatch.length + ' pendientes.');
                deferred.resolve('Se ha encolado para su borrado posterior el registro ' + rec.id + ' ' + rec.firstName);
            } else {

                $timeout(function () {
                    _deleteBatchData(arrayDeleteBatch)
                        .then(function (JSONData) {

                            // Suponemos que el servidor nos devuelve los mismos registros
                            // una vez eliminados físicamente.
                            // Los buscamos en la lista
                            for (var i = 0; i < JSONData.length; i++) {
                                _eraseDataFromList(JSONData[i])
                                    .then(function (data) {
                                        deferred.notify(data);
                                    })
                                    .catch(function (reason) {
                                        deferred.reject(reason);
                                    });
                            }

                            arrayDeleteBatch = [];
                            deferred.resolve(JSONData);
                        })
                        .catch(function (reason) {
                            deferred.reject(reason);
                        });

                }, 1000);

            }
            return deferred.promise;
        };

        var _deleteBatchData = function (recArray) {
            var deferred = $q.defer();

            var dataToDelete = [];
            if (recArray instanceof Array) {
                for (var i = 0; i < recArray.length; i++)
                    dataToDelete.push(recArray[i].fromViewToServer());
            } else {
                dataToDelete.push(recArray.fromViewToServer());
            }
            dataToDelete = JSON.stringify(dataToDelete);
            console.log('\n--- PROCESANDO LA COLA DE BORRADOS ---\n' + 'Eliminando del Servidor...\n', dataToDelete, '\n--- PROCESANDO LA COLA DE BORRADOS ---\n');

            // El Servidor es el que realmente tiene que confirmar
            // la eliminación de los registros.
//            $http
//                .post('http://www.myserver.com/ws/deletecontacts.wsdl', dataToDelete)
//                .success(function (dataReceived, status, headers, config) {
////                    if (dataReceived.Algo_que_me_indique_si_el_servidor_elimina_los_datos == false)
////                        deferred.reject('El servidor no permite elminar los datos ' + dataReceived);
////                    else
//                    deferred.resolve(dataReceived);
//                    console.log('Recibido del Servidor:', dataReceived);
//                })
//                .error(function (dataReceived, status, headers, config) {
//                    deferred.reject('Ha habido un problema con el servicio ' + config.url);
//                });

            $timeout(function () {
                // *** SIMULADOR
                // Simulamos la respuesta del servidor con todos
                // los registros eliminados devueltos por el WS
                var dataReceived = JSON.parse(dataToDelete);
                deferred.resolve(dataReceived);
                console.log('\n--- FIN DE LA COLA DE BORRADO ---\n' + 'Recibido del Servidor tras el Borrado...\n', dataReceived, '\n--- FIN DE LA COLA DE BORRADO ---\n');
                // *** SIMULADOR END
            }, 1000);

            return deferred.promise;
        };

        return {
            // Estas dos funciones nos permiten compartir y mantener sincronizado
            // un mismo dato declarado en contactServices entre los $scope de ambos Controladores
            switchBatchMode: function () {
                batchMode = !batchMode;

                // Si se desactiva el modo batch, lanzamos el envío de las colas
                if (!batchMode) {

                    if (arrayDeleteBatch.length > 0)
                        _deleteData(null)
                            .catch(function (reason) {
                                console.log('*** ERROR en Borrado en Batch:', reason);
                            });

                    if (arraySendBatch.length > 0)
                        _sendData(null)
                            .catch(function (reason) {
                                console.log('*** ERROR en Envío en Batch:', reason);
                            });
                }

                return batchMode;
            },
            getBatchMode: function () {
                return batchMode;
            },

            getBlankRecord: function () {
                currentRecord = new Contact();
                return currentRecord;
            },

            getAll: function () {
                var deferred = $q.defer();

                if (all.length !== 0) {
                    console.log('Devolvemos el contenido del Array que ya tenemos en memoria.');
                    deferred.resolve(all);
                } else {
                    _getAllData()
                        .then(function (JSONData) {
                            // Ordenamos los datos recibidos por ID antes de meterlos en el array
                            JSONData.sort(myUtils.sortById);

                            all = [];
                            for (var i = 0; i < JSONData.length; i++) {
                                // Transformamos los datos para adaptarlos al Usuario
                                // y los convertimos en un Objeto especializado
                                all.push((new Contact()).fromServerToView(JSONData[i]));
                            }

                            deferred.resolve(all);
                        })
                        .catch(function (reason) {
                            deferred.reject(reason);
                        });
                }

                return deferred.promise;
            },

            saveOrUpdate: function (rec) {
                var deferred = $q.defer();

                // Control de errores en los datos
                // al margen de lo que se pueda controlar
                // directamente por HTML
                var fieldsList = rec.VerifyData();

                if (fieldsList.length) {
                    deferred.reject('Datos erroneos en los campos: ' + fieldsList.toString());
                } else {

                    _sendData(rec)
                        .then(function (JSONData) {
                            deferred.resolve(JSONData);
                        })
                        .catch(function (reason) {
                            deferred.reject(reason);
                        });
                }

                return deferred.promise;
            },

            remove: function (rec) {
                var deferred = $q.defer();

//                $timeout(function () {
//                    var index = _getIndexOf(rec);
//
//                    if (index > -1) {
//                        all.splice(index, 1);
//                        deferred.resolve('Se ha eliminado el registro ' + rec.id);
//                    } else {
//                        deferred.reject('El registro ' + rec.id + ' no se encuentra.');
//                    }
//
//                }, 1000);

                _deleteData(rec)
                    .then(function (JSONData) {
                        deferred.resolve(JSONData);
                    })
                    .catch(function (reason) {
                        deferred.reject(reason);
                    });

                return deferred.promise;
            },

            setCurrentRecord: function (rec) {
                currentRecord = rec;
            },

//            getCurrentRecord: function () {
//                var deferred = $q.defer();
//
//                $timeout(function () {
//                    if (currentRecord !== null) {
//                        deferred.resolve(currentRecord);
//                    } else {
//                        deferred.reject('No se ha cargado ningún registro.');
//                    }
//                }, 1000);
//
//                return deferred.promise;
//            },

            searchByIndex: function (idx) {
                if (idx < 0)
                    return all[0];

                if (idx < all.length)
                    return all[idx - 1];

                return all[all.length-1];
            },

            findById: function (id) {
                var deferred = $q.defer();

                if (all.length != 0) {
                    doFindById();
                } else {
                    // Si se accede a la ficha de un registro directamente
                    // o si se refresca la página con F5, debemos de volver
                    // a cargar la lista de registros antes de hacer la búsqueda.
                    this.getAll()
                        .then(function () {
                            doFindById();
                        })
                        .catch(function (reason) {
                            deferred.reject(reason);
                        });
                }

                // Subrutina que realmente hace la búsqueda sabiendo que el
                // array siempre estará cargado.
                function doFindById() {
                    var rec = _.find(all, function (it) {
                        if (it.id !== id)
                            return null;

                        return it;
                    });

                    if (rec) {
                        currentRecord = rec;
                        deferred.resolve(currentRecord);
                    } else {
                        deferred.reject('No se ha encontrado el registro con ID: ' + id);
                    }
                }

                return deferred.promise;
            },

            getIndexOf: function (rec) {
                return _getIndexOf(rec);
            },

            getLabel: function (fieldName, markMandatory) {
                if (currentRecord)
                    return currentRecord.getLabel(fieldName, markMandatory);
                else
                    return (new Contact()).getLabel(fieldName, markMandatory);
            },

            getAge: function (rec) {
                if (rec instanceof Contact)
                    return rec.getAge();

                return null;
            }
        };
    });