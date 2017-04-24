var BaseController = require('./Base'),
	View = require('../views/Base'),
	model = new (require('../models/ContentModel'))

module.exports = BaseController.extend({
	name: 'appointmentconfir',
	content: null,
	run: function (req, res) {
		var self = this
		console.log('Confirmed Appointment')
		model.setDB(req.db)
		if (req.session.yourhelpinghand &&
			req.session.yourhelpinghand === true &&
			req.session.username) {
			if (req.empID) {
				var assignId = req.empID	
				model.getProjectedEmployeeDetails(function (err, data) {
					if (err) {
						self.renderProfile(req, res)
					} else {
						if (data.length !== 0) {
							model.getProjectedUserDetails(function (er, records) {
								if (err) {
									self.renderProfile(req, res)
								} else {
									if (records.length !== 0) {
										self.content = {
											username: req.session.username,
											userfullname: records.fullname,
											userAddress: records.address,
											userPincode: records.pincode,
											userPhnumber: records.phnumber,
											userProfilePic: "https://s3-us-west-1.amazonaws.com/yhhprofilepicfolder/" + 
												req.session.username + "/profile/profilepic.jpg",
											empname: data.name,
											empAddress: data.address,
											empCategory: req.body.category,
											time: req.body.calender,
											description: req.body.servicedesc,
											paymentMode: req.body.paymentMode
										}
										var v = new View(res, 'orderConfirm')
										v.render(self.content)
									}
								}
							}, {
								username: req.session.username
							}, {
								fullname: 1,
								address: 1,
								pincode: 1,
								phnumber: 1
							})
						} else { 
							self.renderProfile(req, res)
						}
					}
				}, {
					empID: assignId
				}, {
					name: 1,
					phnumber: 1
				})
			} else if (req.statusMessage) {
				self.renderProfile(req, res)
			}			
		} else {
			res.redirect('/login')
		}
	},
	renderProfile: function(req, res) {
		// Still have to decide how to send the error message to the page
		res.redirect('/profile/' + req.session.username)
	}
})