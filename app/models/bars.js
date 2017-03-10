var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Bar = new Schema({
	id: String,
	rsvp: Number
})

module.exports = mongoose.model('Bar', Bar)