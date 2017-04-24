var BaseController = require('./Base'),
	View = require('../views/Base'),
	model = new (require('../models/ContentModel'))

module.exports = BaseController.extend({
	name: 'schedule',
	run: function (req, res, next) {
		var self = this
		model.setDB(req.db)
		if (req.method === 'POST' &&
			req.body.category &&
			req.body.calender &&
			req.body.servicedesc &&
			req.session.yourhelpinghand &&
			req.session.yourhelpinghand === true &&
			req.session.username) {
			self.checkServiceAvailability(req, res, self, function (data) {
				console.log('Data by callback: ' + data)
			}) 
		} else {
			self.renderProfile(false, res, self)
		}
	},
	checkServiceAvailability: function (req, res, self, callback) {
		model.getServiceInfo(function (err, data) {
			if (err) {
				self.renderProfile(false, res, self)
			} else {
				if (data.length !== 0) {
					console.log(data)
				} else {
					self.renderProfile(true, res, self)
				}
			}
		}, {
			status: 'Available'
		}, req.body.category)
	}, 
	renderProfile: function(isServiceAvailable, res, self) {
		var v = new View(res, 'profile')
		self.content = {}
		if (isServiceAvailable) {
			self.content.noServiceAvailable = 'Sorry, No service available at this moment. Please try again later.'
			self.content.err = ''
		} else {
			self.content.noServiceAvailable = ''
			self.content.err = 'Some error occured. Please try again.'
		}
		v.render(self.content)
	}
})