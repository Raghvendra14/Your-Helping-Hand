var Model = require('./Base'),
	model = new Model()

module.exports = model.extend({
	insertUserDetails: function(data, callback) {
		this.user_detail_collection().insertOne(data, callback)
	},
	insertLgCredentials: function(data, callback) {
		this.lg_cred_collection().insertOne(data, callback)
	},
	update: function(data, callback) {
		// write update code here
	},
	getLgCredentials: function(callback, query) {
		this.lg_cred_collection().find(query).toArray(callback)
	},
	getUserDetails: function(callback, query) {
		this.user_detail_collection().find(query).toArray(callback)
	},
	checkUsernameAvailability: function(callback, query, project) {
		this.user_detail_collection().find(query).project(project).toArray(callback)
	},
	remove: function(ID, callback) {
		// write remove code here
	}
})