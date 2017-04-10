var BaseController = require('./Base'),
	View = require('../views/Base'),
	model = new(require('../models/ContentModel'))

module.exports = BaseController.extend({
	name: 'register',
	run: function (req, res, next) {
		var self = this
		model.setDB(req.db)
		if (req.method === 'POST' &&
			req.body.username &&
			req.body.email &&
			req.body.fullname &&
			req.body.address &&
			req.body.pincode &&
			req.body.phnumber &&
			req.body.password &&
			req.body.confirm_password) {
			model.checkUsernameAvailability(function (err, data) {
				if (err) {
					self.renderRegister(false, false, res, self)
				}
				if (data.length != 0) {
					if (data[0].username === req.body.username &&
								data[0].email === req.body.email) {
						self.renderRegister(true, true, res, self)
					} else if (data[0].username === req.body.username) {
						self.renderRegister(true, false, res, self)
					} else if (data[0].email === req.body.email) {
						self.renderRegister(false, true, res, self)
					}
				} else {
					var userdata = {
						username: req.body.username,
						email: req.body.email,
						fullname: req.body.fullname,
						address: req.body.address,
						pincode: req.body.pincode,
						phnumber: req.body.phnumber
					}
					model.insertUserDetails(userdata, function (err, objects) {
						if (err) {
							self.renderRegister(false, false, res, self)
						} else {
							console.log(objects.insertedCount + " User registered.")
						}
					})
					var userCredentials = {
						username: req.body.username,
						password: req.body.password
					}
					model.insertLgCredentials(userCredentials, function (err, objects) {
						if (err) {
							self.renderRegister(false, false, res, self)
						} else {
							console.log(objects.insertedCount + " User Credential inserted.")
							req.session.yourhelpinghand = true
							req.session.username = req.body.username
							req.session.save()
							res.redirect('/profile/' + req.body.username)
						}
					})
				}
			}, 
			{	$or: [
				{
					username: req.body.username
				}, 
				{
					email : req.body.email
				}
			]},
			{
				username: 1,
				email: 1
			})
		} else {
			self.renderRegister(false, false, res, self)
		}
	},
	renderRegister: function(isUsernameAlreadyTaken, isEmailAlreadyTaken, res, self) {
		var v = new View(res, 'login_reg');
		self.content = {}
		if (isUsernameAlreadyTaken && isEmailAlreadyTaken) {
			self.content.usernameTaken = "Username already taken."
			self.content.emailTaken = "Email id already taken."
			self.content.retry = ""
		} else if (isUsernameAlreadyTaken) {
			self.content.usernameTaken = "Username already taken."
			self.content.emailTaken = ""
			self.content.retry = ""
		} else if (isEmailAlreadyTaken) {
			self.content.usernameTaken = ""
			self.content.emailTaken = "Email id already taken."
			self.content.retry = ""
		} else {
			self.content.usernameTaken = ""
			self.content.emailTaken = ""
			self.content.retry = "Error during registration. Try Again!"
		}
		v.render(self.content)
	}
})