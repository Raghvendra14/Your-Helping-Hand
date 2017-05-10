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
	},
	getUserDetails: function(req, res, self) {
		if (req.session.username) {
			model.getUserDetails(function (err, data) {
				if (err) {
					self.renderLogin(res, self)
				} 
				if (data.length != 0) {
					var userData = data[0]	
					var profilePic = "https://s3-us-west-1.amazonaws.com/yhhprofilepicfolder/userpics/" + 
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
	edit: function (req, res, next) {
		model.setDB(req.db)
		model.updateUserDetails(function (err, results) {
			if (err) {
				res.sendStatus(500)
			} else {
				res.sendStatus(200)
			}
		}, {
			username: req.session.username
		}, {
			$set: {
				address: req.body.address,
				pincode: req.body.pincode,
				phnumber: req.body.phnumber
			}
		})
	},
	renderLogin: function(res, self) {
		var v = new View(res, 'login-reg')
		self.content = {}
		self.content.retry = 'Error loading profile. Try Again!'
		v.render(self.content)
	}
})