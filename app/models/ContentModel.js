var Model = require('./Base'),
	model = new Model()

module.exports = model.extend({
	insertUserDetails: function(data, callback) {
		this.user_detail_collection().insertOne(data, callback)
	},
	insertLgCredentials: function(data, callback) {
		this.lg_cred_collection().insertOne(data, callback)
	},
	insertEmployeeDetails: function(data, callback) {
		this.employee_detail_collection().insertOne(data, callback)
	},
	insertCategoryData: function(category, data, callback) {
		this.service_collection(category).insertOne(data, callback)
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
	getAdminCredentials: function(callback, query) {
		this.admin_lg_collection().find(query).toArray(callback)
	},
	getProjectedUserDetails: function(callback, query, project) {
		this.user_detail_collection().find(query).project(project).toArray(callback)
	},
	getProjectedEmployeeDetails: function(callback, query, project) {
		this.employee_detail_collection().find(query).project(project).toArray(callback)
	}, 
	getServiceInfo: function(callback, query, category) {
		this.service_collection(category).find(query).toArray(callback)
	},
	remove: function(ID, callback) {
		// write remove code here
	},
	getCollectionCount: function(callback) {
		this.employee_detail_collection().count(callback)
	}
})