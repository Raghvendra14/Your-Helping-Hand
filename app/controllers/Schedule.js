var BaseController = require('./Base'),
	View = require('../views/Base'),
	// 'new' keyword is used to generate a new 'this' value and invokes requires as a constructor
	model = new (require('../models/ContentModel')),
	googleMapsWS = require('../services/GoogleDistanceMatrix')

module.exports = BaseController.extend({
	name: 'schedule',
	run: function (req, res, next) {
		var self = this
		model.setDB(req.db)
		if (req.method === 'POST' &&
			req.body.category &&
			req.body.calender &&
			req.body.servicedesc &&
			req.session.yourhelpinghand &&
			req.session.yourhelpinghand === true &&
			req.session.username &&
			req.body.paymentMode) {
			self.checkServiceAvailability(req, function (isServiceNotAvailable, data) {
				if (isServiceNotAvailable === true) {
					self.renderProfile(isServiceNotAvailable, res, self)
				} else if (isServiceNotAvailable === false) {
					self.renderProfile(!isServiceNotAvailable, res, self)
				} else if (data !== null) {
					self.fetchUserLocation(req, function (isUserLocationNotAvailable, userLocation) {
						if (isUserLocationNotAvailable === true) {
							self.renderProfile(isUserLocationNotAvailable, res, self)
						} else if (isUserLocationNotAvailable === false) {
							self.renderProfile(!isUserLocationNotAvailable, res, self)
						} else if (userLocation!== null) {
							console.log(userLocation)
							var userFullLoc = userLocation[0].address + ', ' + userLocation[0].pincode
							var smallestDistance = 0 // Temp variable
							var bestAvailableEmpId = null
							data.forEach(function (list) {
								self.fetchEmployeeLocation(list, function (isEmpLocNotAvailable, employeeLocation) {
									if (isEmpLocNotAvailable === true) {
										self.renderProfile(isEmpLocNotAvailable, res, self)
									} else if (isEmpLocNotAvailable === false) {
										self.renderProfile(!isEmpLocNotAvailable, res, self)
									} else if (employeeLocation !== null) {
										console.log('Returned location value: \n')
										console.log(employeeLocation)
										var empFullLoc = employeeLocation[0].address + ', ' + employeeLocation[0].pincode
										googleMapsWS.getDistance(userFullLoc, empFullLoc, function (response) {
											if (response === null) {
												self.renderProfile(false, res, self)
											} else {
												// console.log(response)
												var distance = parseFloat(response.rows[0].elements[0].distance.text.toString().split(' ')[0])
												console.log('The distance in kilometers are:  ')
												console.log(distance)
												if (smallestDistance < distance) {
													smallestDistance = distance
													bestAvailableEmpId = employeeLocation[0].empID
												}
											}
										})
									}		
								})
							})
							console.log('Smallest distance available of userId: ')
							console.log(bestAvailableEmpId + 'present at ' + smallestDistance.toString() + ' Km away')
						}
					})
				}	
			}) 
		} else {
			self.renderProfile(false, res, self)
		}
	},
	checkServiceAvailability: function (req, callback) {
		model.getServiceInfo(function (err, data) {
			if (err) {
				callback(false, null)
			} else {
				if (data.length !== 0) {
					callback(null, data)
				} else {
					callback(true, null)
				}
			}
		}, {
			status: 'Available'
		}, req.body.category)
	}, 
	fetchUserLocation: function (req, callback) {
		model.getProjectedUserDetails(function (err, data) {
			if (err) {
				callback(false, null)
			} else {
				if (data.length !== 0) {
					callback(null, data)
				} else {
					callback(true, null)
				}
			}
		}, {
			username: req.session.username
		}, {
			address: 1,
			pincode: 1
		})
	}, 
	fetchEmployeeLocation: function (list, callback) {
		model.getProjectedEmployeeDetails(function (err, data) {
			if (err) {
				callback(false, null)
			} else {
				if (data.length !== 0) {
					callback(null, data)
				} else {
					callback(true, null)
				}
			}
		}, {
			empID: list.empId
		}, {
			empId: 1,
			address: 1,
			pincode: 1
		})
	},
	/* Fix this code for any error case */
	renderProfile: function(isServiceAvailable, res, self) {
		var v = new View(res, 'profile')
		self.content = {}
		if (isServiceAvailable) {
			self.content.noServiceAvailable = 'Sorry, No service available at this moment. Please try again later.'
			self.content.err = ''
		} else {
			self.content.noServiceAvailable = ''
			self.content.err = 'Some error occured. Please try again.'
		}
		v.render(self.content)
	}
})