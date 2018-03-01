var express = require('express');
var router = express.Router();
var adminService = require('./../Service/adminService');
var managerService = require('./../Service/managerService');
var volunteerService = require('./../Service/volunteerService');
var serviceRequestSer = require('./../Service/serviceRequestSer');
var sendEmail = require('./sendMail');
var bcrypt = require('bcryptjs');

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

//admin登陆
router.post('/admin/login', function (req, res, next) {
    var user = req.body;
    adminService.findByUsername(user.username,function (err, userInDB) {
      if (err){
          // return to login page
          res.render('adminLogin');
      } else if (userInDB && user.password == userInDB.password){
          req.session.user = user;
          req.session.isLogin = true;
          res.render('adminIndex', {user: user});
        } else {
          // return to login page
          res.render('adminLogin');
        }
    });
});

/*//获取当前用户
router.get("/current/username", function (req, res, next) {
   if(req.session.user){
       res.send({username : req.session.user.username});
   }else{
       res.send({error : "no"});
   }
});*/

//判断admin是否登陆
router.get('/adminIndex', function(req, res, next) {
    if(req.session.user){
        var user = req.session.user;
        var name = user.username;
        //console.log(name);
        res.render('adminIndex');
    }else{
        res.render('Index'/*,'你还没有登录，先登录！'*/);
    }
});

//Logout
router.get('/logout', function (req, res, next) {
    req.session.regenerate(function (err) { // create a new session id
        req.session.destroy(function () {
            res.clearCookie("name",{});
            res.redirect('/');
        })
    });
});

//manager登陆
router.post('/manager/login', function (req, res, next) {
    var manager = req.body;
    //console.log(manager);
    managerService.findByEmail(manager.manageremail,function (err, userInDB) {
        if (err){
            // return to login page
            res.render('managerLogin');
        } else if (userInDB && bcrypt.compareSync(manager.password, userInDB.password)) {
            req.session.name = userInDB.managername;
            req.session.id = userInDB._id;
            req.session.email = userInDB.manageremail;
            req.session.isLogin = true;
            req.session.user=userInDB;
            res.render('managerIndex', {user: manager, username : userInDB.managername});
        } else {
            // return to login page
            res.render('managerLogin');
        }
    });
});

//跳转到创建manager页面
router.post('/admin/createManager', function (req, res, next){
    res.render('createManager');
});


//创建manager
router.post('/createManager', function (req, res, next) {
    var newManager = req.body;
    newManager.password = bcrypt.hashSync(newManager.password);
    var email = req.body.manageremail;
    var password = req.body.password;
    if(email==='' && email.length<=0 && password==='' && password.length<=0){
        res.render('registerSuc', {title: 'Manager name and password should not be empty.'});
    }else{
        managerService.findByEmail(email,function (err, managerInDB) {
            if(err) {
                return next(err);
            }
            else if(managerInDB && managerInDB.manageremail == email){
                res.render('registerSuc',{title: 'Manager name has existed.'})
            }else{
                managerService.create(newManager);
                res.render('adminIndex'/*'registerSuc',{title: 'Register successfully'}*/)
            }
        })
    }
});

//获取managers数据
router.get("/managers", function (req, res, next) {
    managerService.findAll(function (err, managers) {
        for(var i =0; i < managers.length; i ++){
            delete managers[i].password;
        }
        res.json(managers);
    });
});

//获取volunteer数据
router.get("/volunteers", function (req, res, next){
    volunteerService.findAll(function (err, volunteers) {
        res.json(volunteers);
    })
})

//获取service request数据
router.get("/services", function (req, res, next) {
    serviceRequestSer.findAll(function (err, services) {
        //console.log("service", services);
        res.json(services);
    });
});

//获取service request sign in数据
router.get("/servicesSignIn", function (req, res, next) {
    serviceRequestSer.findAll(function (err, services) {
        res.json(services);
    });
});

