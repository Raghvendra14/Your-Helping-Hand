var express = require('express'),
	app = express(),
	path = require('path'),
	mongo = require('mongodb').MongoClient,
	bodyParser = require('body-parser'),
	session = require('express-session'),
	url = 'mongodb://localhost:27017/yourhelpinghand',
	Home = require('./controllers/Home')
	Login = require('./controllers/Login')
	Register = require('./controllers/Register')
	Profile = require('./controllers/Profile')

app.set('views', __dirname + '/templates/html')
app.set('view engine', 'hjs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(session({
	secret: 'your-helping-hand',
	resave: true,
	saveUninitialized: true
	}))
app.use(express.static(path.join(__dirname, 'templates')))

mongo.connect(url, function (err, db) {
	if (err) {
		console.log('Sorry, there is no mongo db server running.')
		throw err
	} else {
		var attachDB = function (req, res, next) {
			req.db = db
			next()
		}
		app.all('/', attachDB, function (req, res, next) {
			Home.run(req, res, next)
		})
		app.all('/login', attachDB, function (req, res, next) {
			Login.run(req, res, next)
		})
		app.all('/register', attachDB, function (req, res, next) {
			Register.run(req, res, next)
		})
		app.all('/profile', attachDB, function (req, res, next) {
			Profile.run(req, res, next)
		})
		app.listen(3000, function() {
			console.log(
				'Successfully connected to mongodb://localhost:27017' +
				'\nExpress server listening on port 3000'
			)
		})
	}
	// db.close()
})