var express = require('express')

// Location of the routes file.
var routes = require('./app/routes/routes.js')


// Require mongoose to manipulate MongoDB
var mongoose = require('mongoose')


// Require passport to accept logins
var passport = require('passport')


// Control logins with express-session
var session = require('express-session')



// Initialize app
var app = express()

// Config file for YELP
require('./app/config/yelp.js')

var oauth = OAuth({
	consumer: {
		key: process.env.YELP_CONSUMER_KEY,
		secret: process.env.YELP_CONSUMER_SECRET
	},
	signature_method: 'HMAC-SHA1',
	hash_function: function(base_string, key) {
		return crypto.createHmac('sha1', key).update(base_string).digest('base64');
	}
})


// Enables the use of .env file in root folder
require('dotenv').load()

// Point to the passport config file
require('./app/config/passport.js')

// Initialize mongoose with the .env variable
mongoose.connect(process.env.MONGO_URI)
mongoose.Promise = global.Promises


// Set pug as view engine
app.set('view engine', 'pug')
// Set the views directory
app.set('views', './app/views')
// Set public folder for assets
app.use(express.static('./public'))

// Used to keep session during page changes
app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: true
}))

// Invoke the app to the routes file
routes(app, request, oauth)

// This makes the app always listen for querys
var port = process.env.PORT || 3000;
app.listen(port, function() {
	console.log('Node.js listenting on port ' + port + '...')
})