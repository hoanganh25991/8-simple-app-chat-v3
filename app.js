//module dependencies
var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");
var mongoose = require("mongoose");
//get application-context
var app = express();
//setup middleware
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
//setup views
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
/**
 * SETUP PASSPORT
 */
var passport = require("./passport.js");
app.use(session({ secret: "keyboard cat", resave: false, saveUninitialized: false }));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
/**
 * SET UP: AUTH for socket connection
 * if auth-user, notify to other people, an "active-user" is online
 */
app.use(function(req, res, next){
    console.log("inside middleware check connection");
    //if auth-user, check by req.user
    if(req.isAuthenticated()){
        console.log("this user is auth");
        //get io
        var io = require("./io.js");
        //get active-users room
        var ListActiveUsers = require("./models/activeUser.js");
        io.on("connection", function(socket){
            //has connection
            console.log("io('/') connect");
            //store listActiveUsers
            //var newActiveUser = new ListActiveUsers({
            //    userOauthID: req.user.oauthID,
            //    socketID: socket.id
            //});
            //newActiveUser.save();
            ////emit to all users know new active-user (inclue this new-auth-user)
            //socket.emit("active-users", JSON.stringify(req.user));
            ListActiveUsers.findOne({userOauthID: req.user.oauthID}, function(err, list){
                //find one result in null/object
                if(list == null){
                    //find, but result is null
                    console.log("if(list == null)");
                    console.log("req.user.oauthID: ", req.user.oauthID);
                    var newActiveUser = new ListActiveUsers({
                        userOauthID: req.user.oauthID,
                        socketID: socket.id
                    });
                    newActiveUser.save();
                    //emit to all users know new active-user (inclue this new-auth-user)
                    socket.emit("active-users", JSON.stringify(req.user));
                }else{
                    ////list is empty, store this new active-user
                    //console.log("list is empty");
                    //console.log("req.user.oauthID: ", req.user.oauthID);
                    //var newActiveUser = new ListActiveUsers({
                    //    userOauthID: req.user.oauthID,
                    //    socketID: socket.id
                    //});
                    //newActiveUser.save();
                    ////emit to all users know new active-user (inclue this new-auth-user)
                    //socket.emit("active-users", JSON.stringify(req.user));
                }
            });
            //socket.on("disconnect", function(socket){
            //    console.log("io('/') disconnect");
            //    //remove from list active user
            //    ListActiveUsers.findOne({socketID: socket.id}, function(err, user){
            //        if(user){
            //            //emit to let active-users remove this disconnect user
            //            socket.emit("unactive-users", JSON.stringify(user));
            //            //remove from listActiveUsers
            //            user.remove();
            //        }
            //    });
            //});
        });
    }
    next();
});
/**
 * SETUP SOCKET-IO
 * push io to req, like global-use
 */
app.use(function(req, res, next){
    //get io from module
    var io = require("./io.js");
    //attach to req for global use in routes
    req.io = io;
    next();
});

//setup routes
//at ensureAuthenticated to routes
var router = express.Router();
router.ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    //login fail, back to "/", login again
    res.redirect('/')
};
var welcome = require("./routes/index.js");
var login = require("./routes/login.js");
var room = require("./routes/room.js");
var contact = require("./routes/contact.js");
app.use("/", welcome);
app.use("/", login);
//check auth on "/room/*"
app.use("/room", function(req, res, next){
    router.ensureAuthenticated(req, res, next);
});
app.use("/room", room);
//check auth on "/contact/*"
app.use("/contact", function(req, res, next){
    router.ensureAuthenticated(req, res, next);
});
app.use("/contact", contact);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = Error("Not Found");
    err.status = 404;
    next(err);
});
// error handlers
// development error handler
// will print stacktrace
if (app.get("env") === "development") {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render("error", {
            message: err.message,
            error: err
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render("error", {
        message: err.message,
        error: {}
    });
});
module.exports = app;

