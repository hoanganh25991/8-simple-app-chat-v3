var socket;
window.onload = function(){
    socket = io();
    socket.on("active-users", function(activeUserInfo){
        var activeUserObject = JSON.parse(activeUserInfo);console.info("activeUserInfo: ", activeUserInfo);console.info("activeUserObject: ", activeUserObject);
        var thisUserA_ID = $("#userA_ID").val();console.log("thisUserA_ID: ", thisUserA_ID);
        if(activeUserObject.oauthID != thisUserA_ID){
            var emitToUserB_ID = "/room/" + activeUserObject.oauthID;
            var a = $("<a>").attr("href", emitToUserB_ID).text(activeUserObject.displayName);
            $("#list-active-users").append($("<li>").append(a));
        }
    });
};