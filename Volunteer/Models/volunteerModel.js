var mongoose = require('mongoose');

var volunteerSchema= mongoose.Schema({
    volunteeremail: String,
    volunteername: String,
    password: String,
    volunteerID: mongoose.Schema.ObjectId
});

var Volunteer = mongoose.model('Volunteer', volunteerSchema, 'volunteer');
module.exports = Volunteer;