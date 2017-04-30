module.exports = function(db) {
	this.db = db;
};

module.exports.prototype = {
	extend: function(properties) {
		var Child = module.exports
		Child.prototype = module.exports.prototype
		for (var key in properties) {
			Child.prototype[key] = properties[key]
		}
		return Child
	},
	setDB: function(db) {
		this.db = db
	},
	lg_cred_collection: function() {
		if (this._collection) return this._collection
		return this._collection = this.db.collection('login_credentials')
	},
	user_detail_collection: function() {
		if (this._userCollection) return this._userCollection
		return this._userCollection = this.db.collection('user_details')
	},
	admin_lg_collection: function() {
		if (this._adminCollection) return this._adminCollection
		return this._adminCollection = this.db.collection('admin_credentials')
	},
	employee_detail_collection: function() {
		if (this._empCollection) return this._empCollection
		return this._empCollection = this.db.collection('employee_details')
	},
	service_collection: function(category) {
		return this._serviceCollection = this.db.collection(category)
	}
}