var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Bar = new Schema({
	id: String,
	rsvp: Array
})

module.exports = mongoose.model('Bar', Bar)