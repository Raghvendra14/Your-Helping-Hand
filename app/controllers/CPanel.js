var BaseController = require('./Base'),
	View = require('../views/Base'),
	model = new (require('../models/ContentModel')),
	shortId = require('shortid'),
	awsService = require('../services/AWSS3Upload')

module.exports = BaseController.extend({
	name: 'cpanel',
	run: function (req, res, next) {
		if (req.session.yhhadmin) {
			var self = this
			var v = new View(res, 'admin')
			self.content = {
				adminname: req.session.adminname
			}
			v.render(self.content)
			
		} else {
			res.redirect('/admin')
		}
	},
	uploadEmployeeDetails: function (req, res, next) {
		var JSONinfo = JSON.parse(req.body.info)
		var self = this
		if (req.session.yhhadmin && req.method === 'POST' &&
			JSONinfo.fullname &&
			JSONinfo.address &&
			JSONinfo.city &&
			JSONinfo.country &&
			JSONinfo.pincode &&
			JSONinfo.phnumber &&
			JSONinfo.aadhaar &&
			JSONinfo.bankAccount &&
			JSONinfo.bankName &&
			req.files.file) {
			if (JSONinfo.category === null) {
				JSONinfo.category = "Electrician"
			}
			model.setDB(req.db)
			var employeeId = JSONinfo.fullname.toString().split(' ')[0] + shortId.generate()
			var srcPath = req.files.file.path
			var destPath = "employeepics/" + employeeId + "/profile/profilepic.jpg"
			awsService.uploadFiles(srcPath, destPath, function () {
				console.log('Employee Profile Pic Uploaded.')
				var employeeData = {
					empId: employeeId, 
					name: JSONinfo.fullname,
					address: JSONinfo.address,
					city: JSONinfo.city,
					country: JSONinfo.country,
					pincode: JSONinfo.pincode,
					phnumber: JSONinfo.phnumber,
					aadhaarno: JSONinfo.aadhaar,
					bankAccount: JSONinfo.bankAccount,
					bankName: JSONinfo.bankName,
					category: JSONinfo.category
				}
				model.insertEmployeeDetails(employeeData, function (err, objects) {
					if (err) {
						self.renderAdminReg(false, req, res, self, null)
					} else {
						console.log(objects.insertedCount + " Employee added.")
					}
				})
				var employeeCategoryData = {
					empId : employeeId,
					status: 'Available'
				}
				model.insertCategoryData(JSONinfo.category, employeeCategoryData, function (err, objects) {
					if (err) {
						self.renderAdminReg(false, req, res, self, null)
					} else {
						self.renderAdminReg(true, req, res, self, employeeId)
					}
				})
			})
		} else {
			self.renderAdminReg(false, req, res, self, null)
		}
	},
	renderAdminReg: function (isSuccessfullyInserted, req, res, self, empId) {
		if (isSuccessfullyInserted) {
			res.status(200)
			self.content.success = 'Successfully added employee detail with ID: ' + empId
		} else {
			res.status(500)
			self.content.err = 'Some error occured. Please try again.'
		}
		res.json(self.content)
	}
})