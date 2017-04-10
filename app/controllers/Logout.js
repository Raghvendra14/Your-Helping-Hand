var BaseController = require('./Base'),
	View = require('../views/Base')

module.exports = BaseController.extend({
	name: 'logout',
	run: function(req, res, next) {
		req.session.destroy(function (err) {
			if (err) {
				console.error(err)
			} else {
				res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
				res.redirect('/login')
			}
		})
	}
})
