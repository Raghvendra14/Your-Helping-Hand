var googleMapsClient = require('@google/maps').createClient({
	key: 'AIzaSyC-AtHm2DlQhAkgJhW2Fg5ml3U7l0GuznI'
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