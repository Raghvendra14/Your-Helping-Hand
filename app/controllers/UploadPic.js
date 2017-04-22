var BaseController = require('./Base'),
	s3 = require('s3')
	s3Client = s3.createClient({
		s3Options: {
			accessKeyId: "AKIAIFSARA4FE4VGN6DA",
			secretAccessKey: "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",
			region: "us-west-1"
		}
	})

module.exports = BaseController.extend({
	name: 'updatePic',
	run: function (req, res, next) {
		var file = req.files.file
		var destPath = req.params.name + "/profile/profilepic.jpg"
		var params = {
			localFile: file.path,	
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
			res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
			res.redirect("/profile/" + req.params.name)
		})
	}
})