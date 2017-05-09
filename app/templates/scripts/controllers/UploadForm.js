angular.module('FormUpload', ['ngFileUpload']).controller('formUploadCntrl', ['$scope', 'Upload', function ($scope, Upload) {
      $scope.uploadForm = function (file) {
        if (file) {
          file.upload = Upload.upload({
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

          file.upload.then(function (response) {
            if (response.status == 200) {
              $scope.fullname = ''
              $scope.address = ''
              $scope.city = ''
              $scope.country = ''
              $scope.pincode = ''
              $scope.phnumber = ''
              $scope.aadhaar = ''
              $scope.bankAccount = ''
              $scope.bankName = ''
              $scope.category = ''  
              $scope.success = response.data.success
              $scope.err = ''
              $scope.picFile = ''
              console.log($scope.success)
            }
          }, function (response) {
            if (response.status == 500) {
              $scope.success = ''
              $scope.err = response.data.err
              console.log($scope.err)
            }
          })
        }
      }
    }]);