var socket;
window.onload = function(){
    socket = io();
    socket.on("active-users", function(activeUserInfo){
        var activeUserObject = JSON.parse(activeUserInfo);
        //console.info("activeUserInfo: ", activeUserInfo);console.info("activeUserObject: ", activeUserObject);
        var thisUserA_ID = $("#userA_ID").val();console.log("thisUserA_ID: ", thisUserA_ID);
               //if(activeUserObject.oauthID != thisUserA_ID){
        //    console.log("activeUserInfo.oauthID same as thisUserA_ID", thisUserA_ID);
        //    var emitToUserB_ID = "/room/" + activeUserObject.oauthID;
        //    var a = $("<a>").attr("href", emitToUserB_ID).text(activeUserObject.displayName);
        //    $("#list-active-users").append($("<li>").append(a));
        //}
        /**
         * DON'T HAVE TO CHECK ACTIVE-USER DUPLICATION
         * bcs server side has check listActiveUsers before emit
         */
        var emitToUserB_ID = "/room/" + activeUserObject.oauthID;
        var a = $("<a>").attr("href", emitToUserB_ID).text(activeUserObject.displayName);
        $("#list-active-users").append($("<li>").append(a));
    });
    socket.on("unactive-users", function(activeUser){
        var activeUserObject = JSON.parse(activeUser);
        var listLis = $("#list-active-users").find("li");
        for(var i = 0; i < listLis.length; i++){
            var emitTo = "/room/" + activeUserObject.userOauthID;
            if(listLis[i].find("a").attr("href") == emitTo) {
                listLis[i].style("display: none");
            }
        }
    });
};