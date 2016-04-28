/**
 * Created by Christopher on 4/28/2016.
 */
$(function(){
    var iosocket = io.connect();
    iosocket.on('connect', function () {
        $('#incomingChatMessages').append($('<p>Connected</p>'));
        iosocket.on('message', function(message) {
            $('#incomingChatMessages').append($('<p></p>').text('+' + message));
        });
        iosocket.on('disconnect', function() {
            $('#incomingChatMessages').append('<p>Disconnected</p>');
        });
    });
    $('#outgoingChatMessage').keypress(function(event) {
        if(event.which == 13) {
            event.preventDefault();
            iosocket.send($('#outgoingChatMessage').val());
            $('#incomingChatMessages').append($('<p></p>').text('-'+$('#outgoingChatMessage').val()));
            $('#outgoingChatMessage').val('');
        }
    });
});