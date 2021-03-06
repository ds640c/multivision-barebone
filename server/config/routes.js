/*************************************************************************************
 Routes are required to connect to the server

 Mapping:

 GET    -> $HTTP GET
 QUERY  -> $HTTP GET
 UPDATE -> $HTTP PUT (REQ BODY permitted)
 REMOVE -> $HTTP DELETE
 ADD    -> $HTTP POST (REQ BODY permitted)
 ***************************************************************************************/

var auth=require('./auth'),
    users=require('../controllers/users'),
    courses=require('../controllers/courses'),
    fellows=require('../controllers/fellowships'),
    fellowMems=require('../controllers/fellowMems'),
    init=require('../controllers/init'),
    mongoose=require('mongoose'),
    User=mongoose.model('User');

//app comes from whoever calls this function
module.exports=function(app){

    //Only allowing ADMIN access info from /api/users
    //app is an extension from server.js file, the object is from express

    //grab from user controller
    app.get('/api/users',auth.requiresRole('admin'),users.getUsers);
    //create new user
    app.post('/api/users',users.createUser);
    //update existing user
    app.put('/api/users',users.updateUser);

    //retrieve data from courses controller
    app.get('/api/courses',courses.getCourses);
    app.get('/api/courses/:id',courses.getCourseById);

    //4.29.2014, retrieve data from fellows controller
    app.get('/api/fellows',fellows.getFellows);
    app.get('/api/fellows/:id',fellows.getFellow);

    //4.30.2014 equalvilant to add, create route for handling user joining fellowship
    app.post('/api/fellowMems',fellowMems.createFellowMem);

    app.get('/api/fellowMems',fellowMems.getFellowMemByUser);
    app.get('/api/fellowMems/:id',fellowMems.getFellowMem);

    //equalvilant to update
    app.put('/api/fellowMems/:id',fellowMems.updateFellowMem);

    app.get('/api/init',init.getInit);

    //Define a new route for Jade
    app.get('/partials/*', function(req, res){
        res.render('../../public/app/'+req.params);
    });

    //middleware will authenticate user
    app.post('/login',auth.authenticate);

    app.post('/logout',function(req,res){
        req.logout();
        res.end();
    });

    app.all('/api/',function(req,res){
        res.send(404);
    });

    app.get('*',function(req,res){
        res.render('index',{
            bootstrappedUser: req.user
        });
    });

};