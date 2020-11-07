class ChatEngine{
    constructor(chatBoxId, userEmail){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;

        this.socket = io.connect('http://localhost:5000');

        if (this.userEmail){
            this.connectionHandler();
        }

    }


    connectionHandler(){
        let self = this;
        console.log('connection call made');
        this.socket.on('connect', function(){
            console.log('connection established using sockets...!');

            self.socket.emit('join_room',  {
                user_email: self.userEmail,
                chatroom: 'codeial'
            });

            self.socket.on('user_joined', function(data){
                console.log('a user joined', data);
            });
        });

        $('#sub').click(function(){
            let msg = $('#message').val();
            console.log('send clicked', msg);
            if(msg != '')
            {
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    chatroom: 'codeial'
                });
            }
        });
        self.socket.on('recieve_message', function(data){
            console.log('message recieved', data.message);

            let newMessage = $('<li>');
            console.log('initial message is ', newMessage);
            let messageType = 'others';
            if(data.user_email == self.userEmail)
                messageType = 'mine';

            newMessage.append($('<span>',{
                html: data.message
            }));
            newMessage.append($('<br>'));
            newMessage.append($('<sub>',{
                html: data.user_email
            }));
            newMessage.addClass(messageType);
            console.log('new message is ', newMessage);
            $('#message-list').append(newMessage);
        });
    }
}