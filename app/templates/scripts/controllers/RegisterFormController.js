angular.module('loginRegForm', []).controller('registerFormCntrl', ['$scope', '$http', '$window', function ($scope, $http, $window) {
	$scope.register = function() {
		var data = {
			username: $scope.username,
			email: $scope.email,
			fullname: $scope.fullname,
			address: $scope.address,
			pincode: $scope.pincode,
			phnumber: $scope.phnumber,
			password: $scope.password,
			confirm_password: $scope.confirm_password
		}
		$http.post('/register', data)
		.then(function (response) {
			if (response.data.username !== null) {
				$scope.usernameTaken = ''
				$scope.emailTaken = ''
				$window.location = '/profile/' + response.data.username
			}
		}, function (response) {
			if (response.data.usernameTaken !== null && response.data.emailTaken !== null) {
				$scope.usernameTaken = response.data.usernameTaken
				$scope.emailTaken = response.data.emailTaken
			} else if (response.data.usernameTaken !== null) {
				$scope.usernameTaken = response.data.usernameTaken
				$scope.emailTaken = ''
			} else if (response.data.emailTaken !== null) {
				$scope.emailTaken = response.data.emailTaken
				$scope.usernameTaken = ''
			}
		})
	}
}]);