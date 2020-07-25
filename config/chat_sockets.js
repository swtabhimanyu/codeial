//this is the observer..BackEnnd

//front end will will come here when io.connect('localhost:5000') is called...Because in the index.js we have run our socket server on port 5000
// we intitate a connection from front end using "io.connect(port)" on the port on which we have run our socket server from index.js -- in our case the port is 5000  

module.exports.chatSockets = function (socketServer) {
    let io = require('socket.io')(socketServer);

    io.sockets.on('connection', function (socket) {
        console.log('new connection received', socket.id);


        socket.on('disconnect', function () {
            console.log('socket disconnected');
        });


        //event recieved from chat_engine.js file when chatroom was created...using socket.emit() function

        //syntax --> socket.on(<message>,function(data){})   => this message should be same as it is passed from the front end side using socket.enit(<message>,{}) function
        socket.on('join_room',function(data){
            console.log('Joining req received',data);

            //joining chat room from the name passed from frontend
            socket.join(data.chatroom);

            //broadcasting msg in the chatroom that a new user is joined with details in 'data' variable
            io.in(data.chatroom).emit('user_joined' , data);  //io.in(chatroom) =>specifies chatroom and in that chatroom emit 

            //receiveing the message send fron frontend using socket.emit('send_message')
            socket.on('send_message',function(data){
                io.in(data.chatroom).emit('received_message',data);
            })
        });
    });
}