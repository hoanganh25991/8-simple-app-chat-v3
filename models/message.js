var mongoose = require('mongoose');
// define the schema for our user
var userSchema = mongoose.Schema({
    msg: String,
    createAt: String,
    on: String,
    emit: String
});
// create the model for users and expose it to our app
module.exports = mongoose.model('Message', userSchema);