var socket;
window.onload = function(){
    var roomID = $("#input_roomID").val();
    console.log("roomID: %s", roomID);
    socket = io(roomID);
    $("#form-message").submit(function(){
        //get text-message
        var input_message = $("#input-message");
        var text_message = input_message.val();
        //clear input message
        input_message.val("");
        //append to list-messages
        $("#list-messages").append($("<li>").text(text_message));
        //send to server
        socket.emit(roomID, text_message);
        //cancel submit
        return false;
    });
    socket.on(roomID, function(other_msg){
        //listen to server-other_msg, server receive from others, then send back
        console.log(other_msg);
        $("#list-messages").append($("<li>").text(other_msg));
    });
};