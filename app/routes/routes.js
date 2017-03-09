
module.exports = function(app, yelp){

	app.get('/', function(req, res) {
		res.render('index')
	})

	app.get('/search', function(req, res) {
		res.redirect('/')
	})

	app.post('/search', function(req, res) {

		yelp.search({category_filter: 'bars', location: req.body.location})
		.then(function (data) {
			res.locals.bars = data.businesses
			res.render('index')
		})
		.catch(function(err) {
			var data = err.data
			data = data.match(/"text": "(.*?(?="))/)
			res.locals.error = data[1] + '.'
			res.render('index')
		})
	})
	
}


