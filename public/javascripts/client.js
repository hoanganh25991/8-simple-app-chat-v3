var socket;
window.onload = function(){
    var userB_ID = $("#userB_ID").val();
    var userA_ID = $("#userA_ID").val();
    socket = io(userB_ID);
    $("#form-message").submit(function(){
        //get msg A to B
        var input_msg = $("#input-message");
        var msgAtoB = input_msg.val();
        //clear input message
        input_msg.val("");
        //append to list-messages, from A to B
        var div = $("<div>").attr("class", "msg-right").text(msgAtoB);
        $("#list-messages").append($("<li>").append(div));
        //build Message-object, from A to B
        var msgObjectAtoB = {
            msg: msgAtoB,
            createAt: new Date().toString(),
            on: userA_ID,
            emit: userB_ID
        };
        //send to server
        socket.emit(userB_ID, JSON.stringify(msgObjectAtoB));
        //cancel submit
        return false;
    });
    socket.on(userA_ID, function(msgXtoA){
        //parse to JSON object
        var msgObjectXtoA = JSON.parse(msgXtoA);
        if(msgObjectXtoA.emit === userB_ID){
            //append to list-messages, from B to A
            var div = $("<div>").attr("class", "msg-left").text(msgObjectXtoA.msg);
            $("#list-messages").append($("<li>").append(div));
        }
    });
};