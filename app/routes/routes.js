
module.exports = function(app, yelp){

	app.get('/', function(req, res) {
		res.render('index')
	})

	app.get('/search', function(req, res) {
		yelp.search({category_filter: 'bars', location: 'monterrey'})
		.then(function (data) {
			console.log(data)
		})
		.catch(function(err) {
			console.error(err)
		})
	})
	
}


