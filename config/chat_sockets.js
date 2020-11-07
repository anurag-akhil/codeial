
module.exports.chatSockets = function(socketServer){
    console.log('command came in chat socket.io');
    let io = require('socket.io')(socketServer);

    io.sockets.on('connection', function(socket){
        console.log('new connection received', socket.id);

        socket.on('disconnect', function(){
            console.log('socket disconnected!');
        });


        socket.on('join_room', function(data){
            console.log('joining req recieved', data);

            socket.join(data.chatroom);
            io.in(data.chatroom).emit('user_joined', data);
        });

        socket.on('send_message', function(data){
            console.log('send_ has been clicked', data);
            io.in(data.chatroom).emit('recieve_message', data);
        });
    });

}