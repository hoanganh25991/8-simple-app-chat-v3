var socket;
window.onload = function(){
    socket = io("/room/minion");
    setInterval(function(){
        socket.emit("/room/minion", "client call server: " + new Date().toString());
    }, 1500);
    socket.on("/room/minion", function(other_msg){
        //listen to server-other_msg, server receive from others, then send back
        console.log(other_msg);
        $("#list-messages").append($("<li>").text(other_msg));
    });
};