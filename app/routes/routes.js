var Bars = require('../models/bars.js')

module.exports = function(app, yelp, passport){

	var storedData
	var useStored = false

	function isLoggedIn(req, res, next){
		if(req.isAuthenticated()){
			return next()
		}else{
			res.redirect('/login')
		}
	}

	app.use(function(req, res, next){
		res.locals.user = req.user
		next()
	})

	app.get('/', function(req, res) {
		res.render('index')
	})

	app.get('/search', function(req, res) {
		res.redirect('/')
	})

	app.post('/search', function(req, res) {

		yelp.search({category_filter: 'bars', location: req.body.location})
		.then(function (data) {
			bars = data.businesses
			res.locals.bars = bars
			res.render('index')
		})
		.catch(function(err) {
			var data = err.data
			data = data.match(/"text": "(.*?(?="))/)
			res.locals.error = data[1] + '.'
			res.render('index')
		})
	})

	app.route('/auth/github')
		.get(passport.authenticate('github'))

	app.get('/auth/github/callback',
		passport.authenticate('github', { failureRedirect: '/login' }),
		function(req, res){
			res.redirect('/')
		})

	app.get('/logout', function(req, res){
		req.logout()
		res.redirect('/')
	})

	app.get('/rsvp/:id', function(req, res){
		console.log(req.params.id)
		Bars.findOne({id: req.params.id}, function(err, bar){
			if(bar){
				bar.rsvp++
				bar.save()
				useStored = true
				res.redirect('/')
			}else{
				var newBar = new Bars()
				newBar.id = req.params.id
				newBar.rsvp = 1
				newBar.save()
				useStored = true
				res.redirect('/')
			}
		})
		
	})
	
}


