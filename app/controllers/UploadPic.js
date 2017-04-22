var BaseController = require('./Base'),
	View = require('../views/Base'),
	model = new (require('../models/ContentModel')),
	s3 = require('s3')
	s3Client = s3.createClient({
		s3Options: {
			accessKeyId: "AKIAIFSARA4FE4VGN6DA",
			secretAccessKey: "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"
		}
	})

module.exports = BaseController.extend({
	name: 'updatePic',
	content: null,
	run: function (req, res, next) {
		var self = this
		model.setDB(req.db)
		var file = req.files.file
		var extension = file.path.substring(file.path.lastIndexOf('.'))
		var destPath = req.params.name + "/profile/profilepic" + extension
		console.log(file.path)
		var params = {
			localFile: file.path,	
			s3Params: {
				Bucket: "yhhprofilepics",
				Key: destPath
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
			var v = new View(res, 'profile')
			v.render(self.content)
		})
	}
})