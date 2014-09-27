/**
 * Created by Javi on 23/06/14.
 */

angular
    .module('myApp')
    .filter('sexFilter', function () {
        return function (input) {

            if ((input === 1) || (input === 'Hombre'))
                return 'H';
            else if ((input === 2) || (input === 'Mujer'))
                return 'M';
            else
                return 'N/D';

        };
    });