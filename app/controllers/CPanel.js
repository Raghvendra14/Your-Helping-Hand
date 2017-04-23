var BaseController = require('./Base'),
	View = require('../views/Base'),
	model = new (require('../models/ContentModel')),
	shortId = require('shortid')

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
		if (req.session.yhhadmin && req.method === 'POST' &&
			req.body.fullname &&
			req.body.address &&
			req.body.pincode &&
			req.body.phnumber &&
			req.body.category) {
			var self = this
			model.setDB(req.db)
			var employeeId = req.body.fullname + shortId.generate()
			var employeeData = {
				empID: employeeId, 
				name: req.body.fullname,
				address: req.body.address,
				pincode: req.body.pincode,
				phnumber: req.body.phnumber,
				category: req.body.category
			}
			model.insertEmployeeDetails(employeeData, function (err, objects) {
				if (err) {
					self.renderAdminReg(false, req, res, self, null)
				} else {
					console.log(objects.insertedCount + " Employee added.")
				}
			})
			var employeeCategory = {
				empId : employeeId,
				status: 'Available'
			}
			model.insertCategoryData(req.body.category, employeeCategory, function (err, objects) {
				if (err) {
					self.renderAdminReg(false, req, res, self, null)
				} else {
					self.renderAdminReg(true, req, res, self, employeeId)
				}
			})
		} else {
			self.renderAdminReg(false, req, res, self, null)
		}
	},
	renderAdminReg: function (isSuccessfullyInserted, req, res, self, empId) {
		var v = new View(res, 'admin')
		self.content = {
			adminname: req.session.adminname
		}
		if (isSuccessfullyInserted) {
			self.content.success = 'Successfully added employee detail with ID: ' + empId + '.'
			self.content.err = '' 
		} else {
			self.content.success = ''
			self.content.err = 'Some error occured. Please try again.'
		}
		console.log(self.content)
		v.render(self.content)
	}
})