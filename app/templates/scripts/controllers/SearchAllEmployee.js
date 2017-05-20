angular.module('FormUpload').controller('searchAllEmployeeCntrl', ['$scope', '$http', '$window', function ($scope, $http, $window) {
	$scope.search = function() {
		$http.get('/checkAvailability').then(function (response) {
			$scope.errorSearchAll = ''
			$window.location = '/searchAll'
		}, function (response) {
			$scope.errorSearchAll = 'No employee details are found'
		});
	}
}]);