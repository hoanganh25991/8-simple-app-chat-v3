var socket;
window.onload = function(){
    socket = io();
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