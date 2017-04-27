var app = angular.module('FormUpload', ['ngFileUpload']);
      app.controller('formUploadCntrl', ['$scope', 'Upload', function ($scope, Upload) {
        $scope.uploadForm = function (file) {
          if (file) {
            Upload.upload({
              url: '/cpanel',
              data: {
                  file: file,
                  info: Upload.json({
                    fullname: $scope.fullname,
                    address: $scope.address,
                    city: $scope.city,
                    country: $scope.country,
                    pincode: $scope.pincode,
                    phnumber: $scope.phnumber,
                    aadhaar: $scope.aadhaar,
                    bankAccount: $scope.bankAccount,
                    bankName: $scope.bankName,
                    category: $scope.category
                  })
              }
            });
          }
        }
      }]);