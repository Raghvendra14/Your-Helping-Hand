angular.module('FormUpload').controller('searchEmployeeCntrl', ['$scope', '$http', '$window', function ($scope, $http, $window) {
		$scope.submit = function (searchQuery) {
			var urlEndPoint = null
			if (angular.equals($scope.searchByName, searchQuery)) {
				urlEndPoint = "name="
			} else if(angular.equals($scope.searchById, searchQuery)) {
				urlEndPoint = "id="
			}
			$http.get("/search/?" + urlEndPoint + searchQuery)
			.then(function (response) {
				$scope.searchByName = ''
				$scope.searchById = ''
				$scope.errorSearchByName = ''
				$scope.errorSearchById = ''
				$window.location = '/employee/?' + urlEndPoint + searchQuery
			}, function (response) {
				if (angular.equals(urlEndPoint, 'name=')) {
					$scope.searchByName = ''
					$scope.errorSearchByName = 'No such employee name is available'
					$scope.errorSearchById = ''
				} else if (angular.equals(urlEndPoint, 'id=')) {
					$scope.searchById = ''
					$scope.errorSearchById = 'No such employee id is available'
					$scope.errorSearchByName = ''
				}
			});
		}
	}]);