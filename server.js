// Enables the use of .env file in root folder
require('dotenv').config()


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

var Yelp = require('yelp')

var yelp = new Yelp({
	consumer_key: process.env.YELP_CONSUMER_KEY,
	consumer_secret: process.env.YELP_CONSUMER_SECRET,
	token: process.env.YELP_TOKEN,
	token_secret: process.env.YELP_TOKEN_SECRET
})

// This is to read the query of the search post
var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))



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
routes(app, yelp)

// This makes the app always listen for querys
var port = process.env.PORT || 3000;
app.listen(port, function() {
	console.log('Node.js listenting on port ' + port + '...')
})