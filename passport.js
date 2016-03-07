var setup_passport = function(){
    //login, using passport
    var passport = require("passport");
    var GitHubStrategy = require("passport-github2").Strategy;
    //auth with my app
    var GITHUB_CLIENT_ID = "f4ba09c4cc7b4f463f63";
    var GITHUB_CLIENT_SECRET = "0138561f5a349ec5a64533697785cb346c365a7c";
    // Passport session setup.
    //   To support persistent login sessions, Passport needs to be able to
    //   serialize users into and deserialize users out of the session.  Typically,
    //   this will be as simple as storing the user ID when serializing, and finding
    //   the user by ID when deserializing.  However, since this example does not
    //   have a database of user records, the complete GitHub profile is serialized
    //   and deserialized.
    //store data in mongodb database
    var User = require("./models/user.js");
    //noinspection JSUnresolvedFunction
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    //noinspection JSUnresolvedFunction
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user){
            done(null, user);
        });
    });
    var appID = 0;
    passport.use(new GitHubStrategy({
            clientID: GITHUB_CLIENT_ID,
            clientSecret: GITHUB_CLIENT_SECRET,
            //callbackURL: "https://simple-chat-hoanganh25991.c9users.io/auth/github/callback"
            callbackURL: "http://localhost:3000/auth/github/callback"
        },
        function(accessToken, refreshToken, profile, done) {
            // asynchronous verification, for effect...
            process.nextTick(function () {

                // To keep the example simple, the user"s GitHub profile is returned to
                // represent the logged-in user.  In a typical application, you would want
                // to associate the GitHub account with a user record in your database,
                // and return that user instead.
                User.findOne({ oauthID: profile.id }, function(err, user) {
                    if(err) {
                        console.log(err);  // handle errors!
                    }
                    if (!err && user !== null) {
                        //this is auth-users info stored in User
                        done(null, user);
                    } else {
                        user = new User({
                            oauthID: profile.id,
                            appID: appID,
                            displayName: profile.displayName,
                            username: profile.username,
                            provider: profile.provider,
                            profileUrl: profile.profileUrl,
                            _json: profile._json
                        });
                        appID++;
                        user.save(function(err) {
                            if(err) {
                                console.log(err);  // handle errors!
                            } else {
                                console.log("saving user ...");
                                done(null, user);
                            }
                        });
                    }
                });
                //return done(null, profile);
            });

        }
    ));
    return passport;
};


module.exports = setup_passport();