var BaseController = require('./Base'),
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
				if (isServiceNotAvailable !== null) {
					req.statusMessage = isServiceNotAvailable
					return next()
				} else if (data !== null) {
					self.fetchUserLocation(req, function (isUserLocationNotAvailable, userLocation) {
						if (isUserLocationNotAvailable !== null) {
							req.statusMessage = isUserLocationNotAvailable
							return next()
						} else if (userLocation!== null) {
							var userFullLoc = userLocation[0].address + ', ' + userLocation[0].pincode
							var promises = data.map(function (list) {
								return new Promise(function(resolve, reject) {
									self.fetchEmployeeLocation(list, function (isEmpLocNotAvailable, employeeLocation) {
										if (isEmpLocNotAvailable !== null) {
											req.statusMessage = isEmpLocNotAvailable
											return next()
										} else if (employeeLocation !== null) {
											var empFullLoc = employeeLocation[0].address + ', ' + employeeLocation[0].city + ', ' + employeeLocation[0].country + ', ' + employeeLocation[0].pincode
											googleMapsWS.getDistance(userFullLoc, empFullLoc, function (response) {
												if (response === null) {
													req.statusMessage = false
													return reject()
												} else {
													var distance = parseFloat(response.rows[0].elements[0].distance.text.toString().split(' ')[0])
													var returnObject = {
														empId: employeeLocation[0].empId,
														distance: distance
													}
													resolve(returnObject)
												}
											})
										}		
									})
								})
							})
							Promise.all(promises)
							.then(function(distanceArray) {
								var smallestDistance = 15.0 // distance should be less than 15 kilometers for any employee to get assigned the task
								var bestAvailableEmpId = null // Best Employee Id
								for (var object of distanceArray) {
									if (object.distance <= smallestDistance) {
										smallestDistance = object.distance
										bestAvailableEmpId = object.empId
									}
								}
								if (bestAvailableEmpId === null) {
									req.statusMessage = true
								} else {
									req.empId = bestAvailableEmpId
									req.userAddress = userLocation[0].address
									req.pincode = userLocation[0].pincode
								}
								return next()
							})
						}
					})
				}	
			}) 
		} else {
			req.statusMessage = false
			return next()
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
			empId: list.empId
		}, {
			empId: 1,
			address: 1,
			city: 1,
			country: 1,
			pincode: 1
		})
	}
})