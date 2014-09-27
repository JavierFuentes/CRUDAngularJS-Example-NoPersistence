angular
    .module('login', [])
    .directive('loginForm', function () {
        return {
            restrict : 'E', //'A' atributo, 'E' elemento, 'C' comentario... 'AE'
            templateUrl: 'components/directives/login/login-directive-template.html',
            scope : {

            },
            link : function (scope, element, attrs) {
                console.log('sadsasdadsa');
            }
        };
    });