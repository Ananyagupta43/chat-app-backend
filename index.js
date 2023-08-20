
const express=require('express');
const socketio=require('socket.io');
const http=require('http');
const cors = require('cors');

const { addUsers, removeUsers, getUsers, getUsersInRoom } = require('./users');

const PORT=process.env.PORT || 5000;
const router=require('./router');

const app=express();
const server =http.createServer(app);
const io=socketio(server);


app.use(cors());
app.use(router);

io.on('connect',(socket)=>{
socket.on('join',({name,room},callback)=>{

    const {error,user}=addUsers({id:socket.id,name,room});   // adduser accepts three things id,name and room so we are using destructor for this.

    if(error){
        return callback(error);   
    }
  
  
    socket.emit('message',{user:'admin',text:`${user.name},Welcome to the room ${user.room}`});
  socket.broadcast.to(user.room).emit('message',{user:'admin',text:`${user.name} has joined.`})
  socket.join(user.room);

  io.to(user.room).emit('roomData',{room:user.room,users:getUsersInRoom(user.room)})
callback();
});


socket.on('sendMessage', (message, callback) => {
    const user = getUsers(socket.id);
console.log(socket.id);
    io.to(user.room).emit('message', { user: user.name, text: message });
    io.to(user.room).emit('roomData', { room: user.room,users:getUsersInRoom(user.room) });  //when user leaves we can send the msg to roomData and updated users as well
    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUsers(socket.id);

    if(user) {
      io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
    }
  })
});


// io.on('connetion',(socket)=>{
// console.log("We have a conection.");

// socket.on('disconnect',()=>{ //this is for a specific socket that just joined.Also we will not have any parameter inside it  because we guess that user had just left
// console.log("user just left");
// })       
// })

app.use(router);

server.listen(PORT,()=>console.log(`Server has started on port ${PORT}`))