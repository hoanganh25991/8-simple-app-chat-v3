var socket;
window.onload = function(){
    //get info
    var userA_sender= $("#userA-sender").val();
    //get socket from namespace
    var host = "http://localhost:3000/";
    var namespaceDefault = "redoc";
    socket = io(host + namespaceDefault);
    //socket = io();
    //when userA click on [contact] to chat with others, get list-active-users for him
    //list active users DOM
    var DOM_listActiveUser = $("#list-active-users");
    socket.emit("list-active-users", "server give me list active users");
    //listen to this list from server
    socket.on("list-active-users", function(list_active_users){
        console.log("list_active_users", list_active_users);
        //show list
        for (var key in list_active_users) {
            //make sure list has key
            if (list_active_users.hasOwnProperty(key)) {
                //get user
                var userObject = list_active_users[key];
                updateDOM_List(userObject);
            }
        }
    });
    //update this list when new active user come
    socket.on("new-active-user", function(new_active_user){
        //update list
        //get user
        var userObject = new_active_user;
        updateDOM_List(userObject);
    });
    var userB_receiver = "123";
    //when userA click on [userB] to chat with him, get userB
    //bcs active-user added dynamic >>> delegate listen event on DOM_List
    DOM_listActiveUser.on("click", "a", function(event){
        //stop default go to page from a
        event.preventDefault();
        console.log($(this));
        //if this is a
        userB_receiver = $(this).attr('href');
        //move user to conversation
        var DOM_conversation_title = $("#conversation-title");
        DOM_conversation_title.text("#" + $(this).text());
        location.href = "#conversation";
    });
    $("#form-message").submit(function(){
        //get msg A to B
        var input_msg = $("#input-message");
        var msgAtoB = input_msg.val();
        //clear input message
        input_msg.val("");
        //update conversation (A,B)
        var div = $("<div>").attr("class", "msg-right").text(msgAtoB);
        $("#list-messages").append($("<li>").append(div));
        //build PersonalMessage-object, from A to B
        var msgFromAObject = {
            msg: msgAtoB,
            createAt: new Date().toString(),
            from: userA_sender,
            to: userB_receiver
        };
        //send to server, server will delivery it
        //on client-side, we can not see others client
        //through server, send msg to B
        socket.emit("clientChatMsg", msgFromAObject);
        //cancel submit, we MUST do this, if not, page reload
        return false;
    });
    /**
     * 2. receive msg from server
     */
    socket.on("clientChatMsg", function(msgFromXObject){
        console.log("msgFromBOjebct:", msgFromXObject);
        //update conversation (A,B)
        //if msgFrom B, update
        var div; //DOM of msg
        //check userB_receiver
        console.log("userB_receiver: ", userB_receiver);
        if(msgFromXObject.from === userB_receiver){
            div = $("<div>").attr("class", "msg-left").text(msgFromXObject.msg);
        }
        console.log("userA_sender: ", userA_sender);
        if(msgFromXObject.from === userA_sender){
            div = $("<div>").attr("class", "msg-right").text(msgFromXObject.msg); }
        if(div){
            $("#list-messages").append($("<li>").append(div));
        }
    });
    function updateDOM_List(userObject){
        //append list DOM
        var DOM_userLink = $("<a>").attr("href", userObject.oauthID).text(userObject.displayName);
        DOM_listActiveUser.append($("<li>").append(DOM_userLink));
    }
};

