var ServiceRequest = require('../Models/serviceRequestModel');

//创建serviceRequest
function create(serviceRequest,cb) {
    new ServiceRequest(serviceRequest).save(cb);
}
module.exports.create = create;

//删除serviceRequest
function remove(title, cb) {
    console.log("title service", title);
    // ServiceRequest.remove(title, cb);
    // ServiceRequest.findByTitle(title).remove(cb);
    ServiceRequest.deleteOne({title : title}, cb);
}
module.exports.remove = remove;

//通过标题查找
function findByTitle(title, cb) {
    ServiceRequest.findOne({title: title}, cb);
}
module.exports.findByTitle = findByTitle;

//通过id查找
function findById(id,cb){
    ServiceRequest.findOne({_id:id},cb);
}
module.exports.findById = findById;

function update(title, serviceRequest,cb){
    ServiceRequest.update({title:title}, {$set: serviceRequest}, cb);
}
module.exports.update = update;

function findAll(cb) {
    ServiceRequest.find({}, cb);
}
module.exports.findAll = findAll;

function findAllByEmail(email, cb) {
    findAll(function (error, data) {
        if(error){
            cb(error, null);
        }else{
            var results = [];
            for(var i = 0; i < data.length; i ++){
                for(var j =0; j < data[i].signInMember.length;j++){
                    if(data[i].signInMember[j].voluntemail && email ==data[i].signInMember[j].voluntemail){
                        results.push(data[i]);
                    }
                }
            }
            cb(null, results);
        }
    })
}
module.exports.findAllByEmail = findAllByEmail;

