var BaseController = require('./Base'),
	awsService = require('../services/AWSS3Upload')

module.exports = BaseController.extend({
	name: 'updatePic',
	run: function (req, res, next) {
		var file = req.files.file
		var destPath = "userpics/" + req.params.name + "/profile/profilepic.jpg"
		awsService.uploadFiles(file.path, destPath, function () {
			res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')	
			res.redirect("/profile/" + req.params.name)
		})
	}
})