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
	insertAppointmentDetails: function(data, callback) {
		this.appointment_collection().insertOne(data, callback)
	},
	updateUserDetails: function(callback, query, data) {
		this.user_detail_collection().updateOne(query, data, callback)
	},
	updateEmployeesStatus: function(callback, query, data, category) {
		this.service_collection(category).updateOne(query, data, callback)
	},
	appendAppointmentDetails: function(callback, query, data) {
		this.appointment_collection().updateOne(query, data, callback)
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
	getAppointmentDetails: function(callback, query, project) {
		this.appointment_collection().find(query).project(project).toArray(callback)
	},
	removeEmployeeData: function(callback, query) {
		this.employee_detail_collection().deleteOne(query, callback)
	},
	removeServiceData: function(callback, query, category) {
		this.service_collection(category).deleteOne(query, callback)
	},
	getCollectionCount: function(callback) {
		this.employee_detail_collection().count(callback)
	}
})