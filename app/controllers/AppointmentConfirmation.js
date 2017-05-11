var BaseController = require('./Base'),
	View = require('../views/Base'),
	model = new (require('../models/ContentModel'))

module.exports = BaseController.extend({
	name: 'appointmentconfir',
	content: null,
	run: function (req, res) {
		if (req.empId) {
			console.log('Confirmed Appointment')
			var data = {
				scheduleId : req.scheduleId		
			}
			res.status(200).send(data)
		} else if (req.statusMessage !== null) {
			console.log('Appointment Declined')
			var error = {
				statusBool: req.statusMessage
			}
			res.status(400).send(error)
		}			
	},
	displayConfirmation: function (req, res, next) {
		var self = this
		model.setDB(req.db)
		if (req.session.yourhelpinghand &&
			req.session.yourhelpinghand === true &&
			req.session.username && req.query.id) {
			model.getProjectedUserDetails(function (err, records) {
				if (err) {
					res.sendStatus(404)
				} else {
					if (records.length !== 0) {
						model.getProjectedEmployeeDetails(function (err, data) {
							if (err) {
								res.sendStatus(404)
							} else {
								if (data.length !== 0) {
									self.content = {
										username: req.session.username,
										userfullname: records[0].fullname,
										userAddress: records[0].app_history[0].customeraddress,
										userPincode: records[0].app_history[0].customerPincode,
										userPhnumber: records[0].phnumber,
										userProfilePic: "https://s3-us-west-1.amazonaws.com/yhhprofilepicfolder/userpics/" + 
											req.session.username + "/profile/profilepic.jpg",
										empProfilePic: "https://s3-us-west-1.amazonaws.com/yhhprofilepicfolder/employeepics/" +
											records[0].app_history[0].empId + "/profile/profilepic.jpg",
										empname: data[0].name,
										empPhnumber: data[0].phnumber,
										empCategory: records[0].app_history[0].category,
										time: records[0].app_history[0].time,
										description: records[0].app_history[0].description,
										paymentMode: records[0].app_history[0].paymentMode,
										scheduleId: req.query.id
									}
									var v = new View(res, 'orderConfirm')
									v.render(self.content)
								} else {
									res.sendStatus(404)
								}
							}
						}, {
							empId: records[0].app_history[0].empId
						}, {
							name: 1,
							phnumber: 1
						})
					} else {
						res.sendStatus(404)
					}
				}
			}, {
				username: req.session.username
			}, {
				fullname: 1,
				phnumber: 1,
				app_history: {
					$elemMatch: {
						scheduleId: req.query.id
					}
				}
			})
		} else {
			res.redirect('/login')
		}
	}
})