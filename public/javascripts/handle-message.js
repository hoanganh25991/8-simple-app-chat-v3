var socket;
window.onload = function(){
    //get info
    var userA_sender= $("#userA_sender").val();
    //get socket from namespace
    var host = "http://localhost:3000/";
    var namespaceDefault = "/";
    socket = io(host + namespaceDefault);
    //when userA click on [chat] to chat with others,get list-active-users for him
    socket.emit("list-active-users", "server give me list active users");
    //listen to this list from server
    socket.on("list-active-users", function(list_active_users){
        //show list
    });
    //update this list when new active user come
    socket.on("new-active-user", function(new_active_user){
        //update list
    });
    //when userA click on [userB] to chat with him, get userB
    var userB_receiver = $("#userB_receiver").val();
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
        var div = $("<div>").attr("class", "msg-left").text(msgFromXObject.msg);
        $("#list-messages").append($("<li>").append(div));
    });
};