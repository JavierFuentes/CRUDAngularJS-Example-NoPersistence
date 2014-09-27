angular
    .module('myApp')
    .filter('paginate', function () {
        return function (list, page, perPage) {
            offset = (page - 1) * perPage;
            limit = perPage;

            if (!angular.isArray(list)) {
                return null;
            }

            if (offset > list.length) {
                return null;
            }

            if (offset + limit > list.length - 1) {
                limit = list.length - offset;
            }

//            $log.debug('offset', offset);
//            $log.debug('limit', limit);

            return list.slice(offset, offset + limit);
        };
    });