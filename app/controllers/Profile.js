var BaseController = require('./Base'),
	View = require('../views/Base'),
	model = new (require('../models/ContentModel'))

module.exports = BaseController.extend({
	name: 'profile',
	run: function (req, res, next) {
		if (req.session.yourhelpinghand) {
			var self = this
			model.setDB(req.db)
			this.getUserDetails(req, res, self)
			
		} else {
			res.redirect('/login')
		}
		
		// handle edits in profile here
	},
	getUserDetails: function(req, res, self) {
		if (req.session.username) {
			model.getUserDetails(function (err, data) {
				if (err) {
					self.renderLogin(res, self)
				} 
				if (data.length != 0) {
					var userData = data[0]	
					var profilePic = "https://s3-us-west-1.amazonaws.com/yhhprofilepicfolder/" + 
						req.session.username + "/profile/profilepic.jpg"
					userData.profilePic = profilePic
					var v = new View(res, 'profile')
					v.render(userData)
				}
			}, 
			{
				username: req.session.username
			})
		} else {
			self.renderLogin(res, self)
		}
	},
	renderLogin: function(res, self) {
		var v = new View(res, 'login-reg')
		self.content = {}
		self.content.retry = 'Error loading profile. Try Again!'
		v.render(self.content)
	}
})