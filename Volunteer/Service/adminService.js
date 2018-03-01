var Admin = require("./../Models/adminModel");

function findByUsername(username, cb) {
    Admin.findOne({username: username}, cb);
}
module.exports.findByUsername = findByUsername;

//通过ID查找
function findById(id, cb) {
    Admin.findById(id, cb);
}
module.exports.findById = findById;


/*
function remove(id, cb) {
    Admin.findById(id).remove(cb);
}
module.exports.remove = remove;*/
