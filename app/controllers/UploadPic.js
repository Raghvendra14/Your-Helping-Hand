var BaseController = require('./Base'),
	awsService = require('../services/AWSS3Upload')

module.exports = BaseController.extend({
	name: 'updatePic',
	run: function (req, res, next) {
		var file = req.files.file
		var destPath = "userpics/" + req.params.name + "/profile/profilepic.jpg"
		awsService.uploadFiles(file.path, destPath, function () {
			res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate")
			res.setHeader("Pragma", "no-cache")
			res.setHeader("Expires", "0")
			res.sendStatus(200)
		})
	}
})