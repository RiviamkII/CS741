var mongoose = require('mongoose');

var serviceRequestSchema = mongoose.Schema({
    title: String,
    date: String,
    startTime: String,
    endTime: String,
    location: String,
    contents: Number,//需要多少个人
    isConfirmed: Boolean,
    status: Boolean,
    signInMember:[{voluntname: String,
                   voluntemail: String,
                  ID:mongoose.Schema.ObjectId}],
    requestID: mongoose.Schema.ObjectId
});

var ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema, 'ServiceRequest');
module.exports = ServiceRequest;
// module.exports = mongoose.model('ServiceRequest', serviceRequestSchema, 'ServiceRequest');<-没用