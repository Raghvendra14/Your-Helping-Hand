var BaseController = require('./Base'),
	model = new (require('../models/ContentModel')),
	shortId = require('shortid')

module.exports = BaseController.extend({
	name: 'finalizeSchedule',
	run: function (req, res, next) {
		if (req.session.yourhelpinghand &&
			req.session.yourhelpinghand === true &&
			req.session.username && req.empId) {
			var self = this
			var selectedEmpId = req.empId
			model.setDB(req.db)
			self.updateEmployeeStatus(req, selectedEmpId, function (isErrorOccured) {
				if (isErrorOccured === true) {
					req.statusMessage = false
					return next()
				} else if (isErrorOccured === false) {
					var scheduleId = shortId.generate()
					self.insertAppointmentData(req, selectedEmpId, scheduleId, function (isValueNotInserted) {
						if (isValueNotInserted === true) {
							req.statusMessage = false
							return next()
						} else if (isValueNotInserted === false) {
							self.insertUserAppHistory(req, selectedEmpId, scheduleId, function (isUserAppValueInserted) {
								if (isUserAppValueInserted === true) {
									req.statusMessage = false
									return next()
								} else if (isUserAppValueInserted === false) {
									req.scheduleId = scheduleId
									return next()
								}
							})
						}
					})
				}
			})
			
		} else {
			return next()
		}
	},
	updateEmployeeStatus: function(req, selectedEmpId, callback) {
		model.updateEmployeesStatus(function (err, result) {
				if (err) {
					callback(true)
				} else {
					callback(false)
				}
			}, {
				empId: selectedEmpId
			}, {
				$set: {
					status: 'Not Available'
				}
			}, req.body.category.toString())
	},
	insertAppointmentData: function(req, empId, scheduleId, callback) {
		model.getAppointmentDetails(function (err, data) {
			if (err) {
				callback(true)
			} else {
				var appDataArray = {
					scheduleId: scheduleId,
					category: req.body.category,
					time: req.body.calender,
					customername: req.session.username,
					customeraddress: req.userAddress,
					customerPincode: req.pincode,
					description: req.body.servicedesc,
					paymentMode: req.body.paymentMode
				}

				if (data.length >= 1) {
					model.appendAppointmentDetails(function (err, result) {
						if (err) {
							callback(true)
						} else {
							callback(false)
						}
					}, {
						empId: empId
					}, {
						$push: {
							appData: appDataArray
						}
					})
				} else if (data.length === 0) {
					var appointmentData = {
						empId: empId,
						appData: [appDataArray]
					}
					model.insertAppointmentDetails(appointmentData, function (err, object) {
						if (err) {
							callback(true)
						} else {
							console.log(object.insertedCount + " appointment inserted.")
							callback(false)
						}
					})
				}
			}
		}, {
			empId: empId
		}, {
			empId: 1
		})
	},
	insertUserAppHistory: function (req, empId, scheduleId, callback) {
		model.getProjectedUserDetails(function (err, data) {
			if (err) {
				callback(true)
			} else {
				var appHistory = {
					scheduleId: scheduleId,
					empId: empId,
					category: req.body.category,
					time: req.body.calender,
					customeraddress: req.userAddress,
					customerPincode: req.pincode,
					description: req.body.servicedesc,
					paymentMode: req.body.paymentMode
				}
				model.updateUserDetails(function (err, result) {
					if (err) {
						callback(true)
					} else {
						callback(false)
					}
 				}, {
					username: req.session.username
				}, {
					$push: {
						app_history: appHistory
					}
				})
			}
		}, {
			username: req.session.username
		}, {
			app_history: 1
		})

	}
})