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
	}
}