//获取特定用户的signInData
router.get("/getSignInData",function (req,res,next) {
    var userEmail = req.session.email;
    var results=[];
    serviceRequestSer.findAll(function (err,servicesInDB) {
        for(var i=0;i<servicesInDB.length;i++){
            if(servicesInDB[i]){
                for(var j=0;j<servicesInDB[i].signInMember.length;j++) {
                    if (userEmail == servicesInDB[i].signInMember[j].voluntemail){
                        results.push(servicesInDB[i]);
                    }
                }
            }
        }
        res.json(results);
        //console.log("********" + results);
    })
});


//得到当前用户数据
router.get("/getcurrentuser", function (req,res,next) {
    res.json(req.session.user?req.session.user:{err:"null"}) ;
});



/*
//获取用户信息添加到service request中
router.get("/signIn", function (req, res, next) {
    var title =req.query.title;
    //console.log(title);
    var name = req.session.name;
    var id = req.session.id;
    var email =req.session.email;

    serviceRequestSer.findAllByEmail(email,function (err,services) {
       if(err){
           res.send(err);
       } else{

       }
    });


    serviceRequestSer.findByTitle(title, function (err, serviceRequestInDB) {
       if(serviceRequestInDB && serviceRequestInDB.title ==title){
           if(id && serviceRequestInDB.status){

               serviceRequestInDB.signInMember.push({
                   voluntname: name,
                   voluntemail: email,
                   ID:id
               });
               serviceRequestInDB.contents --;
               if(serviceRequestInDB.contents <= 0){
                   serviceRequestInDB.status = false;
               }


               console.log("after sign in ", serviceRequestInDB)
           }

            serviceRequestSer.update(title, serviceRequestInDB, function (err, numEffected) {
               if (err) res.json(err);
               else res.json(serviceRequestInDB);
            })
        }
    })
});
*/

//跳转到创建service页面
router.post('/manager/createServiceRequest', function (req, res, next){
    res.render('createServiceRequest');
});

//创建ServiceRequest
router.post('/createServiceRequest', function (req, res, next) {
    var newServiceRequest = req.body;
    newServiceRequest.status = true;
    //console.log("-----------------------newServiceRequest", newServiceRequest);
    var title = req.body.title;
    var contents = req.body.contents;
    var username = req.session.name;
    console.log("创建service时候，当前的username",username);
    if(title==='' && title.length<=0 && contents==='' && contents.length<=0){
        res.render('releaseSuc', {title: 'Title and requirement should not be empty.'});
    }else{
        serviceRequestSer.findByTitle(title,function (err, serviceRequestInDB) {
            if(err) {
                return next(err);
            }
            else if(serviceRequestInDB && serviceRequestInDB.title == title){
                res.render('releaseSuc',{title: 'This activity has existed.',username:username})
            }else{
                serviceRequestSer.create(newServiceRequest, function (error, data) {
                    if(error){
                        res.send(error);
                    }else{
                        console.log("datas", data);
                        res.render('managerIndex', {title : 'success', username : username});
                        // res.redirect("/managerIndex");
                    }
                });
            }
        })
    }
});




//跳转到创建volunteer页面
router.post('/admin/createVolunteer', function (req, res, next){
    res.render('createVolunteer');
});

//创建volunteer
router.post('/createVolunteer', function (req, res, next) {
    var newVolunteer = req.body;
    newVolunteer.password = bcrypt.hashSync(newVolunteer.password);
    var email = req.body.volunteeremail;
    var password = req.body.password;
    if(email==='' && email.length<=0 && password==='' && password.length<=0){
        res.render('registerSuc', {title: 'Volunteer name and password should not be empty.'});
    }else{
        volunteerService.findByEmail(email,function (err, volunteerInDB) {
            if(err) {
                return next(err);
            }
            else if(volunteerInDB && volunteerInDB.volunteeremail == email){
                res.render('registerSuc',{title: 'Volunteer name has existed.'})
            }else{
                volunteerService.create(newVolunteer);
                res.render('adminIndex')
            }
        })
    }
});

