// this is subscriber code -- frontend

class chatEngine{

    constructor(chatboxId,userEmail){
        this.chatboxId=$(`#${chatboxId}`);
        this.userEmail=userEmail;

        //intiate the connection
        this.socket=io.connect('http://localhost:5000');
        
        if(this.userEmail){
            this.connectionHandler();
        }
    }


    //it handles too and fro interaction between subscriber and observer
    connectionHandler(){

        let self=this;

        //sending a request to join a chat room  --> when this event is completed we will receive an acknowledgement on the backend side i.e in chat_sockets.js 
       
        //syntax --> socket.emit('<message>',{key1:value1,key2:value2});  here key:value are the information which is to be passed to socket server in backend            
        self.socket.emit('join_room',{
            user_email:self.userEmail,
            chatroom:'codeial'
        });
        //first event that takes place is connection from subsccribers to observers
        self.socket.on('connect',function(){
            console.log('connection established using sockets')
        });


        //receiving broadcasted msg from chat_sockets.js that a user has joined
        self.socket.on('user_joined',function(data){
            console.log('user joined with data => ',data);
        });


        //send-meesage form handler
        $('#send-message-submit-button').click(function(event){
            let msg=$('#chatbox-message-input').val();

            if(msg!=''){
                self.socket.emit('send_message',{
                    message:msg,
                    user_email:self.userEmail,
                    chatroom:'codeial'
                });
            }
        });


        //came here from the server which broadcasted that server has received a message and we are going to display the msg in frontend
        self.socket.on('received_message',function(data){
            console.log('message received',data.message);

            let newMessage=$('<li>');

            let messageType='receiver-message';
            
            //checking if user who send the message is same as the on who is recieving the message
            if(data.user_email==self.userEmail){
                messageType='sender-message';
            }

            newMessage.append($('<span>',{
                'html':data.message
            }));

            newMessage.append($('<sub>',{
                'html':data.user_email
            })); 

            newMessage.addClass(messageType);

            $('#messages').append(newMessage);
        });
    }
}