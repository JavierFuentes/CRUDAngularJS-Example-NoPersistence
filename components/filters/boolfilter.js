/**
 * Created by Javi on 23/06/14.
 */

angular
    .module('myApp')
    .filter('boolFilter', function () {
        return function (input) {

            if ((input === true) || (input === 'Si'))
                return 'Si';
            else if ((input === false) || (input === 'No'))
                return 'No';
            else
                return 'N/D';

        };
    });