//Volunteer 登陆
router.post('/volunteer/login', function (req, res, next) {
    var volunteer = req.body;
    volunteerService.findByEmail(volunteer.volunteeremail,function (err, userInDB) {
        if (err){
            // return to login page
            res.render('volunteerLogin');
        } else if (userInDB && bcrypt.compareSync(volunteer.password, userInDB.password)) {
            req.session.name = userInDB.volunteername;
            req.session.id = userInDB._id;
            req.session.email = userInDB.volunteeremail;
            req.session.isLogin = true;
            req.session.user=userInDB;
            res.render('volunteerIndex', {user: volunteer, username : userInDB.volunteername}/*{user: volunteer}*/);
        } else {
            // return to login page
            res.render('volunteerLogin');
        }
    });
});

//发送eamils
router.get('/sendmails',function (req, res, next) {
    var title =req.query.title;
    serviceRequestSer.findByTitle(title, function (err, serviceInDB) {
        if(err){
            res.json(err);
        } else {
            var emails = [];
            console.log("123 send email function");
            console.log("1234 send email function serviceINDB",serviceInDB);
            for(var i=0; i<serviceInDB.signInMember.length; i++){
                emails.push(serviceInDB.signInMember[i].voluntemail);
            }
            console.log("after push", emails);
            var location = serviceInDB.location;
            var date = serviceInDB.date;
            var starTime = serviceInDB.startTime;
            var endTime = serviceInDB.endTime;
            var text = "Your volunteer service activity " + title + " will start from " + starTime
                       + " to " + endTime + " in " + location + " on " + date;
            // console.log("发送email的emails",emails);
            sendEmail.sendConfirmedEmail(emails, text)
        }
    });
});

//修改confirm的状态
router.post('/changeconfirm',function (req,res,next) {
    var id = req.query.id;
    serviceRequestSer.findById(id, function (err,serviceInDB) {
        if(err){
            res.json(err);
        }else if(serviceInDB ){
            /*console.log(serviceInDB);*/
            serviceInDB.isConfirmed = true;
            serviceInDB.save();
            res.json({s:1});
        }
    });
});

//volunteer退出该活动
router.post('/cancels',function (req,res,next) {
    var title =req.query.title;
    var email =req.session.email;
    serviceRequestSer.findByTitle(title, function (err, serviceRequestInDB) {
        if(serviceRequestInDB && serviceRequestInDB.title ==title){
            var length = serviceRequestInDB.signInMember.length;
            var index=-1;
            for(var u=0;u<length;u++){
                if(email == serviceRequestInDB.signInMember[u].voluntemail){
                   index=u;
                   break;
                    }
                }
            serviceRequestInDB.contents++;
            serviceRequestInDB.status = true;
            serviceRequestInDB.signInMember.splice(index,1);
            serviceRequestSer.update(title, serviceRequestInDB, function (err, numEffected) {
                if (err) res.json(err);
                else res.json(serviceRequestInDB);
            });
        }
    })
});

//删除volunteer
router.post('/deleteVolunteer',function (req,res,next) {
   var volunteerEmail = req.query.volunteerEmail;
   // console.log("****"+volunteerEmail)
   volunteerService.findByEmail(volunteerEmail,function (err,volunteerServiceInDB) {
       // if(volunteerServiceInDB && volunteerServiceInDB.volunteeremail == volunteerEmail){
            serviceRequestSer.findAll(function (err,serviceRequestInDB) {
                //console.log("service Request length", serviceRequestInDB.length);
                for(var i =0;i<serviceRequestInDB.length;i++){
                    for(var j=0;j<serviceRequestInDB[i].signInMember.length;j++){
                        if(volunteerEmail == serviceRequestInDB[i].signInMember[j].voluntemail){
                            //console.log("index", i,"service request", serviceRequestInDB[i], "remove", j)
                            serviceRequestInDB[i].signInMember.splice(j,1);
                            serviceRequestInDB[i].contents++;
                            serviceRequestSer.create(serviceRequestInDB[i],
                                function (data) {
                                console.log("data", data);
                                },
                                function (error) {
                                    console.log("error", error);
                                }
                            )
                        }
                    }
                }
            });
           //console.log("Database's volunteeremail"+ volunteerServiceInDB.volunteeremail);
            volunteerServiceInDB.remove(volunteerEmail,function (err,results) {
                if(err) {
                    console.log(err);
                }
                else{
                    console.log("update");
                }
                //volunteerServiceInDB.close();
                //res.json({s:1});
            });

       res.json({s:1});
   })
});

