
module.exports = function(app, request, oauth){

	app.get('/', function(req, res) {
		res.render('index')
	})

	app.get('/search', function(req, res) {

		var request_data = {
			url: 'https://api.yelp.com/v2/search/?location=monterrey&limit=20&category_filter=bars',
			method: 'POST'
		}

		var token = {
			key: process.env.YELP_TOKEN,
			secret: process.env.YELP_TOKEN_SECRET
		}

		request({
			url: request_data.url,
			method: request_data.method,
			form: oauth.authorize(request_data, token)
		}, function(err, response, body) {
			if(err) throw err
			console.log(body)

		})





	})
	
}


