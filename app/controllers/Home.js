var BaseController = require('./Base'),
	View = require('../views/Base')

module.exports = BaseController.extend({
	name: 'home',
	content: null,
	run: function (req, res, next) {
		var self = this
		var v = new View(res, 'home')
		v.render(self.content)
	}
})