//删除volunteer
router.post('/deleteManager',function (req,res,next) {
   var managerEmail = req.query.managerEmail;
    console.log("****"+managerEmail);
    managerService.findByEmail(managerEmail, function (err,managerServiceInDB) {
        managerServiceInDB.remove(managerEmail,function (err,results) {
            if(err) {
                console.log(err);
            }
            else{
                console.log("update");
            }
        });
        res.json({s:1});
    })
});

//删除serviceRequest
router.post('/deleteservice',function (req,res,next) {
        var title = req.query.title;
        console.log("tiltle", title);
        serviceRequestSer.remove(title,function (err,serviceRequestInDB) {
            // console.log("delete service's serviceRequestInDB", serviceRequestInDB);
            console.log("delete success");
            if(err){
                res.json(err);
            }else{
                console.log("delete success!!!");
                //res.json(serviceRequestInDB);
               res.json({s:1});

            }
        })
    //res.json({s:1});
    });

//弹窗的service数据
router.get('/getUserService',function (req,res,next) {
    var name = req.query.name;
    var results =[];
    console.log("getUserService name",name);
    serviceRequestSer.findAll(function (err,serviceRequestInDB) {
        if(err){
            res.send(err);
        }else{
            for(var i=0;i<serviceRequestInDB.length;i++){
                for(var j=0; j<serviceRequestInDB[i].signInMember.length; j++){
                    if(serviceRequestInDB[i].signInMember[j].voluntname && name == serviceRequestInDB[i].signInMember[j].voluntname){
                        results.push(serviceRequestInDB[i]);
                    }
                }
            }
            res.send(results);
        }
    })
});

//获取用户信息添加到service request中,volunteer sign in
router.get("/signIn", function (req, res, next) {
    var title =req.query.title;
    //console.log(title);
    var name = req.session.name;
    var id = req.session.id;
    var email =req.session.email;

    serviceRequestSer.findAllByEmail(email,function (err,services) {
        if(err){
            res.send(err);
        } else{
            serviceRequestSer.findByTitle(title, function (err, serviceRequestInDB) {
                console.log("signIn时间前第一个是啥",services);
                console.log("signIn时间前第2个是啥",serviceRequestInDB);
                if(!isServiceTimeEqual(services, serviceRequestInDB)){
                    if(serviceRequestInDB && serviceRequestInDB.title ==title) {
                        if (id && serviceRequestInDB.status) {
                            serviceRequestInDB.signInMember.push({
                                voluntname: name,
                                voluntemail: email,
                                ID: id
                            });
                            serviceRequestInDB.contents--;
                            if (serviceRequestInDB.contents <= 0) {
                                serviceRequestInDB.status = false;
                            }
                            console.log("after sign in ", serviceRequestInDB);
                            serviceRequestSer.update(title, serviceRequestInDB, function (err, numEffected) {
                                if (err) res.json(err);
                                else res.json(serviceRequestInDB);
                            })
                        }
                    }
                }else{
                    res.send({err : "time duplicate!!!"});
                }
                });

        }
    });


});

function isServiceTimeEqual(services, newService) {
    console.log("services", services, "new service", newService);
    var left = newService.date + " "+ newService.startTime;
    var right = newService.date + " " + newService.endTime;
    var L = new Date(left);
    var R = new Date(right);
    for(var i =0; i < services.length; i ++){
        var service = services[i];
        var starteTime = service.date + " "+ service.startTime;
        var endTime = service.date + " " + service.endTime;
        console.log("start time" , starteTime, "end Time", endTime);
        var start = new Date(starteTime);
        var end = new Date(endTime);
        if(compareTime(start, end, L, R)){
            return true;
        }
    }
    return false;
}

function compareTime(oldStart, oldEnd, start, end) {
    if(start >= oldStart && start < oldEnd){
        return true;
    }else if(end >= oldStart && end < oldEnd){
        return true;
    }else{
        return false;
    }
}
module.exports = router;