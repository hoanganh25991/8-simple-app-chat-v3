var socket;
window.onload = function(){
    var roomID = "/contact";
    console.log("roomID: %s", roomID);
    socket = io(roomID);
    var current_user_AppID = $("#input_userAppID").val();
    socket.emit(roomID, current_user_AppID);
    socket.on(roomID, function(other_msg){
        //listen to server-other_msg, server receive from others, then send back
        console.log(other_msg);
        var user = JSON.parse(other_msg);
        var roomID = generateRoomID(current_user_AppID, user.appID);
        var link = $("<a>").attr("href", "/room/" + roomID).text(user.displayName);
        $("#list-contacts").append($("<li>").append(link));
    });
};

function generateRoomID(userIDArray){
    var roomIDSum = 0;
    var roomIDMulti = 1;
    var i;
    for (i = 0; i < userIDArray.length; i++){
        var userIDString = userIDArray[i];
        var userIDInt = parseInt(userIDString, 10);
        roomIDSum += userIDInt;
        roomIDMulti *= userIDInt;
    }
    var roomID = roomIDSum + roomIDMulti;
    return roomID;
}