var s3 = require('s3'),
	s3Client = s3.createClient({
		s3Options: {
			accessKeyId: "Enter your access key here",
			secretAccessKey: "Enter your secret key here",
			region: "us-west-1" 
		}
	})

module.exports = {
	deleteFiles: function(filePath, callback) {
		var s3Params = {
			Bucket: "yhhprofilepicfolder",
			Prefix: filePath
		};

		var deleter = s3Client.deleteDir(s3Params);
		deleter.on('error', function (err) {
			console.error("unable to delete: ", err.stack)
		})

		deleter.on('progress', function () {
			console.log('progress', deleter.progressAmount, deleter.progressTotal)
		})

		deleter.on('end', function() {
			console.log('done deleting')
			callback()
		})
	}
}