var Bars = require('../models/bars.js')

module.exports = function(app, yelp, passport){

	var storedData
	var useStored = false

	function isLoggedIn(req, res, next){
		if(req.isAuthenticated()){
			return next()
		}else{
			res.redirect('/auth/github')
		}
	}

	app.use(function(req, res, next){
		res.locals.user = req.user
		next()
	})

	app.get('/', function(req, res) {
		res.locals.bars = undefined
		res.render('index')
	})

	app.get('/search', function(req, res) {
		res.locals.bars = storedData
		var bars = res.locals.bars
		var bar_ids = []
		console.log(bars)
		for(i=0; i < bars.length; i++){
			bar_ids.push(bars[i].id)
		}
		Bars.find({id: {$in: bar_ids}}, function(err, bars_found){
			for(i = 0; i < bars_found.length; i++){
				for(j = 0; j < bars.length; j++){
					if(bars_found[i].id == bars[j].id){
						bars[j].numberOfRsvp = bars_found[i].rsvp.length
					}
				}
			}
			res.locals.bars = bars
			res.render('index')
		})
	})

	app.post('/search', function(req, res) {

		yelp.search({category_filter: 'bars', location: req.body.location})
		.then(function (data) {
			var bars = data.businesses
			var bar_ids = []
			for(i=0; i < bars.length; i++){
				bar_ids.push(bars[i].id)
			}

			Bars.find({id: {$in: bar_ids}}, function(err, bars_found){
				for(i = 0; i < bars_found.length; i++){
					for(j = 0; j < bars.length; j++){
						if(bars_found[i].id == bars[j].id){
							bars[j].numberOfRsvp = bars_found[i].rsvp.length
						}
					}
				}
				res.locals.bars = bars
				storedData = bars
				res.render('index')
			})
			
		})
		.catch(function(err) {
			var data = err.data
			console.log(err)
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
			res.redirect('/search')
		})

	app.get('/logout', function(req, res){
		req.logout()
		res.redirect('/')
	})

	app.get('/rsvp/:id', isLoggedIn, function(req, res){
		Bars.findOne({id: req.params.id}, function(err, bar){
			if(bar){
				var index = bar.rsvp.indexOf(req.user._id)
				if(index == -1){
					bar.rsvp.push(req.user._id)
				}else{
					bar.rsvp.splice(index, 1)
				}
				bar.save()
				res.redirect('/search')
			}else{
				var newBar = new Bars()
				newBar.id = req.params.id
				newBar.rsvp.push(req.user._id)
				newBar.save()
				useStored = true
				res.redirect('/search')
			}
		})
		
	})
	
}


