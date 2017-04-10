var Model = require('./Base'),
	model = new Model()

module.exports = model.extend({
	insert: function(data, callback) {
		// write insert code here
	},
	update: function(data, callback) {
		// write update code here
	},
	getLgCredentials: function(callback, query) {
		this.lg_cred_collection().find(query).toArray(callback)
	},
	remove: function(ID, callback) {
		// write remove code here
	}
})