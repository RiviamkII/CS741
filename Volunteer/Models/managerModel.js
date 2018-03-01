var mongoose = require('mongoose');

var managerSchema = mongoose.Schema({
    manageremail:String,
    managername: String,
    password: String,
    managerID: mongoose.Schema.ObjectId
});

var Manager = mongoose.model('Manger', managerSchema, 'manager');
module.exports = Manager;