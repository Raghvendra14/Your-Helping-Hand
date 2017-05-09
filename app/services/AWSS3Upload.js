var s3 = require('s3'),
	s3Client = s3.createClient({
		s3Options: {
			accessKeyId: "Enter your access key here",
			secretAccessKey: "Enter your secret key here",
			region: "us-west-1"
		}
	})

module.exports = {
	uploadFiles: function(srcPath, destPath, callback) {
		var params = {
			localFile: srcPath,	
			s3Params: {
				Bucket: "yhhprofilepicfolder",
				Key: destPath,
				ACL: 'public-read',
				CacheControl: 'max-age=0'
			}
		}

		var uploader = s3Client.uploadFile(params)
		uploader.on('error', function (err) {
			console.error('Unable to upload:', err.stack)
		})
		
		uploader.on('progress', function() {
			console.log('progress', uploader.progressMd5Amount,
				uploader.progressAmount, uploader.progressTotal)
		})		

		uploader.on('end', function() {
			console.log('done uploading')
			callback()
		})
	}
}