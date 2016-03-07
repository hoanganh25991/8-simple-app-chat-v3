var list_active_users;
list_active_users = function () {
    var num_user = 0;
    var users = [];
    return {
        add: function (user) {
            users[num_user] = user;
            num_user++;
        },
        remove: function (user_name) {
            for(var i = 0; i <= num_user; i++){
                if(users.hasOwnProperty(user_name)){
                    delete users[user_name];
                    num_user--;
                }
            }
        },
        get: users,
        size: num_user
    }
}();
module.exports = list_active_users;