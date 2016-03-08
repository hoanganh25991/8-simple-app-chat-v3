var socket;
window.onload = function(){
    /**
     * A SEND MSG TO B
     * A LISTEN MSG FROM B
     * >>>>TASK MEANS>>>>>>
     * [1]. send msg from A to server
     * when form submit msg, means A want to send msg to B
     * server help us delivery this msg to B
     * [2]. receive msg from server
     * server has filtered which msg from B to A
     */
    //get info
    var userA= $("#userA").val();
    var userB = $("#userB").val();
    socket = io();
    /**
     * 1. send msg from A to server, when form submit
     */
    $("#form-message").submit(function(){
        //get msg A to B
        var input_msg = $("#input-message");
        var msgAtoB = input_msg.val();
        //clear input message
        input_msg.val("");
        //append to list-messages chat
        var div = $("<div>").attr("class", "msg-right").text(msgAtoB);
        $("#list-messages").append($("<li>").append(div));
        //build PersonalMessage-object, from A to B
        var msgFromAObject = {
            msg: msgAtoB,
            createAt: new Date().toString(),
            from: userA,
            to: userB
        };
        //send to server, DONE
        socket.emit(userB, JSON.stringify(msgFromAObject));
        //cancel submit, we MUST do this, if not, page reload
        return false;
    });
    /**
     * 2. receive msg from server
     */
    socket.on(userA, function(msgFromB){
        //server has filtered msg, from B to A
        var msgFromBObject = JSON.parse(msgFromB);//parse JSON object
        //console.log("msg: %s\nfrom: userID-%s\nto: userID-%s\n", msgFromBObject.msg, msgFromBObject.from, msgFromBObject.to);//info
        console.log("msgFromBOjebct: \n", msgFromBObject);
        //append to list-messages, msg from B to A
        var div = $("<div>").attr("class", "msg-left").text(msgFromBObject.msg);
        $("#list-messages").append($("<li>").append(div));
    });
};