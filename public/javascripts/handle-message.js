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
    //get socket from namespace
    var host = "http://localhost:3000/";
    socket = io(host + userB);
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
        //under namespaceUserB, A send msg to server, then server search for B, send to B
        socket.emit(userB, msgFromAObject);
        //cancel submit, we MUST do this, if not, page reload
        return false;
    });
    /**
     * 2. receive msg from server
     */
    socket.on(userA, function(msgFromXObject){
        //server not filter msg from X, Y, Z to A
        //vi khi B o mot noi khac, da muon namespaceUserA de emit(msg), khi emit dau co find A, emit all members in namespaceUserA
        //log msg info
        console.log("msgFromBOjebct:", msgFromXObject);
        //if check msg from B
        if(msgFromXObject.from == userB){
            //append to list-messages, msg from B to A
            var div = $("<div>").attr("class", "msg-left").text(msgFromXObject.msg);
            $("#list-messages").append($("<li>").append(div));
        }
    });

    var socketDefault = io();
    socketDefault.on("time", function(msg){
        console.log(msg);
    });
};