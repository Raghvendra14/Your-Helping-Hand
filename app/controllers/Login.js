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
					self.renderLogin(false, false, res, self)
				}
				if (data.length != 0) {
					if (data[0].username === req.body.username && data[0].password === req.body.password) {
						req.session.yourhelpinghand = true
						req.session.username = req.body.username
						req.session.save()
						res.redirect('/profile/' + req.body.username)
					} else if (data[0].username != req.body.username) {
						self.renderLogin(true, false, res, self)
					} else if (data[0].password != req.body.password) {
						self.renderLogin(false, true, res, self)
					}
					
				} else {
					self.renderLogin(true, true, res, self)
				}
			}, 
			{	$or: [
				{
					username: req.body.username
				},
				{
					password: req.body.password
				}]
			})
		} else {
			self.renderLogin(false, false, res, self)
		}
	},
	renderLogin: function(incorrect_username_bool, incorrect_password_bool, res, self) {
		var v = new View(res, 'login_reg');
		self.content = null
		if (incorrect_username_bool && !incorrect_password_bool) {
			self.content = {}
			self.content.incorrect_username = "Username is incorrect"
			self.content.incorrect_password = ""
		} else if (!incorrect_username_bool && incorrect_password_bool) {
			self.content = {}
			self.content.incorrect_username = ""
			self.content.incorrect_password = "Password is incorrect"
		} else if (incorrect_username_bool && incorrect_password_bool) {
			self.content = {}
			self.content.incorrect_username = "Username is incorrect"
			self.content.incorrect_password = "Password is incorrect"
		}
		v.render(self.content);
	}
})