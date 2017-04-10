var BaseController = require('./Base'),
	View = require('../views/Base'),
	model = new (require('../models/ContentModel'))

module.exports = BaseController.extend({
	name: 'login',
	run: function (req, res, next) {
		var self = this
		model.setDB(req.db)
		this.authorize(req, res, self)
	},
	authorize: function(req, res, self) {
		if (req.session && req.session.yourhelpinghand 
			&& req.session.yourhelpinghand === true) {
			res.redirect('/profile/' + req.session.username)
		} else if (req.method === 'POST' && req.body.username && req.body.password) {
			model.getLgCredentials(function (err, data) {
				if (err) {
					self.renderLogin(true, res, self)
				}
				if (data.length != 0) {
					req.session.yourhelpinghand = true
					req.session.username = req.body.username
					req.session.save()
					res.redirect('/profile/' + req.body.username)
				} else {
					self.renderLogin(true, res, self)
				}
			}, 
			{	
				username: req.body.username,
				password: req.body.password 
			})
		} else {
			self.renderLogin(false, res, self)
		}
	},
	renderLogin: function(incorrect_credenitials, res, self) {
		var v = new View(res, 'login_reg');
		self.content = null
		if (incorrect_credenitials) {
			self.content = {}
			self.content.incorrect_username = "Username is incorrect"
			self.content.incorrect_password = "Password is incorrect"
		}
		v.render(self.content);
	}
})