var Volunteer = require('../Models/volunteerModel');


//创建volunteer
function create(volunteer,cb) {
    new Volunteer(volunteer).save(cb);
}
module.exports.create = create;

function findByEmail(email, cb){
    Volunteer.findOne({volunteeremail: email},cb);
}
module.exports.findByEmail = findByEmail;

function findByUsername(username, cb) {
    Volunteer.findOne({volunteername: username}, cb);
}
module.exports.findByUsername = findByUsername;

function findAll(cb) {
    Volunteer.find({}, cb);
}
module.exports.findAll = findAll;

//删除volunteer
function remove(id, cb) {
    Volunteer.findById(id).remove(cb);
}
module.exports.remove = remove;