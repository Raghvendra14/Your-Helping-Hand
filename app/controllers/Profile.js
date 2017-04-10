var BaseController = require('./Base'),
	View = require('../views/Base')

module.exports = BaseController.extend({
	name: 'profile',
	content: null,
	run: function (req, res, next) {
		var self = this
		var v = new View(res, 'profile')
		v.render(self.content)
		// handle edits in profile here
	}
})