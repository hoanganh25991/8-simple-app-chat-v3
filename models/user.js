var mongoose = require('mongoose');
// define the schema for our user
var userSchema = mongoose.Schema({
    oauthID: String,
    appID: String,
    username: String,
    displayName: String,
    provider: String,
    profileUrl: String,
    _json: Object
});
// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);