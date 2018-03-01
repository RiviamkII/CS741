var Manager = require('./../Models/managerModel');


//创建manager
function create(manager,cb) {
    new Manager(manager).save(cb);
}
module.exports.create = create;

function findByEmail(email, cb){
    Manager.findOne({manageremail: email}, cb);
}
module.exports.findByEmail = findByEmail;

function findByUsername(username, cb) {
    Manager.findOne({managername: username}, cb);
}
module.exports.findByUsername = findByUsername;

function findAll(cb) {
    Manager.find({}, cb);
}
module.exports.findAll = findAll;


//删除manager
function remove(id, cb) {
    Manager.findById(id).remove(cb);
}
module.exports.remove = remove;