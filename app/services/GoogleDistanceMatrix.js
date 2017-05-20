var googleMapsClient = require('@google/maps').createClient({
	key: 'Enter your google maps API key here'
})

module.exports = { 
	//Get the distance.
	getDistance: function (origin_address, destination_address, callback) {
		googleMapsClient.distanceMatrix({
			origins: origin_address,
			destinations: destination_address
		}, function (err, response) {
			if (err) {
				callback(null)
			} else {
				callback(response.json)
			}
		})
	}
}